/**
 * 对CodyyMeeting插件的前台封装，方便调用
 * @Author Jason
 * @Date 2017-11-7
 * @Other 依赖tool.js   Websocket
 * 如果项目中加载了duangJs，会codyyMeeting对象加载入duangJs，模块名为：Tool，指令名：CodyyMeeting
 * 如果项目中没有加载duangJs，会将codyyMeeting对象暴露在全局环境中
 * 与底层Websocket服务的连接是在初始化时建立的
 * ws://localhost:9098
 */
;(function(fn, undefined) {
    var duang = fn(),
        cameras = {},
        audios = {},
        isUnload = false,
        pluginVersion = "",
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
        url = "https:"===location.protocol?"wss://localhost:9099":"ws://localhost:9098";
    var addEvent = window.addEventListener?function(target, type, fn, use) {
        target.addEventListener(type, fn, use||false);
    }:function(target, fn, type) {
        target.attachEvent("on"+type, fn);
    };
    addEvent(window, "beforeunload", function() {
        isUnload = true;
    });
    var eventMap = {
        5002: "OnInit",
        5004: "OnServerRecordStart",
        5006: "OnServerRecordStop",
        5010: "OnSetShareVideo",
        5016: "OnShareVideoTimeChange",
        5019: "OnServerRecordPause",
        5020: "OnError",
        5063: "OnCaptureUpload",
        5067: "OnShareVideoEnd",
        5081: "OnLockScreen",
        5082: "OnUnlockScreen",
        9999: "OnDisconnect",
        100000000: "OnStop"
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
    var av = {
        preview: (function() {
            var stream = null,
                video = null,
                constraints  = {
                    video: {
                        width: {ideal: 1280},
                        height: {ideal: 720},
                        deviceId: {}
                    }
                };
        	return {
        		setCamera: function(deviceName) {
        			if(!deviceName) return ;
                    var camera = cameras[deviceName.match(/Codyy\w+\((\d+)\)/)[1]];
                    if(!camera) {
                        console.error("未获取到相关设备！");
                    } else {
                        constraints.video.deviceId = {exact: camera.deviceId};
                    }
				},
				startPlay: function(_video) {
        			if(_video) video = _video;
        			if(!video) return ;
                    if(stream) {
                        stream.getTracks().forEach(function(track) {
                            track.stop();
                        });
                    }
                    navigator.mediaDevices.getUserMedia(constraints).then(function(_stream) {
                        stream = _stream;
                        video.srcObject = _stream;
                    });
				},
				pausePlay: function() {
					video && video.pause();
				},
				stopPlay: function() {
                    video && video.pause();
				}
			};
		}())
	};
    var WSCodyyMeeting = (function() {
        var	ws = null,
            isClose = false,
            custEvent = new tool.constructor.CustomerEvent();
        var _WSCodyyMeeting = function(callback1, callback2) {
            var self = this;
            isClose = false;
            ws = new WebSocket(url);
            ws.onopen = function() {
                var args = [].slice.call(arguments, 0);
                callback1 && callback1.apply(ws, args);
            };
            ws.onmessage = function() {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = tool.decodeBase64(arg.data);
                if(!/register/g.test(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        throw e;
                    }
                } else {
                    return callback2.call(self, data);
                }
                if("5002"===data.event.toString()) {
                    pluginVersion = data.parameter.version;
                    return ;
                }
                if(data.uuid) {
                } else {
                    callback2.call(self, data);
                }
            };
            ws.onclose = function() {
                isClose && callback2.call(self, {event: 100000000});
                if(isUnload || isClose) return;
                _WSCodyyMeeting(null, callback2);
            };
        };
        var _send = function(msg) {
            ws.send(msg);
        };
        var _stop = function() {
            isClose = true;
            ws.close();
        };
        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send,
            stop: _stop
        }, {init: {
            writable: false,
            configurable: false,
            enumerable: false,
            value: _WSCodyyMeeting
        }});
        return obj;
    }());
    var configWrapper = function(val) {
        return {
            key: "WSMeetingEngine",
            value: val
        };
    };
    //视频会议里相关插件
    var codyyMeeting = {
        //初始化
        init: function(params, callback) {
            if(!params) return ;
            var self = this;
            var config = {
                method: 5001,
                parameter: params
            };
            WSCodyyMeeting.init(function() {
                var registerConfig = {
                    key: "register",
                    value: params.moduleName
                };
                WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(registerConfig)));
            }, function(data) {
                if(/register/g.test(data)) {
                    callback && callback.call(self);
                    WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
                    return ;
                }
                var eventName = eventMap[data.event || ""];
                eventName && this.fireEvent({type: eventName, message: data.parameter});
            });
        },
        //开始服务器录制
        startServerRecord: function() {
            var config = {method: 5003};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //服务器录制暂停
        pauseServerRecord: function() {
            var config = {method: 5018};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //停止服务器录制
        stopServerRecord: function() {
            var config = {method: 5005};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //开始共享桌面
        startShareDesk: function() {
            var config = {method: 5007};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //停止共享桌面
        stopShareDesk: function() {
            var config = {method: 5008};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //设置共享视频
        setShareVideo: function(deviceName) {
            if(!deviceName) return ;
            var config = {
                method: 5009,
                parameter: {
                    title: document.title,
                    cameraId: deviceName
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.setCamera(deviceName);
        },
        //开始共享视频
        startShareVideo: function(video) {
            var config = {method: 5011};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            //av.preview.startPlay(video);
        },
        //seek到视频某个时间点，单位:s
        shareVideoSeek: function(time) {
            if(void(0)===time || isNaN(time)) return ;
            var config = {
                method: 5012,
                parameter: {
                    seek: time
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //暂停共享视频
        pauseShareVideo: function() {
            var config = {method: 5013};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.pausePlay();
        },
        //停止共享视频
        stopShareVideo: function() {
            var config = {method: 5014};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.stopPlay();
        },
        //退出视频共享
        exitShareVideo: function() {
            var config = {method: 5015};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.stopPlay();
        },
        //截屏
        captureScreen: function() {
            var config = {method: 5017};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //通知插件断开连接
        quit: function() {
            var config = {method: 5021};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //调节共享视频音量
        setShareVideoVoice: function(val) {
            var config = {
                method: 5057,
                parameter: {
                    val: val
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },

        // 锁屏
        lockScreen: function(val){
            var config = {
                method: 5060,
                parameter: {
                    val: val
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },

        // 取消锁屏
        unlockScreen: function(){
            var config = {method: 5061};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },


        addEvent: function(type, callback) {
            if(void(0)===type || void(0)===callback) return;
            WSCodyyMeeting.addEvent(type, callback);
        },
        removeEvent: function(type) {
            if(void(0)===type) return;
            WSCodyyMeeting.removeEvent(type);
        },
        stop: function() {
            var config = {method: 5021};
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            WSCodyyMeeting.stop();
        },
        get version() {
            return pluginVersion;
        }
    };
    var plugin = {
        codyyMeeting: codyyMeeting
    };
    !duang?(window.plugin=Object.assign(window.plugin||{}, plugin)):(function() {
        duang.module("Tool", []).directive("CodyyMeeting", ["tool"], function() {
            return codyyMeeting;
        });
    }());
}(function() {
    return window.duang || null;
}));