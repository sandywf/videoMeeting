
/**
 *  基础设置  音量 | 麦克风
 */
import * as Type from '@/config/actionTypes';
import store from '@/store/store';
import MyStorage from '@/utils/storage';

let mystorage = "";


//大画面: 1、教室跟踪；2：教室全景，3：板书 4：学生跟踪 5：学生全景 6：vga
const tmp = {
	'0'   : '电影模式',
	'1'   : '教师跟踪',
	'2'   : 'VGA',
	'3'   : '学生跟踪',
	'4'   : '板书',
	'5'   : '教师全景',
	'6'   : '学生全景',
};

//视频布局对应的画面数量
const videoLayoutModeToVideoNum = {
	'one':1, 
	'two':2, 
	'threeLeftRight':3,
	'threeTopBottom':3,
	'four':4,
	'sixLeft':6,
	'sixRight':6,
	'eight':8,
	'nine':9
};

let defaultState = {
    videoLayoutMode: 'four',
    videoLayoutNum : 4,
	screenList   : [],                   //获取摄像头列表
	
	//最终使用的值
    resolution   : "",                   //分辨率
    definition   : "",                   //清晰度-码率
    bigScreen    : "",                   //大画面
    mode         : 1,             	     //导播模式  2手动 ；1自动 ； 3半自动
    smallScreen  : [],            	     //小画面集合
    
    /**
     * 可以给同一场会议设置两套视频设置（分为工作台进入，以及授课平台进入）；
     */
    //授课平台的值-默认的值-用于缓存到服务器上
    classroomSetting : {
    	resolution   : "",               //授课平台进入-分辨率
    	definition   : "",               //授课平台进入-清晰度-码率
    	bigScreen    : "",               //授课平台进入-大画面
    	mode         : 1,             	 //导播模式  2手动 ；1自动 ； 3半自动
    	smallScreen  : [],            	 //小画面集合
    },
    //工作台数据-默认的值-用于缓存到服务器上
    workspaceSetting : {
    	resolution   : "1280*720",       //工作台进入-分辨率
    	definition   : 1.5*1024,         //工作台进入-清晰度-码率
    	bigScreen    : 1,                //工作台进入-大画面
    	mode         : 2,             	 //导播模式默认手动
    	smallScreen  : [],            	 //小画面集合默认是空
    },
    preset       : 1,             //预置位
    pluginJson   : {},            //插件需要的大json
    openShareMem : false,         //是否开启了虚拟内存---开启：接收流才能双屏
    rtmpUrl      : '',            //发流使用的rtmpurl
    virtualCamera: [],            //虚拟摄像头列表
    meetCamera   : '',            //视频会议的虚拟摄像头，用于共享视频，桌面等功能
    receiveCamera: "",            //观摩接收放大的虚拟摄像头（只对观摩有效）
    meetPluginObj: '',            //视频会议插件，用于共享视频，桌面等功能
    previewPlugin: "",            //预览插件 
    hideVideoArr : [],            //当前电脑，隐藏其它人的视频集合
    hideAudioArr : [],            //当前电脑，隐藏其他人的音频集合
	doubleScreen : '',            //设置双屏的userId
	microphoneSound: 0,           //麦克风音量 0 --100
	soundVolume  : 0,			  //音响音量	0 -- 100
	recordStatus : 'stop',        //是否正在录制中   run,pause,stop
	recordTime   : 0,             //当前的录制时间
	
	//共享视频相关
	shareVideoCurrentTime : 0,    //共享视频，当前播放长度
	shareVideoDuration    : 0,    //共享视频的总长度
	shareVideoPlay        : false,//共享视频是否播放 

	isLockScreen: false,   		  // 是否锁屏状态
	
	//自检相关
	hasCheck: false,              //是否已经自检过
	//自检的值
	selfCheck: {             
		camera   : 'checking',
		speaker  : 'checking',
		audio    : 'checking',
		browser  : 'checking',
		tool     : 'checking',
		checkExtensionScreen: 'checking',  //扩展屏
	},
	
	//获取数组中一些值的快捷方式
	getPublishPlugin : (id)=>{
		let {virtualCamera} = store.getState().setInfo;
		return virtualCamera.find(item=>item.userId===id);
	}
}

//开发环境中，关闭自检功能
if( process.env.NODE_ENV === 'development'){
	defaultState.hasCheck = false;
}

