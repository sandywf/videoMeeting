//挂载虚拟video
import React, { Component } from 'react';
import * as cn from "classnames";

export default class Video extends Component {
	
	componentDidMount(){
    	this.componentDidUpdate();
    }
    componentDidUpdate(){
    	let {videoObj,controls} = this.props,
    		{videoItem} = this.refs;
    	if( videoItem && videoObj ){
    		
    		if( controls ){
				videoObj.videoDom.setAttribute('controls','controls');
			}else{
				videoObj.videoDom.removeAttribute('controls');
			}
    		
    		//如果是当前弹出的是自己，并且在内部，不出发
			let firstChild = videoItem.firstChild;
			if( firstChild ){
				if( firstChild !== videoObj.videoDom ){
					videoItem.replaceChild(firstChild, videoObj.videoDom);
				}else{
					return;
				}
			}else{
				videoObj.videoDom.parentNode && videoObj.videoDom.parentNode.removeChild(videoObj.videoDom);
				videoObj.videoDom.style.width = "100%";
				videoObj.videoDom.style.height = "100%";
				videoItem.appendChild(videoObj.videoDom);
			}
			videoObj.videoDom.load();
    	}
    }
	
    render(){
    	let divStyle={
    		width  : "100%",
    		height : "calc(100% - 30px)"
    	}
    	let {videoObj,...params} = this.props;
    	
        return (
			<div ref="videoItem" style={divStyle} {...params}/>
        );
    }
}
