// 
//  action.js
//  <project>
//  coco通信-action
//  Created by codyy on 2018-05-24.
//  Copyright 2018 codyy. All rights reserved.
// 

import * as Type          from '@/config/actionTypes';
import CocoClass          from '@/utils/coco';
import {meetApi}          from '@/api';
import * as meetAction    from '@/store/meet/action';
import * as popupAction   from '@/store/popup/action';
import * as setAction     from '@/store/settings/action';
import * as userAction    from '@/store/user/action';
import * as msgAction    from '@/store/message/action';

//一个变量指向Function，防止有些前端编译工具报错
import * as shareAction   from '@/store/share/action';
import * as padAction     from '@/store/pad/action';

// coco和移动端通信
import { handleMsgToMobile } from './mobileAction';

//一个变量指向Function，防止有些前端编译工具报错
let actions = {meetAction,popupAction,setAction,userAction,shareAction,padAction, msgAction};
function evil(fn) {
    var Fn = Function;
    let fun = new Fn('return this.'+ fn);
    fun = fun.bind(actions);
    return fun();
}

//设置coco的时候绑定的事件-用于初始化的时候绑定事件，等用户登录coco并且加入了组以后，进行回调触发
let setCocoFn  = "";


/**
 * 获取视频会议coco的服务器地址
 */
export const getCocoServer = ()=>{
	return (dispatch, getState) => {
		let {meetId,uid,meetObj:{clsSchoolId,baseAreaId}} = getState().meetInfo;
		
		return meetApi.getCocoServer({
			baseAreaId   : baseAreaId,
			clsSchoolId  : clsSchoolId,
			baseUserId   : uid,
			groupId      : parseInt(meetId.substring(0, 6), 16).toString(),
            userRealName : uid
		}).then((data) => {
			let {sslServerHost,sslPort,serverHost,port,token} = data.result,
				location = window.location,
				url = "https:" === location.protocol ? ("wss://" + sslServerHost + ":" + sslPort + "/wss") : ("ws://" + serverHost + ":" + port + "/ws");
			
			dispatch({
				type : Type.SET_COCO_PARAMS,
				playload : {url,token}
			});
		})
    }
}

//获取coco设置
export const setCoco = (fn) => {
	return (dispatch, getState) => {
		let {meetInfo,cocoInfo} = getState(),
			{meetId,uid} = meetInfo,
			{url,token} = cocoInfo;
	
		let	coco = new CocoClass(url,{
				userId   : uid,
                groupId  : parseInt(meetId.substring(0, 6), 16).toString(),
				userToken: token,
                clientType: 'web'
				
			});
				
		dispatch({
        	type     : Type.SET_COCO,
        	playload : coco
   		});
   		
   		setCocoFn = fn;
	};
}

/**
 * 监听链接上coco
 */
export const onLoginUp = () => {
    return  {
        type     : Type.COCO_ON_LOGIN_UP,
        playload : ''
    }
}

/**
 * 监听当前用户，添加到组
 */
export const onJoinGroup = (state)=>{
	//触发coco初始化事件
	if( setCocoFn && typeof setCocoFn === 'function' ){
		setCocoFn();
	}
	return  {
        type     : Type.COCO_ON_JOIN_GROUP,
        playload : state
    }
}

/**
 * 监听组里面,    某个用户登录还是退出（ 过程管理）
 * state: true || false  登陆 | 登出
 */
export const onLoginNotify = (data) => {
    if (data.state) {
        return (dispatch, getState) => {
			let {role} = getState().meetInfo;
			if(role !== 'WATCH') {
				dispatch(userAction.login(data));
				dispatch(handleLogin(data.uid));
			} else {
                dispatch(userAction.login(data));
            }
        }
    } else{
        return (dispatch, getState) => {
			let {role} = getState().meetInfo;
			if(role !== 'WATCH') {
				dispatch(userAction.logout(data.uid,data.deviceName));
				dispatch(handleLogout(data.uid));
			} else {
                dispatch(userAction.logout(data.uid,data.deviceName));
            }
        }
    }
}

//用户登录的时候需要做的一些特殊事件
/**
 * 模式一：轮询模式下
 * 		有非主持人登录的时候，主讲人将轮询状态通知给该用户；
 * 
 * 模式而：锁屏模式下
 * 		有非主持人，非观摩用户登录时候，主持人将锁屏状态通知给该用户；
 */
function handleLogin(loginUid){
	return (dispatch,getState)=>{
		let {role,mid,uid,pollingSetting:{customPolling} } = getState().meetInfo;
		let { isLockScreen } = getState().setInfo;
		
		if( role === "MAIN" && loginUid !== mid ){
			//模式一：如果在轮巡状态，主持人发送相关数据给，新用户
			if( customPolling ){
				dispatch( meetAction.noticePolling(loginUid) );
			}
			//模式二：如果在锁屏状态，主持人发送相关数据，给登录用户
			if( isLockScreen ){
				dispatch( setAction.noticeLockScreen(loginUid) );
			}
		}
	}
}


