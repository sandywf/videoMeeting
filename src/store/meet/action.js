// 
//  action.js
//  <project>
//  会议相关信息-action
//  Created by codyy on 2018-05-24.
//  Copyright 2018 codyy. All rights reserved.
// 

import * as Type        from '@/config/actionTypes';
import { meetApi } from '@/api';
import { User } from '@/api/index'
import { setCommonUrl } from '@/config/apiUrl';
import * as setAction   from '@/store/settings/action';
import {mediaDevice}    from "@/utils/codyy";
import * as userAction  from '@/store/user/action';
import * as cocoAction  from "@/store/coco/action";
import MyStorage from "@/utils/storage";
import { initPad } from '@/store/pad/action';
import {Modal}  from "@/components/modal";

/**
 * 获取会议的key
 * 并且初始化项目，获取token的值
 */
export const setMeetKey = (mkey)=>{
	return (dispatch,getState)=>{
		//判断会议是否登录
		let windowNameToken = window.name,
			mystorage = new MyStorage(mkey),
			token = "";
			
		//解析windowNameToken
		try{
			if( windowNameToken ){
				let arr = windowNameToken.split(".");
				if( arr[1] ){
					let obj = JSON.parse( window.atob(arr[1]) );
					if( obj.mkey === mkey ){
						windowNameToken = window.name;
					}else{
						windowNameToken = "";
					}
				}else{
					windowNameToken = "";
				}
			}
		}catch(err){
			windowNameToken = "";
		}
		
		if( windowNameToken ){
			//使用window.name中的值作为token；
			token = windowNameToken;
			mystorage.setItem('token',windowNameToken);
		}else{
			token = mystorage.getItem('token');
		}
		
		//非正常流程登录--提示用户从课表进入
		if( !token ){
			let m_confirm = Modal.confirm({
				content : "无法进入会议，请从视频会议列表进入！2秒后自动关闭页面。",
				footer  : false
	   		});
	   		setTimeout(()=>{
	   			m_confirm.close();
	   			window.close();
	   		},2000);
	   		dispatch({
				type: Type.HAS_NO_LOGIN,
				playload: {
					hasLogin: false
				}
			});
		}else{
			dispatch({
				type: Type.HAS_NO_LOGIN,
				playload: {
					hasLogin: true
				}
			});
		}
		//将mkey保存到store中
		dispatch({
			type     : Type.SET_MEETKEY,
			playload : mkey
		});
		
	};
}

/**
 * 缓存history（方便用于页面跳转）
 */
export const setHistory = (history) => {
	return {
		type: Type.SET_HISTORY,
		playload: { history }
	}
}


/**
 * 会议初始化
 *
 * 	|---getMeetInitData    //获取会议相关数据
 * 		|---getUserList        //获取参会者列表
 * 			|---initSetting
 * 			|		|---promise.all
 * 			|				|--- setApi.getRtmpUrl   //获取发布的dms流服务器
 * 			|				|--- getPlgunJson        //本地大json
 * 			|				|--- getVideoSetting     //后台视屏相关设置
 * 			|				|---then
 * 			|					 |---handlePluginJson  //处理大json
 * 			|							 |---setScreenList      //设置当前设备的机位数组，并绑定快捷捷切换画面功能
 * 			|							 |---bindVideoAndCrame  //根据大json，生产虚拟video，并绑定虚拟摄像头，方便启用（包括发布流，和接受流）
 * 			|---getCocoServer    //获取coco服务地址
 * 					|---setCoco  //链接coco服务器
 * 
 */
export const getMeetInit = ()=>{
	return async(dispatch, getState) => {
		let { mkey,hasLogin } = getState().meetInfo;
		if( !hasLogin ){
			return;
		}
		let	meetInfo = await meetApi.initData(mkey);
		//如果是工作台环境进入则关闭自检功能
		//授课平台进入需要进行自检
		let {roleStatus,source} = meetInfo.result;
		if( roleStatus === "WATCH" || source === "TEACH_PLATFORM" ){
			//设置自检已经完成，不需要自检页面
			dispatch(setAction.finishSelfCheck());
		}
		//授课平台因为没有自检功能，无法判断是否有双屏功能，通过自执行检测是否有双屏
		if( roleStatus !== "WATCH" && source === "TEACH_PLATFORM" ){
			dispatch(setAction.runSelfCheck(0));
		}
		return meetInfo;
	};
}

