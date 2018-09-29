/**
 * 插件设置相关----录制，归档功能
 */
import * as Type  from '@/config/actionTypes';
import { setApi } from '@/api';
import {Modal} from '@/components/modal';


let intervalTime;
	
export const toggleRecord = (status)=>{
	return (dispatch,getState) => {
		let content = "";
		if( status === 'run' ){
			content = "确定开始在服务器端录制吗？";
		}else{
			content = "当前正在录制中，是否停止录制？";
		}
		let m_confirm = Modal.confirm({
			content,
			onSure : ()=>{
				dispatch(toggleRecordOver(status));
				m_confirm.close();
			}
		});
	}
}

/**
 * 开启，或关闭录制-业务层
 * status : true|false  //是否录制
 */
export const toggleRecordOver = (status)=>{
	return (dispatch,getState) => {
		let {canRecord,meetObj:{skey}} = getState().meetInfo;
		if(!canRecord){
			return;
		}
		dispatch(toggleRecordPlugin(status,()=>{
			//缓存数据到后台
			setApi.setVideoSetting(skey,getState().setInfo,{recordStatus:status}).then(() => {
				//修改录制状态
				dispatch({
					type     : Type.SET_RECORD_STATUS,
					playload : status,
				});
				
				intervalTime && clearInterval(intervalTime);
				
				//修改录制时间
				if( status === 'run' ){
					let { recordTime } = getState().setInfo;
					
					let time = recordTime || 0;
					intervalTime = setInterval(()=>{
						time++;
						dispatch({
							type     : Type.SET_RECORD_TIME,
							playload : time,
						});
					},1000);
				}else if( status === 'stop'   ){
					dispatch({
						type     : Type.SET_RECORD_TIME,
						playload : 0,
					});
				}
			});
		}));
	}
}


/**
 * 开启，或关闭录制-插件层
 * status : true|false  //是否录制
 */
export const toggleRecordPlugin = (type,backFn)=>{
	return (dispatch, getState) => {
		let {meetPluginObj:mp,virtualCamera} = getState().setInfo,
			{mid,shareDesk,meetId} = getState().meetInfo,
			virtualObj = virtualCamera.find(item=>item.index===0);
		
		if( type === 'run' ){
			//开始录制
			mp.plugin.removeEvent("OnServerRecordStart");
			mp.plugin.addEvent("OnServerRecordStart",(state)=>{
				backFn(state);
				//通知dms服务录制文件需要上传到那个resourceserver上
				setApi.noticeDmsUpload({
					periodId   : meetId,                                      //会议ID
					streamName : "meeting_" + meetId + '_u_' + mid,           //视频流名称
					uploadUrl  : virtualObj.httpServerUrl,                    //通知上传的地址
				});
			});
			mp.plugin.startServerRecord();
            virtualObj.plugin.startServerRecord()
		}else if( type === 'stop' ){
			//停止录制
			mp.plugin.removeEvent("OnServerRecordStop");
			mp.plugin.addEvent("OnServerRecordStop",(state)=>{
				dispatch({
					type     : Type.SET_RECORD_TIME,
					playload : 0,
				});
				backFn(state);
				//如果没有发送共享桌面的流-调用改方法提升性能（建议这些，可以在插件内部处理更好）
				if( shareDesk !== mid ){
					//mp.plugin.StopDasktopSource();
				}
			});
			mp.plugin.stopServerRecord();
            virtualObj.plugin.stopServerRecord()
		}else if( type === 'pause' ){
			//暂停录制
			mp.plugin.removeEvent("OnServerRecordPause");
			mp.plugin.addEvent("OnServerRecordPause",(state)=>{
				backFn(state);
			});
			mp.plugin.pauseServerRecord();
            virtualObj.plugin.pauseServerRecord()
		}
	}
}

