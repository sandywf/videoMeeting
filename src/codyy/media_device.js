/**
 *
 *
 * date: 2018-04-03
 * author: Jason
 * fileName: media_device.js
 * describe: 获取本地音视频设备
 *
 *
 */
;(function (fn, undefined) {
    var defaultParam = {video: false, audio: false},
        toString = Object.prototype.toString,
        duang = fn(),
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool;

	//获取所有音视频设备，包括虚拟设备
    function getUserMedias() {
        var self = this,
        param = Object.assign({});
        param[self.type] = true;

        navigator.mediaDevices.getUserMedia(param).then(function(stream) {
            var tracks = stream.getTracks();

            if(tracks) {
                tracks.forEach(function(track) {
                    track.stop();
                });
            }

            stream.oninactive = function () {
                console.log('Stream inactive');
            };

            return navigator.mediaDevices.enumerateDevices();
        }).then(function(devices) {
            devices = devices.filter(function(device) {
                var flag = "communications"!=device.deviceId && "default"!=device.deviceId && (self.type+"input")===device.kind;
                if(flag) self.deviceMap[device.label] = device;
                return flag;
            });

        	[].push.apply(self.devices, devices);
            self.status = 1;
        }).catch(function(e) {
        	self.time --;
            if( self.time>0 ){
            	//提供三次进行检查
            	setTimeout(function(){
            		self.getDevices();
            	},400);
            }else{
            	console.error(e);
            	self.status = 1;
            }
        });
    }

    var eventHandle = new tool.constructor.CustomerEvent();
    eventHandle.handles = [];

    var video = {
    	time : 5,
        type : "video",
        devices: [],
        deviceMap: {},
        getDevices: getUserMedias
    };

    var audio = {
    	time : 5,
        type: "audio",
        devices: [],
        deviceMap: {},
        getDevices: getUserMedias
    };

    Object.defineProperty(video, "status", {
        set: function(d) {
            if(1===d) {
                Object.defineProperty(this, "status", {
                    value: 1
                });

                if(1===audio.status) {
                    eventHandle.fire({type: "OnReady", message: [].concat.apply([], this.devices, audio.devices)});
                }
            }
        },
        get: function() {
            return 0;
        },
        configurable: true
    });

    Object.defineProperty(audio, "status", {
        set: function(d) {
            if(1===d) {
                Object.defineProperty(this, "status", {
                    value: 1
                });
                
                if(1===video.status) {
                    eventHandle.fire({type: "OnReady", message: [].concat.apply([], video.devices, this.devices)});
                }
            }
        },
        get: function() {
            return 0;
        },
        configurable: true
    });
    
   	video.getDevices();
    audio.getDevices();

    var mediaDevice = {
        addEvent: function(name, handle) {
            if("[object Function]"!=toString.call(handle)) return;
            eventHandle.addCustEvent(name, handle);
            if(1===audio.status && 1===video.status) handle();
        },
    	getAllMedias: function() {
            if(!audio.status || !video.status) return ;
    		return [].concat.apply([], video.devices, audio.devices);
    	},
    	getAllVideos: function() {
            if(!video.status) return ;
    		return video.devices;
    	},
    	getAllAudios: function() {
    		if(!audio.status) return ;
            return audio.devices;
    	},
    	getVideoByName: function(name) {
            if(!video.status) return ;
    		return video.deviceMap[name];
    	},
    	getAudioByName: function(name) {
    		return audio.deviceMap[name];
    	},
    	getMediaByName: function(name) {
    		return video.deviceMap[name] || audio.deviceMap[name];
    	}
    };

    window.mediaDevice = mediaDevice;
}(function() {
    return window.duang || null;
}));