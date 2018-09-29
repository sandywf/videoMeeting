
//Dialog.defaultProps= {
//	visible       : false,    //是否已经使用了
//	header        : true,     //是否有头部
//	footer        : true,     //是否有尾部
//	class         : '',       //设置类名称
//	key           : "",       //获取标记
//	title         : "提示",
//	width         : "600",
//  minHeight	  : ''
//	height        : "",
//	left          : "",        //dragAble=true 模式下执行，默认是居中
//	top           : "",        //dragAble=true 模式下执行，默认是居中
//	time          : 0,         //0的时候不会自动关闭，否则几秒后自动关闭
//	children      : "",        //弹出层内容
//	mask          : true,      //遮罩层(false,true)
//	maskOpacity   : 0.2,       //遮罩层的透明度，默认全透明
//	cancelBtn     : true,      //是否有关闭按钮
//	sureBtn       : true,      //是否有确认按钮
//	cancelText    : "取消" || "",  //关闭的文本
//	sureText      : "确认" || "",  //保存的文本
//	onCancel      : ()=>{},        //关闭方法
//	onSure        : ()=>{},        //确认方法,
//	closeStyle    : true,      //关闭模式：true：删除dom节点；false：隐藏的关闭模式
//	dragAble      : true,      //是否应许拖动
//	modalType     : '',        //弹出的类型 tipPop,confirmPop
//	onDialogState :  ''        //监听弹框状态事件
//};


import React, { Component } from 'react';
import VideoSetting from './videoSetting';
import VideoSettingLocal  from './videoSetting/indexLocal';
import VideoLayout  from './videoLayout';
import FullScreen   from './fullScreen';
import ShareDoc     from './share_doc';
import Polling    from './polling';
import Invite    from './invite';
import SortVideo     from './sort_video';
import Logout     from './logout';
import {connect}    from 'react-redux';
import {Modal}      from '@/components/modal';

import {
	switchVideoSetting, 
	videoLayoutSetting, 
	shareDoc,
	switchFullScreen,
	switchSortVideo,
	switchPolling,
	switchInvitePopup,
	switchLogoutPopup
} from '@/store/popup/action';

class Popup extends Component {
	
	constructor(props){
		super(props);
		//弹出层基本样式
		this.popParams  = {
			videoSetting : {
				title    : "视频设置",
				width    : 'auto',
				minWidth : 550,
				minHeight : 150,
				footer   : true,
				onCancel : ()=>{this.props.switchVideoSetting(false)}
			},
			videoLayout: {
				title: "视频布局设置",
				width: 780,
				footer: false,
				header: false,
				onCancel: () => { this.props.videoLayoutSetting(false)}
			},
			shareDoc: {
				title: "共享文档",
				width: 720,
				footer: false,
				closeStyle : false,
				header: true,
				onCancel: () => { this.props.shareDoc(false)}
			},
			fullScreen: {
				title: "画面最大化",
				modalType : 'fullScreen',
				footer: false,
				header: false,
				onCancel: () => { this.props.switchFullScreen(false)}
			},
			sortVideo: {
				title: "调整画面次序",
				width : 380,
				height: 480,
				footer: true,
				header: true,
				onCancel: () => { this.props.switchSortVideo(false)}
			},
			polling: {
				title: "轮巡设置",
				width : 480,
				footer: true,
				header: true,
				sureText : "开启轮巡",
				onCancel: () => { this.props.switchPolling(false)}
			},

			invite: {
				title: "邀请观摩",
				width : 546,
				minHeight: 120,
				footer: false,
				header: true,
				onCancel: () => { this.props.switchInvitePopup(false)}
			},

			logout: {
				title: "退出视频会议",
				width : 400,
				minHeight: 140,
				footer: false,
				header: true,
				onCancel: () => { this.props.switchLogoutPopup(false)}
			}
		};
	}
	//
	componentDidMount(){
		let { isFirstTimes,switchVideoSetting, role } = this.props;
		if(isFirstTimes && role !== "WATCH"){
			//第一次进入会议，默认打开视频设置(观摩者不需要打开)
			switchVideoSetting(true);
		}
	}
	
	//props更新时候触发
	componentWillReceiveProps(nextProps){
		let { isFirstTimes : oldVal,switchVideoSetting } = this.props;
		let { isFirstTimes : newVal } = nextProps;
		if( oldVal !== newVal && newVal ){
			//第一次进入会议，默认打开视频设置
			switchVideoSetting(true);
		}
	}
	
	
    render() {
			let {videoSetting, 
				videoLayout, 
				shareDocSwitch,
				fullScreen,
				polling,
				invite,
				sortVideo,
				logout,
				source,
				type} = this.props;

				if(invite){
					this.popParams.invite.type = type;
					this.popParams.invite.title = type === 'watch' ? ' 邀请观摩' : '邀请来宾';
				}
	    return (
			<React.Fragment>
				<Modal visible={ videoSetting } {...this.popParams.videoSetting}>{source==="TEACH_PLATFORM"?<VideoSetting/>:<VideoSettingLocal/>}</Modal>
				<Modal visible={ videoLayout } {...this.popParams.videoLayout}><VideoLayout/></Modal>
				<Modal visible={ shareDocSwitch } {...this.popParams.shareDoc}><ShareDoc/></Modal>
				<Modal visible={ fullScreen } {...this.popParams.fullScreen}><FullScreen/></Modal>
				<Modal visible={ sortVideo } {...this.popParams.sortVideo}><SortVideo/></Modal>
				<Modal visible={ polling } {...this.popParams.polling}><Polling/></Modal>
				<Modal visible={ invite } {...this.popParams.invite}><Invite/></Modal>
				<Modal visible={ logout } {...this.popParams.logout}><Logout/></Modal>
				
			</React.Fragment>
	    );
    }
}

let mapStateToProps = state=>({
	videoSetting   : state.popupInfo.switchVideoSetting,
	videoLayout    : state.popupInfo.videoLayoutSetting,
	shareDocSwitch : state.popupInfo.shareDoc,
	fullScreen     : state.popupInfo.fullScreen,
	sortVideo      : state.popupInfo.sortVideo,
	polling        : state.popupInfo.polling,
	logout         : state.popupInfo.logout,
	invite         : state.popupInfo.invite,
	type           : state.popupInfo.type,
	isFirstTimes   : state.meetInfo.meetObj.isFirstTimes,   //判断是否是第一次进入会议
	source         : state.meetInfo.source,                 //判断进入会议的来源
    role           : state.meetInfo.role
});

let mapDispatchToProps = {
	switchVideoSetting,
	videoLayoutSetting,
	shareDoc,
	switchFullScreen,
	switchSortVideo,
	switchPolling,
	switchInvitePopup,
	switchLogoutPopup
}

export default connect(mapStateToProps,mapDispatchToProps)(Popup);