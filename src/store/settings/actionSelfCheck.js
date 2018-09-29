/**
 * 插件设置相关----自检相关操作
 * 1、单画面是否有视频
 * 2、单画面是否有音频
 * 3、当前画面是否全屏 -- 在组件中实现
 * 4、当前画面是否双屏
 * 5、是否设置为发言人-- 在主action中
 */
import * as Type  from '@/config/actionTypes';
import {checkEnv,mediaDevice} from "@/utils/codyy";
import {getMeetInit} from '@/store/meet/action';

/**
 * 修改自检状态
 * selfCheckObj object
 */
export const setCheckStatus = (selfCheckObj) => {
	return {
		type: Type.SET_CHECK_STATUS,
		playload: selfCheckObj
	}
}

/**
 * 结束自检
 */
export const finishSelfCheck = () => {
	return {
		type: Type.END_SELF_CHECK,
		playload: { hasCheck: true }
	}
}


/**
 * 开始进行自检
 */
export const runSelfCheck = (time=1000)=>{
	return (dispatch,getState)=>{
        let {setInfo} = getState(),
            {meetPluginObj:mp} = setInfo;

	    // todo 自检前先检查火狐浏览器版本,因为无法进入mediaDevice.addEvent的回调,自检页面一直显示检测中,so 如果是49版本则将所有检查结果置为error,
        checkEnv.checkBrowserEnv(function(data) {
            if( data.browser.name === 'Firefox' && data.browser.version.split('.').includes('49')) {
                dispatch(setCheckStatus({
                    camera               : 'error',
                    speaker              : 'error',
                    audio                : 'error',
                    browser              : 'error',
                    tool                 : 'error',
                    checkExtensionScreen : 'error',
                }));
            }
        });
		mediaDevice.addEvent("OnReady", ()=>{
		    // 经测试,火狐浏览器49.0版本无法进入此回调
			setTimeout(()=>{
				
				checkEnv.init('',function(data){
					dispatch(initPreviewPlugin());
				});
				
				//获取浏览器环境
				dispatch(checkBrowserEnv());
				
				//插件未安装
				checkEnv.addEvent("OnError", function(a) {
					dispatch(setCheckStatus({tool  : 'uninstall'}));
				});
				
			},time);
		});
	}
}


//重新检测
export const restCheck = ()=>{
	return (dispatch,getState)=>{

        // todo 重新检测也需要先检查火狐浏览器版本
        checkEnv.checkBrowserEnv(function(data) {
            if( data.browser.name === 'Firefox' && data.browser.version.split('.').includes('49')) {
                dispatch(setCheckStatus({
                    camera               : 'error',
                    speaker              : 'error',
                    audio                : 'error',
                    browser              : 'error',
                    tool                 : 'error',
                    checkExtensionScreen : 'error',
                }));
            } else {
                let {selfCheck:{tool}} = getState().setInfo;

                dispatch(setCheckStatus({
                    camera               : 'checking',
                    speaker              : 'checking',
                    audio                : 'checking',
                    browser              : 'checking',
                    tool                 : 'checking',
                    checkExtensionScreen : 'checking',  //扩展屏
                }));

                //获取浏览器环境
                setTimeout(()=>{
                    if( tool ==='uninstall' ){
                        dispatch(runSelfCheck());
                    }else{
                        dispatch(checkBrowserEnv());
                        dispatch(initPreviewPlugin());
                    }
                },1000);
            }
        });
	}
}

//初始化检查工具
function initPreviewPlugin(){
	return (dispatch,getState)=>{
		dispatch(setCheckStatus({tool  : 'success'}));
//      dispatch(getMeetInit()).then(({ result: meetObj }) =>{
//          // 正则替换掉后台返回版本号中的英文, 例如: v5.6
//          let replaceEnglish = str => {
//              return str.replace(/[a-zA-Z]/g, "");
//          }
//          // 要比较的插件版本号
//          let plugVersion = replaceEnglish(meetObj.pluginVersion)
//          // 当前插件版本号
//          let currentPlugVersion = replaceEnglish(meetObj.meetingInfo.meetInfo.pluginEdition)
//          // 比较版本
//          if (currentPlugVersion < plugVersion) {
//              // 当前版本小于需求版本时
//              dispatch(setCheckStatus({tool  : 'error'}));
//          } else {
//              //当前版本大于或者等于需求版本时 插件已安装
//              dispatch(setCheckStatus({tool  : 'success'}));
//          }
//      })

		
		//获取摄像头信息
		checkEnv.getCamera(function(data) {
			let camera;
			if( data && data.videoList && Array.isArray(data.videoList) && data.videoList.length>0  ){
				let list = data.videoList.filter( item=>item.videoName.indexOf('Codyy')!==0 );
				if( list.length>0 ){
					camera = 'success';
				}else{
					camera = 'error';
				}
			}else{
				camera = 'error';
			}
			dispatch(setCheckStatus({camera}));
		});
		
		//获取音频设备
		checkEnv.checkAudio(function(data) {
			let audio;
			if( data && data.VoiceList && Array.isArray(data.VoiceList) && data.VoiceList.length>0  ){
				audio = 'success';
			}else{
				audio = 'error';
			}
			dispatch(setCheckStatus({audio}));
		});
		
		//获取扩展屏检测（后面用到）
		checkEnv.checkExtensionScreen(function(data) {
			let checkExtensionScreen = 'error';
			if( data && data.ScreenNum > 1 ){
				checkExtensionScreen = 'success';
			}
			dispatch(setCheckStatus({checkExtensionScreen}));
		});
		
		//获取扬声器
		checkEnv.checkSpeaker(function(data){
			let speaker;
			if( data && data.speakerList && Array.isArray(data.speakerList) && data.speakerList.length>0 ){
				speaker = 'success';
			}else{
				speaker = 'error';
			}
			dispatch(setCheckStatus({speaker}));
		});
		
	}
}


//进行浏览器检测-非插件方法，可直接调用
function checkBrowserEnv(){
	return (dispatch,getState)=>{
		checkEnv.checkBrowserEnv(function(data) {
			let browser;
			if( data && ['Chrome','Firefox','360EE','QQBrowser'].includes(data.browser.name) ){
				browser = 'success';
			}else{
				browser = 'error';
			}
			dispatch(setCheckStatus({browser}));
		});
	}
}