export default function(state = defaultState, action){
    switch (action.type) {
    	//初始化本地的值
    	case Type.INIT_STORAGE : 
    		mystorage = new MyStorage(action.playload);
    	return {
    		...state,
    		recordTime : mystorage.getItem('recordTime') || 0
    	};
    	
		//视频布局样式
        case Type.CHANGE_VIDEO_LAYOUT:
        return {
        	...state, 
        	videoLayoutMode : action.params,
        	videoLayoutNum : videoLayoutModeToVideoNum[action.params]
        }

		//视频相关设置
		case Type.SET_VIDEO_SETTING : 
			return { ...state,...action.playload};
			
		//设置页面json
		case Type.SET_PLUGIN_JSON : 
			return { ...state,...action.playload};
			
		//设置rtmpurl
		case Type.SET_RTMP_URL:
			return { 
				...state,
				rtmpUrl : action.playload
			};
		
		//设置设备列表
		case Type.SET_SCREEN_LIST:
			let screenList = getScreenList(action.playload);
			return {...state,screenList}
			
		//设置虚拟摄像头
		case Type.SET_VIRTUAL_CAMERA : 
			return { 
				...state,
				virtualCamera : [...action.playload]
			};
		
		//设置meet使用的plugin对象
		case Type.SET_MEET_PLUGIN : 
			return { 
				...state,
				meetPluginObj : action.playload
			};
		
		//设置meet使用的虚拟摄像头
		case Type.SET_MEET_CAMERA : 
			return { 
				...state,
				meetCamera : action.playload
			};
		
		//设置是否已经开启了共享内存
		case Type.SET_SHARE_MEM : 
			return {
				...state,
				openShareMem : action.playload
			}
		
		//设置隐藏的视频集合
		case Type.SET_HIDE_VIDEO_ARR :
			return {
				...state,
				hideVideoArr : [...action.playload]
			};
		
		//设置隐藏的音频集合
		case Type.SET_HIDE_AUDIO_ARR :
			return {
				...state,
				hideAudioArr : [...action.playload]
			};
		
		//设置双屏
		case Type.SET_DOBULE_SCREEN :
			return {
				...state,
				doubleScreen : action.playload
			};
		
		//设置麦克风声音
		case Type.SET_MICROPHONE_SOUND :
		return {
			...state,
			microphoneSound : action.playload
		};
		
		//设置设置音响声音
		case Type.SET_SOUND_VOLUME :
			return {
				...state,
				soundVolume : action.playload
			};
		
		//开始、关闭录制
		case Type.SET_RECORD_STATUS:
			return {
				...state,
				recordStatus : action.playload
			};
		
		//设置录制时间
		case Type.SET_RECORD_TIME :
			mystorage.setItem('recordTime',action.playload);
			return {
				...state,
				recordTime   : action.playload
			};
		
		//设置共享视频的总长度
		case Type.SET_SHARE_VIDEO_DURATION :
			return {
				...state,
				shareVideoDuration   : action.playload
			};
		
		//设置共享视频当前时间
		case Type.SET_SHARE_VIDEO_CURRENT_TIME :
			return {
				...state,
				shareVideoCurrentTime : action.playload
			};
		
		//共享视频是否在播放中	
		case Type.SET_SHARE_VIDEO_PLAY :
			return {
				...state,
				shareVideoPlay : action.playload
			};
		
		case Type.SWITCH_LOCK_SCREEN :
			return {
				...state,
				isLockScreen : action.playload
			};
		
		//共享视频设置	
		case Type.SET_SHARE_VIDEO_SETTING :
			return {
				...state,
				...action.playload
			};
			
		//修改自检状态
		case Type.SET_CHECK_STATUS:
			let selfCheck = { ...state.selfCheck, ...action.playload };
			return { ...state, selfCheck };
		
		//结束自检
		case Type.END_SELF_CHECK: 
			return { ...state, ...action.playload };
			
		//设置预览插件
		case Type.SET_PREVIEW_PLUGIN: 
			return { 
				...state, 
				previewPlugin : action.playload
			};
		
		//设置观摩的虚拟摄像头
		case Type.SET_WATCH_CAMERA : 
			return { 
				...state, 
				watchCamera : action.playload
			};
			
        default:  return state;
    }
}

//生成设备列表集合
function getScreenList(list){
	return list.map(obj=>{
		if( typeof obj === "object" ){
			return obj;
		}else{
			return {
				id   : obj,
				name : tmp[obj]
			}
		}
	});
};


