// 
//  button.jsx
//  <project>
//  按钮事件
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 
import React from 'react';
import Less from './index.less'
import classnames from 'classnames';

export default class Button extends React.Component{
	render(){
		let {children,className,...params} = this.props;
		let btnClass = classnames(Less.btn,className);
		return (
			<button className={btnClass} {...params} ref="Button" >{children}</button>
		)
	}
}
