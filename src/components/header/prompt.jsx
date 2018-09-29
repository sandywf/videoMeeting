//头部部分 提示部分，按不同的状态，显示不同的内容
import React, { Component } from 'react';
import Less from './header.less';
import * as cn from "classnames";
import {connect} from 'react-redux';
import {
	switchShare,
	toggleCustomPolling,
	toggleBoardPolling,
	handlePollingData
} from "@/store/meet/action";
import {toggleRecord, toggleRecordOver, switchLockScreen} from "@/store/settings/action";
import {transTime} from "@/utils/time";


class Prompt extends Component {
	
	constructor(props){
		super(props);
		
		this.closeShareDesk  = this.closeShareDesk.bind(this);   //结束共享桌面
		this.closeShareVideo = this.closeShareVideo.bind(this);  //结束共享视频
		this.toggleRecord    = this.toggleRecord.bind(this);     //停止录制
		this.toggleRecordOver = this.toggleRecordOver.bind(this); //暂停录制
		this.toggleBoardPolling  = this.toggleBoardPolling.bind(this); //切换广播轮巡
		this.toggleCustomPolling = this.toggleCustomPolling.bind(this); //取消轮巡
		this.handlePollingData = this.handlePollingData.bind(this);     //下一次轮巡
		this.switchLockScreen = this.switchLockScreen.bind(this);
	}
	
	
	
	//结束共享桌面
	closeShareDesk(){
		this.props.switchShare({userId:false,type:'desk'});
	}
	
	//结束共享视频
	closeShareVideo(){
		this.props.switchShare({userId:false,type:'video'});
	}
	
	//停止录制
	toggleRecord(){
		this.props.toggleRecord('stop');
	}
	
	//暂停录制
	toggleRecordOver(){
		let {toggleRecordOver,recordStatus} = this.props;
		toggleRecordOver(recordStatus==='run'?'pause':'run');
	}
	
	//是否进行广播轮巡
	toggleBoardPolling(){
		let {toggleBoardPolling,isPolling} = this.props;
		toggleBoardPolling(!isPolling);
	}
	
	//下一次轮巡
	handlePollingData(){
		let {handlePollingData,currentPage} = this.props;
		handlePollingData(currentPage+1);
	}
	
	//取消预览轮巡
	toggleCustomPolling(){
		this.props.toggleCustomPolling(false);
	}

	//结束锁屏
	switchLockScreen(){
		this.props.switchLockScreen(false);
	}
	
