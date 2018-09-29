/**
 *  视屏区域
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import style from './videoContent.less'
import VideoItem from '../videoItem/videoItem';
import Video from '@/components/tag/video';
import {toggleMainFull} from '@/store/meet/action';
import * as cn from "classnames";
import videoLayoutList from './videoLayoutList'
import { Calc } from '@/utils/index'

const bigVideoSize = { width: 320, height: 180 }
const smallVideoSize = { width: 160, height: 90 }

export class VideoContent extends Component {
    static propTypes = {
        videoLayoutMode: PropTypes.string
    }

    static defaultProps = {
        modeTitle: '视频'
    }
    
    componentDidMount(){
    	this.componentDidUpdate();
    }

    componentDidUpdate(){
        let { videoContent ,wrap} = this.refs;
        let { videoLayoutMode, mode } = this.props;
        let wrapSize = Calc.calcWrapSize(videoLayoutMode, videoContent);
        let wrapSizeStyle = {
            width: wrapSize.width + 'px',
            height: wrapSize.height + 'px'
        }
        if (mode !== 'video') {
            wrap.style.width = wrapSizeStyle.width;
            wrap.style.height = wrapSizeStyle.height;
        }
    }

    smallVideoArea = (box, index) => {
        let { videoLayoutMode, speakerList } = this.props
        if (
            videoLayoutMode === 'one' ||
            videoLayoutMode === 'two' ||
            videoLayoutMode === 'threeLeftRight' ||
            videoLayoutMode === 'threeTopBottom' ||
            videoLayoutMode === 'four'
        ) {
            index < 4 && box.push(<VideoItem VideoStyleItem={bigVideoSize} key={index} uid = {speakerList[index]} />)
        }
        if (videoLayoutMode === 'sixLeft' || videoLayoutMode === 'sixRight') {
            index < 3 ?
                box.push(<VideoItem VideoStyleItem={bigVideoSize} key={index} uid = {speakerList[index]} />)
                : box.push(<VideoItem VideoStyleItem={smallVideoSize} key={index} uid = {speakerList[index]} />)
        }
        if (videoLayoutMode === 'eight' || videoLayoutMode === 'nine') {
            index === 0 ?
                box.push(<VideoItem VideoStyleItem={bigVideoSize} key={index} uid = {speakerList[index]} />)
                : box.push(<VideoItem VideoStyleItem={smallVideoSize} key={index} uid = {speakerList[index]} />)
        }
    }

    renderVideoBox() {
        let { videoLayoutMode, speakerList, mode,role,watchCamera } = this.props;
        let box = [];
        let videoListStyle = videoLayoutList[videoLayoutMode] && videoLayoutList[videoLayoutMode].length > 0 ? videoLayoutList[videoLayoutMode] : []

        videoListStyle.forEach((item, i) => {
            if (mode === 'video') {
                this.smallVideoArea(box, i)
            } else {
                box.push(<VideoItem VideoStyleItem={{position: 'absolute', ...item}} key={i} uid = {speakerList[i]} />)
            }
        })

        let newBox = box;
        if (mode === 'pad') {
            newBox = this.layoutMode(box);
        }else if( role === "WATCH" ){
        	newBox = null;
        }
        
        
        return (
            <div className={style['video-wrap']} ref="wrap" id={"mode-"+mode}>
                {newBox}
                {role==="WATCH"?<Video cn={videoLayoutMode} mode={mode} videoObj={watchCamera}></Video>:null}
            </div>
        )
    }

    // 调整顺序和盒子结构
    layoutMode(box) {
        let layoutMode = this.props.videoLayoutMode;
        let newBox = [];
        if (layoutMode === 'threeLeftRight') {
            newBox.push(box.shift())
            newBox.push(<div key={layoutMode}>{box}</div>)
        } else if (layoutMode === 'sixLeft') {
            newBox.push(box.shift())
            newBox.push(<div key={layoutMode}>{box.splice(0, 2)}</div>)
            newBox.push(box)
        } else if (layoutMode === 'sixRight') {
            newBox.push(box.shift())
            newBox.unshift(<div key={layoutMode}>{box.splice(0, 2)}</div>)
            newBox.push(box)
        } else if (layoutMode === 'eight') {
            newBox.push(box.shift())
            newBox.push(<div key={layoutMode}>{box.splice(0, 3)}</div>)
            newBox.push(box)
        } else {
            newBox = box
        }
        return newBox;
    }

    //主画面是否全屏显示
    toggleMainFull(){
    	let {toggleMainFull,mainFull} = this.props;
    	toggleMainFull(!mainFull);
    }

    render() {
    	let {mainFull, mode} = this.props,
    		mainScreenCn = cn(
    			style['full-screen'],
    			'iconfont',
    			{true:"icon-exit-fullscreen",false:'icon-area-fullscreen'}[mainFull]
    		),
    		mainScreenTitle = mainFull?'退出全屏显示':'全屏显示';
        
        return (
            <div className={cn(style['video-content'], style[mode])} ref="videoContent" id="video-cont">
                {mode === 'pad' ? <div className={style.header}>
                    <span className={style.mode}>{this.props.modeTitle}</span>
                    <i title={mainScreenTitle} className={mainScreenCn} onClick={this.toggleMainFull.bind(this)} />
                </div>: null
                }

                {this.renderVideoBox()}
            </div>
        )
    }
};


let mapStateToProps = state => {
	let {speakerList,hideRight,role,pollingSetting,mode, resizeTime} = state.meetInfo,
		{videoLayoutMode,watchCamera} = state.setInfo,
		{customPolling,pollingList,isPolling} = pollingSetting,
		polling = false;
		
	if( role === "MAIN" && customPolling ){
		polling = true;
	}else if( customPolling && isPolling ){
		polling = true;
	}
	
	speakerList = polling?pollingList:speakerList;
	
	return {
		role,
		watchCamera,              //虚拟摄像头
	    videoLayoutMode,          //布局模式
	    speakerList,              //发言人列表 
	    mainFull : hideRight,     //主显示区是否全屏
	    mode,                     //切换模式 ==> 右上角小窗口是什么(pad --> 白板, video--> 视频)
	    resizeTime
	};
};


let mapDispatchToProps = {
	toggleMainFull
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VideoContent);

