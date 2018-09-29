;(function(fn, undefined) {
    "use strict";
    var receivePluginTab = [],
        receivePluginObj = {},
        _receivePluginObj = {},
        cameras = {},
        audios = {},
        number = 1,
        receiveVersion = "",
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
        custEvent = new tool.constructor.CustomerEvent(),
        url = ("https:"===location.protocol?"wss://localhost:9099":"ws://localhost:9098") + "/receive";
    var eventMap1 = {
        1: "OnCPUWatch",
        2: "OnGPUWatch",
        3: "OnMemoryWatch"
    };
    var eventMap = {
        1101: "OnRateWatch",
        1102: "OnDisConnect",
        1103: "OnFunctionResult",
        1104: "OnStateMessage",
        1105: eventMap1,
        1106: "OnStreamResolution"
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
        1999: function(data) {
            receiveVersion = data.version;
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
                fn && args.push(fn);
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
        var self = this, camera = cameras[params.cameraId||number++];
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
                });
            } catch(e) {
                console.error(e.message);
            }
        };
        if(camera) {
            _linkVideo();
        } else {
            console.error("未获取到相关设备！");
        }
    }
//================接收插件开始=======================================================
    function AvReceive(params, server) {
        if(!this instanceof AvReceive) {
            return new AvReceive(params);
        }
        this.name = "AvReceive";
        var self = this;
        var bindEvent = function() {
            var tracks = self.stream.getTracks();
            tracks.forEach(function(track) {
                /*track.onmute = function() {
                    //流中断
                    params.video.load();
                    self.fireEvent({type: "OnBreak", message: {type: track.kind, id: self.id, video: params.video}});
                };*/
            });
        }; 
        this.id = params.id || tool.random(10);
        this.taskList = [];
        linkVideo.call(self, params, bindEvent);
        this.addEvent = custEvent.addCustEvent;
        this.removeEvent = custEvent.removeCustEvent;
        this.fireEvent = custEvent.fire;
        this.handles = [];
        if(params.background) {
            params.video.style.background = "center contain no-repeat content-box url("+params.background+")";
        }
        params.video.setAttribute("autoplay", "autoplay");
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
    AvReceive.prototype = {
        constructor: AvReceive,
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
        /**
         * 录制
         * fn 回调函数
         */
        ableRecord: function(fn) {
            avReceiveInterface.setReceiveRecord(1, this.deviceName, 1, fn);
        },
        /**
         * 不录制
         * fn 回调函数
         */
        disableRecord: function(fn) {
            avReceiveInterface.setReceiveRecord(1, this.deviceName, 0, fn);
        },
        /**
         * 设置录制文件类型
         * 参数1 文件类型 flv,mp4
         * 参数2 回调函数
         */
        setRecordFileType: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                map = {flv: 1, mp4: 2},
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var type = args.shift() || lastArg || "flv";
            avReceiveInterface.setReceiveRecord(2, this.deviceName, map[type], fn);
        },
        /**
         * 设置录制文件类型
         * 参数1 是否appending ture/false
         * 参数2 回调函数
         */
        setRecordAppending: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var appending = args.shift() || lastArg || 1;
            avReceiveInterface.setReceiveRecord(3, this.deviceName, Number(appending), fn);
        },
        /**
         * 开始录制
         * fn 回调函数
         */
        startRecord: function(fn) {
            avReceiveInterface.setReceiveRecord(4, this.deviceName, 2, fn);
        },
        /**
         * 暂停录制
         * fn 回调函数
         */
        paruseRecord: function(fn) {
            avReceiveInterface.setReceiveRecord(4, this.deviceName, 1, fn);
        },
        /**
         * 停止录制
         * fn 回调函数
         */
        stopRecord: function(fn) {
            avReceiveInterface.setReceiveRecord(4, this.deviceName, 0, fn);
        },
        /**
         * 设置录制文件全路径
         * 参数1 录制文件全路径
         * 参数2 回调函数
         */
        setRecordFileName: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var fileName = args.shift() || lastArg;
            if(!fileName) return ;
            avReceiveInterface.setReceiveRecord(5, this.deviceName, fileName, fn);
        },
        /**
         * 设置录制文件类型，
         * 参数1 文件类型 0=只录制视频  1=只录制音频 2=音视频全录
         * 参数2 回调函数
         */
        setRecordType: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var type = args.shift() || lastArg || 2;
            avReceiveInterface.setReceiveRecord(6, this.deviceName, type, fn);
        },
        /**
         * 设置接收流名称，
         * 参数1 流名称
         * 参数2 回调函数
         */
        setStreamName: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var streamName = args.shift() || lastArg;
            if(void(0)===streamName) return ;
            avReceiveInterface.setReceiveStream(1, this.deviceName, streamName, fn);
        },
        /**
         * 设置缓冲时长，
         * 参数1 缓冲时长
         * 参数2 回调函数
         */
        setButterTime: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var time = args.shift() || lastArg;
            avReceiveInterface.setReceiveStream(2, this.deviceName, isNaN(time)?0:time, fn);
        },
        /**
         * 设置接收类型，
         * 参数1 接收类型 0//音视频都不接,1//只接视频, 2//只接音频, 3//音视频都接
         * 参数2 回调函数
         */
        setReceiveType: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var type = args.shift();
            type = void(0)===type?(lastArg||3):type;
            avReceiveInterface.setReceiveStream(3, this.deviceName, type, fn);
        },
        /**
         * 设置编码器
         * 参数1 编码器 1=CodyyFfmpeg 2=CodyyIntel
         * 参数2 回调函数
         */
        setEncodeType: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var encodeType = args.shift() || lastArg || 1;
            avReceiveInterface.setReceiveStream(4, this.deviceName, encodeType, fn);
        },
        /**
         * 设置共享内存名称
         * 参数1 共享内存名称 CodyyMultiHD 插件的OnCreateShareMem事件产生的shareName
         * 参数2 回调函数
         */
        setShareMemoryName: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var name = args.shift() || lastArg;
            if(void(0)===name) return ;
            avReceiveInterface.setReceiveStream(5, this.deviceName, name, fn);
        },
        /**
         * 设置流量统计参数，统计结果主动抛给页面
         * time 设置插件统计时长
         * interval 设置插件向页面抛出时长
         * 参数2 回调函数
         */
        setTrafficStatisticParam: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {} || 1;
            avReceiveInterface.setTrafficStatistic(this.deviceName, isNaN(params.time)?3000:+params.time, isNaN(params.interval)?3000:+params.interval, fn);
        },
        /**
         * 运行插件
         * fn 回调函数
         */
        run: function(fn) {
            avReceiveInterface.setProgramState(this.deviceName, 1, fn);
        },
        /**
         * 停止插件
         * fn 回调函数
         */
        stop: function(fn) {
            avReceiveInterface.setProgramState(this.deviceName, 2, fn);
        },
        /**
         * 设置共享内存的分辨率大小，该接口需要在设置共享内存名字之前调用
         * width 宽
         * height 高
         * 参数2 回调函数
         */
        setMemoryResolution: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avReceiveInterface.setMemoryResolution(this.deviceName, isNaN(params.width)?1920:params.width, isNaN(params.height)?1080:params.height, fn);
        },
        /**
         * 使用扩展屏显示预览，该接口需要在run方法之前调用
         * fn 回调函数
         */
        useExtendScreen: function(fn) {
            avReceiveInterface.setRenderMode(this.deviceName, 0, fn);
        },
        /**
         * 使用扩展屏显示预览，该接口需要在run方法之前调用
         * switch 音频快播的开关 0/1
         * max 阈值
         * time 持续的时间间隔
         * 参数2 回调函数
         */
        setFastPlayParam: function() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if(lastArg && "[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if(void(0)===params.switch || void(0)===params.max || void(0)===params.time) return ;
            avReceiveInterface.setMemoryResolution(params.switch, params.max, params.time, fn);
        }
    };
