/**
 *
 *
 * date: 2018-4-12
 * author: Jason
 * fileName: index.js
 * describe: 环境检测
 *
 *
 */
 ;(function(fn, undefined) {
 	 "use strict";

    var linkCount = 0,
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
        url = ("https:"===location.protocol?"wss://localhost:9102":"ws://localhost:9101") + "/envCheck";

    var defaultConfig = {
        linkCountLimit: 3
    };

    var addEvent = window.addEventListener?function(target, type, fn, use) {
        target.addEventListener(type, fn, use||false);
    }:function(target, fn, type) {
        target.attachEvent("on"+type, fn);
    };

    var eventHandle = {};
    var callbackMap = {};

    var browserNameMap = {
    	"Chrome": "谷歌",
    	"Firefox": "火狐",
    	"Edge": "Edge",
    	"MSIE": "IE",
    	"360EE": "360",
    	"QQBrowser": "QQ",
    	"OPR": "opera"
    };

    var eventMap = {
    	OnDetectionCamera: "OnGetCamera",	//视频设备获取成功后触发的事件
    	OnCheckDMSIsConnect: "OnCheckStremServer",	//硬件检测
    	OnVideoRender: "OnGetVideoInfo",	//视频信息
    	OnAudioRender: "OnGetAudioInfo",	//音频信息
    	OnAudioCheck: "OnCheckMicrophone",	//音频设备检测
    	OnNativeEnvironmentCheck: "OnCheckEnv",	//环境检测
    	OnBrowserEnvCheck: "OnBrowserEnvCheck",
        OnError: "OnError"
    };

    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };

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

    var WSCheck = (function() {
        var	ws = null, custEvent = new tool.constructor.CustomerEvent();

        var _WSCheck = function(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);
            self.state = 0;
            ++linkCount;

            ws.onopen = function() {
                linkCount = 0;
                self.state = this.readyState;
                var args = [].slice.call(arguments, 0);
                callback1 && callback1.apply(ws, args);
            };

            ws.onmessage = function() {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = JSON.parse(tool.decodeBase64(arg.data));

                if(data.uuid) {
                    var uuid = data.uuid;
                    delete data.uuid;
                    delete data.event;
                    callbackMap[uuid] && callbackMap[uuid].call(self, data.param || data);
                    delete callbackMap[uuid];
                } else {
                    if(eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };

            ws.onclose = function(e) {
                if(!self.state && linkCount>=(params.linkCountLimit || defaultConfig.linkCountLimit)) {
                    var info = {
                        code: 0
                    };

                    Object.defineProperty(info, "description", {
                        value: "未安装检测插件"
                    });

                    obj.fireEvent({type: eventMap["OnError"], message: info});
                    return ;
                }

                self.state = this.readyState;
                if(1000===e.code) return ;

                switch(e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({type: eventMap["OnError"], message: {code: e.code, message: errorMessageMap[e.code]}});
                    break;
                    default:
                        _WSCheck.call(self, callback1, callback2);
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
            value: _WSCheck
        }});

        return obj;
    }());

	var pluginInterface = {
		compressZip: function(src, dist, fn) {
			var config = {
				method: "CompressZip",
				parameter: {
					srcPath: src,
					desPath: dist
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		extractZip: function(src, dist, fn) {
			var config = {
				method: "ExtractZip",
				parameter: {
					srcPath: src,
					desPath: dist
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		permission: function(src, fn) {
			var config = {
				method: "Permission",
				parameter: {
					path: src
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		denyPermission: function(src, fn) {
			var config = {
				method: "DenyPermission",
				parameter: {
					path: src
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		detectionCamera: function(fn) {
			var config = {
				method: "DetectionCamera"
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		checkDMSIsConnect: function(dms, time, fn) {
			var config = {
				method: "CheckDMSIsConnect",
				parameter: {
					dms: dms,
					timeout: time || 2*1000
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		videoRenderStop: function(fn) {
			var config = {
				method: "VideoRenderStop"
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		videoRenderStart: function(winId, deviceName, fn) {
			var config = {
				method: "VideoRenderStart",
				parameter: {
					windowsHandle: winId,
					cameraName: deviceName
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		audioRenderStop: function(fn) {
			var config = {
				method: "AudioRenderStop"
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		audioRenderStart: function(deviceName, fn) {
			var config = {
				method: "AudioRenderStart",
				param: {
					audioName: deviceName
				}
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
		audioCheck: function(fn) {
			var config = {
				method: "AudioCheck"
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            
			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
        checkSpeaker: function(fn) {
            var config = {
                method: "SpeakerCheck"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            
            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
		nativeEnvironmentCheck: function(fn) {
			var config = {
				method: "NativeEnvironmentCheck"
			};

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

			WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
		},
        checkExtensionScreen: function(fn) {
            var config = {
                method: "CheckExtensionScreen"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        }
	};

	var checkPlugin = {
		init: function(params, callback) {
			return WSCheck.init(params, callback, function() {
				var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.event;
                eventName && this.fireEvent({type: eventMap[eventName], message: data.param});
			});
		},
		addEvent: function(name, fn) {
			if(void(0)===name || void(0)===fn) return ;
			WSCheck.addEvent(name, fn); 
		},
		removeEvent: function(name, fn) {
			if(void(0)===name) return ;
			WSCheck.removeEvent(name, fn);
		},
		// 当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        // 参数1 在“wsPublish”中的接口名，string
        // 参数2-n 插件需要的参数
        // 参数n+1 回调函数
        // 目前不用，预留接口
        pip: function() {
            var pip = Pip.call(this);
            pip.pip.apply(this, [].slice.call(arguments, 0));
            return pip;
        },
        // 将目录打包成zip
        // src是源目录
        // dist是目标目录
        compressZip: function(src, dist, fn) {
        	if(void(0)===src || void(0)===dist) return ;
        	pluginInterface.compressZip(src, dist, fn);
        },
        // 将zip文件解压
        // src是源目录
        // dist是目标目录
        extractZip: function(src, dist, fn) {
        	if(void(0)===src || void(0)===dist) return ;
        	pluginInterface.extractZip(src, dist, fn);
        },
        // 给指定文件设置权限
        // src: 文件路径
        permission: function(src, fn) {
        	if(void(0)===src) return ;
        	pluginInterface.permission(src, fn);
        },
        // 解除指定文件权限
        removePerission: function(src, fn) {
        	if(void(0)===src) return ;
        	pluginInterface.denyPermission(src, fn);
        },
        // 获取摄像头
        getCamera: function(fn) {
        	pluginInterface.detectionCamera(fn);
        },
        checkStreamServer: function() {
            var args = toString.call(arguments),
                dms = args.shift(),
                fn = args.pop(),
                time = args.shift();
        	if(!dms || "[object Function]"===toString.call(dms)) return ;
        	pluginInterface.checkDMSIsConnect(dms, time||2*1000, fn);
        },
        stopVideoRender: function(fn) {
        	pluginInterface.videoRenderStop(fn);
        },
        startVideoRender: function(winId, deviceName, fn) {
        	if(!winId || !deviceName) return ;
        	pluginInterface.videoRenderStart(winId, deviceName, fn);
        },
        stopAudioRender: function(fn) {
        	pluginInterface.audioRenderStop(fn);
        },
        startAudioRender: function(deviceName, fn) {
        	if(!deviceName) return ;
        	pluginInterface.audioRenderStart(deviceName, fn);
        },
        checkAudio: function(fn) {
        	pluginInterface.audioCheck(fn);
        },
        checkEnv: function(fn) {
        	pluginInterface.nativeEnvironmentCheck(fn);
        },
        checkBrowserEnv: function(fn) {
        	var info = {
        		plat: navigator.platform,
        		AVStreaming: {},
        		CodyyReceive: {},
        		CodyyTransfer: {},
        		flash: {},
        		PPMeet: {}
        	};

        	var browserInfo = navigator.userAgent.match(/^\s*.*(chrome|firefox|edge|MSIE|360EE|QQBrowser|OPR)[\/\s]*([\d+\.?]+)*.*$/i);

        	browserInfo = {
        		name: browserInfo[1],
        		version: browserInfo[2] || ""
        	};

        	Object.defineProperty(browserInfo, "description", {
        		get: function() {
        			return browserNameMap[browserInfo.name];
        		}
        	});

        	[].slice.call(navigator.plugins, 0).forEach(function(plugin) {
        		switch(plugin.name) {
        			case "CodyyMultiHD":
                    info.AVStreaming = {};
        			info.AVStreaming.name = plugin.name;
        			info.AVStreaming.version = plugin.version;

        			Object.defineProperty(info.AVStreaming, "description", {
        				get: function() {
        					return "发送流插件";
        				}
        			});
        			break;
        			case "CodyyReceiveHD":
                    info.CodyyReceive = {};
        			info.CodyyReceive.name = plugin.name;
        			info.CodyyReceive.version = plugin.version;

        			Object.defineProperty(info.CodyyReceive, "description", {
        				get: function() {
        					return "接收流插件";
        				}
        			});
        			break;
        			case "CodyyTransfer":
                    info.CodyyTransfer = {};
        			info.CodyyTransfer.name = plugin.name;
        			info.CodyyTransfer.version = plugin.version;

        			Object.defineProperty(info.CodyyTransfer, "description", {
        				get: function() {
        					return "转换插件";
        				}
        			});
        			break;
        			case "PPMEETSR":
                    info.PPMeet = {};
        			info.PPMeet.name = plugin.name;
        			info.PPMeet.version = plugin.version;

        			Object.defineProperty(info.PPMeet, "description", {
        				get: function() {
        					return "视频会议插件";
        				}
        			});
        			break;
        			case "Shockwave Flash":
                    info.flash = {};
        			info.flash.name = plugin.name;
        			info.flash.version = plugin.version;

        			Object.defineProperty(info.flash, "description", {
        				get: function() {
        					return "flash";
        				}
        			});
        		}
        	});

        	info.browser = browserInfo;
            "[object Function]"===toString.call(fn) && fn(info);
        },
        checkExtensionScreen: function(fn) {
            pluginInterface.checkExtensionScreen(fn);
        },
        checkSpeaker: function(fn) {
            pluginInterface.checkSpeaker(fn);
        }
	};

	window.plugin = window.plugin || {};
	window.plugin.checkEnv = checkPlugin;
 }(function() {
 	return window.duang || null;
 }));