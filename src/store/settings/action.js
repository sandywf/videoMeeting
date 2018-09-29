/**
 * 用户设置相关---录制相关
 * 对当前用户有关的配置项
 */

import * as Type from '@/config/actionTypes';
import { setApi,meetApi } from '@/api';
import { wsPublish, avPublish, wsReceive, avReceive, meetPlugin } from '@/utils/codyy';
import * as pluginHandle from './actionPlugin';
import * as cocoAction from "@/store/coco/action";
import * as padAction from "@/store/pad/action";
import { setSpeakerList } from "@/store/meet/action";
import { Modal }  from "@/components/modal";
import * as msgAction from "@/store/message/action";
import * as shareAction from "@/store/share/action";
import { switchFullScreen } from "@/utils/tool";


import * as setRecord    from './actionRecord';    //录制相关
import * as setVideoItem from './actionVideoItem'; //视频item上对应的功能
import { jointVideoStream }  from './actionJoint'; //设置拼接规则


export * from './actionRecord';         //录制相关
export * from './actionVideoItem';      //视频item上对应的功能
export * from './actionPolling';        //轮巡相关的设置
export * from './actionSelfCheck';      //自检的相关设置


export { 
	jointVideoStream    //拼接流方法
};


//共享内存的设置的值
const shareMemName = [
	{ id : 101, shareName : "RECEIVE1" },
	{ id : 102, shareName : "RECEIVE2" },
	{ id : 103, shareName : "RECEIVE3" },
	{ id : 104, shareName : "RECEIVE4" },
	{ id : 105, shareName : "RECEIVE5" },
	{ id : 106, shareName : "RECEIVE6" },
	{ id : 107, shareName : "RECEIVE7" },
	{ id : 108, shareName : "RECEIVE8" },
	{ id : 109, shareName : "RECEIVE9" }
];




//设置画面模式
export const changeVideoLayout = (mode, flag) => {
	return (dispatch, getState) => {
		let { mid,role, uid, speakerList } = getState().meetInfo;
		dispatch({
			type: Type.CHANGE_VIDEO_LAYOUT,
			params: mode
		});
		
		//如果是主持人的话，去生成拼接流
		if( role === "MAIN" ){
			dispatch( jointVideoStream() );
		}
		

		if(flag) {
			//主讲人-才进行后台请求
			if (mid === uid && mode) {
				setApi.setVideoLayout({ type: mode });
				dispatch(cocoAction.callAll('setAction.changeVideoLayout', mode));
			}

			//更新发言列表去掉undefind
			if (speakerList.length > 0 && speakerList.includes("")) {
				let newList = speakerList.filter((item) => {
					return item;
				});
				dispatch(setSpeakerList(newList));
			}
		}
	}
}

//保存视频设置
export const setVideoSetting = (videoSetting) => {
	return (dispatch, getState) => {
		var { meetObj:{skey},source } = getState().meetInfo,
			{ setInfo } = getState();

		return setApi.setVideoSetting(skey,setInfo,{...videoSetting},source).then(() => {
			dispatch({
				type: Type.SET_VIDEO_SETTING,
				playload: { ...videoSetting }
			});
			//触发修改本地视频的设置
			pluginHandle.changeLocalStream(setInfo, videoSetting);
		});
	}
}

//获取视频设置
export const getVideoSetting = () => {
	return async(dispatch, getState) => {
		let { skey,clsClassroomId,source } = getState().meetInfo.meetObj;
		let { screenList } = getState().setInfo;
		let promises = [];
		let videoSetting = "";
		
		//获取用户设置的数据
		promises.push( setApi.getVideoSetting(skey) );
		
		if( source === "TEACH_PLATFORM" ){
			//授课平台进入
			promises.push( setApi.getDefaultVideoSetting(clsClassroomId) );
			let [selfParams,defaultParams] = await Promise.all( promises );
			selfParams = JSON.parse( selfParams.result || "{}" );
			selfParams.classroomSetting = selfParams.classroomSetting || {};
			let settings = selfParams.classroomSetting;
			
			//分辨率 
			settings.resolution  = settings.resolution  || defaultParams.resolution;
			//码率
			settings.definition  = settings.definition  || defaultParams.mainStreamBitrate;
			//导播模式
			settings.mode        = settings.mode        || defaultParams.initDirectorMode;
			//大画面
			settings.bigScreen   = settings.bigScreen   || defaultParams.initDevice;
			//小画面
			settings.smallScreen = settings.smallScreen || [];
			
			videoSetting = {...selfParams,...settings};
		}else{
			//工作台进入
			let [selfParams] = await Promise.all( promises );
			let defaultParams = getState().setInfo.workspaceSetting;
			selfParams = JSON.parse( selfParams.result || "{}" );
			selfParams.workspaceSetting = selfParams.workspaceSetting || {};
			let settings = selfParams.workspaceSetting;
			
			//分辨率 
			settings.resolution  = settings.resolution  || defaultParams.resolution;
			//码率
			settings.definition  = settings.definition  || defaultParams.definition;
			//导播模式
			settings.mode        = settings.mode        || defaultParams.mode;
			//大画面
			settings.bigScreen   = settings.bigScreen   || defaultParams.bigScreen;
			//小画面
			settings.smallScreen = settings.smallScreen || defaultParams.smallScreen;
			
			videoSetting = {...selfParams,...settings};
		}
		
		//设置画面设置
		dispatch({
			type: Type.SET_VIDEO_SETTING,
			playload: videoSetting
		});
		return videoSetting;
	}
}


//获取插件需要的大JSON-如果有教室，则从后台取数据，否则取前端写死的json数据
export const getPlgunJson = () => {
	return (dispatch, getState) => {
		let { clsClassroomId,source } = getState().meetInfo;
		
		//判断是否有教室
		if(  source === "TEACH_PLATFORM"  ){
			return setApi.getPlgunJson( clsClassroomId ).then((data) => {
				//根据大json的值，获取通用的值
				//获取大画面显示的内容
				dispatch({
					type: Type.SET_PLUGIN_JSON,
					playload: { pluginJson: data.result }
				});
			});
		}else{
			return setApi.getPlgunDefaultJson().then((data) => {
				//根据大json的值，获取通用的值
				//获取大画面显示的内容
				dispatch({
					type: Type.SET_PLUGIN_JSON,
					playload: { pluginJson: data }
				});
			});
		}
	}
}


