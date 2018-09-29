//radio,组合
import React, { Component } from 'react';
import Checkbox from "./checkbox";

/**
 * props:
 * 	value:
 * 	onChange:
 * 	options:
 * 		value :
 * 		label  :
 *  defaultValue:
 * 	disable:
 */

function getCheckedValue(children) {
	let value = [];
	React.Children.forEach(children, (checkbox) => {
	    if (checkbox && checkbox.props && checkbox.props.checked) {
	        value.push(checkbox.props.value);
	    }
	});
	return value;
}

export default class Group extends Component {
	
	constructor(props){
		super(props);
		let value = [];
		if( 'value' in props ){
			value = props.value;
		}else if( 'defaultValue' in props ){
			value = props.defaultValue;
		} else {
	      	value = getCheckedValue(props.children);
	    }
	    this.state = {value};
	}
	
	componentWillReceiveProps(nextProps) {
	    if ('value' in nextProps) {
	        this.setState({
	            value: nextProps.value,
	        });
	    }else{
	        const checkedValue = getCheckedValue(nextProps.children);
	        if (checkedValue) {
	        this.setState({
	            value: checkedValue,
	        });
	      }
	    }
	}
	
	onCheckboxChange = (value) => {
	    if (!('value' in this.props)) {
	      	this.setState({
	        	value,
	      	});
	    }
	    const onChange = this.props.onChange;
	    if (onChange ) {
	      	onChange(value);
	    }
	}
	
    render(){
		let {options,children,defaultValue} = this.props;
		//判断是否有options存在
		if( options && options.length>0 ){
			children = options.map((option,index)=>{
				if( typeof option === 'string' ){
					return (
						<Checkbox 
							key={index}
							disabled={this.props.disabled}
							value = {option} 
							select = {this.state.value||defaultValue}
							onChange = {this.onCheckboxChange}>
							{option}
						</Checkbox>
					);
				}else{ // 此处类型自动推导为 {label: string value: string disabled : boolean}
					return (
						<Checkbox 
							key={index}
							disabled={option.disabled || this.props.disabled}
							value = {option.value}
							select = {this.state.value||defaultValue}
							onChange = {this.onCheckboxChange}>
							{option.label}
						</Checkbox>
					);
				}
			});
		}else{
			children = null;
		}
		
        return (
			<React.Fragment>
				{children}
			</React.Fragment>
        );
    }
}
