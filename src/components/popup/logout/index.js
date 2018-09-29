// 邀请来宾 或者  邀请观摩
import React, { Component } from 'react';
import Less from './index.less';
import { connect } from 'react-redux';
// import {Modal}  from "@/components/modal";
import {endMeeting, logoutMeeting} from '@/store/meet/action';
import { videoMeetType } from '../../header/header'
class Logout extends Component {
	componentDidMount() {
	
    }

    onCancel(){
        this.props.logoutMeeting();
    }

    onSure(){
        this.props.endMeeting()
    }

	
	render() {
        const { meetingType } = this.props
		return (
            <div className={Less.wrap}>
                <div className={Less.content}>{ `直播尚未开始，请选择退出${videoMeetType[meetingType]}或者结束${videoMeetType[meetingType]}！`}</div>
                <div className={Less['btn-wrap']} >
                    <span onClick={this.onSure.bind(this)} className={Less.btn}>结束视频会议</span>
                    <span onClick={this.onCancel.bind(this)} className={Less.btn}>退出视频会议</span>
                </div>
            </div>
		);
	}
}

let mapStateToProps = state => ({
    meetingType        : state.meetInfo.meetObj.meetingInfo.meetType, // 会议类型
});

let mapDispatchToProps = {
    endMeeting, 
    logoutMeeting
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