//创建虚拟video元素，已提供开发使用
/**
 * 创建本地显示流，9个接收流
 * 并将10个虚拟video元素，和10个虚拟摄像头进行绑定-方便调试
 * [
 * 	{
 * 		videoId  : //虚拟摄像头的key值  1-10   10:默认发送流 1-9:接收流
 * 		videoDom ： //虚拟dom元素
 * 		deviceName ://虚拟摄像头名称
 * 		plugin   ： //video绑定的虚拟摄像头的回调对象
 * 		userId   : //如果绑定了用户了需要添加userId
 * 		index    : //摄像机的编号 本地流为0  接受的流  依次为101,102...109
 * 		status   : //当前画面是否已经启用了
 * 	}
 * ]
 */

export const initSetting = () => {
	return async(dispatch, getState) => {
		let { role,meetId } = getState().meetInfo;
		
		//如果是主讲教室，或者参会者的情况下，才会进行插件数据的处理
		if ( role !== "WATCH" ) {
			//生成本地可能要发送流的数据
			await dispatch(handlePluginJson());
		}
		
		//生成虚拟dom,并且根据参会者列表初始化dom元素
		let [ 
			watchObj,
			pubObj,
			receiveList,
			meetPlugin 
		] = await Promise.all([
			//创建接受观摩流的虚拟摄像头（role===watch,才执行）；CodyyVirtualCamera(10)
			dispatch( createReceiveWatchVirtualVideo() ),
			//创建发送流的虚拟摄像头（role!==watch，才执行）;CodyyVirtualCamera(10)
			createPublishVirtualVideo(getState()),
			//创建接受流的虚拟摄像头（需要和产品讨论，设置某个画面全屏，或者音视频的开关）CodyyVirtualCamera(1-9)
			createReceiveVirtualVideo(getState()),
			//创建视频会议的插件，用户共享桌面之类的  CodyyVirtualCamera(9)
			createMeetingPlugin(getState(),dispatch)
		]);
		
		
		//将本地的视频插件对象，缓存下，用于启动共享视频，桌面，录制画面等
		dispatch({
			type: Type.SET_MEET_PLUGIN,
			playload: meetPlugin
		});
		
		//参会者相关逻辑处理
		if( role !== "WATCH" ){
			//预留一个摄像头给共享桌面和共享视频
			dispatch({
				type: Type.SET_MEET_CAMERA,
				playload: receiveList.pop()
			});
			
			//只有主讲教室才会有相关的流信息---观摩没有发言人功能
			let virtualCamera = [...receiveList, pubObj];
			//将发言人的流推送进虚拟摄像头中
			dispatch(bindSpeakerList(virtualCamera)).then(()=>{
				//设置本地storage工具
				dispatch({
					type: Type.INIT_STORAGE,
					playload: meetId
				});
				
				//如果当前是录制中，则继续录制
				let {recordStatus} = getState().setInfo;
				if( recordStatus === 'run' && role === "MAIN" ){
					dispatch(setRecord.toggleRecordOver(recordStatus));
				}

				let {plugin} = pubObj;
				//获取音量，和麦克风的初始化数据
				plugin.getMicrophoneValue(item=>{
					if( item.param.result <= 100 ){
						dispatch(setMicrophoneSound(item.param.result,true));
					}
				});
				plugin.getLoudspeakerValue(item=>{
					if( item.param.result <= 100 ){
						dispatch(setSoundVolume(item.param.result,true));
					}
				});
				
				//初始化双屏功能
				let {doubleScreen} = getState().setInfo;
				if( doubleScreen ){
					dispatch(setVideoItem.toggleDobuleScreen(doubleScreen));
				}
				
			});
		}else{
			
			//观摩者功能
			let meetCamera = {
				videoId    : 9,
				videoDom   : document.createElement('video'),
				deviceName : "CodyyVirtualCamera(9)",
				status     : false,
				index      : 9
			};
			meetCamera.plugin = avReceive.init({
				video      : meetCamera.videoDom,
				cameraId   : meetCamera.videoId,
				id         : 109,
				deviceName : meetCamera.deviceName
			});
			dispatch({
				type: Type.SET_MEET_CAMERA,
				playload: meetCamera
			});
			
			//保存观摩到store中
			dispatch({
				type: Type.SET_WATCH_CAMERA,
				playload: watchObj
			});
			
			//设置大画面的虚拟摄像头
			let receiveCamera = {
				videoId    : 1,
				videoDom   : document.createElement('video'),
				deviceName : "CodyyVirtualCamera(1)",
				status     : false,
				index      : 1
			};
			receiveCamera.plugin = avReceive.init({
				video      : receiveCamera.videoDom,
				cameraId   : receiveCamera.videoId,
				id         : 101,
				deviceName : receiveCamera.deviceName
			});
			dispatch( updateVirtual( [receiveCamera] ) );
		}
	}
}

//观摩全屏的画面
export const watchFullScreen = (tag)=>{
	return async(dispatch, getState) => {
		let { virtualCamera } = getState().setInfo;
		let camera = virtualCamera[0];
		camera.userId    = tag;
		camera.oldUserId = tag;
		if( tag ){
			let {rtmpUrl,httpServerUrl} = await setApi.registerDmsServer(getState(),tag);
			let pip = camera.plugin.pip('setStreamName', rtmpUrl)
			.then('setReceiveType',3)
			.then("run", (a) => {
				camera.rtmpUrl       = rtmpUrl;
				camera.httpServerUrl = httpServerUrl;
				camera.status        = true;
			}).exec();
		}else{
			camera.plugin.stop();
		}
		dispatch( updateVirtual( [camera] ) );
	};
}


