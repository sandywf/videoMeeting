/**
 * 插件设置相关----显示的视频画面-相关的操作
 * 1、单画面是否有视频
 * 2、单画面是否有音频
 * 3、当前画面是否全屏 -- 在组件中实现
 * 4、当前画面是否双屏
 * 5、是否设置为发言人-- 在主action中
 */
import * as Type  from '@/config/actionTypes';
import { setApi } from '@/api';


/**
 * 开启关闭接收流的视频
 * 1、单画面是否有视频
 */
export const toggleVideo = (uid, isShow) => {
	return hanleStreamMode(uid, isShow, 'video');
}

/**
 * 开启关闭接收流的音频
 * 2、单画面是否有音频
 */
export const toggleAudio = (uid, isShow) => {
	return hanleStreamMode(uid, isShow, 'audio');
}

//开启关闭(发送流或者接收流)的视频和音频
export const hanleStreamMode = (uid, isShow, type) => {
	return (dispatch, getState) => {
		let { virtualCamera, hideAudioArr, hideVideoArr } = getState().setInfo,
			{ uid: currentUid } = getState().meetInfo,
			audioIsOpen = true,
			videoIsOpen = true;

		let index_audio = hideAudioArr.indexOf(uid),
			index_video = hideVideoArr.indexOf(uid);

		let result;

		//接受流处理视频音频按钮标红状态
		if (uid !== currentUid) {
			//音频处理
			if (type === 'audio') {
				//音频处理
				if (isShow) {
					index_audio > -1 && hideAudioArr.splice(index_audio, 1);
				} else {
					audioIsOpen = false;
					index_audio === -1 && hideAudioArr.push(uid);
				}
				//视频处理
				index_video > -1 && (videoIsOpen = false);
				//获取result
				result = {
					type: Type.SET_HIDE_AUDIO_ARR,
					playload: hideAudioArr
				};
			} else {
				//视频处理
				if (isShow) {
					index_video > -1 && hideVideoArr.splice(index_video, 1);
				} else {
					videoIsOpen = false;
					index_video === -1 && hideVideoArr.push(uid);
				}
				//音频处理
				index_audio > -1 && (audioIsOpen = false);
				//获取result
				result = {
					type: Type.SET_HIDE_VIDEO_ARR,
					playload: hideVideoArr
				};
			}
		} else {
			//判断当前状态
			let { isPublishAudio, isPublishVideo } = getState().userInfo.userList.find(item => item.uid === uid)||{};
			audioIsOpen = isPublishAudio;
			videoIsOpen = isPublishVideo;
		}


		//循环出对象并进行操作
		virtualCamera.forEach(cam => {
			if (cam.userId === uid) {
				//判断是否本身
				if (cam.index === 0) {
					//当前的流为发送流
					//streamMode 0 音视频 1 视频 2 音频 3无，默认：0
					let tag;
					if (!audioIsOpen && !videoIsOpen) {
						tag = 3;
					} else if (audioIsOpen && videoIsOpen) {
						tag = 0;
					} else if (audioIsOpen) {
						tag = 2;
					} else {
						tag = 1;
					}

					cam.plugin.pip('setStreamMode', {
						streamMode: tag,
						index: 0,
						direction: 12
					}).then('setStreamMode', {
						streamMode: tag,
						index: 0,
						direction: 13
					}, () => {
						setTimeout(() => {
							type === 'video' && cam.videoDom.load();
						}, 50);
					}).exec();
				} else {
					//当前的流为接受流
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
					cam.plugin.pip('setReceiveType', tag, () => {
						dispatch(result);
						setTimeout(() => {
							type === 'video' && cam.videoDom.load();
						}, 50);
					}).exec();
				}
			}
		});
	};
}

/**
 * 4、当前画面是否开启双屏
 */
export const toggleDobuleScreen = (screenUserId) =>{
	return (dispatch, getState) => {
		let {meetInfo:{meetObj:{skey}},setInfo} = getState();
		let { virtualCamera } = setInfo;
		let cameraIndex = virtualCamera.find(item=>item.userId === screenUserId);
		let cameraPublish = virtualCamera.find(item=>item.index === 0);

		setApi.setVideoSetting(skey,setInfo,{doubleScreen:screenUserId}).then(() => {
			dispatch({
				type: Type.SET_DOBULE_SCREEN,
				playload: screenUserId
			});
			
			if( screenUserId ){
				cameraPublish.plugin.setExtansionScreenIndex(cameraIndex.index,(item)=>{
					if( item && item.param.result === 0 ){
						cameraPublish.plugin.openExtansionScreen((item1)=>{
							console.log(item1);
						});
					}
				});
			}else{
				cameraPublish.plugin.closeExtansionScreen();
			}
		});
	}
};



