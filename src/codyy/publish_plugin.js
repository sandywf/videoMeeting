/**
 *
 *
 * date: 2018-04-03
 * author: Jason
 * fileName: index.js
 * describe: 流发送插件
 *
 *
 */
;(function(fn, undefined) {
    "use strict";
    var publishPlugin = null,
        cameras = {},
        audios = {},
        number = 1,
        publishVersion = "",
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
        url = ("https:"===location.protocol?"wss://localhost:9099":"ws://localhost:9098") + "/publish";
    //OnGeneral事件下的不同key
    var eventMap1 = {
        1: "OnMainChange",		//主画面索引值改变事件
        2: "OnRateWatch",		//流量监测
        3: "OnMouseWatch",		//鼠标侦测
        4: "OnVGAMotionWatch",	//VGA运动量检测
        5: "OnCPUWatch",		//CPU消耗(总体)
        6: "OnGPUWatch",		//GPU消耗(总体)
        7: "OnMemoryWatch",		//内存消耗
        8: "OnPacketLostRate",	//丢包率
        9: "OnBehaviorExplain", //行为分析
        10: "OnBehaviorTrack",  //行为轨迹
        11: "OnServerRecordStateChange",//服务器录制状态
        15: "OnRecordLimit"
    };
    var eventMap = {
        101: "OnTransVideoOver",	//视频转换结果的通知
        // 102: "OnCreateShareMem",	//共享内存创建名字的通知
        103: eventMap1,		//OnGeneral
        104: "OnRemoteControlKeypress",	//遥控器按键通知
        105: "OnCenterControlKeypress",	//中控台按键通知
        106: "OnStateMessage",	//状态上报通知
        107: "OnFunctionResult",	//函数结果通知
        108: "OnConnectResult",	//主辅互换后连接结果通知
        
        6104 : "OnRunningExceptionReport",
    };
    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };
    var addEvent = window.addEventListener?function(target, type, fn, use) {
        target.addEventListener(type, fn, use||false);
    }:function(target, fn, type) {
        target.attachEvent("on"+type, fn);
    };
    var eventHandle = {
        199: function(data) {
            publishVersion = data.version;
        }
    };
    //获取所有音视频设备，包括虚拟设备
    mediaDevice.addEvent("OnReady", function() {
        var devices = mediaDevice.getAllVideos();
        devices.forEach(function(device) {
            if(/Codyy\w+\((\d+)\)/.test(device.label)) {
                if("videoinput"===device.kind) {
                    cameras[RegExp.$1] = device;
                }
            }
        });
    });
    var Pip = function() {
        var self = this,
            state = 0, //0为初始化，1为执行中，2为执行完毕，-1为出现bug
            taskList = [];
        function __Pip__() {}
        __Pip__.prototype = {
            constructor: __Pip__,
            pip: function() {
                if(1===state) return ;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            then: function() {
                if(1===state || -1===state || 2===state) return ;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            exec: function() {
                state = 1;
                if(taskList.length>0) {
                    try {
                        run(taskList[0]);
                    } catch(e) {
                        state = -1;
                        console.error(e);
                    }
                }
            }
        };
        function run() {
            var args = arguments[0],
                fName = args.shift(),
                fn = args.pop();
            if("[object Function]"===toString.call(fName) && void(0)===fn) return fName();
            if("[object String]"!=toString.call(fName) || !self[fName]) throw "no function name";
            if("[object Function]"!=toString.call(fn)) {
                void(0)!=fn && args.push(fn);
                fn = null;
            }
            args.push(function() {
                fn && fn.apply(this, [].slice.call(arguments, 0));
                taskList.shift();
                taskList.length>0 && run(taskList[0]);
            });
            return self[fName] && self[fName].apply(self, args);
        }
        return new __Pip__();
    };
    function linkVideo(params, callback) {
        var self = this,
            camera = cameras[params.cameraId||number++];
        var constraints  = {
            video: {
                width: {ideal: 1280},
                height: {ideal: 720},
                deviceId: {}
            }
        };
        var _linkVideo = function() {
            try {
                constraints.video.deviceId = {exact: camera.deviceId};
                if(self.stream) {
                    self.stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                }
                navigator.mediaDevices.getUserMedia(constraints).then(function(_stream) {
                    self.stream = _stream;
                    
                    params.video.onloadstart = function(){
		            	var time = 20;
		            	var inter = setInterval(function(){
		            		params.video.srcObject.getTracks().forEach(function(track) {
		            			if( !track.onmute ){
		       		 				track.onmute = function() {
					                	params.video.load();
					                };
		            			}
				            });
				            time --;
				            if( time == 0){
				            	clearInterval(inter);
				            }
		            	},1000);
					}
                    params.video.srcObject = _stream;
                    
                    
                    "[object Function]"===toString.call(callback) && callback();
                }).catch(function(e) {
                    console.error(e.message);
                });
            } catch(e) {
                console.error(e.message);
            }
        };
        if(camera) {
            _linkVideo();
        } else {
            console.error("未找到相关设备！");
        }
    }
//================发送插件开始=======================================================
    function AvPublish(params, server) {
        if(!this instanceof AvPublish) {
            return new AvPublish(params);
        }
        var self = this, custEvent = new tool.constructor.CustomerEvent();
        this.name = "AvPublish";
        this.id = params.id || tool.random(10);
        custEvent.handle = [];
        if(params.background) {
            params.video.style.background = "center contain no-repeat content-box url("+params.background+")";
        }
        params.video.setAttribute("autoplay", "autoplay");
        self.addEvent = custEvent.addCustEvent.bind(custEvent);
        self.removeEvent = custEvent.removeCustEvent.bind(custEvent);
        var bindEvent = function() {
            var tracks = self.stream.getTracks();
            tracks.forEach(function(track) {
                //流中断
                /*track.onmute = function() {
                    params.video.load();
                    WSPublish.fireEvent({type: "OnBreak", message: {type: track.kind, id: self.id, video: params.video}});
                };*/
            });
        };
        linkVideo.call(self, params, bindEvent);
        this.setVideoElement = function(video) {
            params.video = video;
            linkVideo.call(self, params, bindEvent);
        };
        this.shutdown = function(fn) {
            try {
                if(self.stream) {
                    self.stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                    fn && fn();
                }
            } catch(e) {
                console.error(e.message);
            }
        };
    }
    AvPublish.prototype = {
        constructor: AvPublish
    };
//================发送插件结束=======================================================
//================发送插件服务开始=======================================================
    var WSPublish = (function() {
        var	ws = null, custEvent = new tool.constructor.CustomerEvent();
        var _WSPublish = function(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);
            eventHandle[9999] = function() {
                avPublishInterface.initSenderModule(params, function() {
                    var args = [].slice.call(arguments, 0);
                    callback1 && callback1.apply(ws, args);
                });
            };
            ws.onopen = function() {
                self.state = this.readyState;
                eventHandle[9999]();
            };
            ws.onmessage = function() {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = JSON.parse(tool.decodeBase64(arg.data));
                if(data.uuid) {
                    callbackMap[data.uuid] && callbackMap[data.uuid].call(self, data);
                    delete callbackMap[data.uuid];
                } else {
                    if(eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };
            ws.onclose = function(e) {
                self.state = this.readyState;
                if(1000===e.code) return ;
                switch(e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({type: "OnError", message: {code: e.code, message: errorMessageMap[e.code]}});
                    break;
                    default:
                        _WSPublish.call(self, params, null, callback2);
                }
            };
            return this;
        };
        var _send = function(msg) {
            ws.send(msg);
        };
        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send
        }, {init: {
            writable: false,
            configurable: false,
            enumerable: false,
            value: _WSPublish
        }});
        return obj;
    }());
//================发送插件服务结束=======================================================
    //发送插件初始化接口
    //此接口对外，供业务层调用初始化发送插件
    //不包括插件服务的初始化
    var avPublish = {
        init: function(params) {
            if(void(0)===params || !params.video) return;
            publishPlugin = new AvPublish(params, WSPublish);
            return publishPlugin;
        },
        getPlugin: function() {
            return publishPlugin;
        }
    };
    var avPublishInterface = {
        /**
         * 启动发送模块,并将需要的设备名称传下来
         * params 从后端获取的参数；（必填）
         */
        initSenderModule: function(params, fn) {
            var config = {
                method: 1,
                delayExitTime: params.delayExitTime || 0,
                param: {
                    stitchDeviceName: params.stitchDeviceName || "",
                    resourceDeviceList: params.resourceDeviceList || [],
                    mcuDeviceName: ""
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        /**
         * 设置初始化参数，这里的参数从后端获取
         * type 代表不同的终端设备，1：导播，2：发送端，3：中控及班班通，4：视频转换；（必填）
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setConfig: function(type, params, fn) {
            if(!type || !params) return ;
            var config = {
                method: 2,
                param: {
                    key: type,
                    value: JSON.stringify(params)
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            console.log("==========================into setConfig======================================");
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //录制控制
        setRecord: function(key, value, index, fn) {
            if(void(0)===key || void(0)===value || isNaN(key)) return ;
            var config = {
                method: 3,
                param: {
                    key: key,
                    id: index,
                    value: value,
                    flag : 0
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //流控制
        setStream: function(key, value, index, flag, fn) {
            if(void(0)===key || void(0)===value || isNaN(key)) return ;
            var config = {
                method: 4,
                param: {
                    key: key,
                    id: index,
                    flag: flag,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置截屏上传服务器所需要的参数
        setStitchCapture: function(url, interval, height, compress, fn) {
            if(isNaN(height) || void(0)===url) return ;
            var config = {
                method: 5,
                param: {
                    captureInterval: interval,
                    captureHeight: height||200,
                    compress: captureCompress,
                    url: url
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置视频设备的参数
        setResourceVideoDevice: function(key, value, fn) {
            if(void(0)===key || void(0)===value) return ;
            var config = {
                method: 6,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置PPT索引功能的参数
        setPPTIndexInfo: function(key, value, fn) {
            if(void(0)===key || void(0)===value) return ;
            var config = {
                method: 7,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置流量监测功能参数
        setTrafficStatistic: function(time, interval, fn) {
            if((time && isNaN(time)) || (interval && isNaN(interval))) return ;
            var config = {
                method: 8,
                param: {
                    time: time || 3000,
                    eventInterval: interval || 3000
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //移除台标,字幕信息
        removeLogoSubtitle: function(key, id, index, fn) {
            if(void(0)===id || void(0)===index) return ;
            var config = {
                method: 9,
                param: {
                    key: key || 1,
                    id: id,
                    value: index
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置片头,片尾开关
        setMovieHeadTail: function(key, _switch, file, fn) {
            if(void(0)===file) return ;
            var config = {
                method: 10,
                param: {
                    key: key || 1,
                    switch: _switch || 0,
                    file: file
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置导播相关功能信息,根据key值不同,完成相应功能设置
        setDirectorControl: function(key, index, value, fn) {
            if(void(0)===key || void(0)===index) return ;
            var config = {
                method: 11,
                param: {
                    key: key,
                    id: index,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置拼接器相关功能信息,根据key值不同,完成相应功能设置
        setStitchVideo: function(key, id, value, fn) {
            if(void(0)===key) return ;
            var config = {
                method: 12,
                param: {
                    key: key,
                    id: id,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取电脑磁盘上存储的一些信息
        getSystemInfo: function(key, value, fn) {
            var config = {
                method: 13,
                param: {
                    key: key,
                    value: value || ""
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置自动更新功能所需参数
        setUpdatePlugin: function(url, fn) {
            var config = {
                method: 14,
                param: {
                    update: 1,
                    updaterUrl: url
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置程序运行状态,根据key值不同,完成相应功能设置
        setProgramState: function(key, fn) {
            var config = {
                method: 15,
                param: {
                    key: key
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //打开vnc,班班通预览程序
        startVNCBBT: function(key, value, fn) {
            var config = {
                method: 16,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //控制班班通预览程序,根据key值不同,完成相应功能设置
        setBBTControl: function(key, value, fn) {
            var config = {
                method: 17,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置录制状态
        setRecordState: function(state, fn) {
            var config = {
                method: 18,
                param: {
                    state: state
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置预览窗口大小
        changeWindowSize: function() {},
        //通用接口设置,根据key值不同,完成相应功能设置
        setGeneralFunction: function(key, value, fn) {
            var config = {
                method: 20,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置对话模式初始值
        setConversationArray: function(param, fn) {
            var config = {
                method: 21,
                param: param
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置服务器录制状态
        setServerRecordState: function(state, fn) {
            var config = {
                method: 22,
                param: {
                    state: state
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        setPreview: function(index, value, fn) {
            var config = {
                method: 23,
                param: {
                    id: index,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        }
    };
    //发送插件服务相关接口
    //此接口对外，供业务层调用初始化发送插件服务
    var wsPublish = {
        init: function(params, callback) {
            if(void(0)===params) return ;
            var self = this;
            return WSPublish.init.call(WSPublish, params, callback, function() {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key?eventMap[data.event][data.param.key]:eventMap[data.event];
                data.param?delete data.param.key:(data.param = "");
                eventName && this.fireEvent({type: eventName, message: data.param});
            });
        },
        get version() {
            return publishVersion;
        },
        get state() {
            return WSPublish.state;
        },
        //当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        //参数1 在“wsPublish”中的接口名，string
        //参数2-n 插件需要的参数
        //参数n+1 回调函数
        pip: function() {
            var args = [].slice.call(arguments, 0),
                pip = Pip.call(this);
            args.length>0 && pip.pip.apply(this, args);
            return pip;
        },
        addEvent: function(type, callback) {
            if(void(0)===type || void(0)===callback) return;
            WSPublish.addEvent(type, callback);
        },
        removeEvent: function(type, fn) {
            if(void(0)===type) return;
            WSPublish.removeEvent(type, fn);
        },
        /**
         * 设置导播初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setDirectorConfig: function(params, fn) {
            if(!params) return ;
            avPublishInterface.setConfig(1, params, fn);
        },
        /**
         * 设置发送插件初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setPublisherConfig: function(params, fn) {
            if(!params) return ;
            console.info("===========================into setPublisherConfig===================================");
            avPublishInterface.setConfig(2, params, fn);
        },
        /**
         * 设置中控及班班通初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setControllerConfig: function(params, fn) {
            if(!params) return ;
            avPublishInterface.setConfig(3, params, fn);
        },
        /**
         * 设置转换视频文件初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setTransConfig: function(params, fn) {
            if(!params) return ;
            avPublishInterface.setConfig(4, params, fn);
        },
        /**
         * 允许录制
         * 参数1 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        ableRecord: function() {
            var args = [].slice.call(arguments, 0);
            avPublishInterface.setRecord.apply(avPublishInterface, [].concat.apply([1, 1], args));
        },
        /**
         * 不允许录制
         * 参数1 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        disableRecord: function() {
            var args = [].slice.call(arguments, 0);
            avPublishInterface.setRecord.apply(avPublishInterface, [].concat.apply([1, 0], args));
        },
        /**
         * 设置录制路径
         * path 录制路径；（必填）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFilePath: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if(void(0)===params.path) return ;
            avPublishInterface.setRecord(2, params.path, +params.index||0, fn);
        },
        /**
         * 设置录制路径
         * type 录制文件类型[flv, mp4]；（必填）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFileType: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop(),
                map = {flv: 1, mp4: 2};
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(3, void(0)===params.type?1:map[params.type], params.index||0, fn);
        },
        /**
         * 设置appending和非appeding录制模式
         * appending false/true，默认：true
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordAppending: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(4, void(0)===params.appending?1:Number(params.appending), params.index||0, fn);
        },
        /**
         * 设置录制文件的码率
         * bitrate 码率；默认：4000
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordBitrate: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(5, void(0)===params.bitrate?4000:params.bitrate, params.index||0, fn);
        },
        /**
         * 设置录制文件的分辨率
         * resolution 分辨率；默认：1920*1080
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordResolution: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(6, void(0)===params.resolution?[1920, 1080]:params.resolution, params.index||0, fn);
        },
        /**
         * 设置录制文件的贞率
         * fps 贞率；默认：24
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordfps: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(7, void(0)===params.fps?24:params.fps, params.index||0, fn);
        },
        /**
         * 设置录制文件的音频存在形式
         * staute 0：无音频，1：只有主讲人音频，2：主辅课堂混音；默认：1
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordVoiceStaute: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(8, void(0)===params.staute?1:params.staute, params.index||0, fn);
        },
        /**
         * 设置录制文件的编码设备
         * encode 1：CPU，1：集显，2：独显；默认：1
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordEncodeType: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(9, void(0)===params.encode?2:params.encode, params.index||0, fn);
        },
        /**
         * 设置录制文件大小，用于分段录制
         * size 文件大小，单位b，默认：5*1024*1024
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFileSize: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(10, void(0)===params.size?5*1024*1024:params.size, params.index||0, fn);
        },
        /**
         * 设置录制文件时长，用于分段录制
         * duration 录制时长，单位s，默认：30*60
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFileDuration: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(11, void(0)===params.duration?30*60:params.duration, params.index||0, fn);
        },
        /**
         * 关闭某路流
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        unpublishStream: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(1, 0, params.index||0, params.direction||12, fn);
        },
        /**
         * 打开某路流
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        publishStream: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(1, 1, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置流地址
         * streamName 流地址，（必填）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamName: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if(void(0)===params.streamName) return ;
            avPublishInterface.setStream(2, params.streamName, params.index||0, params.direction||12, fn);
        },
        /**
         * 开始服务器录制
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        ableServerRecord: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(2, 0, params.index||0, params.direction||12, fn);
        },
        /**
         * 停止服务器录制
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        disableServerRecord: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(2, 1, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置流码率
         * bitrate 码率，默认：2000
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamBitrate: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(4, void(0)===params.bitrate?2000:params.bitrate, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置流分辨率
         * resolution 分辨率，默认1920*1080
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamResolution: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(5, void(0)===params.resolution?[1920, 1080]:params.resolution, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置流贞率
         * fps 贞率，默认：24
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamfps: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(6, void(0)===params.fps?24:params.fps, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置发送的每路流音频存在形式
         * staute 0：无音频，1：只有主讲人音频，2：主辅课堂混音，默认：1
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamVoiceStaute: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(7, void(0)===params.staute?1:params.staute, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置发送的每路流编码方式
         * encode 1：CPU，2：集显，3：独显，默认：2
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamEncodeType: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(8, void(0)===params.encode?2:params.encode, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置发送的每路流编码方式
         * recordMode 0 代表可进行【开始，停止】控制，断流10s后会自动结束录制，如在线课堂 ,默认：0
         *			  1代表可进行【开始，暂停，停止】控制，断流不会结束录制，如智慧课堂）
         *			  2代表【开始，暂停，停止】控制，断流10s后会自动结束录制）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setServerRecordMode: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(9, params.recordMode||0, params.index||0, params.direction||12, fn);
        },
        /**
         * 设置发送的每路流编码方式
         * streamMode 0 音视频 1 视频 2 音频 3无，默认：0
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamMode: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(10, +(params.streamMode||0), +(params.index||0), +(params.direction||12), fn);
        },
        /**
         * 主辅互换后改变服务器端录制流
         * streamName 流名称
         * append 是否需要append
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂 13:移动端
         * 参数2 回调函数
         */
        changeServiceRecordStream: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if(void(0)===params.streamName) return ;
            avPublishInterface.setStream(11, {url: params.streamName, append: Number(params.append||1)}, params.index||0, params.direction||12, fn);
        },
        /**
         * 拼接画面定时截图发送到平台
         * interval 截图发送间隔，单位秒(int)，默认：10
         * height 生成的jpeg图片高度，默认：100
         * compress Jpeg图片的的压缩质量，50-100(int)，默认：100
         * 参数2 回调函数
         */
        setStitchCapture: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if(!params.url) return ;
            avPublishInterface.setStitchCapture(params.url, params.interval||10, params.height||100, params.compress||100, fn);
        },
        /**
         * 设置图象采集设备贞率
         * 参数1 贞率
         * 参数2 回调函数
         */
        setDevicefps: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var fps = args.shift() || lastArg;
            if(!fps) return ;
            avPublishInterface.setResourceVideoDevice(1, fps, fn);
        },
        /**
         * 设置图象采集设备分辨率
         * 参数1 分辨率
         * 参数2 回调函数
         */
        setDeviceResolution: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var resolution = args.shift() || lastArg;
            if(!resolution) return ;
            avPublishInterface.setResourceVideoDevice(2, resolution, fn);
        },
        /**
         * 设置timeline文件存放路径
         * 参数1 timeline文件路径；（必填）
         * 参数2 回调函数
         */
        setTimelineFile: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var path = args.shift() || lastArg;
            if(!path) return ;
            avPublishInterface.setPPTIndexInfo (1, path, fn);
        },
        /**
         * 设置教室名称
         * 参数1 教室名称；（必填）
         * 参数2 回调函数
         */
        setClassroomName: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var classroomName = args.shift() || lastArg;
            avPublishInterface.setPPTIndexInfo (2, classroomName, fn);
        },
        /**
         * 设置流量统计参数，统计结果主动抛给页面
         * time 设置插件统计时长
         * interval 设置插件向页面抛出时长
         * 参数2 回调函数
         */
        setTrafficStatisticParam: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setTrafficStatistic(isNaN(params.time)?3000:+params.time, isNaN(params.interval)?3000:+params.interval, fn);
        },
        /**
         * 移除台标
         * id 代表使用哪个拼接器  0:电影拼接器 100:观摩拼接器 150:预监拼接器；
         * index 台标索引值；（必填）
         * 参数2 回调函数
         */
        removeLogo: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if(void(0)===params.index) return ;
            avPublishInterface.removeLogoSubtitle(1, params.id||0, params.index, fn);
        },
        /**
         * 移除字幕
         * id 代表使用哪个拼接器  0:电影拼接器 100:观摩拼接器 150:预监拼接器；
         * index 字幕索引值；（必填）
         * 参数2 回调函数
         */
        removeSubtitle: function() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if(void(0)===params.index) return ;
            avPublishInterface.removeLogoSubtitle(1, params.id||0, params.index, fn);
        },
        /**
         * 使用片头
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        useMovieHead: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var headFile = args.shift() || lastArg;
            if(!headFile) return ;
            avPublishInterface.setMovieHeadTail(1, 1, headFile, fn);
        },
        /**
         * 使用片尾
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        useMovieTail: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var tailFile = args.shift() || lastArg;
            if(!tailFile) return ;
            avPublishInterface.setMovieHeadTail(2, 1, tailFile, fn);
        },
        /**
         * 不使用片头
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        abandonMovieHead: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var headFile = args.shift() || lastArg;
            if(!headFile) return ;
            avPublishInterface.setMovieHeadTail(1, 0, headFile, fn);
        },
        /**
         * 不使用片头
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        abandonMovieTail: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var tailFile = args.shift() || lastArg;
            if(!tailFile) return ;
            avPublishInterface.setMovieHeadTail(2, 0, tailFile, fn);
        },
        /**
         * 拉近焦距
         * 参数1 机位索引
         * 参数2 回调函数
         */
        closerFocus: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(1, index||0, 1, fn);
        },
        /**
         * 释放变焦
         * 参数1 机位索引
         * 参数2 回调函数
         */
        fixFocus: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(1, index||0, 0, fn);
        },
        /**
         * 拉远焦距
         * 参数1 机位索引
         * 参数2 回调函数
         */
        furtherFocus: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(1, index||0, 2, fn);
        },
        /**
         * 变倍变小
         * 参数1 机位索引
         * 参数2 回调函数
         */
        minifyFocal: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(2, index||0, 1, fn);
        },
        /**
         * 停止变倍
         * 参数1 机位索引
         * 参数2 回调函数
         */
        fixFocal: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(2, index||0, 0, fn);
        },
        /**
         * 变倍变大
         * 参数1 机位索引
         * 参数2 回调函数
         */
        largenFocal: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(2, index||0, 2, fn);
        },
        /**
         * 使用鼠标滚轮变焦
         * zoom 滚轮滚动幅度
         * index 机位索引
         * 参数2 回调函数
         */
        setWheelZoom: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.zoom || isNaN(params.zoom)) return ;
            avPublishInterface.setDirectorControl(3, params.index||0, params.zoom, fn);
        },
        /**
         * 画面向上调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraUp: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index||0, 1, fn);
        },
        /**
         * 画面向下调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraDowm: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index||0, 2, fn);
        },
        /**
         * 画面向左调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraLeft: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index||0, 3, fn);
        },
        /**
         * 画面向右调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraRight: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index||0, 4, fn);
        },
        /**
         * 停止画面调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraFix: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index||0, 0, fn);
        },
        /**
         * 设置预置位
         * index 机位索引
         * preset 预置位
         * 参数2 回调函数
         */
        setPreset: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(void(0)===params.preset) return ;
            avPublishInterface.setDirectorControl(5, params.index||0, params.preset, fn);
        },
        /**
         * 鼠标点击跟踪
         * posx 鼠标点击画面的x坐标，向对画面左上角 （必须）
         * posy 鼠标点击画面的y坐标，向对画面左上角 （必须）
         * width 画面宽度 （必须）
         * height 画面高度 （必须）
         * index 机位索引 （必须）
         * 参数2 回调函数
         */
        mouseClickTrack: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(void(0)===params.posx || isNaN(params.posx) || void(0)===params.posy || isNaN(params.posy) || void(0)===params.width || isNaN(params.width) || void(0)===params.height || isNaN(params.height)) return ;
            avPublishInterface.setDirectorControl(6, params.index||0, [params.posx, params.posy, params.width, params.height], fn);
        },
        /**
         * 设置导播模式
         * 参数1 导播模式 1=自动  2=手动  3=半自动1 4=半自动2（柯桥）
         * 参数2 回调函数
         */
        setDirectorMode: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var mode = args.shift() || lastArg;
            if(isNaN(mode)) return ;
            avPublishInterface.setDirectorControl(7, 0, +mode||1, fn);
        },
        /**
         * 设置画面进入的特效
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * styleIndex 特效索引 0：无特效 1：从左上角渐入 2：从右上角渐入 3：从左下角渐入 4：从右下角渐入 5：水平从中间向左右拉幕 6：竖直从中间向上下拉幕 7：水平从左往右渐入 8：竖直从上往下渐入 9：中间向四周散开 10：淡入淡出
         * 参数2 回调函数
         */
        setScreenShiftStyle: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(1, params.id||0, params.styleIndex||0, fn);
        },
        /**
         * 设置画面拼接模式
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * mode 拼接模式索引 1=全屏模式，2=画中画模式，3=画外画模式，4=对话模式 ， 5=自定义模式
         * 参数2 回调函数
         */
        setSplitMode: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(2, params.id||0, Number(!params.mode||isNaN(params.mode)?1:params.mode), fn);
        },
        /**
         * 当画面拼接模式是画中画、画外画时，设置小画面的位置，其它拼接模式下此接口无效
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * site 1左上/2右上/3左下/4右下
         * 参数2 回调函数
         */
        setSmallScreenSite: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(3, params.id||0, params.site||4, fn);
        },
        /**
         * 设置画中画/画外画的排列组合
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * list 一个二维数组，代表每大画面情况下小画面的拼接顺序（必须）
         * 参数2 回调函数
         */
        setSmallScreenSequence: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.list) return ;
            avPublishInterface.setStitchVideo(4, params.id||0, params.list, fn);
        },
        /**
         * 设置对话模式的高亮
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * which 高亮哪一边，left：高亮左边，right：高亮右边，none或空：取消高亮
         * 参数2 回调函数
         */
        setHighLight: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), map = {left: 1, right: 2, none: 0}, fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(5, params.id||0, map[params.which||"none"], fn);
        },
        /**
         * 设置对话模式的高亮哪个机位
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * index 机位索引
         * 参数2 回调函数
         */
        setHighLightCamera: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(6, +(params.id||0), +(params.index||0), fn);
        },
        /**
         * 设置主画面索引值
         * 参数1 主画面索引值
         * 参数2 回调函数
         */
        setMainScreenIndex: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg || 1;
            avPublishInterface.setStitchVideo(8, 0, +index, fn);
        },
        /**
         * 设置扩展屏画面索引值
         * 参数1 扩展屏画面索引值
         * 参数2 回调函数
         */
        setExtansionScreenIndex: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index;
            var value = args.shift();
            if( !isNaN( value ) ){
            	index = value;
            }else{
            	index = value || lastArg || 1;
            }
            avPublishInterface.setStitchVideo(8, 200, +index, fn);
        },
        /**
         * 设置用户自定义画面拼接规则
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * rule 拼接规则
         * 参数2 回调函数
         */
        setCustSplitInfo: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.rule) return ;
            avPublishInterface.setStitchVideo(9, params.id||0, params.rule, fn);
        },
        /**
         * 启用台标
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * logo.id 标识，如果同时存在多个台标，用于区分不同的台标对象(根据业务需要自己生成，移除台标时使用)
         * logo.filePath 台标文件路径
         * logo.widthScale 台标宽度，相对于视频分辨率的百分比，范围0至1
         * logo.heightScale 台标高度，相对于视频分辨率的百分比，范围0至1
         * logo.position 台标所处位置：1左上/2右上/3左下/4右下
         * logo.x 台标所处位置与左右边的距离
         * logo.y 台标所处位置与上下边的距离
         * 参数2 回调函数
         */
        useLogo: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.logo || void(0)===params.logo.id) return ;
            params.logo.switch = 1;
            params.logo.position = params.logo.position || 1;
            avPublishInterface.setStitchVideo(10, +params.id||0, JSON.stringify(params.logo), fn);
        },
        /**
         * 取消启用台标
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * logo.id 标识，启用台标里生成的
         * 参数2 回调函数
         */
        abandonLogo: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.logo || void(0)===params.logo.id) return ;
            params.logo.switch = 0;
            avPublishInterface.setStitchVideo(10, params.id||0, JSON.stringify(params.logo), fn);
        },
        /**
         * 启用字幕
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * subtitle.id 标识，如果同时存在多个台标，用于区分不同的台标对象(根据业务需要自己生成，移除字幕时使用)
         * subtitle.content 字幕内容
         * subtitle.direction 字幕方向，字幕方向1=横向  2=纵向
         * subtitle.position 字幕位置，1=上/左 2=下/右
         * subtitle.x 字幕所处位置与左右边的距离
         * subtitle.y 字幕所处位置与上下边的距离
         * subtitle.scrollDirection 字幕滚动方向 0=不滚动 1=向上 2=向下 3=向左 4=向右
         * subtitle.scrollCount 滚动次数，scrollDirection不为0时有效，值为-1时表示一直滚动
         * subtitle.fontName 字体名称
         * subtitle.fontSize 字体大小
         * subtitle.fontStyle 字体样式，第1个表示是否倾斜， 第2个表示是否下划线，第3个表示是否加粗，（用","分割）
         * subtitle.fontColor 字体透明度和颜色，ARGB，（用","分割）
         * subtitle.backgroundColor 背景透明度和颜色，ARGB，（用","分割）
         * 参数2 回调函数
         */
        useSubtitle: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null,
                defaultParams = {
                    switch: 1,
                    direction: 1,
                    position: 1,
                    scrollDirection: 0,
                    fontName: "宋体",
                    fontSize: 24,
                    italic: false,
                    underline: false,
                    bold: false,
                    fontColor: "1,0,0,0",
                    backgroundColor: "0,0,0,0"
                };
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.subtitle || void(0)===params.subtitle.id || void(0)===params.subtitle.content || 0===params.subtitle.content.length) return ;
            var subtitleInfo = Object.assign(defaultParams, params.subtitle);
            subtitleInfo.fontStyle = [Boolean(subtitleInfo.italic), Boolean(subtitleInfo.underline), Boolean(subtitleInfo.bold)];
            subtitleInfo.fontColor = subtitleInfo.fontColor.split(",").map(function(item) {return +item});
            subtitleInfo.backgroundColor = subtitleInfo.backgroundColor.split(",").map(function(item) {return +item});
            avPublishInterface.setStitchVideo(11, params.id||0, JSON.stringify(subtitleInfo), fn);
        },
        /**
         * 取消启用字幕
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * subtitle.id 标识，启用字幕时生成的
         * 参数2 回调函数
         */
        abandonSubtitle: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(!params.subtitle || void(0)===params.subtitle.id) return ;
            params.subtitle.switch = 0;
            avPublishInterface.setStitchVideo(11, params.id||0, JSON.stringify(params.subtitle), fn);
        },
        /**
         * 获取磁盘剩余空间
         * 参数1 磁盘地址
         * 参数2 回调函数
         */
        getDiskFreeSpace: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var disk = args.shift() || lastArg;
            if(!disk) return ;
            avPublishInterface.getSystemInfo(1, disk, fn);
        },
        /**
         * 获取磁盘剩余空间可录制时长
         * 参数1 磁盘地址
         * 参数2 回调函数
         */
        getRecordFreeTime: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var disk = args.shift() || lastArg;
            if(!disk) return ;
            avPublishInterface.getSystemInfo(2, disk, fn);
        },
        /**
         * 获取录制文件时长
         * 参数1 录制文件地址
         * 参数2 回调函数
         */
        getRecordTime: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var recordFile = args.shift() || lastArg;
            if(!recordFile) return ;
            avPublishInterface.getSystemInfo(3, recordFile, fn);
        },
        /**
         * 获取系统麦克风音量
         * 参数1 回调函数
         */
        getMicrophoneValue: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.getSystemInfo(4, void(0), fn);
        },
        /**
         * 获取系统扬声器音量
         * 参数1 回调函数
         */
        getLoudspeakerValue: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.getSystemInfo(5, void(0), fn);
        },
        /**
         * 设置自动插件自动更新地址
         * 参数1 新插件地址
         * 参数2 回调函数
         */
        setUpdatePluginUrl: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var url = args.shift() || lastArg;
            if(!url) return ;
            avPublishInterface.setUpdatePlugin(1, url, fn);
        },
        /**
         * 运行插件
         * 参数1 回调函数
         */
        run: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(1, fn);
        },
        /**
         * 停止插件
         * 参数1 回调函数
         */
        stop: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(2, fn);
        },
        /**
         * 停止VNC
         * 参数1 回调函数
         */
        stopVNC: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(3, fn);
        },
        /**
         * 打开PPT
         * 参数1 回调函数
         */
        openPPT: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(4, fn);
        },
        /**
         * 暂停PPT
         * 参数1 回调函数
         */
        pausePPT: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(5, fn);
        },
        /**
         * 关闭PPT
         * 参数1 回调函数
         */
        closePPT: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(6, fn);
        },
        /**
         * 打开VNC
         * 参数1 回调函数
         */
        startVNC: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var ip = args.shift() || lastArg;
            if(!ip) return ;
            avPublishInterface.startVNCBBT(1, ip, fn);
        },
        /**
         * 打开班班通电脑的浏览器
         * 参数1 地址，浏览器会打开指定地址
         * 参数2 回调函数
         */
        openBBTBrowser: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var url = args.shift() || lastArg;
            if(!url) return ;
            avPublishInterface.startVNCBBT(2, url, fn);
        },
        /**
         * 关闭班班通电脑的浏览器
         * 参数1 回调函数
         */
        closeBBTBrowser: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(2, 0, fn);
        },
        /**
         * 放大班班通电脑的浏览器
         * 参数1 回调函数
         */
        enlargeBrowser: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(2, 1, fn);
        },
        /**
         * 缩小班班通电脑的浏览器
         * 参数1 回调函数
         */
        reduceBrowser: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(2, 2, fn);
        },
        /**
         * 班班通PPT向前翻页
         * 参数1 回调函数
         */
        pageUp: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(1, -1, fn);
        },
        /**
         * 班班通PPT向后翻页
         * 参数1 回调函数
         */
        pageDn: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(1, 1, fn);
        },
        /**
         * 开始录制
         * 参数1 回调函数
         */
        startRecord: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setRecordState(2, fn);
        },
        /**
         * 暂停录制
         * 参数1 回调函数
         */
        pauseRecord: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setRecordState(1, fn);
        },
        /**
         * 停止录制
         * 参数1 回调函数
         */
        stopRecord: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setRecordState(0, fn);
        },
        /**
         * 是否预览
         * has 是否预览
         */
        set hasPreview(has) {
            avPublishInterface.setGeneralFunction(1, has);
        },
        /**
         * 设置虚拟机位个数
         * 参数1 虚拟机位个数
         * 参数2 回调函数
         */
        setVirtualCameraCount: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var count = args.shift() || lastArg;
            if(isNaN(count)) return ;
            avPublishInterface.setGeneralFunction(2, count, fn);
        },
        /**
         * 打开系统文件夹
         * 参数1 件夹路径
         * 参数2 回调函数
         */
        openSystemFolder: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var url = args.shift() || lastArg;
            if(!url) return ;
            avPublishInterface.setGeneralFunction(3, url, fn);
        },
        /**
         * 设置麦克风音量
         * 参数1 音量
         * 参数2 回调函数
         */
        setMicrophoneValue: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = 0;
            }
            var value = args.shift() || lastArg;
            if(isNaN(value)) return ;
            avPublishInterface.setGeneralFunction(4, value, fn);
        },
        /**
         * 设置扩音器音量
         * 参数1 音量
         * 参数2 回调函数
         */
        setLoudspeakerValue: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = 0;
            }
            var value = args.shift() || lastArg;
            if(isNaN(value)) return ;
            avPublishInterface.setGeneralFunction(5, value, fn);
        },
        /**
         * 设置用户唯一标示
         * 参数1 用户id
         * 参数2 回调函数
         */
        setUserId: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var userId = args.shift() || lastArg;
            if(!userId) return ;
            avPublishInterface.setGeneralFunction(6, userId, fn);
        },
        //关机
        closeComputer: function() {
            avPublishInterface.setGeneralFunction(7, 1);
        },
        //重起计算机
        restartComputer: function() {
            avPublishInterface.setGeneralFunction(7, 2);
        },
        /**
         * 设置音量
         * 参数1 音量
         * 参数2 回调函数
         */
        setVolume: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var d = args.shift() || lastArg;
            if(void(0)==d) return ;
            avPublishInterface.setGeneralFunction(8, d, fn);
        },
        /**
         * 开启扩展屏
         * fn 回调函数
         */
        openExtansionScreen: function(fn) {
            avPublishInterface.setGeneralFunction(9, 1, fn);
        },
        /**
         * 关闭扩展屏
         * fn 回调函数
         */
        closeExtansionScreen: function(fn) {
            avPublishInterface.setGeneralFunction(9, 0, fn);
        },
        /**
         * 设置对话模式的初始值
         * left 左半个画面的机位索引
         * right 右半个画面的机位索引
         * 参数2 回调函数
         */
        setDefaultConversation: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(void(0)===params.left || void(0)===params.right) return ;
            avPublishInterface.setConversationArray(params, fn);
        },
        //开始服务器端录制
        startServerRecord: function() {
            var args = [].slice.call(arguments, 0), fn = args.pop();
            avPublishInterface.setServerRecordState(2, fn);
        },
        //暂停服务器端录制
        pauseServerRecord: function() {
            var args = [].slice.call(arguments, 0), fn = args.pop();
            avPublishInterface.setServerRecordState(1, fn);
        },
        //停止服务器端录制
        stopServerRecord: function() {
            var args = [].slice.call(arguments, 0), fn = args.pop();
            avPublishInterface.setServerRecordState(0, fn);
        },
        /**
         * 设置预览参数
         * index 机位索引(int) 0:stitch 1~6:resource  100:visitor
         * name 显示的设备名称
         * 参数2 回调函数
         */
        setPreview: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;
            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setConversationArray(params.index||0, params.name, fn);
        }
    };
    var plugin = {
        wsPublish: wsPublish,
        avPublish: avPublish
    };
    !duang?(window.plugin=Object.assign(window.plugin||{}, plugin)):(function() {
        duang.module("Tool", []).directive("PublishPlugin", ["tool"], function() {
            return plugin;
        });
    }());
}(function() {
    return window.duang || null;
}));