//视频设置弹框
import React, { Component } from 'react';
import Less from './index.less';
import {connect} from 'react-redux';
import {Radio,Checkbox} from "@/components/tag";
import {setVideoSetting} from '@/store/settings/action';
import * as cn from 'classnames';

//清晰度
const definitionList = (resolution)=>{
	let list = [];
	if( resolution === '640*360' ){
		list = [1000,800,600];
	}else if( resolution === '1280*720' ){
		list = [1400,1200,1000];
	}else if( resolution === '1920*1080' ){
		list = [2000,1600,1200];
	}

	list = list.map((item,index)=>{
		let tag = ['高','中','低'][index];
		return {
			label : (<span>{tag}<span className="ml20">码率{item}Kbps</span></span>),
			value : item,
		}
	});
	return list;
}


//导播模式
const modeList = [
	{value:2,label:'手动',title:"手动切换大画面，机位不跟踪"},
	{value:3,label:'半自动',title:"手动切换大画面，机位自动跟踪"},
	{value:1,label:'自动',title:"自动切换大画面，机位自动跟踪"}
];

class VideoSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			setPreset : false    //提示
		};
		this.changeMode        = this.changeMode.bind(this);
		this.changeBigScreen   = this.changeBigScreen.bind(this);
		this.changeSmallScreen = this.changeSmallScreen.bind(this);
		this.changeDefinition  = this.changeDefinition.bind(this);
		this.changePreset      = this.changePreset.bind(this);
		this.getSmallScreenByBigScreen = this.getSmallScreenByBigScreen.bind(this);
	}

	componentDidMount() {
		//设置弹框的确认按钮的触发事件
		let {modal,setVideoSetting,videoSetting} = this.props;
		
		this.setState({
			...videoSetting,
			smallScreen : [...videoSetting.smallScreen]
		});
		
		modal.setSure(()=>{
			//视频设置进行保存
			let {definition,mode,bigScreen,smallScreen}=this.state;
			setVideoSetting({definition,mode,bigScreen,smallScreen}).then(()=>{
				modal.onCancel();
			});
		});
	}
	
	componentWillReceiveProps(nexProps){
		
		let { videoSetting : nextVal } =  nexProps;
		let { videoSetting : currVal } = this.props;
			
		Object.keys( nextVal ).forEach(item=>{
			let nextItem =  nextVal[item];
			let currItem =  currVal[item];
			if( currItem === nextItem || item === 'smallScreen' ){
				return;
			}
			this.setState({
				[item] : nextItem
			});
		});
	}

	//切换清晰度
	changeDefinition(definition) {
		this.setState({ definition });
	}

	//切换模式
	changeMode(mode) {
		this.setState({ mode });
	}

	//切换大画面
	changeBigScreen(bigScreen){
		this.setState({bigScreen});
	}
	
	//选择小画面
	changeSmallScreen(smallList){
		let {bigScreen,smallScreen} = this.state;
		if( !bigScreen ) return;
		smallScreen = smallScreen.map(item=>{
			if( item[0] === bigScreen ){
				smallList.unshift(bigScreen);
				return smallList;
			}else{
				return item;
			}
		});
		
		//排除大画面
		this.setState({smallScreen});
	}
	
	//修改预设位
	changePreset(){
		let {mode,preset} = this.state;
		//非手动模式不能触发
		if( mode !== 2 ) return;
		let {selectedIndex}=this.refs.preset;
		preset = Number(this.refs.preset.options[selectedIndex].value);
		this.props.setVideoSetting({mode,preset}).then(()=>{
			this.setState({setPreset : true});
			if( this.timeout ){
				clearTimeout(this.timeout);
			}
			this.timeout = setTimeout(()=>{
				this.setState({setPreset : false});
			},2000);
		});
	}
	
	//根据大画面，获取指定的小画面
	getSmallScreenByBigScreen(big){
		if( !big ) return;
		let {smallScreen} = this.state;
		let result = (smallScreen || []).find(item=>item[0]===big) || [big];
		return [...result];
	}
	
    render() {
    	//获取视频设置的值
		//如果大画面中已选择，则禁用部分小画面
    	let {resolution,definition,mode,bigScreen,preset,setPreset} = this.state,
    		{screenList} = this.props,
			smallScreenList = screenList.map(screen=>{
					let sScreen = {...screen};
					if( sScreen.value === bigScreen  ){
						sScreen.disabled = true;
					}
					screen.value = screen.id;
					screen.label = screen.name;
					return sScreen;
			});
		
		let options = [];
		for( let i=1;i<10;i++){
			if(  preset === (i-1) ){
				options.push(<option key={i} value={i-1} selected>{i}</option>);
			}else{
				options.push(<option key={i} value={i-1}>{i}</option>);
			}
		}
		
		//根据分辨率获取不同的码率
		let definitionListArr = definitionList(resolution) || {};
		//获取当前小画面的接收值
		let currentSmallScreen = [];
		if( bigScreen ){
			currentSmallScreen = this.getSmallScreenByBigScreen(bigScreen);
			currentSmallScreen.shift();
		}
		
		
        return (
           <div className={Less['video-setting']}>
           		<dl>
           			<dt>分辨率 :</dt>
           			<dd>{resolution}</dd>
           		</dl>
           		<dl className={Less['definition']}>
           			<dt>清晰度 :</dt>
           			<dd>
           				<Radio.Group value={definition} onChange={this.changeDefinition} options={definitionListArr}/>
           			</dd>
           		</dl>
           		<dl className={Less.mode}>
           			<dt>导播模式 :</dt>
           			<dd>
           				<Radio.Group value={mode} onChange={this.changeMode} options={modeList}/>
           			</dd>
           		</dl>
           		<dl className={Less.cameras}>
           			<dt>大画面 :</dt>
           			<dd className={cn({'no-event':mode===1})}>
           				<Radio.Group value={bigScreen} onChange={this.changeBigScreen} options={screenList}/>
           			</dd>
           		</dl>
           		<dl className={Less.cameras}>
           			<dt>小画面 :</dt>
           			<dd className={cn({'no-event':mode===1})}>
           				<Checkbox.Group value={currentSmallScreen} onChange={this.changeSmallScreen} options={smallScreenList}/>
           			</dd>
           		</dl>
           		<dl>
           			<dt>大画面预置位 :</dt>
           			<dd className={cn({'no-event':mode!==2})}>
           				<select ref='preset'>{options}</select>
           				<button onClick={this.changePreset}>调用</button>
           			</dd>
           		</dl>
           		<dl className={Less.notice}>
           			说明 : 如果大画面和小画面有重复视频,则小画面自动过滤重复视频<br/>
           			<span className="pl30">在手动导播模式下,预置位才生效</span>
           		</dl>
           </div>
        );
    }
}

let mapStateToProps = state => {
	let { resolution,definition,mode,bigScreen,smallScreen,preset,screenList} = state.setInfo || {};
	return {
		videoSetting :{
			resolution,
			definition,
			mode,
			bigScreen,
			smallScreen,
			preset,
		},
		screenList
	};
};

let mapDispatchToProps = {
	setVideoSetting
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoSetting);