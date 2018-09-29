// 
//  index.jsx
//  <project>
//  主路径，主要用于初始化系统
//
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 

import React, { Component } from 'react';
import {setMeetKey, setHistory} from '@/store/meet/action';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';
import Meet           from '@/contains/meet';
import Login          from '@/contains/login';
import Notice         from '@/contains/notice';

class Home extends Component {
	
	constructor(props){
		super(props);
		props.setMeetKey(props.match.params.meetId.toString());
		props.setHistory(props.history);
    }
	
    render() {
		let meetId = this.props.match.params.meetId;
		return (
			<Switch>
				<Route path="/meetId:meetId/login" component={Login}/>
				<Route path="/meetId:meetId/notice/:notice" component={Notice}/>
				<Route path="/meetId:meetId/meet/:isWatch?" component={Meet}/>
				<Redirect to={"/meetId"+meetId+"/meet"} />
			</Switch>
		);
    }
}

let mapStateToProps = ()=>({});

let mapDispatchToProps = {
	setMeetKey,      //设置meet
	setHistory,      //获取router，便于特殊处理
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);