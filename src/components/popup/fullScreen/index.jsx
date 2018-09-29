//全屏弹框
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { switchFullScreen } from '@/utils/tool';
import VideoItem from "@/components/videoItem/videoItem";
class FullScreen extends Component {
	constructor(props){
		super(props);
		this.state = {
			video : null
		}
	}
	
	//视频最大化，最小化
	componentDidMount(){
		this.switchFullScreen(true);
	}
	
	//取消挂载
	componentWillUnmount(){
		this.switchFullScreen(false);
	}
	
	//是否全屏
	switchFullScreen(tag){
		let { isLockScreen } = this.props;
		//如果在锁定状态--及全屏状态下，无法取消全屏功能
		if( !tag && isLockScreen ){
			return;
		}
		switchFullScreen(tag);
	}
	
	render() {
		let {props} = this,
			{fullScreen,modal} = props;

		if( !modal.visible ){
			//取消全屏
			this.switchFullScreen(false);
		}
		
		return (
			<VideoItem size={{width:"100%",height:"100%"}} uid = {fullScreen} full={true}/>
		);
	}
}

let mapStateToProps = state => ({
	fullScreen   : state.popupInfo.fullScreen,    //是否允许全屏的弹框
	isLockScreen : state.setInfo.isLockScreen     //是否是锁定状态
});

let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreen);