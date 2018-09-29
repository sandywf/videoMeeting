//checkbox 样式美化

import React, { Component } from 'react';
import Less from './index.less';
import * as cn from "classnames";

export default class Checkbox extends Component {
	
	constructor(props){
		super(props);
		this.onCheckboxChange = this.onCheckboxChange.bind(this);
	}
	
	onCheckboxChange(){
		let {value,onChange,select=[]} = this.props;
		//判断value中，是否有值
		const optionIndex = select.indexOf(value);
		if( optionIndex === -1 ){
			select.push(value);
		}else{
			select.splice(optionIndex,1);
		}
		onChange && onChange(select);
	}
	
    render(){
		let {value,className,select=[],children,disabled} = this.props,
			inputParam = {
				value,
				checked : select.includes(value)
			};
			if(disabled){
				inputParam.disabled = 'disabled'; 
			}
        return (
			<label className={cn(Less.checkbox,className,{[Less.disabled]:disabled})}>
				<input type="checkbox" {...inputParam}  onClick={this.onCheckboxChange}/>
				<em></em>
				<span>{children}</span>
			</label>
        );
    }
}
