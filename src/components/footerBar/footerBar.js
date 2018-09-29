/**
 * 底部控制菜单
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './footer.less';
import classNames from "classnames";
import { videoLayoutSetting, shareDoc } from '@/store/popup/action';
import { setShare,startRecord,switchMode } from '@/store/meet/action';
import { requireSpeaker } from '@/store/user/action';
import { connect } from 'react-redux';
import {Switch} from '@/components/tag';



export class FooterBar extends Component {
    static propTypes = {
        role: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
    }

    constructor(props){
        super(props);
        this.state={
            showFooter: true
        }
    }
    
    componentWillReceiveProps(nextProps){
    	//根据大画面-重新设置小画面
		let {meetingMode,mainFull} = nextProps;
		let oldMode = this.props.meetingMode;
		let oldFull = this.props.mainFull;
		//切换成演示模式的时候-默认隐藏底部
		if( meetingMode !== oldMode && meetingMode === "video" ){
			this.setState({
				showFooter: false
			});
		}
		//切换成全屏的时候-默认隐藏底部
		if( oldFull !== mainFull && mainFull === true ){
			this.setState({
				showFooter: false
			});
		}
    }
    

    toggleFooter(){
        this.setState({
            showFooter: !this.state.showFooter
        })
    }

    // 分两个维度来管理显示操作按钮  用户角色  会议状态
    // 根据2个维度确定组合类型

    startRecord() {
        let {status, startRecord} = this.props;
        if(status === 'INIT') {
            startRecord();
        }
    }
    
    //切换模式
    switchMeetingMode(){
    	let {meetingMode,switchMode} = this.props;
		switchMode( meetingMode==="video"?"pad":"video" );
    }


	//视频布局
    showVideoLayoutSetting() {
        this.props.videoLayoutSetting(true)
    }

	//共享文档
    shareDoc() {
        this.props.shareDoc(true)
    }
    
    
    //共享桌面
    setShareDesk(){
    	let {setShare,uid,shareDesk} = this.props;
    	setShare({
    		userId : uid, 
    		type   : "desk",
    		status : uid === shareDesk?false:true
    	});
    }
    
    //共享视频
    setShareVideo(){
    	let {setShare,uid,shareVideo} = this.props;
    	setShare({
    		userId : uid, 
    		type   : "video",
    		status : uid === shareVideo?false:true
    	});
    }
    
    //申请或关闭发言人
    requireSpeaker(){
    	this.props.requireSpeaker();
    }


    render() {
        // 角色信息和会议状态只控制显示   是否可操作根据具体情况  控制
        let { role, status, speakerList, uid,shareVideo,shareDesk,meetingMode } = this.props;
        let isSpeaker = speakerList.includes(uid);
        let switchClass = this.state.showFooter ? '' : 'hidden-status';
        return (
            <React.Fragment>
            <div className={classNames(style.footerBar, style[switchClass])} >
            <div className={style['footer-content']}>
                <ul>
                    {
                        role === 'MAIN' && status === 'INIT' ? (
                            <li className={style['start-video']} onClick={this.startRecord.bind(this)}>
                                <span className={style.icon} />
                                <span className={style.text}>开始直播</span>
                            </li>
                        ) : null
                    }

                    {
                        role === 'JOIN' ? (
                            isSpeaker ? (
                                <React.Fragment>
                                    <li className={style['apply-share-desktop']} onClick={this.setShareDesk.bind(this)}>
                                        <span className={style.icon} />
                                        <span className={style.text}>{shareDesk===uid?'取消共享桌面':'申请共享桌面'}</span>
                                    </li>
                                    <li className={style['apply-share-video']} onClick={this.setShareVideo.bind(this)}>
                                        <span className={style.icon} />
                                        <span className={style.text}>{shareVideo===uid?'取消共享视频':'申请共享视频'}</span>
                                    </li>
                                </React.Fragment>
                            ) : null
                        ) : null
                    }

                    {
                        (role === 'JOIN' || role === 'GUEST') && isSpeaker ? (
                            <li className={style['cancel-speaker']} onClick={this.requireSpeaker.bind(this)}>
                                <span className={style.icon} />
                                <span className={style.text}>取消发言</span>
                            </li>
                        ) : null
                    }

                    {
                        (role === 'JOIN' || role === 'GUEST') && !isSpeaker ? (
                            <li className={style['apply-speaker']} onClick={this.requireSpeaker.bind(this)}>
                                <span className={style.icon} />
                                <span className={style.text}>申请发言</span>
                            </li>
                        ) : null
                    }


                    {/* 所有人都有 */}
                    <li title={{'video':'切换到视频模式','pad':'切换到演示模式'}[meetingMode]} className={{'video':style.switchVideoMode,'pad':style.switchPadMode}[meetingMode]} onClick={this.switchMeetingMode.bind(this)}>
                        <span className={style.icon} />
                        <span className={style.text}>切换模式</span>
                    </li>

                    {
                        role === 'MAIN' ? (
                            <li className={style.videoLayout} onClick={this.showVideoLayoutSetting.bind(this)}>
                                <span className={style.icon} />
                                <span className={style.text}>视频布局</span>
                            </li>
                        ) : null
                    }

                    {
                        role === 'MAIN' && status === 'PROGRESS' ? (
                            <React.Fragment>
                                <li className={style['share-desktop']}  onClick={this.setShareDesk.bind(this)}>
                                    <span className={style.icon} />
                                    <span className={style.text}>{shareDesk===uid?'取消共享桌面':'共享桌面'}</span>
                                </li>

                                <li className={style.shareVideo}  onClick={this.setShareVideo.bind(this)}>
                                    <span className={style.icon} />
                                    <span className={style.text}>{shareVideo===uid?'取消共享视频':'共享视频'}</span>
                                </li>
                            </React.Fragment>
                        ) : null
                    }

                    <li className={style.shareDoc} onClick={this.shareDoc.bind(this)}>
                        <span className={style.icon} />
                        <span className={style.text}>共享文档</span>
                    </li>
                </ul>
                <i title="隐藏工具栏" className={classNames('iconfont', 'icon-viewoff', style.hidden)} onClick={this.toggleFooter.bind(this)} />
            </div>
            </div>
            <Switch title="显示工具栏"  className={classNames(style.switch, style.footer, style.open)} onClick={this.toggleFooter.bind(this)} status={!this.state.toggleFooter?1:0}/>
          </React.Fragment>
            
        )
    }
};

let mapStateToProps = state => ({
    role        : state.meetInfo.role,              //权限
    speakerList : state.meetInfo.speakerList,       //发言人列表
    uid         : state.meetInfo.uid,               //当前用户的id
    status      : state.meetInfo.meetObj.status,    //会议状态
    shareDesk   : state.meetInfo.shareDesk,         //共享桌面
    shareVideo  : state.meetInfo.shareVideo,        //共享视频
    meetingMode : state.meetInfo.mode,              //会议模式 video：视频模式 pad：演示模式
    mainFull    : state.meetInfo.hideRight,         //主显示区是否全屏
});

let mapDispatchToProps = {
    videoLayoutSetting,
    startRecord,
    shareDoc,
    setShare,
    requireSpeaker,
    switchMode,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FooterBar);