//视频会议初始化数据已经加载成功。
export const hasLoadFn = () =>{
	return {
		type     : Type.SET_INITDATA,
		playload : {
			hasLoad : true, 
		}
	}
};


/**
 * 获取视频会议初始化的参数
 */
export const getMeetInitData = ({result:meetObj}) => {
	return async( dispatch, getState ) => {
		let mid = meetObj.mainSpeakerId,
			role = meetObj.roleStatus,
			uid = meetObj.currentUserId,
			source = meetObj.source,
			{mkey} = getState().meetInfo,
			{meetingInfo:{meetData,meetingConfig,meetInfo},resourceServer} = meetObj,
			meetId = meetInfo.meetingId;

		let {guestIdentifyCode, monitorIdentifyCode} = meetInfo;

		let videoLayoutMode = meetData.framesType;
		meetObj.clsSchoolId =  meetObj.clsSchoolId || "";
		meetObj.baseAreaId  =  meetObj.baseAreaId || "";
		meetObj.skey        =  meetObj.skey || "";
		//if( meetingConfig['meet.streamingServerType'] === 'PMS' ){
		//	meetObj.PMS = meetingConfig['meet.pmsServerHost'];
		//}else{
			meetObj.DMC = meetingConfig['meet.dmsServerHost'];
		//}
		
		//有权限录制的教室，或个人，已经能否归档
		let clsClassroomId = meetObj.clsClassroomId;
		meetObj.recClassroomId = meetInfo.recClassroomId;
		meetObj.recUserId = meetInfo.recUserId;
		meetObj.fileFlag = meetInfo.fileFlag==="Y"?true:false;
		
		//会议主题
		let meetingTitle = meetInfo.meetingTitle;
		
		//获取轮巡相关的数据
		let pollingSetting = {
	    	isCustom         : meetData.isCustom,              //主持人是否固定
	    	isPollingSpeaker : meetData.isPollingSpeaker,      //发言人是否固定
	    	isPolling        : false,                          //刷新页面后不再轮巡
	    	pollingInterval  : meetData.pollingInterval || 15, //轮巡间隔时间
	    	customPolling    : meetData.customPolling || meetData.isPolling,  //主讲人是否在轮巡中，如果已经关播了轮巡，主讲人肯定在轮巡中
	   	}
		
		//测试环境中通过window.name取值
		if( process.env.NODE_ENV === 'development' && process.env.ISMOCK ){
			uid = window.name || uid;
			meetId = mkey || meetId;
		}
		
		//明确用户的权限（参会者，也可能是观摩者）
		if( role === "WATCH" ){
			role = "WATCH";
		}else if( mid === uid ){
			role = "MAIN";
		}else if( role === "GUEST" ){
			role = "JOIN";
		}

		//设置后台接口，的通用域名
		setCommonUrl(meetObj.hostConfig);
		
		mid	= mid.toString();
		uid = uid.toString();
		meetId = meetId.toString();
		
		//当前用户能否录制
		let canRecord = false;
		//判断当前用户能否录制或归档
		if( role === "MAIN" ){
			canRecord = true;
		}else if( (meetObj.recUserId && uid === meetObj.recUserId) || (meetObj.recClassroomId && clsClassroomId === meetObj.recClassroomId) ){
			canRecord = true;
		}
		
		//获取上传功能的基本处理
		let { validateCode } = meetObj;
		let { clientId,areaCode='000000',httpsServerAddress } = resourceServer;
		let baseUploadParams = "clientId="+clientId+"&validateCode="+validateCode+"&areaCode="+areaCode;
		let uploadObj = {
			serverAddress   : httpsServerAddress,									   //rs的请求地址                                        
			serverParams    : baseUploadParams,                                        //rs相关参数
			uploadFile      : httpsServerAddress + "/file/upload?"+baseUploadParams,   //上传课件
            saveFile        : httpsServerAddress + "/file/save?"+baseUploadParams,     //保存课件
            doTrans         : httpsServerAddress + "/doc/trans?"+baseUploadParams,     //开始转换
            downDoc         : httpsServerAddress + "/file/download?"+baseUploadParams, //下载文件
            uploadCapture   : httpsServerAddress + "/dmsFileUpload/uploadImage.do?areaCode="+areaCode, //提供给插件截图后图片上传的路径
		}
		
		
		//处理 请求success  
		dispatch({
			type: Type.SET_INITDATA,
			playload: {
				meetingTitle,
				clsClassroomId, 
				meetId,
				mid,
				uid, 
				role, 
				source,
				meetObj,
				guestIdentifyCode,
				monitorIdentifyCode,
				canRecord,
				uploadObj
			}
		});
		
		//更新轮巡的数据
		dispatch(setPollingSettingReducer(pollingSetting));
		
		//同时请求
		//1-获取用户列表
		//2-获取coco服务器以及token
		//3-获取视频设置配置项-（参会者才需要请求）
		//4-获取插件需要的大json-（参会者才需要请求）
		let promiseList = [
			//1-获取用户列表
			dispatch(userAction.getUserList()),
			//2-获取coco服务器以及token
			dispatch(cocoAction.getCocoServer()),
		];
		//（参会者 主讲人 来宾 才需要请求）
		if( role !== "WATCH" ){
			promiseList.push(
				//3-获取视频设置配置项-（参会者才需要请求）
				dispatch(setAction.getVideoSetting()),
				//4-获取插件需要的大json-（参会者才需要请求）
				dispatch(setAction.getPlgunJson())
			);
		}
		
		//等待请求结果
		await Promise.all(promiseList);
		
        //获取用户列表后，开始链接webscoket服务器
        dispatch(cocoAction.setCoco(()=>{
			//coco初始化命令
			let isFirstTimes = meetObj.isFirstTimes;

			// 用户第一次加入会议 发送给所有人自己的用户数据
			if(isFirstTimes && role !== 'WATCH') {
				let {userList} = getState().userInfo;
				let curentUserObj = userList.find((item)=>(item.uid === uid));
				dispatch(cocoAction.callAll('userAction.addUser', curentUserObj));
			}

        	// 设置视屏布局
			dispatch(setAction.changeVideoLayout(videoLayoutMode));
			dispatch(initPad());

			let speakerList = meetObj.meetingInfo.speakers || "";
			speakerList = speakerList.includes(mid)?speakerList:mid+","+speakerList;
			if(speakerList){
				let arr = speakerList.split(',');
				if(arr.length > 0) {
					dispatch({
						type: Type.SET_SPEAKER_LIST,
						params: arr
					})
				}
			}
        }));
       
        mediaDevice.addEvent("OnReady", function() {
        	//生成相关虚拟video,提供给页面中调用
			dispatch(setAction.initSetting());
		});

	};
}

