//展开，收起按钮
import React, { Component } from 'react';
import Less from './index.less';
import * as cn from "classnames";

export default class Switch extends Component {
	
	componentDidMount(){
		//绘制canvas
		let canvas = this.refs.switch,
			ctx = canvas.getContext("2d");
			
			canvas.width = 80;
			canvas.height = 20;
			ctx.fillStyle='#373737';
			ctx.moveTo(0,0);
			ctx.quadraticCurveTo(10,17,20,17);
			ctx.lineTo(60,17);
			ctx.quadraticCurveTo(70,17,80,0);
			ctx.shadowOffsetX = 0; // 阴影Y轴偏移
			ctx.shadowOffsetY = 3; // 阴影X轴偏移
			ctx.shadowBlur = 3; // 模糊尺寸
			ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'; // 颜色
			ctx.fill();
	}
	
    render(){
		let {props} = this,
			classnames = cn(props.className,Less.switch,{[Less.close] : props.status});
        return (
			<div {...props} className={classnames} >
				<canvas  ref="switch"></canvas>
				<span></span>
			</div>
        );
    }
}
