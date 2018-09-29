import React, { Component } from 'react';
import * as cn from "classnames";
import { connect } from 'react-redux';
import style from './userContent.less';
import { toggleSpeaker, toggleAudio, toggleVideo,toggleChat,toggleWhitePad, kickOut } from '@/store/user/action';
import {Modal}  from "@/components/modal";


class UserInfo extends Component{
	constructor(props){
		super(props);
		this.state = {
			isShowOp : false,     //是否弹出右侧框
            hasHover : false,     //鼠标hover事件是否触发
		}
		this.toggleOp = this.toggleOp.bind(this);
	}
	
	//是否显示菜单
	toggleOp(){
	    // hover事件触发,并且点击,第一次点击不能关闭操作按钮,即isShowOp为true,点击之后将hover事件关闭
		this.setState({
			isShowOp : this.state.hasHover ? true : !this.state.isShowOp,
            hasHover : !this.state.hasHover
		});
	}

	// 鼠标移入 显示菜单
    toggleMouseEnter = () => {
	    // 鼠标进入, 弹出操作按钮,并且hover事件触发
        this.setState({
            isShowOp : true,
            hasHover : true
        })
    }

    // 给整个li添加鼠标移出事件
    toggleMouseLeave = () => {
        this.setState({
            isShowOp : false,
            // hasHover : true
        })
    }
	
	//设置是否是发言人
    toggleSpeaker() {
        let { toggleSpeaker, user, role, mainId} = this.props;
        if (role !== "MAIN") return ;
        let { isSpeaker, uid, baseAreaId } = user;
        toggleSpeaker({
            mainId,
            uid: uid,
            type: isSpeaker ? 'N' : 'Y',
            baseAreaId
        });
    }

    //是否允许发送音频
    toggleAudio() {
        let { user, toggleAudio, role  } = this.props,
            { isPublishAudio, uid} = user;
        if (role !== "MAIN") return ;
        //找到对应的虚拟摄像头，关闭音频
        toggleAudio({
        	uid, 
        	value : !isPublishAudio,
        	type  : 'audio'
        });
    }

    //是否允许发送视频
    toggleVideo() {
        
        let { user, toggleVideo, role} = this.props,
            { isPublishVideo, uid} = user;
        if (role !== "MAIN") return ;
        //找到对应的虚拟摄像头，关闭音频
        toggleVideo({
        	uid, 
        	value : !isPublishVideo,
        	type  : 'video'
        });
    }
    
    //是否允许文本聊天
    toggleChat() {
        let { user, toggleChat, role } = this.props,
            { isCanMessage, uid } = user;
        if (role !== "MAIN") return ;
        //找到对应的虚拟摄像头，关闭音频
        toggleChat({
        	uid, 
        	value : !isCanMessage
        });
    }
    
    //是否允许白板标注
    toggleWhitePad() {
        let { user, toggleWhitePad, role  } = this.props,
            { whiteBoard, uid} = user;
        if (role !== "MAIN") return ;
        //找到对应的虚拟摄像头，关闭音频
        toggleWhitePad({
        	uid, 
        	value : !whiteBoard
        });
    }

    // 踢出用户
    kickOut(){
        let {uid, memberId, isSpeaker} = this.props.user;
        isSpeaker && this.toggleSpeaker();
        this.props.kickOut(uid, memberId)
    }
    
    
    //主讲教室弹出功能操作
    _renderOp() {
    	let { isShowOp } = this.state;
        let { user,role } = this.props;
        let { isPublishVideo, isPublishAudio, isCanMessage, isSpeaker, whiteBoard ,userType } = user;
        let domParams = [];
        
        //判断是否显示弹出层
        if( role !== 'MAIN' || !isShowOp || userType === 'MAIN' ){
        	return null;
        }
        
        //点击开关音频
        domParams.push({
        	title   : isPublishAudio?'点击关闭音频':'点击开启音频',
        	liCn    : cn(style['op-item']),
        	iCn     : cn('icon-microphone', { [style.active]: isPublishAudio }),
            onClick : this.toggleAudio.bind(this),
            isAvailable: isPublishAudio
        });
        //点击开关视频
        domParams.push({
        	title   : isPublishVideo?'点击关闭视频':'点击开启视频',
        	liCn    : cn(style['op-item']),
        	iCn     : cn('icon-camera', { [style.active]: isPublishVideo }),
            onClick : this.toggleVideo.bind(this),
            isAvailable: isPublishVideo
        });
        //点击开关文本聊天
        domParams.push({
        	title   : isCanMessage?'点击允许文本聊天':'点击禁止文本聊天',
        	liCn    : cn(style['op-item']),
        	iCn     : cn('icon-editor', { [style.active]: isCanMessage }),
            onClick : this.toggleChat.bind(this),
            isAvailable: isCanMessage
        });
        //点击开关白板功能
        domParams.push({
        	title   : whiteBoard?'点击禁止白板标注':'点击允许白板标注',
        	liCn    : cn(style['op-item']),
        	iCn     : cn('icon-callout', { [style.active]: whiteBoard }),
            onClick : this.toggleWhitePad.bind(this),
            isAvailable: true
        });
        //点击开发发言人
        domParams.push({
        	title   : isSpeaker?'点击取消发言人':'点击设为发言人',
        	liCn    : cn(style['op-item']),
        	iCn     : cn('icon-set-spokesman', { [style.active]: isSpeaker }),
            onClick : this.toggleSpeaker.bind(this),
            isAvailable: true
        });
        //点击请出会议
         domParams.push({
        	title   : '点击请出会议',
        	liCn    : cn(style['op-item']),
        	iCn     : cn('icon-out-meeting', { [style.active]: isShowOp }),
            onClick : this.kickOut.bind(this),
            isAvailable: true
        });

        return (
            <ul className={cn(style['op-list'],'iconfont')}>
                {
                	domParams.map((params,index)=>(
			        	<li key={index} title={params.title} className={params.liCn} onClick={params.onClick}>
			                <i className={params.iCn}>
                                {params.isAvailable ? null : <i className={cn(style['disable'], 'iconfont', 'icon-disable')} />}
                            </i>
			            </li>
		        	))
                }
            </ul>
        )
    }
	
