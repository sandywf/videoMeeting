// 头部菜单
import React, { Component } from 'react';
import style from './header.less';
import Progress from './progress';
import MoreOp from './moreOp';
import SelectScreen from './selectScreen';
import RecordOp from './recordOp';

import classNames from "classnames";
import {connect} from 'react-redux';
import {Switch} from '@/components/tag';
import {switchVideoSetting, switchLogoutPopup} from '@/store/popup/action';
import {toggleHeader, endMeeting, logoutMeeting} from '@/store/meet/action';
import {setSoundVolume, setMicrophoneSound} from '@/store/settings/action';
import Prompt from './prompt';
import {Modal} from '@/components/modal';

export const videoMeetType= {
    "PREPARE_LESSON": "集体备课",
    "INTERACT_LESSON": "互动听课",
    "NET_TEACHING": "网络授课",
    "VIDEO_MEETING": "视频会议",
}

class Header extends Component {
	
	constructor(props){
		super(props);
		this.switchHeader = this.switchHeader.bind(this);            //是否隐藏head头
		this.videoSetting = this.videoSetting.bind(this);            //开始视频设置
	}
	
	//显示隐藏header
	switchHeader(){
		let {toggleHeader,hideHeader} = this.props;
		toggleHeader(!hideHeader);
	}

    //视频设置
 	videoSetting(){
 		this.props.switchVideoSetting(true);
    }

    endMeeting(){
        let {status, role, meetingType} = this.props
        if(role === 'MAIN') {
            if(status === 'INIT') {
                this.props.switchLogoutPopup(true)
            } else {
                Modal.confirm({
                    title: '提示',
                    content: `您确定要结束本次${videoMeetType[meetingType]}吗？`,
                    onSure   : ()=>{
                        this.props.endMeeting()
                    },
        
                    sureText    :"确定" || "",  //关闭的文本
                    cancelText  : '取消' || null,  //保存的文本
                })
            }    
        } else {
            Modal.confirm({
                title: '提示',
                content: `您确定要退出本次${videoMeetType[meetingType]}吗？`,
                onCancel : ()=>{
                   
                },
                onSure   : ()=>{
                    this.props.logoutMeeting();
                },
    
                sureText    :"确定" || "",  //关闭的文本
                cancelText  : '取消' || null,  //保存的文本
            })
        }
    }

    render() {

		let {selectVideoSetting,hideHeader, setMicrophoneSound, 
			setSoundVolume,meetingTitle,soundVolume,microphoneSound,bigScreen, role} = this.props;
			
		//显示隐藏header
        return (
            <div className={classNames(style.mainHeader,{[style.hide]:hideHeader})}>
                <header className={style.inner}>
                    <h4 className={style.title} title={meetingTitle}>主题：{meetingTitle}</h4>
					<Prompt/>
                    <div className={style['right-operation']}>
                        
						{/* 视频选择--如果摄像头列表小于两个的时候隐藏 */}
						<SelectScreen key="selectScreen"/>
						
						{/* 录制  -- 只有主讲人和有权限的人才用改功能 */}
						<RecordOp key="recordOp"/>

                        {/* 视频设置 */}
                        {
                            role !== "WATCH" &&
                            <div key="videoSetting" title="视频设置" className={classNames(style.operation,
                                style['video-settings'],
                                style.hover,
                                {[style.selected]:selectVideoSetting}
                            )} onClick={this.videoSetting}>
                                <i className='iconfont icon-camera'>
                                    {bigScreen===""?<i className='iconfont icon-disable' />:null}
                                </i>
                            </div>
                        }


                        {/* 音量调节 */}
                        <Progress key="earphone" onChange={setSoundVolume} value={soundVolume} type="earphone" />

                        {/* 麦克风音量调节 */}
                        {
                            role !== "WATCH" &&
                            <Progress key="microphone" onChange={setMicrophoneSound} value={microphoneSound} type="microphone" />
                        }

                        {/* 更多 operation */}
                        <MoreOp key="moreOp"/>

                        {/* 关闭 */}
                        <div key="close" onClick={this.endMeeting.bind(this)} className={classNames(style.operation, style.close,style.hover)}>
                            <i className='iconfont icon-end' />
                        </div>
                        
                    </div>
                </header>
				<Switch title={hideHeader?"显示顶部菜单":"隐藏顶部菜单"}  className={style.switch} onClick={this.switchHeader} status={hideHeader?1:0}/>
            </div>
        );
    }
}

let mapStateToProps = state=>({
	meetingTitle       : state.meetInfo.meetingTitle,            //会议主题
    meetingType        : state.meetInfo.meetObj.meetingInfo.meetType, // 会议类型
	bigScreen          : state.setInfo.bigScreen,                //大画面
	selectVideoSetting : state.popupInfo.switchVideoSetting,     //视频设置弹框
	hideHeader         : state.meetInfo.hideHeader,              //是否显示header
    status: state.meetInfo.meetObj.status,
    role: state.meetInfo.role,
	microphoneSound    : state.setInfo.microphoneSound,          //麦克风音量
	soundVolume        : state.setInfo.soundVolume,              //扬声器音量
});

let mapDispatchToProps = {
	switchVideoSetting,
    toggleHeader,
    setSoundVolume,
    setMicrophoneSound,
    endMeeting,
    logoutMeeting,
    switchLogoutPopup
}

export default connect(mapStateToProps,mapDispatchToProps)(Header);