/**  
 * 更新当前用户的发言人列表（如果是主持人则广播）
 *	 params = []
 */
export const setSpeakerList = (params) => {
	return (dispatch,getState) => {
		let { role } = getState().meetInfo;
		dispatch({
			type: Type.SET_SPEAKER_LIST,
			params: params
		});
		if( role === "MAIN" ){
			//主持人发送广播
			dispatch(cocoAction.callAll('meetAction.setSpeakerList',params));
			//支持人重现定义观摩流
			dispatch( setAction.jointVideoStream() );
		}
	};
}

/**
 * 用户未登录，跳转到登陆页面
 */
export const hasNoLogin = () => {
	return {
		type: Type.HAS_NO_LOGIN,
		playload: ''
	}
}

//开始会议
export const startRecord = () => {
	return async(dispatch,getState) => {
		let {mid,uid,meetId} = getState().meetInfo;
		//主讲人-才进行后台请求
		if( mid===uid ){
			await meetApi.startMeeting({mid:meetId});
			dispatch(cocoAction.callAll('meetAction.startRecord'));
		}else{
			//提示开始直播
			Modal.alert("直播开始啦！");
		}
		
		// 发送COCO
		dispatch({
			type: Type.START_RECORD,
			params: {status: 'PROGRESS'}
		});
	}
}

