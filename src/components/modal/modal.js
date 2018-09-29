import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Dialog from './dialog';

export default class Modal extends Component{
	constructor(props){
		super(props);
		//必要onCancal
		if( !props.onCancel || typeof props.onCancel !== 'function' ){
			console.log("使用弹框，必要添加onCancel!");
		}
		this.onDialogState = this.onDialogState.bind(this);
		this.dialogState   = props.visible;
		this.el            = document.createElement('div');
	}
	
	componentDidMount(){
		this.componentDidUpdate();
	}
	
	componentDidUpdate(preProps={}){
		let {visible,afterClose,closeStyle} = this.props;
		if( visible ){
			this.el.style.display = "block";
		}
		
		if( visible && !this.el.parentNode ){
			//显示中
			document.body.appendChild(this.el);
		}else if( !visible && !this.dialogState && this.el.parentNode){
			if( closeStyle ){
				//关闭后
				document.body.removeChild(this.el);
				if( afterClose && typeof afterClose === 'function' ){
					afterClose();
				}
			}else{
				this.el.style.display = "none";
			}
			
		}
	}
	
	//监听dialog的状态
	onDialogState(dialogState){
		if( dialogState !== this.dialogState ){
			this.dialogState = dialogState;
			this.componentDidUpdate();
		}
	}
	
	componentWillUnmount(){
		this.el.parentNode && document.body.removeChild(this.el);
	}
	
	render(){
		const modalDom = (
			<Dialog onDialogState={this.onDialogState} {...this.props}>
				{this.props.children}
			</Dialog>
		);
		return ReactDOM.createPortal(modalDom,this.el);
	}
}
