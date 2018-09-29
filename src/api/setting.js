import urls from "@/config/apiUrl";
import {Net}  from '@/utils';
import json from '@/config/class-default.json';

class setApi extends Net{
    /**
     * 设置视屏设置
     */
    setVideoSetting(skey,setInfo,params={},source){
    	let res = {
			//resolution           : setInfo.resolution,          //分辨率
			//definition           : setInfo.definition,          //清晰度
			//mode                 : setInfo.mode,                //导播模式  2手动 ；1自动 ； 3半自动
			//bigScreen            : setInfo.bigScreen,           //大画面
			//smallScreen          : setInfo.smallScreen,         //小画面集合
			
			preset               : setInfo.preset,              //预置位
			doubleScreen         : setInfo.doubleScreen,        //设置双屏的userId
			recordStatus         : setInfo.recordStatus,        //是否正在录制中
			classroomSetting     : setInfo.classroomSetting,    //教室视频设置
			workspaceSetting     : setInfo.workspaceSetting,    //工作台视频设置
		};
		
		//判断值是否进行了修改如果没有修改，则不需要请求后台
		let hasChange = false;
		Object.keys(params).forEach(item=>{
			if( params[item] !== setInfo[item] ){
				hasChange = true;
			}
		});
		
		if( hasChange ){
			if( typeof(source) !== undefined ){
				let settings = source==="TEACH_PLATFORM" ? res.classroomSetting : res.workspaceSetting;
				//分辨率
				if( params.resolution ){
					settings.resolution = params.resolution;
					delete params.resolution;
				}
				//清晰度
				if( params.definition ){
					settings.definition = params.definition;
					delete params.definition;
				}
				//导播模式
				if( params.mode ){
					settings.mode = params.mode;
					delete params.mode;
				}
				//大画面
				if( params.bigScreen ){
					settings.bigScreen = params.bigScreen;
					delete params.bigScreen;
				}
				//小画面集合
				if( params.smallScreen ){
					settings.smallScreen = params.smallScreen;
					delete params.smallScreen;
				}
			}
			
			let videoSetting = JSON.stringify({...res,...params});
			return this.post(urls.setVideoSetting,{skey,videoSetting});
		}else{
			return Promise.resolve();	
		}
    }
    
    /**
     * 获取默认的视频会议设置的值
     */
    async getDefaultVideoSetting(classroomId){
    	let result = await this.p_get(urls.getDefaultVideoSetting,{classroomId,jsonKeyPath:'videoMeeting'},{selfHandle:true});
    	if( result.status === 1 ){
    		return result.result;
    	}else{
    		throw "has Error by Url "+urls.getDefaultVideoSetting;
    	}
    }
    
	/**
	 * 获取视频设置
	 */
	getVideoSetting(skey){
	 	return this.post(urls.getVideoSetting,{skey:skey||""});
	}
	
	/**
	 * 获取当前json的数据
	 */
	getPlgunJson(classroomId){
		let requset ="";
		//判断是否是开发环境-从后台获取大json
		// if( process.env.NODE_ENV === 'development' ){
		// 	requset = this.p_get(urls.localPluginInitConfig);
		// }else{
		// 	requset = this.p_post(urls.pluginInitConfig,{classroomId},{selfHandle:true});
		// }
		requset = this.p_post(urls.pluginInitConfig,{classroomId},{selfHandle:true});
		return requset;
	}
	
	/**
	 * 从默认数据里面获取大json
	 */
	getPlgunDefaultJson(){
		return Promise.resolve(json);
		//return this['p_get'](urls.pluginDefaultInitConfig,{},{selfHandle:true});
	}
	
	/**
	 * 根据dms获取rtmp数据
	 */
	getRtmpUrl(url,options){
		return this.jsonp(url,options);
	}
	
	/**
	 * 注册dms服务器流
	 */
	registerDmsServer(state,userId,stream){
		let { uid,mid,meetObj: { DMC }, meetId } = state.meetInfo,
			userObj = state.userInfo.userList.find(item => item.uid === uid) || {};
        let speakerUserObj = state.userInfo.getUserObj(userId === mid ? '' : userId);
        let pcStream     = stream ? stream : "meeting_" + meetId + '_u_' + userId;
        let mobileStream = pcStream + "_mobile";
        
		let obj = {
			method: uid===userId?'publish':'play',
			stream: pcStream,
			domain: userObj.baseAreaId,
			protocol: "rtmp",
			action: 1,
			group: meetId
		};
		
		return this.getRtmpUrl(DMC, obj).then((result) => {
			let {external,internal,httpServerUrl} = result.dms;
			let basicUrl  = "rtmp://" + (external && external.length > 0 ? external[0].rtmpUrl : internal[0].rtmpUrl) + "/dms/";
            return Promise.resolve({
				rtmpUrl      : basicUrl + pcStream,
				mobileUrl    : basicUrl + mobileStream,
				basicUrl     : basicUrl,
				httpServerUrl,
			});
		});
		
	}
	
	/**
	 * 通知dms服务器上传视频
	 */
	noticeDmsUpload(params){
		return this.post(urls.noticeDmsUpload,params);
	}

	/**
     * 设置视屏设置
	 * mode = {type: ''};
     */
    setVideoLayout(mode){
		return this.post(urls.setVideoLayout,mode);
    }
	
}

export default new setApi();