// 结速会议
export const endMeeting = () => {
	return async(dispatch,getState) => {
		let {uid,meetId,role, meetObj} = getState().meetInfo;
        let meetingType = getState().meetInfo.meetObj.meetingInfo.meetType;
		let local = meetObj.hostConfig.local
		//主讲人-才进行后台请求
		if( role === 'MAIN' ){
			await meetApi.endMeeting({});
			dispatch(cocoAction.callAll('meetAction.endMeeting'));
		}
		window.location.href = `${local}/cmeet/redirect/${meetingType}/${role}/${meetId}/604.html?skey=${meetObj.skey}&plantformType=""&userId=${uid}`;
	}
}

// 退出会议
export const logoutMeeting = () => {
	return async(dispatch,getState) => {
		let {uid,meetId,role, meetObj, mid} = getState().meetInfo;
        let meetingType = getState().meetInfo.meetObj.meetingInfo.meetType;
        let local = meetObj.hostConfig.local
        let {coco} = getState().cocoInfo.coco;
		await meetApi.logoutMeeting({});
        dispatch(cocoAction.callAll('userAction.logout', uid));
        coco.ws.onclose("close")
        window.location.href = `${local}/cmeet/redirect/${meetingType}/${role}/${meetId}/604.html?skey=${meetObj.skey}&plantformType=""&userId=${uid}`;
	}
}


//设置主显示区是否全屏
export const toggleMainFull = type => {
	return (dispatch) => {
	    // 触发全屏
        dispatch({
            type     : Type.SET_MAIN_FULL,
            playload : type,
        });
        let time = 300;
        let timeClear = setInterval(()=>{
        	time -= 30;
        	dispatch({
                type : Type.UPDATE_RESIZE_TIME,
           	});
           	if( time <= 0 ){
           		clearInterval(timeClear);
           	}
        },time>30?30:time);
	}
};


//设置是否显示header
export const toggleHeader = (type)=>{
    return (dispatch) => {
        dispatch({
            type     : Type.TOGGLE_HEADER_HEADER,
            playload : type,
        })
        let time = 300;
        let timeClear = setInterval(()=>{
        	time -= 30;
        	dispatch({
                type : Type.UPDATE_RESIZE_TIME,
           	});
           	if( time <= 0 ){
           		clearInterval(timeClear);
           	}
        },time>30?30:time);
    }
};


//如果发送给主讲人的事件主讲人没有去点击，则需要一分钟的等待时间
let hasRequire = false,
	requireTime = "";
function setRequireTime(){
	hasRequire = true;
	if( requireTime ){
		clearTimeout(requireTime);
	}
	requireTime = setTimeout(()=>{
		hasRequire = false;
	},60000);
}

// 切换大小窗口   白板和视屏
export const switchMode  = (realMode)=>{
	return (dispatch,getState) => {
		let {role} = getState().meetInfo;
		if(role === 'MAIN') {
			dispatch(cocoAction.callAll('meetAction.switchMode', realMode))
		}

		dispatch({
			type     : Type.SWITCH_MODE,
			playload : realMode
		});

        setTimeout(()=>{
            dispatch({
                type : Type.UPDATE_RESIZE_TIME,
            })
        },300)
	}; 
}


/**
 * 开启或关闭，共享（视频，桌面）
 * params ：{
		userId : uid, 
		type   : "desk"|"video",
		status : true|false
	}
 */
export const setShare = ( params )=>{
	return (dispatch,getState) => {
		let {role,mid,shareDesk,shareVideo} = getState().meetInfo,
			{type,status} = params;
		
		if( status ){
			
			//如果当前正在共享中，则禁止请求共享
			if( shareVideo || shareDesk ){
				Modal.alert('当前正在共享'+(shareVideo?'视频':'桌面')+'，不能执行此操作！');
				return;
			}
			
			//发送给主讲教室-防止用户频繁请求
			if( hasRequire ){
				Modal.alert('请求过于频繁，请等待主讲人处理！');
				return;
			}
			
			//主讲教室开启共享视频，无需弹框，直接处理
			if( role === "MAIN" && type === "video" ){
				dispatch(switchShare(params));
				return;
			}
			
			//开启共享
			let	content = type==='video'?'确认共享视频吗？':'确认共享桌面吗？',
				m_confirm = Modal.confirm({
					content,
					onSure : ()=>{
						if( role === 'MAIN' ){
							dispatch(switchShare(params));
						}else{
							setRequireTime();
							dispatch(cocoAction.callOne(mid,'meetAction.requireSetShare',params,(state)=>{
								hasRequire = false;
								state && dispatch(switchShare(params));
							}));
						}
						m_confirm.close();
					}
		   	});
		}else{
			//关闭共享
			dispatch(switchShare(params));
		}
	}
};

