//插件的相关处理-非reducer部分
import { wsPreview,avPreview } from '@/utils/codyy';

//设备的参数
const deviceParam = {
	"deviceParam": {
		"colorSpace": 1,
		"deviceName": "",
		"displayName": "",
		"fps": 25,
		"height": 720,
		"resolutions": [
			[160,120],[176,144],[320,176],[320,240],[352,288],[432,240],[544,288],[640,360],[640,480],
			[752,416],[800,448],[800,600],[864,480],[960,544],[960,720],[1024,576],[1184,656],[1280,720],[1280,960]
		],
		"width": 1280
	},
	"deviceType": 0,
	"id": 1
};
	
//code的参数
const encoderParam = {
	"id": 1,
	"param": {
		"audioSwitch": 1,
		"avsync": 0,
		"bFramFlag": true,
		"bFrameNum": 0,
		"bitrate": 200,
		"encode": 0,
		"fps": 15,
		"gop": 25,
		"height": 90,
		"width": 160
	},
	"stream": [
		{
			"allSendThreshold": 25,
			"audioQueue": 35,
			"audioSwitch": 1,
			"avsync": 0,
			"flag": 11,
			"keyFrameSendThreshold": 35,
			"recordSwitch": 1,
			"rtmpSwitch": 1,
			"rtmpUri": "rtmp://127.0.0.1:1935/dms",
			"videoQueue": 25
		}
	]
};


//会议的状态处理
export const handleDefaultMetting = async(json)=>{
	let promise = [];
	let previewObj = "";
	// let {audioParam} = json;
	wsPreview.init(function() {
        // 初始化插件
        previewObj = avPreview.init();
        //获取所有摄像头
        previewObj.getCameras();
        //获取所有麦克风
        previewObj.getMicrophones();
        //获取所有扬声器
        previewObj.getLouderspeakers();
        //获取所有独立显卡
        previewObj.getDiscreteGraphics();
    });
    
	//获取摄像头信息
	promise.push(
		new Promise((resolve,reject)=>{
			wsPreview.addEvent("OnCameraBack", function(data) {
				let result = data.value.filter(item=>item.displayName.indexOf('Codyy')===-1);
				resolve(result);
   			});
		})
	);
	
	//获取所有麦克风
	promise.push(
		new Promise((resolve,reject)=>{
			wsPreview.addEvent("OnMicrophoneBack", function(data) {
				let result = data.value[0] || {};
				resolve(result);
   			});
		})
	);
	
	 //获取所有扬声器
	promise.push(
		new Promise((resolve,reject)=>{
			wsPreview.addEvent("OnLoudSpeakerBack", function(data) {
				let result = data.value[0] || {};
				resolve(result);
   			});
		})
	);
	
	//获取所有独立显卡
	promise.push(
		new Promise((resolve,reject)=>{
			wsPreview.addEvent("OnDiscreteGraphicsCard", function(data) {
				resolve(data);
   			});
		})
	);
	let result = await Promise.all(promise);
	
	
	//设置虚拟摄像头
	result[0].map((item,index) => {
		
		json.videoDevice.push({
			...deviceParam,
			deviceParam : {...deviceParam.deviceParam,...item},
			id : index+1
		});
		
		json.encoder.push({
			...JSON.parse(JSON.stringify(encoderParam)),
			id :  index+1
		});
		
	});
	
	//设置麦克风
	json.audioParam = {
		...json.audioParam,
		microphone   : [{...result[1],buffer:30,id:1}],
		speakerParam : [{...result[2],id:1}],
	};
	
	//修改json
	return {
		json,
		previewObj
	};
};




/** 
 * 如果视频画面存在，则修改当前的画面
 * oVal : 老的画面设置
 * nVal : 新的画面设置
 */
export const changeLocalStream = (oVal, nVal)=>{
	let { virtualCamera } = oVal;
	//流是否已经加载
	if (virtualCamera.length === 0) return;
	//本地流是否存在
	let localScreen = virtualCamera.find(item=>item.index===0),
		bigScreen = 'bigScreen' in nVal ? nVal['bigScreen'] : oVal['bigScreen'];

	if (!localScreen || !localScreen.status) return;
	
	let pip = localScreen.plugin.pip();
	
	//修改本地画面流
	Object.keys(nVal).forEach(key => {
		let oItem = oVal[key],
			nItem = nVal[key];
		//设置小画面的时候改写值
		if (oItem.toString() === nItem.toString() && key != "preset") {
			//数据没有修改不做操作
			return;
		}
		
		//根据指定的值修改本地流的设置
		switch (key) {
			//导播模式
			case 'mode':
				pip.then('setDirectorMode',nItem,r => {
					if (r.param.result !== 0) {
						console.log("设置导播模式失败", nItem, r);
					}
				});
				break;
			//修改分辨率
//			case 'resolution' :
//				{
//					let resolution = nItem.split("*").map(item=>parseInt(item,10));
//					pip.then('stop').then('setStreamResolution',{
//						resolution,
//						index      : 0,
//						direction  : 11,
//					},function(a){console.log(a)}).then('setStreamResolution',{
//						resolution,
//						index      : 0,
//						direction  : 12,
//					},function(a){console.log(a)}).then("run");
//				}
//				break;
			
			//大画面
			case 'bigScreen':
				if( nItem === "" ){
					pip.then("stop",function(){
						localScreen.videoDom.load();
					});
				}else{
					pip.then('setMainScreenIndex',nItem,r => {
						if (r.param.result !== 0) {
							console.log("设置大画面失败", nItem, r);
						}
					});
					if( oItem === "" ){
						pip.then("run");
					}
				}
				break;
			//清晰度-码率
			case 'definition':
				pip.then("stop").then('setStreamBitrate',{
					bitrate: nItem,
					index: 0
				},r => {
					if (r.param.result !== 0) {
						console.log("设置清晰度失败", { bitrate: nItem, index: 0 }, r);
					}
				}).then("run");
				break;
			//小画面
			case 'smallScreen':
				pip.then('setSmallScreenSequence',{
					id: 0,
					list: nItem
				},r => {
					if (r.param.result !== 0) {
						console.log("小画面", nItem, r);
					}
				});
				break;
			//设置预设位
			case 'preset':
				let mode = 'mode' in nVal ? nVal['mode'] : oVal['mode'];
				if (mode === 2) {
					pip.then('setPreset',{
						index  : bigScreen,
						preset : nItem || 0
					},r => {
						if (r.param.result !== 0) {
							console.log("预设位", { id: bigScreen, preset: nItem || 0 }, r);
						}
					});
				}
				break;
			default: break;
		}
	});
	pip.exec();
}