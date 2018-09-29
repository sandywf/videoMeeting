//config -接口列表
let location= window.location;
//视频会议根组件
let hostConfig = {
		httpsCommon      : '',            //公共方法https域名
		httpsMeeting     : '',            //meeting模块https域名
		httpsOnlineClass : '',            //onlineclass模块https域名
		httpsPublic      : '',            //public 模块https域名
		httpLocal        : location.protocol + "//localhost"+ ("https:" === location.protocol?":8443":""),            //本地环境
};

//前端相关路径集合
const urls = new Proxy({
	//会议相关
	initData             : '/video/meeting/index/initData.do',           //视频会议初始化数据
	getCocoServer        : '/common/coco-server/cms.do',                 // 获取coco服务器信息
	startMeeting         : '/start.do',                                  // 开始会议
	endMeeting           : '/logout/end.do',                             // 结束会议
	logoutMeeting        : '/logout.do',                                 // 参会者退出会议
	setPollingSetting    : '/updatePollingSetting.do',                   // 轮询设置
	startPolling         : '/startPolling.do',                           // 开启/关闭 轮询
	updataMeetInfo       : '/member/afterupdate.do',                     // 其实就更新了个title 哎
	noticeDmsUpload      : '/upload.do',                                 // 通知dms服务器上传视频
	getFileByFileId      : '/video/pic/get.do',                          //根据文件图片的id获取文件的路径

	
	//画面设置相关
	setVideoSetting         : '/config/recordparam/set.do',  //设置视屏配置
	getVideoSetting         : '/config/recordparam/get.do',  //设置视屏配置
	localPluginInitConfig   : '/director/plugininitconfig',  //获取插件的JSON
	pluginInitConfig        : '/onlineClass/onlineClass/teach/pluginparams.do', //获取插件的JSON
	//pluginInitConfig      : '/TeachingPlatformWeb/onlineClass/teach/pluginparams.do',  //获取插件的JSON
	pluginDefaultInitConfig : "/class-default.json",                            //获取写死的json
	getDefaultVideoSetting  : "/common/common/data/classroom/roomConfig.do",           //获取默认的视频会议配置设置值


	setVideoLayout      : '/updateFrames.do',  //设置画面布局模式
	
	//参会者相关
	getMemberList       : '/member/list.do',              //获取参会者列表
	toggleSpeaker       : '/order.do',                    //发言人列表（排序等操作）
	toggleAudioAndVideo : '/member/publishAv.do',         //参会者的音视频开关
	toggleChat          : '/member/message.do',           //参会者聊天功能开关
	toggleWhitePad      : '/member/whiteboard.do',        //参会者白板标注开发
	kickOut             :  '/member/delete.do',           //请出会议
	saveNote            : '/notebook/save.do',            //保存笔记
	
	//共享文档相关
	getShareDocList        : '/doc/list.do',                //获取所用的共享文档列表
	delShareDoc            : '/doc/delete.do',              //删除文档
	toggleLockShareDoc     : '/doc/lock.do',                //文档的锁定解锁
	getShareDocTransStatus : '/doc/getTransStatus.do',      //获取课件转换状态
	saveShareDoc           : '/doc/save.do',                //保存文档
	changeDocPage           : '/video/meeting/doc/changedocpage.do',
	transShareDocReceiveNotice  : '/doc/receiveNotice.do',  //转换共享文件的服务器要用的回调解决
	DEV_transShareDocReceiveNotice : "http://10.5.52.45:8080/Meeting/video/meeting/doc/receiveNotice.do",
	
},{
	get(target,name){
		//以/common开头的        公共方法https域名
		//以/onlineClass  onlineclass模块https域名
		//以/public       public 模块https域名
		//以/director     取本地插件的值
		//以/             公共方法https域名
		let n = name;
		//开发环境中先判断是否有 'DEV_'+name 的字段，没有的化判断name
		if(process.env.NODE_ENV === 'development'){
			if( 'DEV_'+name in target ){
				n = 'DEV_'+name;
			}
		}
		
		if( n in target ){
			//判断当前接口是否是http接口
			let path = target[n];
			if( path.indexOf('/common') === 0 ){
				return hostConfig.httpsCommon + path.replace("/common/","/");
			}else if( path.indexOf('/onlineClass') === 0 ){
				return hostConfig.httpsOnlineClass + path.replace("/onlineClass/","/");
			}else if( path.indexOf('/public') === 0 ){
				return hostConfig.httpsPublic + path.replace("/public/","/");
			}else if( path.indexOf('/director') === 0 ){
				return hostConfig.httpLocal + path;
			}else if( path.indexOf("/video/meeting") === 0 || path.indexOf("/class-default") === 0 ){
				return path;
			}else if( path.indexOf('http') === 0 ){
				return path;
			}else{
				return hostConfig.httpsMeeting + path;
			}
		}else{
			throw new ReferenceError("URL ["+name+"] does not exist");
		}
	}
});

export default urls;
export const setCommonUrl = (paths)=>{
	let {location} = window;
	//开发环境-重新paths
	if(process.env.NODE_ENV === 'development' && process.env.ISMOCK){
		paths = {
			httpsCommon      : 'http://10.5.235.15:8080/CommonsBaseRest',
			httpsMeeting     : '/video/meeting',
			httpsOnlineClass : '',
			httpsPublic      : '',
			httpLocal        : location.protocol + "//localhost"+ ("https:" === location.protocol?":8443":""),
		}
	}else{
		paths.httpsMeeting = paths.httpsMeeting+'/video/meeting';
	}
	hostConfig = {...hostConfig,...paths};
}
