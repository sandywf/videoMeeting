//封装基本的coco消息
import {coco as codyy_coco} from "./codyy";
import store from '@/store/store';
import * as actions from "@/store/coco/action";

//扩展store
export default class CocoClass{
	constructor(url, params){
		//coco对象
		this.coco = "";
		//通信中的回调事件集合
		this.callbacks = {};
		this.init(url, params);
	}
	
	//初始化coco
	init(url, params){
		let coco = this.coco = codyy_coco.init(url, params);
		//绑定系统相关的监听事件
		if( coco ){
			this.listenControl();
		}
	}
	
	//暴露的监听事件
	addEvent(eventName, fn) {
        this.coco.addCustEvent(eventName, fn);
    }
	
	//通知给指定用户的请求
	/**
	 * uid    : string, 发送消息到uid
	 * type   : string, 消息的类型
	 * args   : string || object, 发送的数据  ,function:请求的回调事件
	 * fn	  : function,  请求的回调事件
	 * 			
	 */
	callOne(uid,type,args,fn){
		let params = args,
			backFn  = (typeof fn === 'function')?fn:"",
			callbackId,
			content = "";
		if( !this.coco || !uid || !type ) return;
		if( typeof args === 'function' ){
			backFn = args;
			params = "";
		}
        if (backFn) {
            callbackId = Date.now()+""+Math.floor(Math.random()*1000);
            this.callbacks[callbackId] = backFn;
        }
        content = {params,callbackId};
        this.coco.sendMsgTo({userId:uid,type,content});

	}

	//广播到其它用户的接口
	callAll(type,content){
		let groupId = this.coco._params.groupId;
		if( !this.coco || !type ) return;
		if(content ===undefined) {
			content = {}
		}
        this.coco.sendMsgToAll({type,content,groupId});
	}

	// 加载在线用户
	loadUser(){
		let groupId = this.coco._params.groupId;
		if( !this.coco ) return;
		this.coco.getGroupOnline(groupId)
	}

	kickOut(uid){
		let groupId = this.coco._params.groupId;
		if( !this.coco) return;
        this.coco.kickOut(uid, groupId);
	}
	
	//发送回调事件
	backFn(uid,params,callbackId){
		let content = {params,callbackId};
		this.coco.sendMsgTo({userId:uid,type:'callback',content});
	}
	
	//添加系统相关的监听事件
	listenControl(){
		let {coco} = this,
			self = this;
		
		//coco已经连上了  可以不要 连上会自动触发 
		coco.addCustEvent("loginup", function(){
            store.dispatch(actions.onLoginUp(true));
        });
        
        //某个用户加入组的时候进行的通知
        coco.addCustEvent("loginNotify", function({from,deviceName}){
            store.dispatch(actions.onLoginNotify({uid: from, deviceName: deviceName, state:true}));
        });
        
        //某个用户离开组的时候发送的通知
        coco.addCustEvent("logoutNotify", function({from,deviceName}){
        	store.dispatch(actions.onLoginNotify({uid: from,state:false,deviceName}));
        });
        
        //当前用户加入到对应的组里面了
        coco.addCustEvent("joinGroup", function(msg){
            store.dispatch(actions.onJoinGroup(msg));
        });
        
        //当前用户被踢出的时候触发
        coco.addCustEvent("onKick", function(msg){
        	store.dispatch(actions.onKick(msg));
        });
        
        //当前用户重复登录上次的coco被踢除
        coco.addCustEvent("offline", function () {
            store.dispatch(actions.onOffline(null));
        });

        //手机端用户申请发言
        coco.addCustEvent("callOne", function (data) {
            let uid = data[data.length - 1][1]; // 数据结构就是这样的 - -!
            let {nameTag,baseAreaId} = store.getState().userInfo.userList.find(item=>item.uid===uid) || {};
            let lastArr = data.pop()
            let params = {
                isMobile: true,
                userId:uid,
                status:true,
                name:nameTag,
                baseAreaId,
                isCancel: lastArr[0] === 'applyCancelSpeaker'
            };
            store.dispatch(actions.onRecePrivateMsg({
                uid,
                type: "control",
                content : params
            }));

        });

		//私下通信
        coco.addCustEvent("recePrivateMsg", function({from,data}) {
        	let {type,content:{params,callbackId}} = data,
        		{userId} = from;
            let detailType = type === 'text' ? "ADD_MSG" : type
            let detailParams = !params ? {
                content: data.content,
                type: "single",
                id: new Date().valueOf(),
                username: from.userName,
                fromId: from.userId,
                fromCoco: true
            } : params
        	//判断是否是回调的触发事件
        	if( detailType === "callback" ){
        		let callback = self.callbacks[callbackId];
        		if( callback && typeof callback === 'function' ){
        			callback(params);
        			delete self.callbacks[callbackId];
        		}
        	}else{
        		store.dispatch(actions.onRecePrivateMsg({
        			userId,
                    type: detailType,
        			content : detailParams,
        			fn:(args)=>{
        				callbackId && self.backFn(userId,args,callbackId)
        			}
        		}));
        	}
        });
        
        //公开
        coco.addCustEvent("recePublicMsg", function(params){
        	let {type, from, content} = params;
        	let	userId = from;
        		
        	//判断是否是回调的触发事件
        	store.dispatch(actions.onRecePublicMsg({userId,type,content}));
        });

		//获取用户列表
        coco.addCustEvent("loadUser", function (msg) {
        	store.dispatch(actions.onLoadUser(msg));
        });


		/*接收白板信息*/
        coco.addCustEvent("loadPadInfo", function (msg) {
            store.dispatch(actions.onLoadPadInfo(msg));
        });

        /*接收白板信息*/
        coco.addCustEvent("onLoadPadData", function (msg) {
            store.dispatch(actions.onLoadPadData(msg));
        });

		/*错误信息*/
        coco.addCustEvent("onerror", function (msg) {
            console.error(msg);
            store.dispatch(actions.onError(msg));
        });
	}
}