//请求设置共享视频
/*coco触发
 * 		userId    ：设置的uid
 * 		type      : 共享内容
 * 		backFn    ： 回调事件
 */
export const requireSetShare = ({userId,type},backFn)=>{
	return (dispatch,getState) => {
		let {userList} = getState().userInfo,
			{nameTag} = userList.find(item=>item.uid===userId) || {},
			content = nameTag+(type === 'video'?'申请共享视频，是否同意？':'申请共享桌面，是否同意？'),
			m_confirm = Modal.confirm({
				content,
				onCancel : ()=>{
					if( backFn && typeof backFn === "function" ){
						backFn(false);
					}
				},
				onSure   : ()=>{
					if( backFn && typeof backFn === "function" ){
						backFn(true);
					}
					m_confirm.close();
				}
			});
	}
};

//最终处理分享(桌面还是视频)
export const switchShare = (params)=>{
	return (dispatch,getState) => {
		//启用或关闭当前用户分享插件的回调事件
		dispatch(setAction.setShare( params,()=>{
			//打开新的分享
			dispatch(setShareVal(params));
		}));
	};
}

//设置共享的值
export const setShareVal = (params)=>{
	return (dispatch,getState) => {
		let {uid,role} = getState().meetInfo,
			{userId,type,status} = params;
			
		if( (!userId && role === "MAIN") || userId === uid ){
			//关播设置共享的值
			dispatch(cocoAction.callAll('meetAction.setShareVal',params));
		}else{
			//通知非发送源，接受流信息
			dispatch(setAction.getShare(params));
		}
		
		if( type === 'video' ){
			dispatch({
				type     : Type.SET_SHARE_VIDEO,
				playload : status?userId:false,
			});
		}else{
			dispatch({
				type     : Type.SET_SHARE_DESK,
				playload : status?userId:false,
			});
		}
	}
};

/**
 * 更新轮巡的相关数据
 */
export const setPollingSettingReducer = (params)=>{
	return (dispatch,getState) => {
		let { role } = getState().meetInfo;
		dispatch({
			type     : Type.SET_POLLING_SETTING,
			playload : params
		});
		//如果是主持人的话，设置观摩流拼接
		if( role === "MAIN" ){
			dispatch( setAction.jointVideoStream() );
		}
	}
};

/**
 * 设置轮巡配置的值
 * 轮巡中-如果主讲教室刷新，也会关闭轮巡
 */
export const setPollingSetting = (params)=>{
	return async (dispatch,getState) => {
		let {role} = getState().meetInfo,
			{videoLayoutNum} = getState().setInfo;
			
		//修改配置项
		dispatch(setPollingSettingReducer(params));
			
		if( role === "MAIN" ){
			//保存数据到后台
			meetApi.setPollingSetting({
				isCustom         : params.isCustom?"Y":"N",
				isPollingSpeaker : params.isPollingSpeaker?"Y":"N",
				pollingInterval  : params.pollingInterval,
			});
			
			//如果是非4分屏或者六分屏的情况下，设置为四分屏
			if( videoLayoutNum < 4 ){
				await dispatch(setAction.changeVideoLayout("four",true));
			}
			
			//启动预览轮巡
			dispatch(toggleCustomPolling(true));
			
			//关播给全部教室
			dispatch(cocoAction.callAll('meetAction.setPollingSetting',params));
		}
	};
};

