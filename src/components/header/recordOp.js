// 录制 下拉列表
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as cn from "classnames";
import style from './header.less';
import {toggleRecord} from '@/store/settings/action';

class RecordOp extends Component {

    constructor (props){
        super(props);
        this.toggleRecord = this.toggleRecord.bind(this);   //录制控制
    }
    

	//录制控制
    toggleRecord(){
    	let { recordStatus,toggleRecord } = this.props;
    	let result = recordStatus === 'stop'?'run':'stop';
        toggleRecord(result);
    }


    render() {
        let {canRecord} = this.props;
        let styleClass = cn(
        	style.operation,
        	style['hover']
        );
        return canRecord?(
            <div  title="录制设置" className={styleClass}  onClick={this.toggleRecord}>
                <i className='iconfont icon-record'></i>
            </div>
        ):null;
    }
}

let  mapStateToProps = (state)=>{
	let {canRecord} = state.meetInfo,
		{recordStatus}  = state.setInfo;

	return {
		recordStatus,  //录制的状态,是否在录制中
		canRecord,     //是否有录制权限
	}
};

let mapDispatchToProps = {
    toggleRecord
};


export default connect(mapStateToProps,mapDispatchToProps)(RecordOp);