//用户登出的时候需要做的一些特殊事件
/**
 * 模式一：轮询模式下
 * 		如果是主持人登出的话，如果当前用户正处于轮询中，则取消轮询
 * 
 * 模式而：锁屏模式下
 * 		如果是主持人登出的话，如果当前用户正处于锁屏状态下，则取消锁屏
 */
function handleLogout(logoUid){
	return (dispatch,getState)=>{
		let {role,mid,pollingSetting:{customPolling,isPolling}} = getState().meetInfo;
		let { isLockScreen } = getState().setInfo;
		//判断登出的是否是主讲人
	    if( mid === logoUid && role !== 'MAIN' ){
	    	//模式一：如果是轮巡中-（主持人刷新页面，关闭接收教室的轮巡状态）
	    	if( customPolling ){
	    		//取消广播
	    		dispatch( meetAction.toggleBoardPolling(false) );
	    		//取消轮巡
	    		dispatch( meetAction.toggleCustomPolling(false) );
	    		//关闭轮播画面
	    		if( isPolling ){
	    			dispatch( setAction.stopLocalPolling() );
	    		}
	    	}
	    	
	    	//模式二：如果在锁屏状态中-（主持人刷新页面，或者）
	    	if( isLockScreen ){
	    		dispatch( setAction.switchLockScreen(false) );
	    	}
	    }
	}
}

//获取用户列表  获取一次COCO在线的用户列表 （初始化执行一次）
export const onLoadUser=(userList)=>{
	return  (dispatch) =>{
       dispatch(userAction.updateLoginStatus(userList))
    }
}

/**
 * 监听用户被踢出
 */
export const onKick = (memberId)=>{
	return (dispatch) => {
		dispatch(userAction.kickOut(memberId));
	}
}

/**
 * 监听用户重复登录被踢出
 */
export const onOffline=()=>{
	return  {
        type     : Type.COCO_ON_OFFLINE,
        playload : ''
    }
}

/**
 * 点对点通信
 */
export const onRecePrivateMsg=({userId,type,content,fn})=>{
	return  (dispatch)=>{
		try{
			//如果是params.type是action方法，则调用方法名
            let allType = type === 'control' ? 'userAction.responseSpeaker' : type
			let typeFn = evil(allType);
			dispatch(typeFn(content,fn,userId));
		}catch(err){
			dispatch({
            	type   : type,
            	params : content
        	});
		}
   }
	
}



/**
 * 点对全部通信
 */
export const onRecePublicMsg=(params)=>{
	let padControls = ['onRender','onShowFiles','onMousemove','onClear','onTabChange','onTabRemove','onPageTurn']
	return  (dispatch,getState)=>{
		let {pad} = getState().padInfo;
		let userObj = getState().userInfo.getUserObj(params.userId)
		if(padControls.includes(params.type)) {
			pad.listenControl(params.type,params.content);
		} else {
			try{
				//如果是params.type是action方法，则调用方法名
                if (params.type === "text") {
                    // todo 手机端用户发送群聊消息,数据格式需要做处理
                    params.type = "msgAction.addMsg"
                    params.content = {
                        avatar: userObj.headPic,
                        username: userObj.truename,
                        to: params.userId,
                        content: params.content,
                        type: 'group',
                        httpsServerAddress: '',
                        id: new Date().valueOf()
                    }
                }
				let fn = evil(params.type);
				dispatch(fn(params.content,params.userId));
			}catch(e){
				dispatch({
					type   : params.type,
					params : params.content
				});
			}
		}
   }
}

export const onLoadPadData=(params)=>{
    return  (dispatch,getState)=>{
        let {pad} = getState().padInfo;
        pad.listenControl('onPageTurn',params && params.length > 0 ? {
            tid: params[0].content.owner.substr(4),
            // tid: 'f33a2542029f4b83b4df3f88532aa06d_1536917433591',
            pageNumber: Number(params[0].content.current) + 1
        } : {});

    }
}

/**
 * 白板消息
 */
export const onLoadPadInfo=(msg)=>{
    handleMsgToMobile('sendWpadMsg', msg)
	return  {
        type     : Type.COCO_ON_PADINFO,
        playload : msg
    }
}   

/**
 * coco报错
 */
export const onError=(msg)=>{
	return  {
        type     : Type.COCO_ON_ERROR,
        playload : msg
    }
}


//coco的发送消息事件-个人
export const callOne=(uid,type,params,fn)=>{
	return (dispatch, getState) => {
		let {coco} = getState().cocoInfo;
		if( typeof params === "object" ){
			params.fromCoco = true;
		}
		coco.callOne(uid,type,params,fn);

        handleMsgToMobile(type, params, uid)

		return dispatch({
			type     : Type.CALL_ONE,
			playload : ''
		});
	}
}

//coco的发送消息事件-全部
export const callAll=(type,params)=>{
	return (dispatch, getState) => {
		let {coco} = getState().cocoInfo,
            mainId =  getState().meetInfo.mid;
        type !== 'msgAction.addMsg' && coco.callAll(type,params);
        let args = typeof params === 'object' ? { ...params, mainId} : params
        handleMsgToMobile(type, args)

        return dispatch({
		 	type: Type.COCO_CALL,
		 	playload : ''
		});
	}
}