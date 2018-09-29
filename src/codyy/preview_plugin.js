/**
 *
 *
 * date: 2018-04-03
 * author: Jason
 * fileName: index.js
 * describe: 预览插件，主要是用来做本地画面预览
 *
 *
 */
;(function(fn, undefined) {
    "use strict";
    var plugin = {},
        cameras = {},
        streamMap = {},
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
        url = ("https:"===location.protocol?"wss://localhost:9099":"ws://localhost:9098")+"/preview";

    var eventMap3 = {
        1: "OnCameraBack",
        2: "OnMicrophoneBack",
        3: "OnLoudSpeakerBack",
        4: "OnDiscreteGraphicsCard",
        5: "OnIntegratedGraphicsCard",
        3000: "OnRegister"
    };

    var eventMap = {
        3100: eventMap3,
        3101: "OnSelectDevice",
        3102: eventMap3,
        9999: "OnDisconnect",
        100000000: "OnStop"
    };

    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };

    var eventHandle = {};

    var addEvent = window.addEventListener?function(target, type, fn, use) {
        target.addEventListener(type, fn, use||false);
    }:function(target, fn, type) {
        target.attachEvent("on"+type, fn);
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

    var WSPreview = (function() {
        var ws = null,
            custEvent = new tool.constructor.CustomerEvent();

        var _WSPreview = function(callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);

            var initPreviewModule = function() {
                var config = {method: 3000};
                WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
            };

            ws.onopen = function() {
                var args = [].slice.call(arguments, 0);
                initPreviewModule();
                callback1 && callback1.apply(ws, args);
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
                if(1000===e.code) return callback2.call(obj, {event: 100000000});

                switch(e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({type: "OnError", message: {code: e.code, message: errorMessageMap[e.code]}});
                    break;
                    default:
                        _WSPreview.call(self, null, callback2);
                }                
            };

            return this;
        };

        var _send = function(msg) {
            ws.send(msg);
        };

        var _stop = function() {
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
            value: _WSPreview
        }});

        //当插件抛出OnDisconnect事件时，自动重新初始化
        obj.addEvent("OnDisconnect", function() {
            initPreviewModule();
        });

        return obj;
    }());

    function PreviewPlugin() {
        if(!this instanceof PreviewPlugin) {
            return new PreviewPlugin();
        }

        this.name = "PreviewPlugin";
    }

    PreviewPlugin.prototype = {
        constructor: PreviewPlugin,
        //当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        //参数1 在“wsPublish”中的接口名，string
        //参数2-n 插件需要的参数
        //参数n+1 回调函数
        //目前不用，预留接口
        pip: function() {
            var pip = Pip.call(this);
            pip.pip.apply(this, [].slice.call(arguments, 0));
            return pip;
        },
        //获取所有摄像头
        getCameras: function() {
            var config = {
                method: 3001,
                param: {
                    key: 1
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取所有麦克风
        getMicrophones: function() {
            var config = {
                method: 3001,
                param: {
                    key: 2
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取所有扬声器
        getLouderspeakers: function() {
            var config = {
                method: 3001,
                param: {
                    key: 3
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取所有独立显卡
        getDiscreteGraphics: function() {
            var config = {
                method: 3001,
                param: {
                    key: 4
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //选择当前设备打开预览
        selectDevice: function(params) {
            if(!params) return ;

            var config = {
                method: 3002,
                param: params
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //
        runView: function(cameraId, video) {
            if(void(0)===cameraId || !video) return ;
            var stream = streamMap[cameraId], camera = cameras[cameraId];
            video.setAttribute("autoplay", "autoplay");

            var constraints  = {
                audio: false,
                video: {
                    width: {ideal: 1280},
                    height: {ideal: 720},
                    deviceId: {}
                }
            };

            var _runView = function() {
                try {
                    constraints.video.deviceId = {exact: camera.deviceId};

                    if(stream) {
                        stream.getTracks().forEach(function(track) {
                            track.stop();
                        });

                        delete streamMap[cameraId];
                    }

                    navigator.mediaDevices.getUserMedia(constraints).then(function(_stream) {
                        streamMap[cameraId] = _stream;
                        video.srcObject = _stream;
                    });
                } catch(e) {
                    console.error(e.message);
                }
            };

            if(camera) {
                _runView();
            } else {
                console.error("未获取到相关设备！");
            }
        },
        stop: function() {
            WSPreview.stop();
        }
    };

    var wsPreview = {
        init: function(callback) {
            this.addEvent("OnRegister", callback);

            return WSPreview.init.call(WSPreview, null, function() {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key?eventMap[data.event][data.param.key]:eventMap[data.event];
                data.param?delete data.param.key:(data.param = "");
                eventName && this.fireEvent({type: eventName, message: data.param});
            });
        },
        addEvent: function(type, callback) {
            if(void(0)===type || void(0)===callback) return;
            WSPreview.addEvent(type, callback);
        },
        removeEvent: function(type) {
            if(void(0)===type) return;
            WSPreview.removeEvent(type);
        },
        get version() {
            return previewVersion;
        }
    };

    var avPreview = {
        init: function() {
            return new PreviewPlugin();
        }
    };

    plugin = {
        wsPreview: wsPreview,
        avPreview: avPreview
    };

    !duang?(window.plugin = Object.assign(window.plugin||{}, plugin)):(function() {
        duang.module("Tool", []).directive("PreviewPlugin", ["tool"], function() {
            return plugin;
        });
    }());
}(function() {
    return !window.duang?null:window.duang;
}));