//================接收插件结束=======================================================
//================接收插件服务开始=======================================================
    var WSReceive = (function() {
        var	ws = null;
        var _WSReceive = function(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);
            eventHandle[9999] = function() {
                avReceiveInterface.initReceiveModule(params, function() {
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
                        _WSReceive.call(self, params, null, callback2);
                }
            };
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
            value: _WSReceive
        }});
        return obj;
    } ());
//================接收插件服务结束=======================================================
    var avReceiveInterface = {
        //与服务器连接成功后,启动接收模块
        initReceiveModule: function(params, fn) {
            var deviceList = params.deviceList || [];
            if(deviceList.length<=0) return ;
            var config = {
                method: 1001,
                delayExitTime: params.delayExitTime || 0,
                param: {
                    deviceList: deviceList
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置录制相关信息
        setReceiveRecord: function(key, deviceName, value, fn) {
            var config = {
                method: 1002,
                param: {
                    key: key,
                    deviceName: deviceName,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置发送相关信息
        setReceiveStream: function(key, deviceName, value, fn) {
            var config = {
                method: 1003,
                param: {
                    key: key,
                    deviceName: deviceName,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置流量监测功能参数
        setTrafficStatistic: function(deviceName, time, interval, fn) {
            var config = {
                method: 1004,
                param: {
                    deviceName: deviceName,
                    time: time,
                    eventInterval: interval
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置程序运行状态
        setProgramState: function(deviceName, key, fn) {
            var config = {
                method: 1005,
                param: {
                    key: key,
                    deviceName: deviceName
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置共享内存分辨率
        setMemoryResolution: function(deviceName, width, height, fn) {
            var config = {
                method: 1007,
                param: {
                    deviceName: deviceName,
                    width: width,
                    height: height
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置预览的模式(是否使用扩展屏显示)
        setRenderMode: function(deviceName, mode, fn) {
            var config = {
                method: 1008,
                param: {
                    deviceName: deviceName,
                    mode: mode
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置音频快播的参数
        setFastPlayParam: function(_switch, max, time, fn) {
            var config = {
                method: 1009,
                param: {
                    fastPlaySwitch: _switch,
                    thresholdValue: max,
                    keepThresholdTime: time
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        }
    };
    //接收插件初始化接口
    //此接口对外，供业务层调用初始化接收插件
    //不包括插件服务的初始化
    var avReceive = {
        init: function(params) {
            if(void(0)===params || !params.video) return;
            var plugin = new AvReceive(params, WSReceive);
            receivePluginTab.push(plugin);
            plugin.deviceName = params.deviceName || "";
            if(void(0)!==params.id) receivePluginObj[params.id] = plugin;
            if(void(0)!==params.deviceName) _receivePluginObj[plugin.deviceName] = plugin;
            return plugin;
        },
        getPluginByIndex: function(index) {
            index = index || 0;
            return receivePluginTab[index];
        },
        getPluginById: function(id) {
            if(void(0)===id) return ;
            return receivePluginObj[id];
        }
    };
    //接收插件服务相关接口
    //此接口对外，供业务层调用初始化插件服务
    var wsReceive = {
        init: function(params, callback) {
            if(void(0)===params) return ;
            var self = this;
            return WSReceive.init.call(WSReceive, params, callback, function() {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key?eventMap[data.event][data.param.key]:eventMap[data.event];
                data.param?delete data.param.key:(data.param = "");
                if(eventName) {
                    if(data.param.deviceName) {
                        var receivePlugin = _receivePluginObj[data.param.deviceName];
                        receivePlugin && receivePlugin.fireEvent({type: eventName, message: data.param});
                    } else {
                        this.fireEvent({type: eventName, message: data.param});
                    }
                }
            });
        },
        get state() {
            return WSReceive.state;
        },
        addEvent: function(type, callback) {
            if(void(0)===type || void(0)===callback) return;
            WSReceive.addEvent(type, callback);
        },
        removeEvent: function(type, fn) {
            if(void(0)===type) return;
            WSReceive.removeEvent(type, fn);
        },
        get version() {
            return receiveVersion;
        }
    };
    var plugin = {
        wsReceive: wsReceive,
        avReceive: avReceive
    };
    !duang?(window.plugin=Object.assign(window.plugin||{}, plugin)):(function() {
        duang.module("Tool", []).directive("ReceivePlugin", ["tool"], function() {
            return plugin;
        });
    }());
}(function() {
    return window.duang || null;
}));