//对插件的数据进行统一的处理-处理成为需要使用的格式效果
export const handlePluginJson = () => {
	return async(dispatch, getState) => {
		let { setInfo, meetInfo } = getState(),
			{ meetId, mid,source,role } = meetInfo,
			{ pluginJson, resolution, definition, bigScreen, smallScreen } = setInfo,
			{ json } = pluginJson,
			resArr = resolution.split("*"),
			handleResult;
		//如果是工作台进入，大json是需要前台拼写的
		if( source === 'WORK_PLATFORM' ){
			handleResult = await pluginHandle.handleDefaultMetting(json);
			pluginJson.json = json = handleResult.json;
			//设置预览的插件
			dispatch({
				type      : Type.SET_PREVIEW_PLUGIN,
				playload  : handleResult.previewObj
			});
		}
		let { encoder, videoDevice, global } = json;
			
		//视频会议模式下，默认只发一路流地址
		delete global.networkAdaptive;
		json.encoder = encoder.filter(code => {
			let { id, record = [], stream = [] } = code;
			
			//视频会议没有录制流
			if( record.length > 0 ){
				return false;
			}
			
			//只有支持人，才有观摩流
			if( role !== "MAIN" && id === 100 ){
				return false;
			}
			
			//只发送主流的数据
			stream.forEach(s => {
				if( code.id === 100 ){
					s.rtmpSwitch = 1;
					s.recordSwitch = 0;
					s.audioSwitch = 1;
				}else if (code.id === 0) {
					if (12 === s.flag) {
						s.rtmpSwitch = 1;
						s.recordSwitch = 1;
						s.audioSwitch = 1;
						code.param.width = Number(resArr[0]);
						code.param.height = Number(resArr[1]);
						code.param.bitrate = Number(definition);
					}
				} else {
					//不发流
					s.rtmpSwitch = 0;
					//不服务器录制
					s.recordSwitch = 0;
					//默认不发音频流
					s.audioSwitch = 0;
				}
				delete s.packetLossRate;
			});

			//如果record，或stream为空，删除整个对象
			stream.length === 0 && delete code.stream;
			record.length === 0 && delete code.record;
			return true;
		});
		
		let screenList = videoDevice.map(device => device.id);
		smallScreen = handleSmallScreen(screenList,smallScreen);
		
		//无摄像头
		//每次进入会议时，弹出层提示——没有检测到摄像头，请检查相关配置。
		//弹出层只需要右上角的关闭按钮；
		//只有一个摄像头
		//进入会议时，默认选择该摄像头；
		//若有多个摄像头
		//初次进入会议时，自动弹出视频设置窗口，默认选择无；
		//后面再进入会议时，加载上一次选择的摄像头，不用弹出视频设置窗口。

		//判断是否检测到摄像头-没有的化需要提示用户
		if( screenList.length === 0 ){
			Modal.confirm({
				content : "没有检测到摄像头，请检查相关配置",
				footer : false
			});
		}
		
		//如果没有教室的话,不在对大画面，小画面做检查处理
		//判断主画面是否存在
		if (screenList.indexOf(bigScreen) === -1) {
			//授课平台进入的时候，判断画面是否存在，如果存在
			if( source === 'TEACH_PLATFORM' ){
				bigScreen = screenList[0];
			}else{
				bigScreen = "";
			}
		}
	
		//工作台的情况下-需要将摄像头的名称也要保留下来
		if( source === 'WORK_PLATFORM' ){
			dispatch(setScreenList(videoDevice.map(device =>({
				id         : device.id,
				name       : device.deviceParam.displayName,
				deviceName : device.deviceParam.deviceName,
			}))));
		}else{
			dispatch(setScreenList(screenList));
		}
		
		//获取配置参数
		dispatch({
			type: Type.SET_VIDEO_SETTING,
			playload: { bigScreen, smallScreen }
		});
		
		//更新大json
		pluginJson.json = json;
		//如要要使用双屏功能-需要给共享内存设置名称
		pluginJson.json.global.shareMemName = shareMemName;

		dispatch({
			type: Type.SET_PLUGIN_JSON,
			playload: { pluginJson }
		});
		
		//判断设置虚拟内存
		dispatch({
			type: Type.SET_SHARE_MEM,
			playload: !!pluginJson.json.global.openShareMem
		});
		
	};
}

//设置观摩流画面
const createReceiveWatchVirtualVideo = ()=>{
	return async (dispatch,getState) => {
		let { setInfo, meetInfo, userInfo } = getState();
		let { role, mid, uid } = meetInfo;
		
		//非观摩用户，不需要接受
		if( role !== "WATCH" ) return;
		
		//观摩用户,获取观摩流，并将流写入虚拟摄像头中，方便后期调用
		//获取观摩流
		let { rtmpUrl } = await setApi.registerDmsServer(getState(),mid);

		let watchObj = {
			videoId    : 10,
			videoDom   : document.createElement('video'),
			deviceName : "CodyyVirtualCamera(10)",
			status     : true,
			index      : 0,
			rtmpUrl    : rtmpUrl+'_watch'
		};
		
		//注册虚拟摄像头
		wsReceive.init({
			deviceList : [
				//观摩画面
				{ deviceName: "CodyyVirtualCamera(10)", graphicsQuality: 1 },
				//额外注册一个接收是给共享视频共享桌面相关使用
				{ deviceName: "CodyyVirtualCamera(9)",  graphicsQuality: 1 },
				//对某个大画面放大
				{ deviceName: "CodyyVirtualCamera(1)",  graphicsQuality: 1 }
			]
		},()=>{
			//初始化-观摩接收摄像头
			watchObj.plugin = avReceive.init({
				video      : watchObj.videoDom,
				cameraId   : watchObj.videoId,
				id         : 110,
				deviceName : watchObj.deviceName
			});
			//设置视频音频默认都接收
			let pip = watchObj.plugin.pip('setReceiveType',3);
			//设置接收流
			pip.then("setStreamName",rtmpUrl+'_watch');
			//启动观摩流
			pip.then("run").exec();
		});

		return watchObj;
	}
}



