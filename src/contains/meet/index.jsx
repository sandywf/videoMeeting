// 
//  index.jsx
//  <project>
//  视频会议页面
//
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 

import React, { Component } from 'react';
import {getMeetInit,getMeetInitData,hasLoadFn} from '@/store/meet/action';
import {connect} from 'react-redux';
import Content from '@/components/content/content';
import Header  from '@/components/header/header';
// import Footer  from '@/components/footerBar/footerBar';
import Popup   from '@/components/popup';                    //弹出层集合
import Less    from './index.less';
import SelfCheck      from '@/contains/selfCheck';

import '@/common/wpad/index.min.css';
import '@/common/wpad/icon/iconfont.css';

class Meet extends Component {
	
	constructor(props){
		super(props);
		let { getMeetInit,hasLoadFn,match } = this.props;
		getMeetInit().then(data=>{
			this.initData = data;
			document.title = data.result.title;
			hasLoadFn();
		});
	}
	
	componentWillReceiveProps(nextProps){
		let {getMeetInitData,} = this.props;
		if( nextProps.hasLoad && nextProps.hasCheck && !this.hasInit ){
            this.hasInit = true;
			getMeetInitData( this.initData);
		}
	}
	
    render() {
		//判断是否需要进入自检页面
		let {hasCheck,hasLoad} = this.props;
		if( !hasLoad ){
			return null;
		}else if( !hasCheck ){
			return (<SelfCheck url={this.initData && this.initData.result.hostConfig.httpsPublic}/>);
		}else{
			return (
				<div className ={Less.app}>
	                <Header/>
	                <Content />
					<Popup/>
	            </div>
			);
		}
    }
}


let mapStateToProps = state=>({
	hasCheck : state.setInfo.hasCheck,    //是否已经自检
	hasLoad  : state.meetInfo.hasLoad,     //会议数据加载
});

let mapDispatchToProps = {
	getMeetInit,     //获取初始化数据
	getMeetInitData,
	hasLoadFn,
}

export default connect(mapStateToProps,mapDispatchToProps)(Meet);
