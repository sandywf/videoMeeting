// 更多 下拉列表
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as cn from "classnames";
import style from './header.less';
import {switchSortVideo,switchPolling, switchInvitePopup} from '@/store/popup/action';
import {toggleCustomPolling, switchAllChatting, updateMeetInfo} from "@/store/meet/action";
import {switchLockScreen} from "@/store/settings/action";
class MoreOp extends Component {
    static defaultProps = {
        role: 'JOIN'
    }

    constructor (props){
        super(props);
        this.state = {
            active   : false,  //点击事件触发的显示，隐藏
            hasHover : true,   //用户取消鼠标hover事件，方法暂时不显示下拉框，是浮动状态消失，然后隔一会儿，在添加元素，这个时候元素上的hover状态没有了
        }
        this.toggleShow = this.toggleShow.bind(this);
    }
	
	//点击触发切换
    toggleShow(){
    	let active = this.active?true:this.state.active;
    	this.active = false;
        this.setState({
            active   : !active,
            hasHover : !active
        },()=>{
        	//判断当前状态
	        if( this.state.active ){
	        	setTimeout(()=>{
	        		window.addEventListener('click',this.toggleShow)
	        	},0);
	        }else{
	        	window.removeEventListener('click',this.toggleShow)
	        }
        });
    }
	
    //开启轮巡
    switchPolling(){
    	let {switchPolling,customPolling,toggleCustomPolling} = this.props;
    	
    	if( customPolling ){
    		//关闭轮巡
    		toggleCustomPolling(false);
    	}else{
	    	switchPolling(true);
    	}
    	this.active = true;
    }

    componentWillReceiveProps(nxp) {
        const { entered, toggleCustomPolling ,customPolling} = this.props

        // 判断当前用户人数,当少于4人的时候,自动退出轮巡
        if (entered > 4 && entered !== nxp.entered && nxp.entered < 5 && customPolling) {
            toggleCustomPolling(false);
        }
    }
    
    onMouseEnter(){
    	this.setState({
	        hasHover : true
	    });
    }
    
    //画面次序
    changeVideoSortBy() {
       this.props.switchSortVideo(true);
       this.active = true;
    }

	//邀请来宾，观摩
    switchInvitePopup (type) {
        this.props.switchInvitePopup(true, type);
        this.active = true;
    }
	
	//切换锁屏
    switchLockScreen(){
        this.props.switchLockScreen(!this.props.isLockScreen);
        this.active = true;
    }

    // 禁止所有人聊天
    switchAllChatting(){
        this.props.switchAllChatting( {forbid: !this.props.canChatting});
    }

    // 添加用户
    addUser(){
        let {local, meetId, updateMeetInfo} = this.props;
        let url =  `${local}/videoMeeting/toeditnotlogin.html?meetingId=${meetId}&flag=edit&channel=inside&baseAreaId=currentBaseAreaId`;
        let winObj = window.open(url, window);

        var loop = setInterval(function() {   
            if(winObj.closed) {  
                clearInterval(loop);  
                updateMeetInfo();
            }  
        }, 1000); 
      
        // window.addEventListener('message', (e)=>{
        //     if(e.data === 'update') {
        //        
        //     }
        // })

        this.active = true;
    }

    _renderList() {
    	let { status, customPolling, isLockScreen, canChatting, meetingType } = this.props;

        return (
            <ul className={cn(style['drop-ul'],{[style['drop-ul-show']]:this.state.active})}>
            	{
            		status==="PROGRESS"?(
            			<React.Fragment>
	            			<li onClick={this.changeVideoSortBy.bind(this)}><span>调整画面次序</span></li>

                            {
                                // 文档9.3,只有视频会议才有轮巡的功能
                                meetingType === 'VIDEO_MEETING' &&
                                <li onClick={this.switchPolling.bind(this)}><span>{customPolling?'关闭轮巡':'开启轮巡'}</span></li>
                            }

                            {/* 注释掉的功能皆为第四期功能,本期不做,故隐藏掉 */}
			                {/*<li><span>禁止发言</span></li>*/}

			                <li onClick={this.switchAllChatting.bind(this)}><span>{canChatting ? '禁止聊天' : '取消禁止聊天'} </span></li>
			
			                {/*<li><span>发起点名</span></li>*/}
			                {/*<li><span>互动调查</span></li>*/}
			                {/*<li><span>随堂测验</span></li>*/}

			                <li onClick={this.switchLockScreen.bind(this)}><span>{ isLockScreen ? '解锁' : '锁屏'}</span></li>
		                </React.Fragment>
            		):null
            	}

                {
                    // 文档9.3,只有视频会议才有添加用户的功能
                    meetingType === 'VIDEO_MEETING' &&
                    <li onClick={this.addUser.bind(this)}><span>添加用户</span></li>
                }
                <li onClick={this.switchInvitePopup.bind(this, 'guest')}><span>邀请来宾</span></li>
                <li  onClick={this.switchInvitePopup.bind(this, 'watch')}><span>邀请观摩</span></li>
            </ul>
        )
    }
    
    render() {
        let {active,hasHover} = this.state;
        let {role,shareVideo,shareDesk} = this.props;
        let opList = this._renderList();
        let styleClass = cn(
        	style.operation, 
        	style['more-operation'],
        	style['drop-down'],
        	{[style['hover']]:!active && hasHover },
        	{[style['selected']]:active },
        	{[style['no-event']]: shareVideo || shareDesk}
        );
        
        if( role !== "MAIN" ){
        	return null;
        }
        
        return (
            <div className={styleClass}  onClick={this.toggleShow}  onMouseEnter={this.onMouseEnter.bind(this)}>
                <div>
                    <span className={style.title}>更多</span>
                    <i className='iconfont icon-arrow-down-green' />
                </div>
                {opList}
            </div>
        )
    }
}

let  mapStateToProps = (state)=>({
	role            : state.meetInfo.role,                         //当前用户的角色
	status          : state.meetInfo.meetObj.status,               //会议的状态
    customPolling   : state.meetInfo.pollingSetting.customPolling, //是否在轮询中
    isLockScreen    : state.setInfo.isLockScreen,                  //是否在锁屏中
    local           : state.meetInfo.meetObj.hostConfig.local,     //
    meetingType     : state.meetInfo.meetObj.meetingInfo.meetType, // 会议类型
    meetId          : state.meetInfo.meetId,                       //会议id
    canChatting     : state.meetInfo.canChatting,                  //是否禁止聊天
    shareVideo      : state.meetInfo.shareVideo,                   //共享视频的uid
    shareDesk       : state.meetInfo.shareDesk,                    //共享桌面的uid
    entered         : state.userInfo.entered,                      // 当前在线人数,用于判断是否要关闭轮巡
});

let mapDispatchToProps = {
    switchSortVideo,
    switchPolling,
    toggleCustomPolling,
    switchInvitePopup,
    switchLockScreen,
    switchAllChatting,
    updateMeetInfo
}


export default connect(mapStateToProps,mapDispatchToProps)(MoreOp);
