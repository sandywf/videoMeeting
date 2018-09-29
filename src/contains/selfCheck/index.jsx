// 
//  selfCheck.jsx
//  <project>
//  页面自检功能
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {finishSelfCheck,runSelfCheck,restCheck} from '@/store/settings/action';
import Button from "./button";
import Less from './index.less';
import * as cn from "classnames";

const checkObj =[
	{
		'type' : 'browser',
		'name' : '浏览器',
		'msg'  : (<span>建议使用推荐版本的chrome浏览器，请点击<a href="https://chrome.en.softonic.com/" target="_block">下载安装</a>！</span>),
		'status' : '检测中...'
	},
	{
		'type'   : 'tool',
		'name'   : '工具检测',
		'msg1'   : '工具版本过旧！请点击下载安装最新工具！',
		'msg2'   : '未检测到工具，请下载安装工具！',
		'status' : '检测中...'
	},
	{
		'type'   : 'camera',
		'name'   : '摄像头检测',
		'msg'    : '未检查到摄像头，请检查后重试！',
		'status' : '检测中...'
	},
	{
		'type' : 'speaker',
		'name' : '扬声器检测',
		'msg'  : '未检测到扬声器，请检查后重试！',
		'status' : '检测中...'
	},
	{
		'type' : 'audio',
		'name' : '麦克风检测',
		'msg'  : '未检测到麦克风，请检查后重试！',
		'status' : '检测中...'
	}
];


class SelfCheck extends Component {
	
    constructor(props){
		super(props);
		this.state = {
			time : 3,
		};
		this.countDown = this.countDown.bind(this);
		this.restCheck = this.restCheck.bind(this);
	};
	
	componentDidMount(){
		this.props.runSelfCheck();
	}

	componentWillUnmount() {
	    this.setState = (state, cb) => {
	        return;
        };
    }
	
	
	//重新检测
	restCheck(){
		this.props.restCheck();
	}
	
	//成功后倒计时
	countDown(){
		let time = this.state.time;
		if( time>=0 ){
			time --;
			this.countDowning = true;
			setTimeout(()=>{
				this.setState({time},()=>{
					this.countDowning = false;
					this.countDown();
				});
			},1000);
		}else{
			this.countDowning = false;
			this.props.finishSelfCheck();
		}
	}

    render() {
    	let time = this.state.time,
			{selfCheck,finishSelfCheck} = this.props,
			tpl = [],
			uninstall = selfCheck.tool === 'uninstall',
			hasAllCheckResult = true,     //是否已经全部检测过了
			hasError  = false;            //是否有检测不通过的值
		
		checkObj.forEach(val=>{
			let status = selfCheck[val.type];
			const { url } = this.props
			val.tag = status;
			if( uninstall && val.type!=='browser'  ){
				val.tag = 'error';
				hasError = true;
				if( val.type !== 'tool' ){
					//插件未安装
					val.status = '[失败]';
					val.error = val.msg;
				}else{
					//插件未安装
					val.status = '[未安装]';
					val.error = (
						<span>未检测到工具！请<a href={`${url}/webpc/meeting/inside/plugin/CodyyMeeting.exe`} download="CodyyMeeting.exe">下载安装</a>工具</span>
					);
				}
			}else if( status === 'checking' ){
				val.status = "检测中...";
				val.error = "";
				hasAllCheckResult = false;
			}else if( status === "success" ){
				val.status = "[成功]";
				val.error = "";
			}else if( status === "error" ){
				hasError = true;
				val.status = "[失败]";
                val.error = val.type === 'tool' ? (
                    <span>工具版本过旧！请<a href={`${url}/webpc/meeting/inside/plugin/CodyyMeeting.exe`} download="CodyyMeeting.exe">下载安装</a>最新工具！</span>
                ) : val.msg;
			}
			//使用模板
			tpl.push(getTpl(val));
		});
		
		
		function getTpl(obj){
			let iconClass = cn([
				Less.icon,
				"iconfont",
				{'icon-jianceshibai':obj.tag==='error'},
				{'icon-jiancechenggong':obj.tag!=='error'}
			]);
			
			return (
				<li key={obj.type} className={Less[obj.tag]}>
					<div className={iconClass}>{obj.icon}</div>
					<div className={Less.name}>{obj.name}</div>
					<div className={Less.status}>{obj.status}</div>
					<div className={Less.error}>{obj.error}</div>
				</li>
			)
		}
		//检测通过进入倒计时
		if( hasAllCheckResult && !hasError && !this.countDowning ){
			this.countDown();
		}
		
		//获取按钮显示
		let footer = (
			<div className={Less.footer}>
				{hasError && hasAllCheckResult?( <Button onClick={this.restCheck}>重新检测</Button> ):null}
				{selfCheck.browser === 'success' && selfCheck.tool === 'success' && hasAllCheckResult?( <Button onClick={finishSelfCheck}>直接进入</Button> ):null}
			</div>
		);
			
		
		return (
			<div className={Less.selfCheck}>
				<div className={Less.tab}>
					<div className={Less.header}>
						{
							hasAllCheckResult ? hasError? null:(<div className={Less.complete}>检测通过，<span className='c_white'>{time}</span> 秒后自动进入...</div>):(
								<div  className={Less.checking}>
									<ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>
									<div className="mt30 cboth">检测中</div>
								</div>
							)
						}
					</div>
					<ul className={Less.content}>
						{tpl}
					</ul>
					{footer}
				</div>
			</div>
		);
    }
}



let mapStateToProps = state=>({
	selfCheck : state.setInfo.selfCheck
});

let mapDispatchToProps = {
	finishSelfCheck,
	runSelfCheck,
	restCheck
};

export default connect(mapStateToProps,mapDispatchToProps)(SelfCheck);