	render() {
    	let { isShowOp } = this.state;
        let { user, role, meetStatus } = this.props;
        let { isPublishVideo, isPublishAudio, isCanMessage, isSpeaker, whiteBoard, isLogin, userType } = user;

        return (
            <li className={style['user-item']} onMouseLeave={this.toggleMouseLeave}>
                <span className={style.role}>{userType==='MAIN' ? '主': '辅'}</span>
                <span className={style.username} title={user.title}>{user.realName}</span>


                {
                    isLogin && meetStatus !== "INIT" ? (
                        <React.Fragment>
                            {userType !== 'MAIN' ? (
                                <ul className={style['state-list']}>
                                    {isPublishAudio || !isSpeaker ? null :
                                        (<li className={style['op-item']} onClick={this.toggleAudio.bind(this)} title={`${role==='MAIN' ? '点击开启音频': '关闭音频中'}`}>
                                            <i className={cn(style['microphone'], 'iconfont', 'icon-microphone')}>
                                                <i className={cn(style['disable'], 'iconfont', 'icon-disable')} />
                                            </i>
                                        </li>)
                                    }
                                    {isPublishVideo || !isSpeaker ? null :
                                        (<li className={style['op-item']} onClick={this.toggleVideo.bind(this)} title={`${role==='MAIN' ? '点击开启视频': '关闭视频中'}`}>
                                            <i className={cn(style['camera'], 'iconfont', 'icon-camera')}>
                                                <i className={cn(style['disable'], 'iconfont', 'icon-disable')} />
                                            </i>
                                        </li>)
                                    }
                                    {isCanMessage ? null : 
                                        (<li className={style['op-item']} onClick={this.toggleChat.bind(this)} title={`${role==='MAIN' ? '点击允许文本聊天': '禁止文本聊天'}`}>
                                            <i className={cn(style['editor'], 'iconfont', 'icon-editor')}>
                                                <i className={cn(style['disable'], 'iconfont', 'icon-disable')} />
                                            </i>
                                        </li>)
                                    }
                                    
                                    {whiteBoard ? 
                                        (<li className={cn(style['op-item'], style.active)} onClick={this.toggleWhitePad.bind(this)} title={`${role==='MAIN' ? '点击禁止白板标注': '允许白板标注'}`} >
                                            <i className={cn(style['callout'], 'iconfont', 'icon-callout')} />
                                        </li>) : null
                                    }
                                    
                                    {isSpeaker ? 
                                        (<li className={cn(style['op-item'], style.active)} onClick={this.toggleSpeaker.bind(this)} title={`${role==='MAIN' ? '点击设为发言人': '发言中'}`}>
                                            <i className={cn(style['spokesman'], 'iconfont', 'icon-set-spokesman')} />
                                        </li>) : null
                                    }
                                </ul>) : null 
                            }

                            {role === 'MAIN' && userType !== 'MAIN'?
                                (
                                    <i
                                        className={cn(style['more-op'], { [style.active]: isShowOp }, 'iconfont', 'icon-operation-button')}
                                        onClick={this.toggleOp}
                                        onMouseEnter={this.toggleMouseEnter}
                                    />
                                ) : null
                            }
                            {this._renderOp()}
                        </React.Fragment>
                    ): (role === 'MAIN' && userType !== 'MAIN'? <div className={style['op-item']} onClick={this.kickOut.bind(this)}>
                            <i className={cn(style['kickout'], style.active, 'iconfont', 'icon-out-meeting')} />
                        </div>: null)
                } 
            </li>
        )
    }
}


let mapStateToProps = (state) => ({
    role: state.meetInfo.role,
    meetStatus :state.meetInfo.meetObj.status,
    getUserObj: state.userInfo.getUserObj,
    userList: state.userInfo.userList,
    mainId: state.meetInfo.uid,
    isFirstTimes: state.meetInfo.meetObj.isFirstTimes // 是否是第一次进入会议
});

let mapDispatchToProps = {
    toggleSpeaker,
    toggleAudio,
    toggleVideo,
    toggleChat,
    toggleWhitePad,
    kickOut
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserInfo);