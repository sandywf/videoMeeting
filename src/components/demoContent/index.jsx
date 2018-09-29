/**
 *  演示功能模块
 */

import React, { Component } from 'react';
import Less from './index.less';
import { connect } from 'react-redux';
import * as cn from 'classnames';
import VideoPlayer from '@/components/videoPlayer/codyy';
import Video from '@/components/tag/video';
import {setPlayState,setPlayTime} from '@/store/settings/action';
import {toggleMainFull} from '@/store/meet/action';

export class DemoContent extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			full : false
		};
	}
	
	componentDidMount(){
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		let { padDomContent } = this.refs;
		let { padDom } = this.props;
		if (padDomContent && padDom) {
			padDomContent.appendChild( padDom );
			let {pad, mode} = this.props;
			if(pad) {
				pad.calcSize(mode);
			}
		}
	}

    //主画面是否全屏显示
    toggleMainFull(){
    	let {toggleMainFull,mainFull} = this.props;
    	toggleMainFull(!mainFull);
    }


    render() {
    	let {shareDesk,shareVideo,meetCamera,uid,mode,
    		setPlayState,setPlayTime,shareVideoDuration,mainFull,
    		shareVideoCurrentTime,shareVideoPlay} = this.props,
    	    demoType = 'pad',
    	    modeTitle = "演示";
    	
    	let fullIcon = null;
    	if( mode==='video' ){
    		let mainScreenCn = cn(
    			Less['full-screen'],
    			'iconfont',
    			{true:"icon-exit-fullscreen",false:'icon-area-fullscreen'}[mainFull]
    		);
    		let mainScreenTitle = mainFull?'退出全屏显示':'全屏显示';
    		fullIcon = <i title={mainScreenTitle} className={mainScreenCn} onClick={this.toggleMainFull.bind(this)}></i>
    	}
    	    
	    
	    let content = (<div ref='padDomContent' style={{width:"100%",height:"100%"}}></div>);

	    if( shareVideo ){
	    	demoType = 'shareVideo';
	    	let playParams = {
				width           : '100%',            //播放器宽高
				height          : mode==="pad"?"100%":"calc( 100% - 45px )",
				hasControl      : shareVideo===uid,  //是否显示控制器
				hasAudio        : false,             //是否显示音量控制和进度条
			}
	    	let onEvent = {
	    		//默认开启状态
	    		isPlay : shareVideo===uid?shareVideoPlay:true,
	    		//屏幕是否全屏
	    		full        : this.state.full,
	    		//总时间
	    		duration    : shareVideoDuration,
	    		//当前长度
	    		currentTime : shareVideoCurrentTime,
	    		//开始暂停操作
	    		togglePlay  : ()=>{
	    			setPlayState(!shareVideoPlay);
	    		},
	    		//设置当前事件控制
				setTimeValue : (time)=>{
					setPlayTime(time);
				},
				//切换大小屏幕
				toggleFull : ()=>{
					this.setState({
						full : !this.state.full
					})
				}
	    	}
	    	modeTitle = "共享视频";
	    	content = (
	    		<VideoPlayer small={mode === 'pad'?true:false} params={playParams} {...onEvent} onDoubleClick = {onEvent.toggleFull.bind(this)}>
	    			<Video videoObj ={meetCamera} vid={shareVideo} type="共享视频"/>
	    		</VideoPlayer>
	    	);
	    }else if(shareDesk && shareDesk !== uid ){
	    	demoType = 'shareDesk';
	    	let playParams = {
				width           : '100%',            //播放器宽高 白板或者演示视频的时候减去菜单按钮的高度
				height          : mode==="pad"?"100%":"calc( 100% - 45px )",
				hasControl      : false,  //是否显示控制器
			}
	    	let onEvent = {
	    		//默认开启状态
	    		isPlay : true,
	    		//屏幕是否全屏
	    		full : this.state.full,
				//切换大小屏幕
				toggleFull : ()=>{
					this.setState({
						full : !this.state.full
					})
				}
	    	}
	    	modeTitle = "共享桌面";
	    	content = (
	    		<VideoPlayer params={playParams} {...onEvent} onDoubleClick = {onEvent.toggleFull.bind(this)}>
	    			<Video videoObj ={meetCamera} vid={shareDesk} type="共享桌面" />
	    		</VideoPlayer>
	    	);
		}
	    
	    //是否有头部
	    let headTpl = null;
	    if( mode === 'video' && demoType !== 'pad' ){
	    	headTpl =(<div className={Less.header}><span className={Less.mode}>{modeTitle}</span></div>);
	    }
		
		
    	let demoCn = cn(
    		Less['demo-content'],
    		Less[mode]
    	);
		
		
		return (
			<div className={demoCn}>
				{fullIcon}
				{headTpl}
				{content}
			</div>
		)
	}
};


let mapStateToProps = state => ({
	padDom: state.padInfo.padDom,
	mode: state.meetInfo.mode,
	pad: state.padInfo.pad,
	uid           : state.meetInfo.uid,             //当前用户id
	shareDesk     : state.meetInfo.shareDesk,       //共享桌面
	shareVideo    : state.meetInfo.shareVideo,      //共享视频
	meetCamera    : state.setInfo.meetCamera,       //视频会议摄像头
	//共享视频下
	shareVideoDuration    : state.setInfo.shareVideoDuration,       //视频当前长度
	shareVideoCurrentTime : state.setInfo.shareVideoCurrentTime,    //视频总长度
	shareVideoPlay        : state.setInfo.shareVideoPlay,           //视频是否播发
	
	resizeTime    : state.meetInfo.resizeTime,                       //主显示区，宽高发生改变时候触发
	mainFull      : state.meetInfo.hideRight,                        //主显示区是否全屏
	
});

let mapDispatchToProps = {
	setPlayState,
	setPlayTime,
	toggleMainFull
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoContent);

