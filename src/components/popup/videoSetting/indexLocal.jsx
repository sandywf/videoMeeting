//视频设置弹框--如果没有教室的模式
import React, { Component } from 'react';
import Less from './index.less';
import {connect} from 'react-redux';
import { Radio } from "@/components/tag";
import {setVideoSetting} from '@/store/settings/action';
// import * as cn from 'classnames';

//清晰度
const definitionList = [{
	label      : '超清',
	value      : 1,
	resolution : "1920*1080",
	bitrate    : 2*1024,       //2M
},{
	label : '高清',
	value : 2,
	resolution : "1280*720",
	bitrate    : 1.5*1024,     //1.5M
},{
	label : '标清',
	value : 3,
	resolution : "640*480",
	bitrate    : 1*1024,       //1M
},{
	label : '普清',
	value : 4,
	resolution : "320*240",
	bitrate    : 0.5*1024,     //0.5M
}];


class VideoSettingLocal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bigScreen  : "",  //要选中的画面
			definition : "",  //选择的清晰度
		};
		this.changeDefinition  = this.changeDefinition.bind(this);
		this.changeScreen = this.changeScreen.bind(this);
	}

	componentDidMount() {
		//设置弹框的确认按钮的触发事件
		let {modal,setVideoSetting,bigScreen,resolution} = this.props;
		let obj = definitionList.find(item=>item.resolution===resolution) || {};
		this.setState({
			bigScreen,
			definition : obj.value || 3
		});
		modal.setSure(()=>{
			//视频设置进行保存
			let {definition,bigScreen}=this.state;
			let obj = definitionList.find(item=>item.value===definition) || definitionList[3];

			setVideoSetting({
				resolution : obj.resolution,
				definition : obj.bitrate,
				bigScreen
			}).then(()=>{
				modal.onCancel();
				//修改分辨率的化，需要刷新页面
				if( obj.resolution !== resolution  ){
					window.location.reload();
				}
			});
		});
	}
	
	componentWillReceiveProps(nexProps){
		if( this.props.bigScreen !== nexProps.bigScreen ){
			this.setState({
				bigScreen : nexProps.bigScreen
			});
		}
		if( this.props.resolution !== nexProps.resolution ){
			let obj = definitionList.find(item=>item.resolution===nexProps.resolution) || {};
			this.setState({
				definition : obj.value || 3
			});
		}
	}

	//切换清晰度
	changeDefinition(definition) {
		this.setState({definition});
	}
	
	//切换画面
	changeScreen(e){
		let val = e.target.value;
		val = val?parseInt(val,10):"";
		this.setState({
			bigScreen : val
		});
	}

	
    render() {
    	//获取视频设置的值
		//如果大画面中已选择，则禁用部分小画面
    	let {definition,bigScreen} = this.state,
    		{screenList} = this.props,
			options = screenList.map((device,index)=>{
				return <option key={device.id} value={device.id}>{device.name}</option>;
			});
			options.unshift(<option key="" value="">无</option>)

			
        return (
           <div className={Less['video-setting']}>
           		<dl className={Less['select-device']}>
           			<dt>摄像头 :</dt>
           			<dd><select ref='preset' value={bigScreen} onChange={(e)=>this.changeScreen(e)}>{options}</select></dd>
           		</dl>
           		<dl className={Less['definition-local']}>
           			<dt>清晰度 :</dt>
           			<dd>
           				<Radio.Group value={definition} onChange={this.changeDefinition} options={definitionList}/>
           			</dd>
           		</dl>
           		<dl className={Less.notice}>建议:1.四分屏以下,选择高清以上;2.六分屏以上,选择标清以下</dl>
           </div>
        );
    }
}

let mapStateToProps = state=>({
	bigScreen     : state.setInfo.bigScreen,      //显示的画面机位
	resolution    : state.setInfo.resolution,     //画面分辨率
	definition    : state.setInfo.definition,     //码率
	screenList    : state.setInfo.screenList,
});

let mapDispatchToProps = {
	setVideoSetting
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoSettingLocal);