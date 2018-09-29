//codyy项目特殊视频播放器
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { switchFullScreen } from "@/utils/tool"; 
import * as cn from 'classnames';
import Less from './index.less';

//基础配置项
const defaultParams = {
	width           : '100%',   //播放器宽高
	videoSrc        : '',       //视频链接
	height          : '100%',   
	hasControl      : true,     //是否显示控制器
	hasPlayBtn      : true,     //是否显示开始结束按钮
	hasTime         : true,     //是否显示时间和进度条
	hasTimeProgress : true,     //是否显示进度条
	useTime         : true,     //能否拖动进度条
	hasAudio        : true,     //是否显示音量控制和进度条
	hasAudioProgress: true,     //是否显示音量进度条
	useAudio        : true,     //能否对音频进行控制
	hasFull         : true,     //是否显示全屏显示
};



const handleTime = (time)=>{
	let second = Math.round(time),
		hh=Math.floor(second/3600),
    mm=Math.floor(second%3600/60),
    ss=second%60,
		str = "";
		
	if( hh>0 ){
		if(hh < 10){
			str += "0";
		}
		str += hh + ":";
	}
	
	if (mm < 10) str += '0'; 
	str += mm + ":";
	if (ss < 10) str += '0'; 
	str += ss;
	
	return str;
}

//对应的控制类方法
class VideoPlayer extends Component {
	
	static defaultProps={
		//触发事件
		togglePlay  : "",     //切换录制状态
		toggleMuted : "",     //切换禁音
		toggleFull  : "",     //切换全屏
		
		//监听事件
		changePlay  : "",
		changeFull  : "",
		changeVolume : "",
		setTimeValue : "",
		
	};
	
	constructor(props){
		super(props);
		this.state = {
			isPlay      : props.isPlay || false,   //是否播放
			full        : props.full   || false,   //是否是全屏
			duration    : props.duration || 0,     //总时间
			currentTime : props.currentTime || 0,  //当前的时间点
		};
		
		this.hasAddEvent = false;   //video事件是否添加了
		this.togglePlay  = this.togglePlay.bind(this);        //播放暂停方法
		this.toggleFull  = this.toggleFull.bind(this);        //切换全屏
		this.setCurrentTimeValue = this.setCurrentTimeValue.bind(this); //当前时间控制
	}

	componentDidMount(){
		this.componentDidUpdate();
	}
	
	componentWillReceiveProps(nextProps){
		let {videoDom} = this.refs,
			{props} = this,
			{children} = props;
		
		if(!videoDom && children && "videoObj" in children.props && children.props.videoObj.videoDom){
			videoDom = children.props.videoObj.videoDom;
		}
			
		//更新props
		Object.keys(this.state).forEach(item=>{
			if( item in nextProps && props[item] !== nextProps[item] ){
				this.setState({[item]:nextProps[item]});
			}
		});
	}
	
	componentDidUpdate(prevProps,prevState={}){
		let {props,state} = this,
			{videoDom} = this.refs,
			{changePlay,changeFull,children,isLockScreen} = props;
		
		if(!videoDom && children && "videoObj" in children.props && children.props.videoObj.videoDom){
			videoDom = children.props.videoObj.videoDom;
		}
		
		if( videoDom ){
			//判断当前的值，是否改变，如果改变则修改video的状态
			Object.keys(state).forEach(item=>{
				if( !prevState || prevState[item] !== state[item] ){
					switch( item ){
						//是否播放
						case 'isPlay' : 
							if( state.isPlay ){
								if( videoDom.readyState === 4 ){
									videoDom.play();
								}
							}else{
								videoDom.load();
								setTimeout(function() {
								  videoDom.pause();
								}, 0);
							}
							if( changePlay &&  typeof changePlay === 'function' ){
								changePlay(state.isPlay,videoDom);
							}
							break;
						//是否全屏
						case 'full'   : 
							if( !(!state.full && isLockScreen) ){
								switchFullScreen(state.full);
							}
							if( changeFull &&  typeof changeFull === 'function' ){
								changeFull(state.full,videoDom);
							}
							break;
						default:break;
					}
				}
			});
		}
	}
	
	
	//开始暂停视频
	togglePlay(){
		let {togglePlay} = this.props;
		//判断外层是否有播放控制
		if( togglePlay && typeof togglePlay === "function" ){
			togglePlay();
		}else{
			//判断是否是内部事件触发
			this.setState({
				isPlay:!this.state.isPlay
			});
		}
	}
	
	
	//切换全屏
	toggleFull(){
		let {toggleFull} = this.props;
		//判断外层是否有播放控制
		if( toggleFull && typeof toggleFull === "function" ){
			toggleFull();
		}else{
			//判断是否是内部事件触发
			this.setState({
				full:!this.state.full
			});
		}
	}
	
	//修改当前的时间
	setCurrentTimeValue(e){
		let {setTimeValue,children} = this.props,
			{duration} = this.state,
			{videoDom,timeRangeLabel,timeRangeBar} = this.refs;
		
		if( !videoDom && children && "videoObj" in children.props && children.props.videoObj.videoDom){
			videoDom = children.props.videoObj.videoDom;
		}
			
		let	{currentTime} = videoDom,
			targetValue = duration*(e.target.value/100);
			
			currentTime = currentTime.toFixed(3);
			targetValue = targetValue.toFixed(3);
		//获取当前事件
		if( currentTime === targetValue ) return;
		
		if( setTimeValue && typeof setTimeValue === "function" ){
			setTimeValue(targetValue,videoDom);
		}
		
		//判断是否是内部事件触发
		videoDom.currentTime = targetValue;
		//样式修改
		let tag = ((targetValue/duration)*100).toFixed(5)+"%";
		timeRangeLabel.style.left = tag;
		timeRangeBar.style.background = 'linear-gradient(to right,#059CFA 0%, #059CFA '+tag+',#bdbec2 '+tag+', #bdbec2 100%)';
		
	}
	

	
	
	//控制器模板
	controlTpl(){
		let {
			hasControl,
			hasPlayBtn,
			hasTime,
			hasTimeProgress,
			useTime,
			hasAudio,
			hasAudioProgress,
			useAudio,
			hasFull
		} = {...defaultParams,...this.props.params},
		{ isPlay,full,currentTime,duration } = this.state,
		tpl = [];
		
		//是否用控制器
		if( !hasControl || duration === 0 ){
			return null;
		}
		
		//是否显示开始结束按钮
		if(hasPlayBtn){
			let cns = cn({true:'icon-record-pause',false:'icon-play'}[isPlay]);
			tpl.push(
				<div key="playBtn" className={cn(Less['play-btn'])}>
					<i className={cns}  onClick={this.togglePlay}></i>
				</div>
			);
		}
		
		//是否显示时间和进度条
		if( hasTime  ){
			let tag =  duration===0?0:parseFloat(currentTime/duration).toFixed(3);
			let rate = tag*100+"%";
			//显示进度
			let barStyle={
				background : 'linear-gradient(to right,#059CFA 0%, #059CFA '+rate+',#bdbec2 '+rate+', #bdbec2 100%)'
			}
			let btnStyle = {
				left : rate
			}
			tpl.push(
				<div key="playTime" className={cn(Less['play-time'])}>
					<i className={cn(Less['play-time-show'])}>{handleTime(currentTime)+"/"+handleTime(duration)}</i>
					{hasTimeProgress?(
						<div className={cn(Less['progress'])}>
							{useTime?<input className={Less['progress-range']} type="range" onInput={event=>this.setCurrentTimeValue(event)}/>:null}							
							<div ref="timeRangeBar" className={cn(Less['progress-bar'])} style={barStyle}>
								<label ref="timeRangeLabel" className={cn(Less['progress-btn'])} style={btnStyle}></label>
							</div>
						</div>
					):null}
				</div>
			);
		}
		
		//是否可以全屏
		if( hasFull ){
			let fullCn = cn({true:"icon-exit-fullscreen",false:'icon-area-fullscreen'}[full]);
			tpl.push(
				<div key="playFull" className={cn(Less['play-full'])}>
					<i className={fullCn}  onClick={this.toggleFull}></i>
				</div>
			);
		}
		
		return (
			<div className={cn(Less['play-controls'],'iconfont')}>
				{tpl}
			</div>
		);
	}
	
	
	
  render() {
		let {params,children,onDoubleClick,small} = this.props,
			{width,height,videoSrc} ={...defaultParams,...params},
			{full} = this.state;
		
		let playCn = cn(
			Less['video-player'],
			{ [Less['full-screen']]  : full},
			{ [Less['small-screen']] : !full && small }
		);
		
		
		return (
			<div style={{width,height}} className={playCn} onDoubleClick={onDoubleClick}>
				{children?children:<video className={Less['video-dom']} ref='videoDom' src={videoSrc}></video>}
				{this.controlTpl()}
			</div>
		);
  }
}

let mapStateToProps = state => ({
	isLockScreen : state.setInfo.isLockScreen     //是否是锁定状态
});

let mapDispatchToProps = {}

export default connect(mapStateToProps,mapDispatchToProps)(VideoPlayer);