//处理小画面-生成页面可用数据
function handleSmallScreen(list,smallScreen){
	return list.map(item=>{
		let id =  item;
		//获取大画面对应的小画面数组（大画面应该是数组中的第一个）
		let screenItem = smallScreen.find( val=>val.indexOf(id)===0 ) || [id];
		//对小画面数组过滤排除在机位数组中，不存在的画面
		screenItem = screenItem.filter( val=>list.indexOf(val)!==-1 );
		//去重
		screenItem = Array.from(new Set(screenItem));
		return screenItem;
	});
}



/**
 * 设置画面集合，并添加快捷键切换事件
 */
export const setScreenList = (screenList) => {
	return (dispatch,getState) => {
		//绑定监听事件
		document.onkeydown = (e) => {
			let { ctrlKey, shiftKey, keyCode } = e;
			if (shiftKey && ctrlKey) {
				let index = keyCode - 49;
				let obj = screenList[index];
				if (obj) {
					let { mode } = getState().setInfo;
					if( mode !== 1 ){
						let id;
						if( typeof obj === 'object' ){
							id = obj.id;
						}else{
							id = obj;
						}
						dispatch(setVideoSetting({ bigScreen: id }));
					}
					e.preventDefault();
					return false;
				}
			}
		}
		//获取设备列表
		dispatch({
			type: Type.SET_SCREEN_LIST,
			playload: screenList
		});
	}
};


/**
 * 创建发送流虚拟video
 */
export const createPublishVirtualVideo = (state) => {
	let { setInfo, meetInfo, userInfo } = state,
		{ pluginJson, smallScreen, bigScreen, definition } = setInfo,
		{ uid, role } = meetInfo,
		{ userList } = userInfo,
		{ director = {}, json = {}, vgaCom = {} } = pluginJson;

	//观摩，没有发送流
	if (role === "WATCH" ) return Promise.resolve("");

	let uidObj = userList.find(item => item.uid === uid)||{},
		{ isPublishAudio, isPublishVideo } = uidObj;

	let virtualVideo = {
		videoId: 10,
		videoDom: document.createElement('video'),
		deviceName: "CodyyVirtualCamera(10)",
		status: false,
		index: 0,
		userId: uid,
		oldUserId : uid,
	};

	return new Promise((resolve) => {
		wsPublish.init({
			stitchDeviceName: "CodyyVirtualCamera(10)",
			resourceDeviceList: []
		}, function () {
			virtualVideo.plugin = wsPublish;

			avPublish.init({
				cameraId: virtualVideo.videoId,
				video: virtualVideo.videoDom
			});
			json.global.extendScreenShowIndex = 0;
			//插入大json
			let pip = wsPublish.pip("setPublisherConfig", json);
			//插件vga参数
			pip.then("setControllerConfig", vgaCom);
			//插入导播数据
			pip.then("setDirectorConfig", director);
			//设置小画面的拼接位置
			pip.then("setSmallScreenSite", { id: 0, site: 4 });
			//设置当前的主画面
			pip.then("setMainScreenIndex", bigScreen);
			//设置小画面的排序
			pip.then("setSmallScreenSequence", { id: 0, list: smallScreen });
			//设置码率
			pip.then("setStreamBitrate", { bitrate: definition, index: 0 });
			//设置画面模式
			pip.then("setSplitMode", { id: 0, mode: 2 });

			//当前的流为发送流
			//streamMode 0 音视频 1 视频 2 音频 3无，默认：0
			let tag;
			if (!isPublishAudio && !isPublishVideo) {
				tag = 3;
			} else if (isPublishAudio && isPublishVideo) {
				tag = 0;
			} else if (isPublishAudio) {
				tag = 2;
			} else {
				tag = 1;
			}
			pip.then("setStreamMode", { streamMode: tag, index: 0, direction: 12 });
			pip.then("setStreamMode", { streamMode: tag, index: 0, direction: 13 });
			
			//判断是否是主讲人，如果是的化，设置观摩流为自定义拼接流
			if( role === "MAIN" ){
				pip.then('setSplitMode',{id:100,mode:7})
			}
			
			//关闭扩展屏幕
			pip.then("closeExtansionScreen");
			
			//默认不录制
			pip.then("stopRecord", function () {
				console.log("注册自己的发送流");
				resolve(virtualVideo);
			});
			pip.exec();
		});
	});
}

/**
 * 创建接受虚拟video
 */
export const createReceiveVirtualVideo = (state) => {
	let { role } = state.meetInfo;
	//观摩，没有其它接受流
	if (role === "WATCH" ) return Promise.resolve("");
	
	return new Promise((resolve, reject) => {
		let deviceList = [],
			intList = [],
			list = [];
		for (let i = 1; i <= 9; i++) {
			//注册摄像头数据
			deviceList.push({
				deviceName: "CodyyVirtualCamera(" + i + ")",
				graphicsQuality: 1
			});
			//初始化接受流数据
			intList.push({
				video: document.createElement('video'),
				cameraId: i,
				id: 100 + i,
				deviceName: "CodyyVirtualCamera(" + i + ")"
			});
		}
		wsReceive.init({ deviceList }, function () {
			list = intList.map(item => {
				let obj = {
					videoId: item.id - 100,
					videoDom: item.video,
					deviceName: item.deviceName,
					status: false,
					index: item.id
				};
				obj.plugin = avReceive.init(item);
				//设置视频音频默认都接收
				obj.plugin.setReceiveType(3);
				//设置共享内存的名称
				obj.plugin.setShareMemoryName("RECEIVE"+(item.id - 100),()=>{
					//设置共享内存的分辨率
					obj.plugin.setMemoryResolution({width:640,height:360});
				});
				return obj;
			});
			//其它的类型为接受流
			resolve(list);
		});
	});
}


/**
 * 初始化视频会议插件
 */
