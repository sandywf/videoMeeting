/**
 * user action
 */
import * as Type from '@/config/actionTypes';
import {Modal} from "@/components/modal";

//视频设置弹框
export const switchVideoSetting = (switchVideoSetting) => {
    return  {
        type     : Type.SWITCH_VIDEO_SETTING,
        playload : { switchVideoSetting }
    }
}

//视频布局设置弹框
export const videoLayoutSetting = (videoLayoutSetting) => {
    return (dispath,getState)=>{
    	let {role,pollingSetting:{customPolling}} = getState().meetInfo;
    	//判断是否允许布局调整
    	if( role === "MAIN" && videoLayoutSetting && customPolling ){
    		Modal.alert("当前正在轮巡状态，不能调整布局!");
    		return;
    	}
    	
        dispath({
        	type     : Type.VIDEO_LAYOUT_SETTING,
        	playload : {videoLayoutSetting}
        });
    }
}

// 共享文档
export const shareDoc = (shareDoc) => {
    return  {
        type     : Type.SHARE_DOC,
        playload : {shareDoc}
    }
}

//单画面全屏显示,showUserId：要放大的画面-对应的userid
export const switchFullScreen = (showUserId) => {
    return  {
        type     : Type.SWITCH_FULL_SCREEN,
        playload : {fullScreen:showUserId}
    }
}

// 视频排序
export const switchSortVideo = (sortVideo) => {
	return (dispath,getState)=>{
    	let {role,pollingSetting:{customPolling}} = getState().meetInfo;
    	//判断是否允许布局调整
    	if( role === "MAIN" && sortVideo && customPolling ){
    		Modal.alert("当前正在轮巡状态，不能调整画面次序!");
    		return;
    	}
    	
        dispath({
        	type     : Type.SHARE_DOC,
        	playload : {sortVideo}
        })
   }
}

//轮巡设置弹框
export const switchPolling = (polling) => {
	return (dispath,getState)=>{
    	let {videoLayoutNum} = getState().setInfo;
    	let { entered } = getState().userInfo // 当前在线人数
        if (!(entered > 4)) {
            Modal.alert("在线人数最少为五人时才能开启轮巡!");
            return;
        }
    	//判断是否允许布局调整
    	if(videoLayoutNum >6 && polling ){
    		Modal.alert("只允许四分屏或者六分屏开启轮巡!");
    		return;
    	}
    	
        dispath({
        	type     : Type.SWITCH_POLLING_SETTING,
        	playload : {polling}
        })
  }
}

//轮巡设置弹框
export const switchInvitePopup = (invite, type) => {
	return {
		type     : Type.SWITCH_INVITE_POPUP,
		playload : {invite: invite, type: type}
	}
}

//轮询设置弹框
export const switchLogoutPopup = (bool) => {
	return {
		type     : Type.SWITCH_LOGOUT_POPUP,
		playload : {logout: bool}
	}
}