//设置是否预览轮巡
export const toggleCustomPolling = (state)=>{
	return async (dispatch,getState) => {
		let {role,pollingSetting:{isPolling}} = getState().meetInfo;
		
		//修改是否全局轮巡
		dispatch(setPollingSettingReducer({customPolling:state}));
		
		if( role === "MAIN" ){
			//如果用计时状态则，不管开始还是接受预览轮巡都关闭
			pollingSetTimeout && clearTimeout(pollingSetTimeout);
			
			//当前是否是广播状态
			if(!state && isPolling){
				await dispatch(toggleBoardPolling(false));
			}
			
			//其它上课教室-都开启或关闭非发言人的流
			dispatch(cocoAction.callAll('meetAction.toggleCustomPolling',state));
			
			if( state ){
				//开始启动轮巡，并设置倒计时
				dispatch(handlePollingData(1));
			}else{
				//关闭本地轮巡
				dispatch(setAction.stopLocalPolling());
			}
		}else{
			//通知-其它人修改输出流策略
			dispatch(setAction.toggleNoSpeakerStream(state));
		}
		
	};
}

//设置是否广播轮巡
export const toggleBoardPolling = (state)=>{
	return async (dispatch,getState) => {
		let {role,pollingSetting:{currentPage}} = getState().meetInfo;
		
		//修改是否全局轮巡
		dispatch(setPollingSettingReducer({isPolling:state}));
		
		if( role === "MAIN" ){
			//关播给全部教室
			dispatch(cocoAction.callAll('meetAction.toggleBoardPolling',state));
			//开启轮巡，并设置倒计时
			state && dispatch(handlePollingData(currentPage,true));
		}else if(!state){
			dispatch(setAction.stopLocalPolling());
		}
	};
}

/**
 * 主讲人-生成轮巡的数据
 * 生成轮巡的列表，并广播给
 * tag:第几轮
 * type: false: 触发以后，重新计时间隔时间；true：继续计算间隔时间
 */
let pollingSetTimeout = "",
	prevHandleTime = 0;
export const handlePollingData = (tag,type)=>{
	return (dispatch,getState) => {
		let { meetInfo,userInfo,setInfo } = getState(),
			{ userList } = userInfo,
			{ speakerList,pollingSetting,mid } = meetInfo,
			{ videoLayoutNum } = setInfo,
			{ isCustom ,isPollingSpeaker,pollingInterval,customPolling } = pollingSetting,
			speakerListArr = speakerList.filter(item=> !!item && item !== mid ),
			//可用的非发言人的参会者
			pollingNoSpeakerList = userList.filter(item=>{
				//不是发言人，是参会者或者来宾，用pc登录的用户
				return item.isLogin && !item.isSpeaker && (item.userType === "JOIN" || item.userType === "GUEST") && item.deviceName === 'PC';
			}).map(item=>item.uid),
			params = {
				currentPage  : tag,   //当前第几轮
				totalPage    : 1,   //总共几轮
				pollingList  : []   //当前轮对应的user列表
			};
			
			
		if( !customPolling ) return;
		
		//判断固定模式
		if( isCustom && isPollingSpeaker ){
			//发言人和主讲人都固定模式
			let space = videoLayoutNum - speakerListArr.length-1;
			let list = [...pollingNoSpeakerList];
			let totalPage = Math.ceil(list.length/space);
			tag = tag > totalPage?1:tag;
			let pushArr = list.splice((tag-1)*space,space);
			let pollingList = speakerList.map(item=>{
				if( !item ){
					item = pushArr.shift();
				}
				return item;
			});
			params = {
				totalPage,
				currentPage : tag,
				pollingList : [...pollingList,...pushArr]
			}
			
		}else if( isCustom && !isPollingSpeaker ){
			//发言人和主讲人都固定模式
			let space = videoLayoutNum - 1;
			let list  = [...speakerListArr,...pollingNoSpeakerList];
			let totalPage = Math.ceil(list.length/space);
			tag = tag > totalPage?1:tag;
			let pushArr = list.splice((tag-1)*space,space);
			params = {
				totalPage,
				currentPage : tag,
				pollingList : [mid,...pushArr]
			}
			
		}else{
			//都不固定的时候
			let space = videoLayoutNum;
			let list  = [mid,...speakerListArr,...pollingNoSpeakerList];
			let totalPage = Math.ceil(list.length/space);
			tag = tag > totalPage?1:tag;
			let pushArr = list.splice((tag-1)*space,space);
			params = {
				totalPage,
				currentPage : tag,
				pollingList : [...pushArr]
			}
		}
		
		dispatch(setPollingData(params));
		
		//在一定时间后，轮巡下一步
		if( pollingSetTimeout ){
			clearTimeout(pollingSetTimeout);
		}
		
		//继续使用间隔时间
		let spaceTime = pollingInterval*1000;
		if( type ){
			let useTime = Date.now()-prevHandleTime;
			spaceTime = spaceTime<useTime?spaceTime:(spaceTime-useTime);
		}
		//设置上一次计算的时间
		prevHandleTime = Date.now();
		
		pollingSetTimeout = setTimeout(()=>{
			dispatch(handlePollingData(tag+1));
		},spaceTime);
		
		
	};
}

