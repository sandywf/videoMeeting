//radio样式美化

import React, { Component } from 'react';
import Less from './index.less';
import * as cn from "classnames";

export default class Radio extends Component {
	
	
	onChange(){
		let {value,onChange} = this.props;
		onChange && onChange(value);
	}
	
    render(){
		let {value,className,select,children,disabled,title} = this.props,
			inputParam = {
				value,
				checked : value === select
			};
			if(disabled){
				inputParam.disabled = 'disabled';
			}
        return (
			<label className={cn(Less.radio,className,{[Less.disabled]:disabled})} title={title}>
				<input type="radio" {...inputParam} onChange={this.onChange.bind(this)}/>
				<em></em>
				<span>{children}</span>
			</label>
        );
    }
}