export const createMeetingPlugin = (state,dispatch) => {
	return new Promise((resolve, reject) => {
		let { uid, meetId ,meetingTitle,uploadObj:{uploadCapture}} = state.meetInfo,
			stream =  meetId + "_" + uid + "_meet";
			
		let meetPluginObj = {
			userId : uid,
			plugin : meetPlugin
		}
		
		setApi.registerDmsServer(state,uid,stream).then( ( {rtmpUrl = '',basicUrl} )=>{
			meetPlugin.init({
				moduleName: 'videoMetting',
				meeting: {
					shareDesktopRtmp  : rtmpUrl.replace("meet", 'desk'),   //共享桌面发送的流址
					shareVideoRtmp    : rtmpUrl.replace("meet", 'video'),  //共享视频发送的流地址
					serverRecordRtmp  : basicUrl+meetingTitle,             //服务器录制流地址
					captureUploadUrl  : uploadCapture                         //视频截图上传URL地址
				},
				default: {
					captureHotKey: "P",
					shareDesktopResolution: [1280, 720],
					shareDesktopBitrate: 1500,
					shareDesktopFps: 20,
					shareVideoBitrate: 1500,
					shareVideoFps: 15,
					recordResolution: [1280, 720],
					recordBitrate: 1500,
					recordFps: 15,
					recordFormat: 1
				},
				switch : {
					localRecord:false,  //是否本地录制
					serverRecord:true,  //是否服务器录制
					shareRecord:true,   //是否共享桌面
					screenCap:true,     //是否截图快捷键
					screenLock:true     //是否开启锁屏
				}
			},()=>{
				resolve(meetPluginObj);
				
				//绑定部分数据的回调
				//截图
				meetPlugin.addEvent("OnCaptureUpload",(obj)=>{
					//通过接口获取图片路径，然后调用白板工具添加图片
					if( obj && obj.fileName ){
						let fileId = obj.fileName;
						meetApi.getFileByFileId(fileId).then(data=>{
							let {serverAddress,serverParams} = state.meetInfo.uploadObj;
							if( data.status == 1 ){
								//保存图片
								// todo 截图之后保存到共享文档里,则保存截图
								let curtScreenParams = {
								    type: "image",
						            successVal: { id: data.result.fileId }
						        }
						        dispatch(shareAction.saveShareFileToResourceServer(curtScreenParams))
								
								//显示文档
								let params = {
									files   : [serverAddress+"/"+data.result.filePath+"?"+serverParams],
						            newTab  : true,
						            isShow  : true,
						            from    : meetId+"_"+uid
								};
								dispatch(padAction.showDoc(params));
							}
						});
					}
				});
			})
		});
	});
}



//更加当前的当前用户列表的状态，推入虚拟的数据流信息
export const bindSpeakerList = (virtualCamera) => {
	return async (dispatch, getState) => {
		let { userInfo, meetInfo,setInfo:{bigScreen} } = getState(),
			{ uid, role } = meetInfo,
			{ userList } = userInfo,
			promiseList = [],
			localVirtual = virtualCamera.find(item => item.index === 0) || "";

		//判断是否是发言人，如果是则添加到视频列表中
		userList.forEach(item => {
			
			let obj = {
				method: '',
			};

			if (item.isSpeaker) {
				//写入虚拟摄像头
				let hasGetStream = false;
				virtualCamera.forEach(camera => {
					if (hasGetStream) return;
					//当前只有当前虚拟摄像头中userid只有 本教室的
					if (item.uid === uid) {
						if (camera.userId !== item.uid) return;
						obj.method = "publish";
					} else if (!camera.userId) {
						obj.method = "play";
					}
					//如果虚拟摄像头可用的化
					if (obj.method) {
						camera.userId = item.uid;
						camera.oldUserId = item.uid;
						hasGetStream = true;
						promiseList.push(
							new Promise((resolve) => {
								setApi.registerDmsServer(getState(),item.uid).then(({rtmpUrl,mobileUrl, httpServerUrl}) => {
                                    let pip;

                                    //输入流
									if (obj.method === "publish") {
										pip = camera.plugin.pip('setStreamName', {
											streamName: rtmpUrl,
											index: 0,
											direction: 12,
										}).then('setStreamName', {
											streamName: mobileUrl ,
											index: 0,
											direction: 13,
										})
										//如果是主持人的化设置观摩流地址
										if( role === "MAIN" ){
											pip.then('setStreamName', {
												streamName: rtmpUrl + "_watch",
												index: 100,
												direction: 12,
											});
										}
									} else {
										pip = camera.plugin.pip('setStreamName', rtmpUrl).then('setReceiveType',3);
									}
									pip.then("run", (a) => {
										camera.rtmpUrl       = rtmpUrl;
										camera.httpServerUrl = httpServerUrl;
										camera.status        = true;
										resolve();
									});
									
									pip.exec();
								});
							})
						);
					}
				});
			} else if (item.uid === uid && role !== "WATCH" && localVirtual) {
				//不是发言人，但是是参与者，并且是当前自己的机位的化，摄入流地址
				obj.method = "publish";
				localVirtual.userId = item.uid;
				localVirtual.oldUserId = item.uid;
                let { mid, meetId } = getState().meetInfo;
                let speakerUserObj = getState().userInfo.getUserObj(item.uid === mid ? '' : item.uid)
                promiseList.push(
					new Promise((resolve) => {
						setApi.registerDmsServer(getState(),item.uid).then(({rtmpUrl,mobileUrl,httpServerUrl}) => {
							//输入流
                            localVirtual.plugin.pip('setStreamName', {
								streamName: rtmpUrl,
								index: 0,
								direction: 12,
							}).then('setStreamName', {
                                streamName: mobileUrl,
                                index: 0,
								direction: 13,
							}).then("stop", () => {
								localVirtual.rtmpUrl       = rtmpUrl;
								localVirtual.httpServerUrl = httpServerUrl;
								localVirtual.status = false;
								resolve();
							}).exec();
						});
					})
				);
			}
		});
		await Promise.all(promiseList).then(()=>{
			//更新虚拟摄像头列表
			dispatch( updateVirtual( virtualCamera ) );
			//如果是支持人的化，启用观摩自定义画面
			dispatch( jointVideoStream() );
		});
	}
}

