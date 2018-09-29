//radio,组合
import React, { Component } from 'react';
import Radio from "./radio";

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
	let value = null;
	let matched = false;
	React.Children.forEach(children, (radio) => {
	    if (radio && radio.props && radio.props.checked) {
	        value = radio.props.value;
	        matched = true;
	    }
	});
	return matched ? { value } : undefined;
}

export default class Group extends Component {
	
	constructor(props){
		super(props);
		let value;
		if( 'value' in props ){
			value = props.value;
		}else if( 'defaultValue' in props ){
			value = props.defaultValue;
		} else {
	      	const checkedValue = getCheckedValue(props.children);
	      	value = checkedValue;
	    }
	    this.state = {value};
	}
	
	componentWillReceiveProps(nextProps: RadioGroupProps) {
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
	
	onRadioChange = (value) => {
	    const lastValue = this.state.value;
	    if (!('value' in this.props)) {
	      	this.setState({
	        	value,
	      	});
	    }
	    const onChange = this.props.onChange;
	    if (onChange && value !== lastValue) {
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
						<Radio 
							key={index}
							disabled={this.props.disabled}
							value = {option} 
							title = {option} 
							select = {this.state.value||defaultValue}
							onChange = {this.onRadioChange}>
							{option}
						</Radio>
					);
				}else{ // 此处类型自动推导为 {label: string value: string disabled : boolean}
					return (
						<Radio 
							key={index}
							disabled={option.disabled || this.props.disabled}
							value = {option.value}
							title = {option.title} 
							select = {this.state.value||defaultValue}
							onChange = {this.onRadioChange}>
							{option.label}
						</Radio>
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
