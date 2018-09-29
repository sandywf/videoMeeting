import React,{Component} from 'react';
import dialogCss from './dialog.less';
import {default as cn} from 'classnames';

let uuid=1;             //弹出框的唯一码

export default class Dialog extends Component{
	constructor(props){
		super(props);
		this.state = {isShow : props.visible};
		this.mounted = false;
		this.onDragMousedown = this.onDragMousedown.bind(this);
		this.setSure   = this.setSure.bind(this);
		this.setCancel = this.setCancel.bind(this);
		this.onSure    = this.onSure.bind(this);
		this.onCancel  = this.onCancel.bind(this);
	};
	
	//组件加载前
	componentWillMount(){
		this.titleId = 'myDialog' + uuid++;
	}
	
	//组件加载后
	componentDidMount(){
		this.componentDidUpdate();
		this.mounted = true;
	}
	
	
	//更新组件
	componentDidUpdate(prevProps={}){
		let props = this.props;
		let {main,modal,mask} = this.refs;
		if( props.visible && !prevProps.visible ){
			this.setState({
				isShow : true
			});
			
			setTimeout(()=>{
				modal.classList.add(dialogCss.in);
				main.style.left = (document.body.clientWidth - main.clientWidth) / 2 + "px";
				main.style.top  = (document.body.clientHeight - main.clientHeight) / 2 + "px";
				if( mask ){
					mask.style.opacity =  props.maskOpacity;
				}
			},0);
		
			
			if( props.time ){
				setTimeout(()=>{
					props.onCancel();
				},props.time);
			}
			
		}else if( ( !props.visible && prevProps.visible ) ){
			modal.classList.remove(dialogCss.in);
			if( mask ){
				mask.style.opacity =  props.maskOpacity;
			}
			setTimeout(()=>this.setState({isShow : false}),300);       //页面关闭
		}
		
		if( this.props.onDialogState && typeof(this.props.onDialogState) === 'function' ){
			this.props.onDialogState(this.state.isShow);
		}
	}
	
	//弹出框拖动事件
	onDragMousedown( event ){
		if( !this.props.dragAble ){
			return;
		}
		let	main = this.refs.main,
			disX = event.clientX - main.offsetLeft,
			disY = event.clientY - main.offsetTop;
		//鼠标移动，窗口移动
		document.onmousemove = function(event){
			var e = event || window.event,
				maxW = document.documentElement.clientWidth - main.offsetWidth,
				maxH = document.documentElement.clientHeight - main.offsetHeight,
				posX = e.clientX - disX,
				posY = e.clientY - disY;
			if(posX < 0) {
				posX = 0;
			} else if(posX > maxW) {
				posX = maxW;
			}
			if(posY < 0) {
				posY = 0;
			} else if(posY > maxH) {
				posY = maxH;
			}
			main.style.left = posX + 'px';
			main.style.top = posY + 'px';
		}
		//鼠标松开，窗口将不再移动
		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}

	
	//设置确认按钮的事件
	setSure(fn){
		this.onSureBack = fn;
	}
	
	//设置关闭的回调事件
	setCancel(fn){
		this.onCancelBack = fn;
	}
	
	//设置底部的确认按钮
	onSure(){
		let {onSure,onCancel} = this.props;
		if( this.onSureBack && typeof this.onSureBack === "function" ){
			this.onSureBack();
		}else if( onSure && typeof onSure === 'function' ){
			onSure();
		}else{
			onCancel();
		}
	}
	
	//设置底部的取消按钮
	onCancel(){
		if( this.onCancelBack && typeof this.onCancelBack === "function" ){
			this.onCancelBack();
		}else{
			this.props.onCancel();
		}
	}
	