//更新虚拟摄像头
export const updateVirtual = (virtual) => ({
	type: Type.SET_VIRTUAL_CAMERA,
	playload: virtual
});


/**
 * params : {
 * 		uid  : 要更改状态的摄像头插件
 * 		type : Y|N 开启或关闭
 * }
 */
export const toggleVideoDom = (params) => {
	return async (dispatch, getState) => {
		let { setInfo, meetInfo } = getState(),
			{ role,pollingSetting,speakerList } = meetInfo,
			{ customPolling,isPolling,pollingList } = pollingSetting,
			{ virtualCamera } = setInfo,
			backPlugin = "";
			
		//当前是否是轮巡状态
		let polling = false;  //是否在轮巡中
		if( role === "MAIN" && customPolling){
			polling = true;
		}else if(isPolling && customPolling){
			polling = true;
		}
		
		//判断当前要修改的用户，在已经提交的虚拟列表中是否存在，如果存在去取对应的摄像头 插件
		let virtualPlugin = virtualCamera.find( item => (item.userId === params.uid || item.oldUserId === params.uid) );
		if( virtualPlugin ){
			//如果已经有了dom结果，则设置流
			backPlugin = await dispatch( setStreamToCamera(virtualPlugin,{uid:params.uid,status:params.type==="Y"?true:false }) );
		}else{
			//查找是否用空余的虚拟摄像头
			let spacePlugin = virtualCamera.find( item=> !item.oldUserId );
			if( spacePlugin ){
				backPlugin = await dispatch( setStreamToCamera(spacePlugin,{uid:params.uid,status:params.type==="Y"?true:false }) );
			}else{
				/**
				 * 判断状态
				 * 主持人的虚拟摄像头不能被覆盖
				 * 如果是轮巡中，则要保证，轮巡列表的虚拟摄像头，不能被覆盖
				 * 如果非轮巡中，则要保证，发言人列表中的虚拟摄像头，不能被覆盖
				 */
				let useAblePlugin = virtualCamera.find(item=>{
					let able = true;
					let list = polling?pollingList:speakerList;
					//不是主持人
					if( item.index === 0 ){
						able = false;
					}else if( list.includes(item.userId) ){
						able = false;
					}
					return able;
				});
				
				if( useAblePlugin ){
					backPlugin = await dispatch( setStreamToCamera(useAblePlugin,{uid:params.uid,status:params.type==="Y"?true:false }) );
				}else{
					throw new Error("has error");
				}
			}
		}
		dispatch(updateVirtual(virtualCamera));
		return backPlugin;
	}
}



/**
 * 发送流获取音频，射频模式
 * @param {Object} isPublishAudio 是否显示音频
 * @param {Object} isPublishVideo 是否显示视频
 * @param {Object} isSpeaker      是否是发言人
 * @param {Object} isPolling      是否在轮轮巡状态
 * 0 音视频 1 视频 2 音频 3无，默认：0
 */
function publishStreamMode({isPublishAudio,isPublishVideo,isSpeaker,isPolling}){
	let tag = 0;
	//发送流为发言人
	if( isSpeaker ){
		if (!isPublishAudio && !isPublishVideo) {
			tag = 3;
		} else if (isPublishAudio && isPublishVideo) {
			tag = 0;
		} else if (isPublishAudio) {
			tag = 2;
		}else {
			tag = 1;
		}
	}else if( isPolling ){
		//轮巡模式下-非发言人-值发送视频
		tag = 1;
	}
	return tag;
}


/**
 * 接受流获取音频，视频模式
 * @param {Object} uid            要处理     
 * @param {Object} hideAudioArr   禁音的音频列表
 * @param {Object} hideVideoArr   禁用的视频列表
 * @param {Object} isSpeaker      是否是发言人
 * @param {Object} isPolling      是否在轮巡状态
 */
function receiveStreamMode({uid,hideAudioArr=[],hideVideoArr=[],isSpeaker,isPolling}){
	let audioIsOpen = !hideAudioArr.includes(uid),
		videoIsOpen = !hideVideoArr.includes(uid);	
	//当前在轮巡的状态下
	if( isPolling ){
		if( isSpeaker ){
			//发言人-音视频都接
			audioIsOpen = true;
			videoIsOpen = true;
		}else{
			//非发言人-只接视频
			audioIsOpen = false;
			videoIsOpen = true;
		}
	}
	
	//接收类型 0//音视频都不接,1//只接视频, 2//只接音频, 3//音视频都接
	let tag;
	if (!audioIsOpen && !videoIsOpen) {
		tag = 0;
	} else if (audioIsOpen && videoIsOpen) {
		tag = 3;
	} else if (audioIsOpen) {
		tag = 2;
	} else {
		tag = 1;
	}
	return tag;
}


/**
 * 修改指定摄像头，到指定的流数据
 * @param {Object} camera   //指定的插件
 * @param {Object} params   //指定的参数
 * params : {
 * 	  uid     : //要接受的那个用户流地址，
 *    status  : //开启流，还是关闭流
 * }
 *  如果当前在轮巡状态下，并且params.uid,
 *	对应的接收流摄像头，在轮巡列表中，则只能显示不能关闭
 *	对应的是发送流摄像头，则不管在不在轮巡列表中，总是显示(如果bigScreen==="" 任何情况下都关闭发送插件)
 */
