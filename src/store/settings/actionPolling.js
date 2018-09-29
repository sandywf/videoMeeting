/**
 * 插件设置相关----轮巡的插件相关设置
 * 主要设置到插件层相关的操作
 */
import * as setAction from "./action";
import * as popupAction from "@/store/popup/action";

/**
 * 开启关闭非发言人的流信息
 * 开启本地的发送流数据，并且如果是发言人的流，要显示音频和视频画面。
 * 如果是非发言人的参会者，来宾，则只显示视频不显示音频。
 * 注：观摩，以及手机端用户，不参与轮巡
 */
export const toggleNoSpeakerStream=(state)=>{
	return (dispatch,getState)=>{
		
		let {setInfo,meetInfo,userInfo} = getState(),
			{getPublishPlugin} = setInfo,
			{uid} = meetInfo,
			{getUserObj} = userInfo,
			userObj = getUserObj(uid),
			publishPlugin = getPublishPlugin(uid);
		
		//启动或关闭非发言人的参会者的发送流
		if( userObj && !userObj.isSpeaker && (userObj.userType === "JOIN" || userObj.userType === "GUEST") && userObj.deviceName === 'PC' && publishPlugin ){
			dispatch( setAction.setStreamToCamera(publishPlugin, {uid,status:state} ) );
		}
	};
}


//关闭轮巡的时候，重设本地摄像头数据（当前的实现画面）
export const stopLocalPolling = ()=>{
	return (dispatch,getState)=>{
		//更新发言人列表
		let { speakerList } = getState().meetInfo,
			{ virtualCamera } = getState().setInfo,
			promiseList = [];
			
		//根据发言人，依次去更新发言人的状态
		speakerList.forEach(item=>{
			if( item ){
				promiseList.push(
					dispatch(setAction.toggleVideoDom({
						uid  : item,
						type : "Y"
					}))
				)
			}
		});
		
		Promise.all(promiseList).then(list=>{
			//未使用的摄像头进行关闭
			virtualCamera.forEach(item=>{
				if( !list.find( v=>v.index===item.index ) ){
					//关闭item
					dispatch(setAction.setStreamToCamera(item,{status:false}));
				}
			});
		});
		
	};
}


//开启轮巡的时候，设置本地摄像头数据（当前的实现画面）
export const runLocalPolling = ()=>{
	return (dispatch,getState)=>{
		let { meetInfo,setInfo } = getState(),
			{ role,pollingSetting,mid } = meetInfo,
			{ virtualCamera } = setInfo,
			{ customPolling,isPolling,pollingList } = pollingSetting,
			promiseList = [];
		
		//轮询前-对页面上一些功能进行整合
		//轮巡时，显示全部的音频和视频
		dispatch(setAction.showVideoAndAudio());
		//轮巡时，取消双屏
		dispatch(setAction.toggleDobuleScreen(""));
		//轮巡是，取消画面最大化
		dispatch(popupAction.switchFullScreen(""));
		
		//操作前，过滤，虚拟摄像头，轮巡中，要听到主持人的声音，所有保留主讲人的接受流
		let cameraAble = virtualCamera.filter(item=>{
			return !item.userId || item.userId !== mid;
		});
		let canPolling = false;
		
		if( role === "MAIN" && customPolling ){
			//主持人轮巡
			canPolling = true;
		}else if( isPolling && customPolling  ){
			//是否在广播轮巡
			canPolling = true;
		}
		
		if(!canPolling) return;
		//接受流接受画面-判断是否有旧的画面
		let list = pollingList.filter(item=>{
			//如果是自己，或者是主讲教室的，先忽略
			if( item === mid ){
				return false;
			}
			
			let index = cameraAble.findIndex(i=>i.userId===item||i.oldUserId ===item);
			//是否已经存在了画面-如果存在使用旧的虚拟video
			if( index !== -1 ){
				let camObj = cameraAble.splice(index,1);
				promiseList.push(dispatch(setAction.setStreamToCamera(camObj[0],{uid:item,status:true})));
				return false;
			}
			return true;
		});
		
		//接受流接受画面-没有旧的画面的时候
		list.forEach(item=>{
			let camObj = cameraAble.shift();
			if(camObj){
				promiseList.push(dispatch(setAction.setStreamToCamera(camObj,{uid:item,status:true})));
			}
		});
		
		//多余的虚拟摄像头，关闭接收
		cameraAble.forEach(item=>{
			promiseList.push(dispatch(setAction.setStreamToCamera(item,{status:false})));
		});
		
		Promise.all(promiseList).then(item=>{
			//更新虚拟摄像头
			virtualCamera = virtualCamera.map(v=>{
				let itemObj = item.find(i=>i.index===v.index);
				return itemObj || v;
			});
			//更新虚拟摄像头数据
			dispatch(setAction.updateVirtual(virtualCamera));
		});
	};
};



