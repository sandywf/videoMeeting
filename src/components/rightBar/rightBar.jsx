/**
 * 页面右侧菜单
 */
import React, { Component } from 'react';
import Module from '../module/module';
import style from './rightBar.less';
import { connect } from 'react-redux';
import UserContent from '../userModule/userContent';
import Message from '../message/message';
import * as cn from 'classnames';
import VideoContent from '@/components/videoContent/videoContent';
import DemoContent from '@/components//demoContent';

export class SideBar extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			full : false
		};
	}

    onChangeMsg = isFull => {
        this.changeState(isFull)
    }

    changeState = isFull => {
	    this.setState({full : isFull})
    }

    render() {
    	let { hideRight, shareDesk, shareVideo, uid, mode, role } = this.props,
    	    rightCn = cn(
	    		style['right-bar'],
	    		{[style['close']]:hideRight}
	    	);

		let moduleTitle = '演示';
		if( mode === 'video' ){
			moduleTitle = '视频';
		}else if( shareVideo ){
	    	moduleTitle = "共享视频";
	    }else if(shareDesk && shareDesk !== uid ){
	    	moduleTitle = "共享桌面";
		}else{
			moduleTitle = '演示';
		}

		return (
			<div className={rightCn}>
				<div className={style['right-content']} style={{ backgroundColor: "#333" }}>
					<Module title={moduleTitle} type={mode}>
						{mode === 'pad'?<DemoContent/>:<VideoContent/>}
					</Module>

					<Module title={'用户'} type={'user'}>
						<UserContent />
					</Module>

                    {/*当前用户不是观摩者 才可以有笔记*/}
                    {role !== 'WATCH' && <Module title={'笔记'} type={'note'} /> }

					<Module title={'聊天'} type={'message'} onChange={this.onChangeMsg}>
						<Message msgStyle={this.state.full ? { display: "none" } : null}/>
					</Module>
				</div>
			</div>
		)
	}
};


let mapStateToProps = state => ({
	mode          : state.meetInfo.mode,
	role          : state.meetInfo.role,            // 当前进入者的身份
	uid           : state.meetInfo.uid,             // 当前用户id
	hideRight     : state.meetInfo.hideRight,       // 是否显示
	shareDesk     : state.meetInfo.shareDesk,       // 共享桌面
	shareVideo    : state.meetInfo.shareVideo,      // 共享视频
});

let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