export const setStreamToCamera =(camera,params)=>{
	return  (dispatch, getState) => {
		let { getUserObj,userList}  = getState().userInfo,
			{ role,pollingSetting,meetId } = getState().meetInfo,
			{ customPolling,isPolling,pollingList } = pollingSetting,
			{ hideAudioArr, hideVideoArr,bigScreen } = getState().setInfo,
			{ isPublishAudio,isPublishVideo,isSpeaker } = getUserObj(params.uid) || {};
			
		return new Promise((resolve,reject)=>{
			let fnName = '';
			
			//当前是否是轮巡状态
			let polling = false;  //是否在轮巡中
			if( role === "MAIN" && customPolling  ){
				polling = true;
			}else if(isPolling && customPolling ){
				polling = true;
			}else if( camera.index === 0 && customPolling ){
				polling = true;
			}
			
			
			if( camera.index === 0 ){
				let isShow = polling?true:params.status;
				isShow = bigScreen === ""?false:isShow;
				//发送流的相关操作
				if( isShow ){
					//当前的流为发送流 0 音视频 1 视频 2 音频 3无，默认：0
					let tag = publishStreamMode({isPublishAudio,isPublishVideo,isSpeaker,isPolling:customPolling});
					camera.plugin.setStreamMode({ streamMode: tag, index: 0, direction: 12 });
					camera.plugin.setStreamMode({ streamMode: tag, index: 0, direction: 13 });
				}
				//轮巡的模式下，发送流只能run，不能stop
				fnName = isShow?"run":"stop";
				
				camera.plugin[fnName]((data)=>{
					camera.status = params.status;
					resolve({...camera});
				});
				
			}else if( params.uid && ( camera.userId === params.uid || camera.oldUserId === params.uid ) ){
				let isShow = polling && pollingList.includes(params.uid)?true:params.status;
				//接受流的操作-当前摄像头已经缓存了正确的流
				if( isShow ){
					//当前的流为发送流 0 音视频 1 视频 2 音频 3无，默认：0
					let tag = receiveStreamMode({uid:params,hideAudioArr, hideVideoArr});
					camera.plugin.setReceiveType(tag);
				}
				
				//轮巡的模式下，接收流在轮巡列表中，则不能关闭
				fnName = isShow ?"run":"stop";
				
				camera.plugin[fnName]((data)=>{
					camera.userId    = params.status?params.uid:'';
					camera.status    = params.status;
					camera.oldUserId = params.uid;
					resolve({...camera});
				});
				
				
			}else if(params.uid && params.status){
				//接受流的操作-设置新的接收流,只有开启流的时候调用
				setApi.registerDmsServer(getState(), params.uid).then(({rtmpUrl,httpServerUrl}) => {
                    let userObj = userList.find( user => user.uid === params.uid );
					//接受流的操作-当前摄像头已经缓存了正确的流
					let pip = camera.plugin.pip("stop").then('setStreamName', rtmpUrl);
					//当前的流为发送流 0 音视频 1 视频 2 音频 3无，默认：0
					let tag = receiveStreamMode({uid:params,hideAudioArr, hideVideoArr,isSpeaker,isPolling:customPolling});
					pip.then("setReceiveType", tag);
					pip.then("run", (data) => {
						camera.rtmpUrl = rtmpUrl;
						camera.httpServerUrl = httpServerUrl;
						camera.userId = params.uid;
						camera.oldUserId = params.uid;
						camera.status = true;
						resolve({...camera});
					}).exec();
				});
				
			}else{
				//只做关闭操作
				camera.plugin.stop(()=>{
					camera.userId = '';
					camera.status = false;
					resolve({...camera});
				});
			}
		});
	};
}


/**
 * 轮巡模式下，开启所有的视频和音频
 * 插件层的话，需要在轮巡的时候开启所有接受流的画面
 */
export const showVideoAndAudio = ()=>{
	return (dispatch, getState) => {
		//循环插件，并且开启所有的音频和视频
		dispatch({
			type: Type.SET_HIDE_AUDIO_ARR,
			playload: []
		});
		dispatch({
			type: Type.SET_HIDE_VIDEO_ARR,
			playload: []
		});
	};
};









//关闭共享
export const closeShare = (mp)=>{
	if( mp.type === "video" ){
		mp.plugin.exitShareVideo();
		mp.userId = "";
		mp.type = "";
		mp.state = false;
		mp.plugin.removeEvent('OnSetShareVideo');
		mp.plugin.removeEvent('OnShareVideoTimeChange');
		mp.plugin.removeEvent('OnShareVideoEnd');
	}else if( mp.type === "desk" ){
		mp.userId = "";
		mp.type = "";
		mp.plugin.stopShareDesk();
	}
}


//设置分享发送流
/**
 * params ：{
		userId : uid, 
		type   : "desk"|"video",
		status : true|false
	}
 */
export const setShare = (params,backFn)=>{
	return (dispatch,getState)=>{
		let {meetPluginObj:mp,meetCamera} = getState().setInfo,
			{userId,type,status} = params;
			
		if( status ){
			//启动分享
			mp.userId = userId;
			mp.type = type;
			if( type === 'video' ){
				mp.plugin.addEvent('OnSetShareVideo',(tag)=>{
					if( tag.totalTime !== '0' ){
						mp.plugin.startShareVideo(meetCamera.videoDom);
						
						dispatch({
							type     : Type.SET_SHARE_VIDEO_DURATION,
							playload : Math.round(parseInt(tag.totalTime,10)/1000),
						});
						
						dispatch(setPlayState(true));
						
						backFn();
						
						mp.plugin.addEvent('OnShareVideoTimeChange',(state)=>{
							dispatch({
								type     : Type.SET_SHARE_VIDEO_CURRENT_TIME,
								playload : Math.round(parseInt(state.currentTime,10)/1000)
							});
						});
						
						mp.plugin.addEvent('OnShareVideoEnd',(state)=>{
							dispatch({
								type     : Type.SET_SHARE_VIDEO_PLAY,
								playload : false
							});
						});
						
						
						
					}
				});
				
				
				mp.plugin.setShareVideo('CodyyVirtualCamera(9)');
			}else{
				mp.plugin.startShareDesk();
				backFn();
			}
		}else{
			//关闭分享
			closeShare(mp);
			backFn();
		}
	}
}

//非共享发出流，接受共享
export const getShare = (params)=>{
	return (dispatch,getState)=>{
		
		let {setInfo,meetInfo} = getState(),
			{userId,type,status} = params,
			{uid,meetId} = meetInfo,
			{meetPluginObj:mp,meetCamera} = setInfo,
			stream  = meetId+"_"+userId+"_"+type;
		
		//自己的情况不处理
		if( userId === uid ) return;
		
		//如果非共享发送的接收发，如果
		closeShare(mp);
		
		//如果是关闭共享则通知其它教室关闭自己的接受流
		if( !status  ){
			meetCamera.plugin.stop();
			meetCamera.videoDom.load();
			return;
		}
		
		//如果是某个教室开启了共享则其它教室设置流的接受地址
		setApi.registerDmsServer(getState(),userId,stream).then(({rtmpUrl,httpServerUrl})=>{
			meetCamera.plugin.pip('stop').then('setStreamName',rtmpUrl).then('setReceiveType',3).then('run',()=>{
				meetCamera.rtmpUrl = rtmpUrl;
				meetCamera.httpServerUrl = httpServerUrl;
				meetCamera.userId  = userId;
				meetCamera.type    = type;
				meetCamera.status  = true;
				meetCamera.videoDom.load();
			}).exec();
		});
	}
};

/**
 * 设置音箱声音大小
 * sound : 麦克风大小
 * type  : true:初始化数据，false:后期设置
 */
export const setMicrophoneSound = (sound,type) =>{
	return (dispatch,getState)=>{
		if( type ){
			dispatch({
				type: Type.SET_MICROPHONE_SOUND,
				playload: sound
			});
		}else{
			let obj = getState().setInfo.virtualCamera.find(item=>item.index===0);
			if( obj ){
				obj.plugin.setMicrophoneValue(sound,item=>{
					if( item.param.result === 0 ){
						dispatch({
							type: Type.SET_MICROPHONE_SOUND,
							playload: sound
						});
					}
				});
			}
		}
	}
};

/**
 * 设置音箱声音大小
 * volume : 音箱声音大小
 * type   : true:初始化数据，false:后期设置
 */
export const setSoundVolume = (volume,type) =>{
	return (dispatch,getState)=>{
		if( type ){
			dispatch({
				type: Type.SET_SOUND_VOLUME,
				playload: volume
			});
		}else{
			let obj = getState().setInfo.virtualCamera.find(item=>item.index===0);
			if( obj ){
				obj.plugin.setLoudspeakerValue(volume,item=>{
					if( item.param.result === 0 ){
						dispatch({
							type: Type.SET_SOUND_VOLUME,
							playload: volume
						});
					}
				});
			}
		}
	}
};

//设置共享视频，是否开关
export const setPlayState = (state)=>{
	return (dispatch,getState)=>{
		let {setInfo} = getState(),
			{meetPluginObj:mp} = setInfo;
			
		if( state ){
			mp.plugin.startShareVideo();
			dispatch({
				type     : Type.SET_SHARE_VIDEO_PLAY,
				playload : true
			});
		}else{
			mp.plugin.pauseShareVideo();
			dispatch({
				type     : Type.SET_SHARE_VIDEO_PLAY,
				playload : false
			});
		}
		
	};
};

//设置共享视频的时间
export const setPlayTime = (time)=>{
	return (dispatch,getState)=>{
		let {setInfo} = getState(),
			{meetPluginObj:mp} = setInfo;
			
		dispatch({
			type     : Type.SET_SHARE_VIDEO_CURRENT_TIME,
			playload : time
		});
		mp.plugin.shareVideoSeek(time*1000)
	};
};


//主持人通知新用户进行锁屏
export const noticeLockScreen = (logUid)=>{
	return (dispatch,getState) => {
		let {isLockScreen} = getState().setInfo;
		
		if( !isLockScreen ) return;
		
		//通知新用户锁屏
		dispatch(cocoAction.callOne(logUid,'setAction.switchLockScreen',true));
	}
}

//设置锁屏
export const switchLockScreen = (bool) =>{
	return (dispatch, getState) =>{
		let {setInfo,meetInfo} = getState();
		let	{meetPluginObj:mp} = setInfo;
		let { role,skey } = meetInfo;
		dispatch({
			type     : Type.SWITCH_LOCK_SCREEN,
			playload : bool
		});
		if (role === 'MAIN') {
			dispatch(cocoAction.callAll('setAction.switchLockScreen', bool));
		}else{
			let border = (window.outerWidth - window.innerWidth)/2;
			let parameter = {
				startX : window.screenLeft + border,
				startY : window.screenTop  + window.outerHeight - window.innerHeight-border,
				endX   : window.innerWidth + window.screenLeft + border,
				endY   : window.screenTop  + window.outerHeight -border
			};
			//调用插件接口处理-只对参会者有效
			if(bool){
				mp.plugin.lockScreen(parameter);
			}else{
				mp.plugin.unlockScreen();
			}
		}
		//开发环境下，主讲人可以看到效果，否则只有接受教室才有功能
		if(process.env.NODE_ENV === "development" && role === 'MAIN'){
			let border = (window.outerWidth - window.innerWidth)/2;
			let parameter = {
				startX : window.screenLeft + border,
				startY : window.screenTop  + window.outerHeight - window.innerHeight-border,
				endX   : window.innerWidth + window.screenLeft + border,
				endY   : window.screenTop  + window.outerHeight -border
			};
			//调用插件接口处理-只对参会者有效
			if(bool) {
				mp.plugin.lockScreen(parameter);
			}else{
				mp.plugin.unlockScreen();
			}
		}
		
		if( bool ){
			dispatch(msgAction.addMsg({
				content : "<span class='f13'>主持人已开启锁屏。</span>",
				id      : Date.now(),
				type    : "system"
			}));
		}else{
			dispatch(msgAction.addMsg({
				content : "<span class='f13'>主持人已结束锁屏。</span>",
				id      : Date.now(),
				type    : "system"
			}));
		}
		
	}
}


//优化获取最合适的摄像头
//优先级--1、userId无，oldUserId无，state：false
//        2、userId无，oldUserId有，state：false
//        3、userId有，oldUserId有，state：false
//        4、userId有，oldUserId有，state：true ---提示无法预览了
function getAbleCameras(list){
	let empty = list.filter(item=>(!item.state&&item.index!==0));
	if( empty.length === 0 ){
		return "";
	}
	//优先级一
	empty = empty.sort();
	let result = empty.find(item=>!item.userId);
	if( result ){
		return result;
	}else{
		return "";
	}
	
}
