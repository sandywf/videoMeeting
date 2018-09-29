//用于测试编写的公共模块

import React, { Component } from 'react';


//视频配置相关
import VideoPlayer           from '@/components/videoPlayer';

//视频会议样式控制
const playParams = {
	width           : '100%',   //播放器宽高
	videoSrc        : 'http://www.170mv.com/tool/jiexi/ajax/pid/13113/vid/3220463.mp4',       //视频链接
	height          : '100%',   
	hasControl      : true,     //是否显示控制器
	hasTime         : true,     //是否显示时间和进度条
	hasTimeProgress : true,     //是否显示进度条
	useTime         : true,     //能否拖动进度条
	hasAudio        : true,     //是否显示音量控制和进度条
	hasAudioProgress: true,     //是否显示音量进度条
	useAudio        : true,     //能否对音频进行控制
	hasFull         : true,     //是否显示全屏显示
}

const controlParams = {
	isPlay : true,          //是否开始录制
	togglePlay : ()=>{     //控制器
		controlParams.isPlay = !controlParams.isPlay;
	}
};


export default class Example extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			isPlay : false,          //是否开始录制
		}
	}
	
	//开始暂停
	togglePlay(){
		this.setState({
			isPlay : !this.state.isPlay
		});
	}
	
	
    render() {
		let {type} = this.props.match.params,tpl = null,title="";
		
		if( type === 'video' ){
			let params = {
				isPlay : this.state.isPlay,
				togglePlay : this.togglePlay.bind(this)
			}
			title = "视频播放器";
			tpl = (
				<VideoPlayer params={playParams} {...params} />
			);
		}
		
		return (
			<div>
				<h1>测试组件模块---{title}</h1>
				<div style={{width:'640px',height:'360px'}}>{tpl}</div>
			</div>
		);
    }
}