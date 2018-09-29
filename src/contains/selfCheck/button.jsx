// 
//  button.jsx
//  <project>
//  自检按钮
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 
import React from 'react';
import Less from './index.less'
import classnames from 'classnames';

export default function({onClick,children}){
	let btnClass = classnames(Less.btn);
	return (
		<button className={btnClass} onClick={onClick}>{children}</button>
	)
};