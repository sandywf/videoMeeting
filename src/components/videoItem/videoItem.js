/**
 * 每一个视屏窗口
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as cn from 'classnames';
import { switchFullScreen } from '@/store/popup/action';
import { toggleSpeaker } from '@/store/user/action';
import { toggleAudio, toggleVideo, toggleDobuleScreen,watchFullScreen } from '@/store/settings/action';
import Less from './videoItem.less';

let moreImg = require('@/asset/images/more.png');

class VideoItem extends Component {
    static propTypes = {
    }
    static defaultProps = {
        isBig: false
    }
    constructor(props) {
        super(props);
        this.state = {
            hasData: true    // 临时
        }
        this.switchFullScreen = this.switchFullScreen.bind(this);       //是否全屏显示
        this.toggleSpeaker = this.toggleSpeaker.bind(this);             //取消或设置发言人
        this.toggleAudio   = this.toggleAudio.bind(this);                    //开关音频
        this.toggleVideo   = this.toggleVideo.bind(this);                    //开关音频
        this.toggleDouble  = this.toggleDouble.bind(this);                   //开关双屏
    }
    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        let { videoObj } = this.props,
            { videoItem } = this.refs;
        if (videoItem && videoObj) {
            let firstChild = videoItem.firstChild;
            if (firstChild) {
                if (firstChild !== videoObj.videoDom) {
                    videoItem.replaceChild(videoObj.videoDom,firstChild);
                } else {
                    return;
                }
            } else {
                videoObj.videoDom.parentNode && videoObj.videoDom.parentNode.removeChild(videoObj.videoDom);
                videoItem.appendChild(videoObj.videoDom);
            }
            videoObj.videoDom.load();
        }
    }

    //画面最大化，还原画面
    switchFullScreen() {
        let { switchFullScreen, videoUid, fullScreen,polling,role,watchFullScreen } = this.props;
        if( polling ) return;
        
        let tag = "";
        if (videoUid === fullScreen) {
        	tag = false; 	
        }else{
         	tag = videoUid;
        }
        switchFullScreen(tag);
        
        if( role === "WATCH" ){
        	watchFullScreen(tag);
        }
    }

    //切换发言人
    toggleSpeaker() {
        let { toggleSpeaker, userObj, role,full} = this.props;
        if (role !== "MAIN") return ;
        
        if( userObj.isSpeaker ){
        	//取消发言人
        	toggleSpeaker({
	            uid        : userObj.uid,
	            type       : 'N',
	            baseAreaId : userObj.baseAreaId
	        });
	        //如果是全屏显示的状态下，关闭全屏显示
	        full && this.switchFullScreen();
        }else{
        	//设置为发言人
        	toggleSpeaker({
	            uid        : userObj.uid,
	            type       : 'Y',
	            baseAreaId : userObj.baseAreaId
	        });
        }
    }

    //开关音频
    toggleAudio() {
        let { videoUid, toggleAudio, audioIsOpen } = this.props;
        toggleAudio(videoUid, !audioIsOpen);
    }

    //开关视频
    toggleVideo() {
        let { videoUid, toggleVideo, videoIsOpen } = this.props;
        toggleVideo(videoUid, !videoIsOpen);
    }

    //开关双屏
    toggleDouble() {
        let { videoUid, doubleScreen, toggleDobuleScreen } = this.props;
        toggleDobuleScreen(doubleScreen === videoUid ? '' : videoUid);
    }


    //有视频
    renderVideo() {
    	let {videoUid,full,userObj,role,mid,uid,videoIsOpen,audioIsOpen,doubleScreen,polling,extensionScreen} = this.props;
    	//全屏
    	let fullScreenTitle = full?'画面还原':'画面最大化',
    	fullScreenCn = cn(
    		'iconfont',
    		{true:'icon-exit-full-screen-s',false:'icon-full-screen-s'}[full],
    		{'hide': polling }
    	);
    	
    	//音频开关
    	let audioSwitch = cn(
    		'icon-microphone',
    		{[Less.overflow]: !audioIsOpen },
    		{'hide': videoUid === uid || polling || role === "WATCH" }
    	),
    	audioSwitchTitle = audioIsOpen?"点击不接受音频":"点击接受音频";
    	
    	//视频开关
    	let videoSwitch = cn(
    		'icon-camera',
    		{[Less.overflow]: !videoIsOpen },
    		{'hide': videoUid === uid || polling || role === "WATCH"}
    	),
    	videoSwitchTitle = videoIsOpen?"点击不接受视频":"点击接受视频";
    	
    	//取消发言演示
    	let speakerCn = cn(
    		{true:'icon-close',false:'icon-jia1'}[userObj.isSpeaker],
    		{'hide':( role!=="MAIN" || mid === videoUid )}
    	),
    	speakerTitle = userObj.isSpeaker?'取消发言':'设置发言';
    	
    	//双屏
    	let doubleScreenCn = cn(
    		'iconfont',
    		{true:'icon-quxiaoshuangping',false:'icon-shuangping'}[doubleScreen === videoUid],
    		{'hide': polling || !extensionScreen }
    	),
    	doubleScreenTitle = doubleScreen === videoUid?'取消双屏显示':'双屏显示';
    	
        return (
            <div className={cn(Less.inner, 'iconfont')}>
                <div ref="videoItem" style={{ width: '100%', height: "100%" }} onDoubleClick={role!=="WATCH"?this.switchFullScreen:null} />
                <div className={Less['video-op']}>
                    <i title={audioSwitchTitle} className={audioSwitch} onClick={this.toggleAudio}>
                        {audioIsOpen ? null : <i className={'icon-disable'} />}
                    </i>
                    <i title={videoSwitchTitle} className={videoSwitch} onClick={this.toggleVideo}>
                        {videoIsOpen ? null : <i className={'icon-disable'} />}
                    </i>
                    <i title={doubleScreenTitle} className={doubleScreenCn} onClick={this.toggleDouble} />
                    <i title={fullScreenTitle}   className={fullScreenCn}   onClick={this.switchFullScreen} />
                    <i title={speakerTitle}  className={speakerCn} onClick={this.toggleSpeaker} />
                </div>
                <div className={cn(Less['user-Info'],{[Less['polling']]:polling&&userObj.isSpeaker})} title={userObj.title}>
                	{
                		!polling?null:videoUid===mid?(
                			<span className={cn(Less['user-role'],Less['main'])}>主</span>
                		):userObj.isSpeaker?(
                			<span className={cn(Less['user-role'],Less['speaker'])}>言</span>
                		):null
                	}
                	<span className={Less['user-title']}>{userObj.nameTag}</span>
                </div>
            </div>
        )
    }

    //无视频画面
    renderEmpty() {
        return (
            <div className={Less.inner}>
                <img className={Less['empty-icon']} src={moreImg} alt='' />
            </div>
        )
    }

    render() {
        let { videoUid, full, VideoStyleItem,mode,role } = this.props;

        let renderItem = videoUid ? this.renderVideo() : this.renderEmpty();

        let VideoStyle =  full ? { width : "100%", height: "100%" } : VideoStyleItem
        let videoCn = cn(
            Less['video-item'],
            { [Less['has-video']]: videoUid },
            { [Less['full-video']]: full },
            { [Less['video-item-watch']]: role==="WATCH" },
            Less[mode]
        );

        return (
            <div className={videoCn} style={VideoStyle}>
                {renderItem}
            </div>
        )
    }
};


let mapStateToProps = (state,props)=>{
	//根据uid,获取videoObj,userObj对象
	let videoUid       = props.uid || "",
		full           = props.full || false, 
		{role,mid,uid,pollingSetting,mode} = state.meetInfo,
		{customPolling,isPolling} = pollingSetting,
		{userList}     = state.userInfo || [],
		{
			openShareMem,
			virtualCamera,
			hideVideoArr,
			hideAudioArr,
			doubleScreen,
			selfCheck:{checkExtensionScreen}
		} = state.setInfo || {},
		{fullScreen}   = state.popupInfo,
		videoObj       = getOne(videoUid,virtualCamera,'userId'),
		userObj        = getOne(videoUid,userList,'uid'),
		videoIsOpen    = hideVideoArr.indexOf(videoUid) === -1 ? true: false,
		audioIsOpen    = hideAudioArr.indexOf(videoUid) === -1 ? true: false,
		polling = false;
	
	if( role === "MAIN" && customPolling ){
		polling = true;
	}else if( isPolling && customPolling ){
		polling = true;
	}
	
	//如果当前是放大的画面-这非放大画面没有videoObj对象
	if( fullScreen === videoUid && !full ){
		videoObj = "";
//		if( role === "WATCH" ){
//			videoUid = null;
//		}
	}
	
	//判断是否有权限双屏（轮询时没有双屏功能）
	/**
	 * 发送流 : 有扩展屏即可 
	 * 接收流 : 有扩展屏且开启了共享内存
	 */
	checkExtensionScreen = uid === videoUid || (uid !== videoUid && openShareMem)?checkExtensionScreen:'error';
	
	return {
		mode,          // 视屏模式还是白板模式
		full,          //是否用于全屏显示
		videoUid,      //当前显示video对应的userid
		mid,           //主讲人的userid
		uid,           //当前用户的userid
		role,          //当前的角色
		fullScreen,    //要全屏的video的userid(处理要全屏的小画面,不接受video,给大画面送video)
		videoObj,      //选中的video对象
		userObj,       //选中的user对象
		videoIsOpen,   //当前设备中 video是否显示
		audioIsOpen,   //当前设备中audio是否显示
		doubleScreen,  //双屏显示对应的userId
		polling,        //当前是否在轮巡中
		extensionScreen : checkExtensionScreen==="success" && role !=='watch', //是否有扩展屏(观摩没有扩展屏功能)
	}
};

let mapDispatchToProps = {
    switchFullScreen,            //单个画面最大化
    toggleSpeaker,
    toggleAudio,
    toggleVideo,
    toggleDobuleScreen,
    watchFullScreen
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VideoItem);


/**
 * 数组循环
 */
function getOne(value, list, tag) {
    let arr = (list || []).filter(item => {
        if (!item[tag]) {
            return false;
        }
        return item[tag] === value;
    }),
        result = "";

    if (arr.length > 0) {
        result = arr[0];
    }
    return result;
}