    render(){
    	let {
    		meetStatus,role,currentUid,shareDesk,shareVideo,recordStatus,recordTime,
    		customPolling,isPolling,totalPage,currentPage, isLockScreen
    	}= this.props,
    	tpl = [];
    	
    	//未开始直播
    	if( meetStatus === 'INIT' ){
    		if( role === "MAIN" ){
    			tpl.push(<div key="beforeBegin" className={Less.notice}>
    					<span className='iconfont icon-tips-general'></span>
    					<span>您暂未开始直播，准备好后请点击下方常用操作栏“<span className={Less['red-letter']}>开始直播</span>”按钮</span>
    				</div>);
    		}else{
    			tpl.push(<div key="beforeBegin" className={Less.notice}>
    					<span className='iconfont icon-tips-general'></span>
    					<span>主持人暂未开始直播</span>
    				</div>);
    		}
    	}
    	
    	//是否正在录制中
    	if( recordStatus === 'run' || recordStatus === 'pause' ){
    		tpl.push(<div key="recordTime" className={Less.notice}>
					<span>录制时间<span className={cn(Less['green'],'pl5')}>{transTime(recordTime)}</span></span>
			</div>);
			
			let pauseLess = cn('iconfont',{'pause':'icon-continue-recording','run':'icon-pause-recording'}[recordStatus]);
			
			tpl.push(<div key="recordPause" className={cn(Less.btn,'ml5')} onClick={this.toggleRecordOver}>
					<span className={pauseLess}></span>
					{recordStatus==='run'?<span>暂停录制</span>:<span>继续录制</span>}
			</div>);
			tpl.push(<div key="recordStop" className={cn(Less.btn,Less['btn-warn'],'ml5')} onClick={this.toggleRecord}>
					<span className={cn(Less['record-tag'],'iconfont','icon-stop-recording')}></span>
					<span>停止录制</span>
			</div>);
    	}
    	
    	//主讲教室轮巡状态
    	if( customPolling ){
    		if( role === "MAIN" ){
    			tpl.push(<div key="boardPolling" className={cn(Less.btn,'ml5')} onClick={this.toggleBoardPolling}>
					<span className={cn('iconfont',{true:'icon-cancel-polling',false:'icon-broadcast'}[isPolling])}></span>
					{!isPolling?<span>广播轮巡</span>:<span><span className={Less['show-state']}>广播中 ...</span><span  className={Less['show-hover']}>取消广播</span></span>}
				</div>);
				tpl.push(<div key="nextPolling" className={cn(Less.btn,'ml5')} onClick={this.handlePollingData}>
						<span className={cn('iconfont','icon-broadcast-next')}></span>
						<span>下一批({currentPage}/{totalPage})</span>
				</div>);
				tpl.push(<div key="closePolling" className={cn(Less.btn,'ml5')} onClick={this.toggleCustomPolling}>
						<span className={cn('iconfont','icon-close-round')}></span>
						<span>关闭轮巡</span>
				</div>);
    		}else if(isPolling){
    			tpl.push(<div key="isPolling" className={Less.notice}>
						<span className='iconfont icon-tips-general'></span>
						<span>轮巡中...</span>
				</div>);
    		}
    	}
    	
    	
    	
    	//是否在共享桌面
    	if( shareDesk ){
    		if( currentUid === shareDesk ){
    			tpl.push(<div key="shareDesk" className={Less.notice}>
					<span className='iconfont icon-tips-general'></span>
					<span>共享桌面中...</span>
				</div>);
    		}else if( role === "MAIN" ){
    			tpl.push(<div key="shareDesk" className={Less.btn} onClick={this.closeShareDesk}>
					<span className='iconfont icon-prohibit'></span>
					<span>结束共享桌面</span>
				</div>);
    		}
    	}
    	
    	//是否在共享视频中
    	if( shareVideo ){
    		if( currentUid === shareVideo ){
    			tpl.push(<div key="shareVideo" className={Less.notice}>
					<span className='iconfont icon-tips-general'></span>
					<span>共享视频中...</span>
				</div>);
    		}else if( role === "MAIN" ){
    			tpl.push(<div key="shareVideo" className={Less.btn} onClick={this.closeShareVideo}>
					<span className='iconfont icon-prohibit'></span>
					<span>结束共享视频</span>
				</div>);
    		}
    	}
    	
		//是否正在锁屏中
		if (isLockScreen) {
			if( role === "MAIN" ){
    			tpl.push(<div key="lockScreen" className={cn(Less.btn,Less['lock-screen'])} onClick={this.switchLockScreen}>
					<span className={cn('iconfont','icon-locking',Less['show-state'])}></span>
					<span className={cn('iconfont','icon-unlock',Less['show-hover'])}></span>
					<span>结束锁屏</span>
				</div>);
	    	}else{
				tpl.push(<div key="lockScreen" className={Less.notice}>
					<span className='iconfont icon-tips-general'></span>
					<span>锁屏中...</span>
				</div>);
			}
	    }
		
		if( tpl.length === 0 ){return null;}
    	
        return(
        	<div className={Less.prompt}>{tpl}</div>
        );
    }
}

let mapStateToProps = state=>{
	let {meetObj:{status},role,shareDesk,shareVideo,uid,pollingSetting} = state.meetInfo,
		{recordStatus,recordTime, isLockScreen} =  state.setInfo,
		{isPolling,customPolling,totalPage,currentPage} = pollingSetting;
		
	return {
		meetStatus : status,               //会议的状态"INIT","PROGRESS","END" 
		role,                              //用户角色信息MAIN,JOIN,WATCH,GUEST
		currentUid : uid,                  //当前用户的id
		shareDesk,                         //共享桌面的id
		shareVideo,                        //共享视频的id
		recordStatus,                      //是否正在录制中
		recordTime,                        //录制时间
		customPolling,                     //主讲是否在轮巡中
		isPolling,                         //是否在广播轮巡中
		totalPage,                         //轮巡当前页数
		currentPage,                       //轮巡总页数
		isLockScreen					   // 是否锁屏
	};
	
};

let mapDispatchToProps = {
	switchShare,
	toggleRecord,
	toggleRecordOver,
	toggleCustomPolling,             //切换总体是否轮巡
	toggleBoardPolling,              //切换是否广播轮巡
	handlePollingData,               //切换下一轮
	switchLockScreen,
}

export default connect(mapStateToProps,mapDispatchToProps)(Prompt);
