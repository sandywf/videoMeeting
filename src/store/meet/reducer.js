
/**
 * 会议相关初始化
 * 和视频会议相关的设置项，相当于对所有参会者，有关的配置想项
 */
import * as Type from '@/config/actionTypes';

let defaultState = {
	history: {},             //路由history
	mkey   : '',             //会议的key
	meetId : '',             //当前会议的id
	source : 'WORK_PLATFORM',//进入会议的来源 （TEACH_PLATFORM：授课平台，WORK_PLATFORM：工作台）
	clsClassroomId : '',     //当前教室的id
	meetingTitle : "",       //会议主题
	mid    : '',             //主讲人的id
	uid    : '',             //登陆与会者的id
	role   : 'MAIN',         //当前用户的角色   // 角色 MAIN  JOIN  GUEST  WATCH
	speakerList: [],         //当前发言人列表
	hasLoad: false,          //数据是否已加载完成
	
	//会议的相关数据值
	meetObj: {                //会议的详情
		status: "INIT",	        //会议状态  "INIT","PROGRESS","END" 
		DMC : '',               //根据pms获取dms 
		PMS : "",               //pms
		baseAreaId: '',         //当前的区域码
		skey : '',              //教室的key，有可能没有
		recClassroomId : "",    //可以录制的教室（一个教室最多只有一个发言人）
		recUserId      : '',    //可以录制的人（同上面之间互斥，只有一个有值）
		fileFlag       : false, //上面两个值对应的人，能否归档
		isFirstTimes   : false, //是否是第一次进入会议
		bigJsonUrl     : "",    //有教室时候，取大JSON的地址
		hostConfig     : {},
	},
	
	hasLogin: false,         //是否已经登陆
	
	//页面相关
    hideRight    : false,         //主显示区最大化-同是否隐藏右侧内容
    hideHeader   : false,         //是否隐藏顶部菜单
    resizeTime   : "",            //页面布局变动触发resize更新时间状态，（用于一些需要计算宽高的组件）
    							  //（触发条件：window.onresize,hideRight,hideHeader,mode）;
    
    shareDesk    : false,         //共享桌面的uid
    shareVideo   : false,         //共享视频的uid
    mode: 'pad',  // video|pad   小窗口部分展示的是视屏还是  白板   
    canRecord   : false,          //当前机位能否录制
    
    //轮巡状态
    pollingSetting : {
    	isCustom         : true,        //主持人是否固定
    	isPollingSpeaker : false,       //发言人是否固定
    	isPolling        : false,       //是否开始轮巡
    	pollingInterval  : 15,          //轮巡间隔时间
    	customPolling    : false,       //主持人是否已经开始轮巡了
    	totalPage        : 1,           //总页数
 		currentPage      : 1,           //当前页
 	    pollingList 	 : [],          //当前页面轮巡的userid
	},
	guestIdentifyCode: '',              // 邀请链接的密码 来宾
	monitorIdentifyCode: '',			 // 邀请链接的密码 观摩

	canChatting: true,   // 是否可以聊天
	
	//上传相关
	uploadObj  : {
		serverAddress   : "",      //请求地址
		serverParams    : "",      //请求参数
		uploadFile      : "",      //上传课件
		uploadCapture   : "",      //提供给会议插件的截图上传地址
        saveFile        : "",      //保存课件
        doTrans         : "",      //开始转换
	}
}

//设置教室信息
export default function (state = defaultState, action) {
	switch (action.type) {
		//设置会议id
		case Type.SET_MEETKEY: 
		return { ...state, mkey:action.playload};

		//设置路由history
		case Type.SET_HISTORY: return { ...state, ...action.playload };

		//设置meetInfo
		case Type.SET_INITDATA:
			//  把会议状态层级提升
			if ( 'meetObj' in action.playload ){
				action.playload.meetObj.status = action.playload.meetObj.meetingInfo.meetInfo.status
			}

			
			return { ...state, ...action.playload };

		case Type.START_RECORD:
			let meetObj = { ...state.meetObj, ...action.params }
			return { ...state, meetObj };

		//未登录，登陆超时
		case Type.HAS_NO_LOGIN: return { ...state, ...action.playload };

		case Type.SET_SPEAKER_LIST:  // 更新发言人列表  直接替换原来列表  数组
			return { ...state, ...{ speakerList: action.params } };
			
		//设置主显示区，是否全屏
		case Type.SET_MAIN_FULL :
			return {
				...state,
				hideRight  : action.playload,
				hideHeader : action.playload,
			};
			
		//设置隐藏顶部	
		case Type.TOGGLE_HEADER_HEADER :
			return {
				...state,
				hideHeader : action.playload,
			};
			
		//修改共享桌面
		case Type.SET_SHARE_DESK:
			return {
				...state,
				shareDesk  : action.playload,
				shareVideo : false
			};
		
		//修改共享视频
		case Type.SET_SHARE_VIDEO:
			return {
				...state,
				shareVideo : action.playload,
				shareDesk : false
			};
		//修改共享视频
		case Type.SWITCH_MODE:
			return {
				...state,
				mode: action.playload 
			};
			
		//修改轮巡的配置值
		case Type.SET_POLLING_SETTING : 
			return {
				...state,
				pollingSetting : {...state.pollingSetting,...action.playload}
			}
		
			// 禁止所有人聊天(除了主讲人) 
		case Type.SWITCH_ALL_USER_CHATTING : 
            return {
                ...state,
                canChatting : action.data
            }
			
		//页面大小改变的时候，触发时间更新
		case Type.UPDATE_RESIZE_TIME : 
			return {
				...state,
				resizeTime : Date.now()
			}
			//页面大小改变的时候，触发时间更新
		case Type.UPDATE_MEET_TITLE : 
		return {
			...state,
			meetingTitle : action.data
		}

			
			
		default:
			return state;
	}
}