/**
 * 主讲人-设置轮巡的数据
 * 并广播数据到其它接收教室
 * 并且调用插件，进行轮巡操作
 * params : { 	
 *	totalPage,   //总页数
 *	currentPage, //当前页
 *	pollingList, //当前页面轮巡的userid
 * }
 * 
 */
export const setPollingData = (params)=>{
	return (dispatch,getState) => {
		let {role,pollingSetting:{customPolling,isPolling}} = getState().meetInfo;
		if( role === "MAIN" ){
			dispatch( cocoAction.callAll("meetAction.setPollingData",params) );
		}
		
		if( (role === "MAIN" && customPolling) || (isPolling && customPolling) ){
			//配置接受轮巡的虚拟摄像头控制
			dispatch(setAction.runLocalPolling());
		}
		
		dispatch(setPollingSettingReducer({...params}));
		
	}
}


/**
 * 当前支持人正在轮巡中，如果突然有其它人加入到会议中，
 * 则主持人，对轮巡进行更新处理
 * loadUid: 为新登录的用户
 */
export const noticePolling = (loadUid)=>{
	return (dispatch,getState) => {
		let {role,pollingSetting} = getState().meetInfo,
		{currentPage} = pollingSetting;
		
		if( role === "MAIN" ){
			//声明设置轮巡的数据
			dispatch(cocoAction.callOne(loadUid,'meetAction.getNoticePolling',pollingSetting,()=>{
				//回调后-重新生成轮巡数据
				dispatch(handlePollingData(currentPage,true));
			}));
		}
	}
}

/**
 * 接收主持人发送的轮巡通知
 */
export const getNoticePolling = (params,back)=>{
	return (dispatch,getState) => {
		let {customPolling} = params;
		//跟新状态
		dispatch(setPollingSettingReducer(params));
		if( customPolling ){
			//主持人进行轮巡-则新用户设置插件
			dispatch(setAction.toggleNoSpeakerStream(true));
			if( back && typeof back === "function" ){
				back();
			}
		}
	}
}

// 禁止和取消 所有人聊天功能 false 禁言   true 可以聊天
// forbid   obj
export const switchAllChatting = (forbid)=>{
	return (dispatch, getState) =>{
		let userList = getState().userInfo.userList.concat();
		let uids = [];
		let bool = forbid.forbid
		let {role} = getState().meetInfo; 
		userList.forEach((user)=>{
			if (user.userType !== 'MAIN') {
				uids.push(user.uid)
				dispatch({
					type     : Type.TOGGLE_CHAT,
					playload : {
						uid: user.uid,
						value: bool
					}
				});
			}
		})

		//是否要发送coco通信
    	if( role === 'MAIN' ){
    		//通知全部修改状态
    		dispatch(cocoAction.callAll('meetAction.switchAllChatting',forbid));
    		//通知后台切换音频开关
    		User.toggleChat({
    			type  : bool ? 'Y' : 'N',
    			uid   : uids
    		});
		}

		dispatch({
			type : Type.SWITCH_ALL_USER_CHATTING,
			data : bool 
		})
	}
};


/**
 *  更新用户信息  用户列表  会议title
 */
export const updateMeetInfo = ()=>{
	return  async (dispatch,getState) => {
		let {meetingTitle} = getState().meetInfo.meetingTitle;
		let info = await meetApi.updataMeetInfo();
		if(meetingTitle !== info.result.meetingTitle) {
			dispatch({
				type: Type.UPDATE_MEET_TITLE,
				data: info.result.meetingTitle,
			})
		}

		dispatch(userAction.getUserList())
	}
}

