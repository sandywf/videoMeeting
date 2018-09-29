/**
 * COCO3.0
 * @Author Jason
 * @Date 2017-4-19
 */
;(function(fn, undefined) {
    var duang = fn.call(null),
        reLoad = false,
        cocoMap = {},
        cocoTab = [],
        protocol = location.protocol,
        tool = duang?duang.getModule("Tool").getController("tool"):(window.vm && window.vm.module?window.vm.module.tool:window.tool),
        eventObj = new tool.constructor.CustomerEvent();
    var ctrlEventMap = {
        whitePadAddTab: "onPadTabAdd",
        whitePadRemoveTab: "onPadTabRemove",
        whitePadChangeTab: "onPadTabFocus"
    };
    var defaultConfig = {
        clientType: "client",
        deviceName: "PC",
        userType: "all",
        tabName: "白板",
        beatInterval: 5 * 1000,  //发送心跳的时间间隔
        beatWaitTime: 5 * 1000, //发送心跳消息后的等待时长
        linkTimes: 100,   //自动重连的次数
        linkInterval: 5 * 1000  //自动重连的时间间隔
    };
    tool.addEvent(window, "beforeunload", function() {
        reLoad = true;
    });
    //心跳
    function KeepAlive(params) {
        if(!(this instanceof KeepAlive)) {
            return new KeepAlive(params);
        }
        var self = this,
            state = 0,
            waitTimer = null,
            beatTimer = null,
            beatWaitTime = params.beatWaitTime || defaultConfig.beatWaitTime,
            beatInterval = params.beatInterval || defaultConfig.beatInterval;
        Object.defineProperty(this, "state", {
            get: function() {
                return state;
            }
        });
        // 启动心跳
        this.run = function() {
            self.stop();
            beatTimer = setTimeout(function() {
                self.ws.send(JSON.stringify({command: "keepAliveMessage"}));
                waitTimer = setTimeout(function() {
                    self.stop();
                    self.linkBuilder();
                }, beatWaitTime);
            }, beatInterval);
        };
        //停止心跳
        this.stop = function() {
            if(beatTimer) {
                clearTimeout(beatTimer);
                beatTimer = null;
            }
            if(waitTimer) {
                clearTimeout(waitTimer);
                waitTimer = null;
            }
        };
    }
    KeepAlive.prototype = {
        constructor: KeepAlive
    };
    function COCO() {
        //coco构造
        function _COCO(url, params) {
            if(!(this instanceof _COCO)) {
                return new _COCO(url, params);
            }
            var self = this,
                ws = null,
                groups = [],
                sequence = 0,
                reLink = false,
                linkWaiter = null,
                keepAlive = new KeepAlive(params),
                linkTimes = params.linkTimes || defaultConfig.linkTimes,
                linkInterval = params.linkInterval || defaultConfig.linkInterval;
            if(!/^\s*(?:ws:|wss:).*$/.test(url)) {
                url = ("https:"===protocol?"wss://":"ws://") + url;
            }
            if(!/\/(?:ws|wss)\/*\s*$/.test(url)) {
                url = url + ("https:"===protocol?"/wss":"/ws");
            }
            this.handles = [];
            this._params = params;
            this.connected = false;
            this.users = {onlineNum: 0};
            var linkBuilder = function() {
                ws = new WebSocket(url);
                ws.onopen = function() {
                    linkTimes = params.linkTimes || defaultConfig.linkTimes;
                    self.ws = ws;
                    keepAlive.ws = ws;
                    self.fire({type:"linkup"});
                    reLink = false;
                    if(null!=linkWaiter) {
                        clearTimeout(linkWaiter);
                        linkWaiter = null;
                    }
                    ws.send(JSON.stringify({
                        command: "online",
                        body: {
                            userToken: params.userToken,
                            clientType: params.clientType || defaultConfig.clientType,
                            deviceName: params.deviceName || defaultConfig.deviceName
                        }
                    }));
                    cocoTab.push(self);
                    cocoMap[params.groupId] = self;
                };
                ws.onmessage = function(res) {
                    var result = JSON.parse(res.data),
                        command = result.command,
                        msg = result.body;
                    switch(command) {
                        case "online"://用户上线
                            self.connected = true;
                            self.fire({type:"loginup"});
                            if(void(0)!=params.groupId) self.joinGroup(params.groupId);
                            break;
                        case "userGroupAction"://用户离开或加入组通知
                            if("add"===msg.action) {
                                changeUsers(1, msg.userId);
                                if(msg.userId===params.userId) {
                                    params.groupId = msg.groupId;
                                    groups.push(msg.groupId);
                                }
                                self.fire({type: "loginNotify", message:{from: msg.userId, groupId: msg.groupId, clientType: msg.clientType, deviceName: msg.deviceName}});
                            } else {
                                changeUsers(-1, msg.userId);
                                if(msg.userId===self._params.userId) {
                                    groups = [].filter.call(groups, function(groupId) {
                                        return groupId!==msg.groupId;
                                    });
                                }
                                self.fire({type: "logoutNotify", message:{from: msg.userId, groupId: msg.groupId}});
                            }
                            break;
                        case "addGroupResult"://加入组返回消息
                            self.fire({type: "joinGroup", message: msg});
                            self.getGroupOnline(params.groupId);
                            break;
                        case "kickUser"://被踢消息
                            changeUsers(-1, msg.userId);
                            self.fire({type: "onKick", message: msg});
                            break;
                        case "offline"://下线
                            changeUsers(-1, msg.userId);
                            self.fire({type: "offline"});
                            break;
                        case "singleChat"://个人消息
                            if("control"===msg.message.type) {
                                self.fire({type: "callOne", message: msg.message.content});
                            } else {
                                self.fire({type: "recePrivateMsg", message: {from: {userName: msg.sendUserName, userId:msg.sendUserId, userType:msg.sendUserType}, data: msg.message}});
                            }
                            break;
                        case "groupChat"://群消息
                            if(msg.from===self._params.userId) return;
                            if("control"===msg.type) {
                                self.fire({type: "callAll", message: msg.content});
                            } else {
                                self.fire({type: "recePublicMsg", message: msg});
                            }
                            break;
                        case "onlineUsers"://获取用户列表
                            msg.userList.forEach(function(user) {
                                changeUsers(1, user.userId);
                            });
                            self.fire({type: "loadUser", message: msg.userList});
                            break;
                        case "onlineUsersCount"://获取组内用户活动数量
                            self.fire({type: "onLoadUserNumber", message: msg.activeUserCount});
                            break;
                        case "whitePad"://接收白板信息
                            self.fire({type: "onLoadPadData", message: msg.data});
                            break;
                        case "control"://ctrlEventMap
                            msg.data.from!=self._params.userId && self.fire({type: ctrlEventMap[msg.type], message: msg.data});
                            break;
                        case "keepAliveMessage":
                            break;
                        default://错误信息
                            self.fire({type:"onError", message: msg});
                    }
                    keepAlive.run();
                };
                ws.onclose = function(err) {
                    !err.wasClean && ws.close();
                    keepAlive.stop();
                    self.connected = false;
                    if(reLoad) return;
                    delete cocoMap[params.groupId];
                    cocoTab.splice(cocoTab.indexOf(self), 1);
                    switch(err.code) {
                        case 1015:
                            self.fire({type: "onError", message: {code: 0, message: "数字证书验证失败"}});
                            break;
                        case 1000:
                            break;
                        default:
                            if(!reLink) {
                                changeUsers(-1, params.userId);
                                keepAlive.linkBuilder();
                                self.fire({type: "offline"});
                                self.fire({type: "logoutNotify", message:{from: params.userId, groupId: params.groupId}});
                            }
                    }
                };
                if(reLink && linkTimes) {
                    linkTimes--;
                    if(linkWaiter) {
                        clearTimeout(linkWaiter);
                        linkWaiter = null;
                    }
                    linkWaiter = setTimeout(function() {
                        ws.onopen = null;
                        ws.onmessage = null;
                        ws.onclose = null;
                        ws.readyState!=ws.CLOSED && ws.close();
                        linkBuilder();
                    }, linkInterval);
                }
            };
            keepAlive.linkBuilder = function() {
                reLink = true;
                linkBuilder();
            };
            Object.defineProperties(this, {
                sequence: {
                    get: function() {
                        return sequence++;
                    }
                }
            });
            linkBuilder();
            this.getGroups = function() {
                return groups || [];
            };
            this.getLastGroup = function() {
                return groups.length<=0?void(0):groups[groups.length-1];
            };
            var changeUsers = function(type, uid) {
                if(self.users[uid]) {
                    if(-1===type) {
                        self.users.onlineNum = self.users.onlineNum + type;
                        delete self.users[uid];
                    }
                } else {
                    if(1===type) {
                        self.users.onlineNum = self.users.onlineNum + type;
                        self.users[uid] = true
                    }
                }
            };
        }
        _COCO.prototype = eventObj;
        _COCO.prototype.constructor = _COCO;
        _COCO.prototype.addEvent = eventObj.addCustEvent;
        _COCO.prototype.removeEvent = eventObj.removeCustEvent;
        _COCO.prototype.fire = eventObj.fire;
        /**
         * 加入组，用户上线后，加入组，同一个会议的用户进入到同一组
         * @param groupId  组id
         */
        _COCO.prototype.joinGroup = function(groupId) {
            if(void(0)===groupId) return ;
            var params = this._params;
            this.ws.send(JSON.stringify({
                command: "addGroup",
                body: {
                    deviceName: params.deviceName || defaultConfig.deviceName,
                    clientType: params.clientType || defaultConfig.clientType,
                    groupId: groupId,
                    userId: params.userId
                }
            }));
        };
        /**
         * 踢人下线
         * @param userId 在线人员id
         * @param groupId 组id，如果"g"===groupId表示在所有组中查找，如果不传的话，会在当前组中查找
         */
        _COCO.prototype.kickOut = function(userId, groupId) {
            if(void(0)===userId) return ;
            this.ws.send(JSON.stringify({
                command: "kickUser",
                body: {
                    groupId: "g"===groupId?"":(groupId || this.getLastGroup()),
                    userId: userId
                }
            }));
        };
        /**
         * 增加一个白板页签
         * @param params.userType 用户类型 user/device/all  默认为all
         * @param params.groupId 组id 默认为当前组id
         * @param params.tabName tab名称
         * @param params.users 用户id list，表示消息发给哪些人
         */
        _COCO.prototype.addPadTab = function(params) {
            var obj = {
                command: "control",
                body: {
                    type: "whitePadAddTab",
                    userType: params.userType || defaultConfig.userType,
                    data: {
                        from: this._params.userId,
                        tabName: params.tabName || defaultConfig.tabName
                    }
                }
            };
            params.data && Object.assign(obj.body.data, params.data);
            if(params.users && 0<params.users.length) {
                obj.body.clientIds = params.users;
            } else {
                obj.body.groupId = (params.groupId || this.getLastGroup());
            }
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 移除一个白板页签
         * @param params.tabId tab的唯一标示
         * @param params.userType 用户类型 user/device/all  默认为all
         * @param params.groupId 组id 默认为当前组id
         * @param params.tabName tab名称
         * @param params.users 用户id list，表示消息发给哪些人
         */
        _COCO.prototype.removePadTab = function(params) {
            var obj = {
                command: "control",
                body: {
                    type: "whitePadRemoveTab",
                    userType: params.userType || defaultConfig.userType,
                    data: {
                        from: this._params.userId,
                        tabName: params.tabName || "",
                        tabId: params.tabId || ""
                    }
                }
            };
            params.data && Object.assign(obj.body.data, params.data);
            if(params.users && 0<params.users.length) {
                obj.body.clientIds = params.users;
            } else {
                obj.body.groupId = (params.groupId || this.getLastGroup());
            }
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 激活指定白板页签
         * @param params.tabId tab的唯一标示
         * @param params.userType 用户类型 user/device/all  默认为all
         * @param params.groupId 组id 默认为当前组id
         * @param params.tabName tab名称
         * @param params.users 用户id list，表示消息发给哪些人
         */
        _COCO.prototype.focusPadTab = function(params) {
            if(void(0)===params.tabId) return ;
            var obj = {
                command: "control",
                body: {
                    type: "whitePadChangeTab",
                    userType: params.userType || defaultConfig.userType,
                    data: {
                        from: this._params.userId,
                        tabName: params.tabName || "",
                        tabId: params.tabId
                    }
                }
            };
            if(params.users && 0<params.users.length) {
                obj.body.clientIds = params.users;
            } else {
                obj.body.groupId = (params.groupId || this.getLastGroup());
            }
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 白板消息
         * @param params 白板onRender事件抛出的数据
         */
        _COCO.prototype.write = function(params) {
            var self = this, content = params.content || params, arr = [];
            if(void(0)===content) return ;
            var obj = {
                command: "whitePad",
                body: {
                    tabId: params.tabId || 0,
                    groupId: params.groupId || this.getLastGroup(),
                    data: []
                }
            };
            if("[object Array]"===toString.call(content)) {
                content.forEach(function(d) {
                    var _d = {
                        sequence: self.sequence,
                        type: d.type || "",
                        content: d.data || d,
                        clientId: self._params.userId
                    };
                    arr.push(_d);
                });
            } else {
                arr.push({
                    sequence: self.sequence,
                    type: content.type || "",
                    content: content.data || content,
                    clientId: self._params.userId
                });
            }
            [].push.apply(obj.body.data, arr);
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 群发文本消息
         * @param params.groupId 组id 默认为当前组id
         * @param params.type 消息内容类型
         * @param params.content 消息内容
         */
        _COCO.prototype.sendMsgToAll = function(params) {
            if(void(0)===params.type || (!params.content && -1===[0, false, null].indexOf(params.content))) return ;
            var obj = {
                command: "groupChat",
                body: {
                    groupId: params.groupId || this.getLastGroup(),
                    message: {
                        type: params.type,
                        content: params.content,
                        from: this._params.userId
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 单发文本消息
         * @param params.userId 需要接收到本条消息的人员id
         * @param params.type 消息内容类型
         * @param params.content 消息内容
         */
        _COCO.prototype.sendMsgTo = function(params) {
            if(void(0)===params.userId || void(0)===params.type || (!params.content && -1===[0, false, null].indexOf(params.content))) return ;
            var obj = {
                command: "singleChat",
                body: {
                    sendUserId: this._params.userId,
                    receivedUserId: params.userId,
                    message: {
                        type: params.type,
                        content: params.content
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 获取所有在线人员
         * @param groupId 组id
         */
        _COCO.prototype.getGroupOnline = function(groupId) {
            this.ws.send(JSON.stringify({
                command: "onlineUsers",
                body: {
                    groupId: groupId || this.getLastGroup()
                }
            }));
        };
        /**
         * 获取组内人员数量
         * @param groupId 组id
         */
        _COCO.prototype.getGroupCount = function(groupId) {
            this.ws.send(JSON.stringify({
                command: "groupUserCount",
                body: {
                    groupId: groupId || this.getLastGroup()
                }
            }));
        };
        /**
         * 发送控制类消息给某人
         * @param 参数1 需要接收到本条消息的人员id
         * @param 参数2-n 需要传递的参数
         */
        _COCO.prototype.callOne = function() {
            var args = [].slice.call(arguments, 0),
                to = args.shift(),
                params = 1<args.length?args:args.shift();
            if(void(0)===to) return ;
            var obj = {
                command: "singleChat",
                body: {
                    sendUserId: this._params.userId,
                    receivedUserId: to,
                    message: {
                        type: "control",
                        content: params || {}
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 群发控制类消息
         * @param 参数1 组id 此参数可以省略
         * @param 参数2-n 需要传递的参数
         */
        _COCO.prototype.callAll = function() {
            var args = [].slice.call(arguments, 0),
                groups = this.getGroups(),
                firstArg = args.shift();
            if(-1===groups.indexOf(firstArg)) {
                (firstArg || -1!=[0, false, null].indexOf(firstArg)) && args.unshift(firstArg);
                firstArg = null;
            }
            var params = 1<args.length?args:args.shift(),
                groupId = firstArg|| this.getLastGroup();
            if(void(0)===groupId) return ;
            var obj = {
                command: "groupChat",
                body: {
                    groupId: groupId,
                    message: {
                        type: "control",
                        from: this._params.userId,
                        content: params || {}
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 验证用户是否在线
         * @param id 用户id
         */
        _COCO.prototype.isOnline = function(id) {
            return !!this.users[id];
        };
        return {
            /**
             * 初始化白板
             * @param url COCO服务器地址，必须
             * @param params.userToken 用户的合法token，必须
             * @param params.userId 用户id，必须
             * @param params.groupId 组id，必须
             * @param params.clientType 客户端类型，默认为”web“
             * @param params.deviceName 设备名称，默认为”PC“
             * @param params.beatInterval 心跳发送频率
             * @param params.beatWaitTime 心跳发出等待时长
             */
            init: function(url, params) {
                if(!url || void(0)===params.userToken || void(0)===params.userId) return ;
                return new _COCO(url, params);
            },
            get: function(param) {
                if(void(0)===param) return ;
                return cocoMap[param] || cocoTab[param] || null;
            }
        };
    }
    duang?duang.module("Tool", []).controller("COCO", COCO):(function() {
        window.vm?(function() {
            vm.module = vm.module || {};
            vm.module["COCO"] = COCO();
        }()):window.COCO = COCO();
    }());
}(function() {
    return window.duang || null;
}, void(0)));