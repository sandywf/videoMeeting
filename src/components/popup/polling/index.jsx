//轮巡设置弹框
import React, { Component } from 'react';
import Less from './index.less';
import { connect } from 'react-redux';
import * as cn from "classnames";
import Radio from '@/components/tag/radio';
import {Modal} from "@/components/modal";
import {setPollingSetting} from "@/store/meet/action";

//导播模式
const posList = [
	{value:1,label:'都不固定'},
	{value:2,label:'仅主持人'},
	{value:3,label:'主持人及发言人'}
];

class Polling extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			interval       : props.interval   || '',
			selectInterval : props.interval   || 15,
			roleStatus     : props.roleStatus || 2    //1:都不固定；2：经主持人;3:主持人及发言人 
		};
		
		this.changeRoleStatus = this.changeRoleStatus.bind(this);
		this.changeInterval = this.changeInterval.bind(this);
		this.selectInterval = this.selectInterval.bind(this);
	}
	
	componentDidMount() {
		//设置弹框的确认按钮的触发事件
		let {modal,setPollingSetting,videoLayoutNum,speakerNum} = this.props;
		//确认按钮
		modal.setSure(()=>{
			let {interval,selectInterval,roleStatus}=this.state;
			let params = {};
			//判断能否开启轮巡
			if( roleStatus === 3 ){
				let num = videoLayoutNum<4?4:videoLayoutNum;
				if( num <= speakerNum ){
					Modal.alert("请至少保留一个空画面位置用于轮巡非发言人！");
					return;
				}
			}
			
			if( interval ){
				if( interval>=15 && interval <= 180 ){
					params.pollingInterval = interval;
				}else{
					Modal.alert("自定义秒数只能在15~180之间,或者为空！");
					return;
				}
			}else{
				params.pollingInterval = selectInterval;
			}
			
			//判断值是否正确
			if( roleStatus === 1 ){
				params.isCustom = false;
				params.isPollingSpeaker =false;
			}else if( roleStatus === 2  ){
				params.isCustom = true;
				params.isPollingSpeaker =false;
			}else if( roleStatus === 3 ){
				params.isCustom = true;
				params.isPollingSpeaker =true;
			}
			setPollingSetting(params).then(()=>{
				modal.onCancel();
			});
		});
	}
	
	componentWillReceiveProps(nexProps){
		//根据大画面-重新设置小画面
		let {interval,roleStatus} = nexProps;
		this.setState({
			interval       : '',
			selectInterval : interval   || 15,
			roleStatus     : roleStatus || 2    //1:都不固定；2：经主持人;3:主持人及发言人 
		});
	}
	
	//select的option
	getOptions(){
		let options = [];
		[15,30,60,90,120,150,180].forEach(item=>{
			options.push(<option key={item} value={item}>{item}</option>);
		});
		return options;
	}
	
	//选择固定角色模式
	changeRoleStatus(item){
		this.setState({
			roleStatus : item
		});
	}
	
	//设置自定义时间
	changeInterval(e){
		let time =e.target.value;
		if( time === '' || /^[1-9]\d*$/.test(time) ){
			if( time<= 180 ){
				this.setState({
					interval : time
				});
			}
		}
	}
	
	//选择时间
	selectInterval(e){
		this.setState({
			selectInterval : e.target.value,
			interval       : ''
		});
	}
	
	
	render() {
		let {interval,roleStatus,selectInterval} = this.state;
		
		return (
			<div className={Less.polling}>
				<div className={cn(Less.notice,'mb20')}>
				说明 : 开启轮巡后,默认只能主持人看到轮巡的视频;当主持人开启"关播轮巡后",参会者也能看到轮巡的视频。
				</div>
				
				<dl>
           			<dt>间隔秒数 :</dt>
           			<dd>
           				<select value={selectInterval} onChange={e=>this.selectInterval(e)}>{this.getOptions()}</select>
           			</dd>
           		</dl>
           		
           		<dl>
           			<dt>自定义秒数 :</dt>
           			<dd>
           				<input type="text" value={interval} onChange={e=>this.changeInterval(e)}/>
           				<label className={cn(Less.notice,'ml20',{[Less.error]:interval&&interval<15})}>只能在15~180之间</label>
           			</dd>
           		</dl>
				
				<dl className={Less.pos}>
           			<dt>固定角色位置 :</dt>
           			<dd>
           				<Radio.Group value={roleStatus} onChange={this.changeRoleStatus}  options={posList}/>
           			</dd>
           		</dl>
           		
           		<div className={cn(Less.notice,'mt10','mb10')}>
					说明 : 如果固定主持人及发言人位置，请至少保留一个空画面位置用于轮巡非发言人。
				</div>
           		
			</div>
		);
	}
}

let mapStateToProps = state => {
	let {isCustom,isPollingSpeaker,pollingInterval} = state.meetInfo.pollingSetting,
		{videoLayoutNum} = state.setInfo,
		{speakerList} = state.meetInfo;
		
	let roleStatus = 1;
	if( !isCustom && !isPollingSpeaker ){
		//都不固定
		roleStatus = 1;
	}else if( isCustom && !isPollingSpeaker ){
		//仅主持人
		roleStatus = 2;
	}else if( isCustom && isPollingSpeaker ){
		//主持人及发言人
		roleStatus = 3;
	}
	
	//获取发言人数量
	let speakerNum = speakerList.filter(item=>!!item).length;
	
	return {
		interval : pollingInterval,       //轮巡间隔
		roleStatus,                       //轮巡固定模式
		videoLayoutNum,                  //画面布局
		speakerNum                        //发言人数量
	}
};

let mapDispatchToProps = {
    setPollingSetting,   //设置轮巡配置
}

export default connect(mapStateToProps, mapDispatchToProps)(Polling);