	//获取tpl模板
	createDom(){
		let $ = this,
			props = $.props,
			{setSure,setCancel} = this;
			
		let dialogModal = cn({
			[dialogCss['dialog-modal']]  : true,
			[dialogCss['has-mask']]      : props.mask,                            //遮罩
			[dialogCss['drag-layer']]    : props.dragAble                         //拖动
		});
		
		let maskStyle = {
			opacity : (this.state.isShow && props.maskOpacity) || 0
		};
		
		let bodyStyle = {
			width :  props.width==='auto'?"atuo":props.width+"px",
			height : props.height?props.height+"px":null
			
		};
		
		if (props.minWidth)
			bodyStyle.minWidth = props.minWidth+"px";
		
		if(props.minHeight)
			bodyStyle.minHeight = props.minHeight+"px";
		
		const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child,{modal:{...props,setSure,setCancel}}));
		
		return (
			<div className={dialogCss.eulaDialog} >
				<div className={dialogModal} id ={dialogCss[props.modalType]}  ref="modal">
					{props.mask && (<div className={dialogCss['dialog-modal-backdrop']} style={maskStyle} ref="mask"></div>)}
					<div className={dialogCss['dialog-modal-wrap']}>
						<div className={dialogCss['dialog-modal-table']} ref="main">
							<div className={dialogCss['dialog-modal-content']}>
								
								{props.header && (<div className={cn(dialogCss['dialog-modal-header'],'iconfont')}  onMouseDown={this.onDragMousedown}>
									<span className={dialogCss['dialog-modal-icon']}></span>
									<h4 className={dialogCss['dialog-modal-title']}>{props.title }</h4>
									<span className={cn(dialogCss['dialog-modal-close'],'icon-close')}  onClick={this.onCancel}></span>
								</div>)}
								
								<div className={dialogCss['dialog-modal-body']} style={bodyStyle}>
									{childrenWithProps}
								</div>
								
								{props.footer && (<div className={dialogCss['dialog-modal-footer']}>
									{props.sureBtn   && (<button className={cn(dialogCss['dialog-btn'],dialogCss['default'])} onClick={this.onSure}>{props.sureText}</button>)}
									{props.cancelBtn && (<button className={cn(dialogCss['dialog-btn'],dialogCss['close'])} onClick={this.onCancel}>{props.cancelText}</button>)}
								</div>)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	
	
	render(){
		let dom = null;
		if( this.mounted && !this.props.closeStyle  ){
			dom = this.createDom();
		}else if( this.state.isShow || this.props.visible ){
			dom = this.createDom();
		}
		return dom;
	}
	
}


//暴露接口
//export const Dialog = {
//	tip: function(msg, params) {
//		//默认几秒后消失
//		var defaultConfig = {
//			header: false, //是否有头部
//			footer: false, //是否有尾部
//			content: msg, //提示内容
//			class: 'tipPop', //设置类名称
//			time: 1500, //0的时候不会自动关闭，否则几秒后自动关闭
//			mask: false, //遮罩层(false,true)
//			dragAble: true //是否应许拖动
//		};
//		return new LayerDir(Object.assign(defaultConfig, params || {}));
//	},
//	alert: function(params) {
//		return new LayerDir(params);
//	},
//	confirm: function(msg, trueFn, falseFn) {
//		var defaultConfig = {
//			title: "提示框",
//			content: "<div class='pl20' style='line-height:50px'>" + msg + "</div>", //提示内容
//			class: "confirmPop",
//			dragAble: false,
//			sure: function() {
//				if(trueFn && typeof(trueFn) == 'function') {
//					trueFn();
//				}
//				this.close();
//			},
//			cancel: function() {
//				if(falseFn && typeof(falseFn) == 'function') {
//					falseFn();
//				}
//				this.close();
//			},
//			sureText: "确认"
//		};
//		return new LayerDir(defaultConfig);
//
//	}
//};

Dialog.defaultProps= {
	visible       : false,    //是否已经使用了
	header        : true,     //是否有头部
	footer        : true,     //是否有尾部
	class         : '',       //设置类名称
	key           : "",       //获取标记
	title         : "提示",
	minWidth      : "",
	minHeight     : '',
	width         : "",
	height        : "",
	isFull        : false,     //是否全屏
	left          : "",        //dragAble=true 模式下执行，默认是居中
	top           : "",        //dragAble=true 模式下执行，默认是居中
	time          : 0,         //0的时候不会自动关闭，否则几秒后自动关闭
	content       : "",        //弹出层内容
	mask          : true,      //遮罩层(false,true)
	maskOpacity   : 0.2,       //遮罩层的透明度，默认全透明
	cancelBtn     : true,      //是否有关闭按钮
	sureBtn       : true,      //是否有确认按钮
	cancelText    : "取消" || "",  //关闭的文本
	sureText      : "确认" || "",  //保存的文本
	onCancel      : ()=>{},        //关闭方法
	onSure        : ()=>{},        //确认方法,
	closeStyle    : true,      //关闭模式：true：删除dom节点；false：隐藏的关闭模式
	dragAble      : true,      //是否应许拖动
	modalType     : '',        //弹出的类型 tipPop,confirmPop
	onDialogState :  ''        //监听弹框状态事件
};