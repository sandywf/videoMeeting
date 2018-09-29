// 
//  notice.jsx
//  <project>
//  提醒页面
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Less from './index.less';

const noticeTpl = {
	'n_0' : '会议已取消！',
	'n_1' : '本次会议已结束！',
	'n_2' : '您已被请出会议！',
	'n_3' : '您已在另外一个地点登录系统！'
};

class Notice extends Component {
	
    static propTypes = {
		state : PropTypes.string
    }
    
    constructor(props){
		super(props);
		this.state = {time : 5};
		this.countDown = this.countDown.bind(this);
	};
	
	componentDidMount(){
		this.setState({time : 5});
	}
	
	//倒计时
	countDown(){
		var time = this.state.time;
		if( time > 0 ){
			time --;
			this.setTime({time})
		}else{
			//跳转页面
		}
	}

    render() {
    	let noticeState = noticeTpl[this.props.state] || "404";
    	
        return (
            <div className={Less.notice}>
            	<header>阔地教育</header>
            	<div>
            		<div>{noticeState}</div>
            		<div>稍候页面将跳转到相应页面,如果没有跳转请点击
            			<span onClick={this.countDown}>这里</span>
            		</div>
            		<div>{this.state.time}秒后自动跳转到相应页面</div>
            	</div>
            	<footer>
            		<span>
            			版权所有(c)2007-2015阔地教育科技有限公司<br/>
            			增值电信业务经营许可证 苏B2-20100157-6
            		</span>
            	</footer>
            </div>
        );
    }
}

export default Notice;