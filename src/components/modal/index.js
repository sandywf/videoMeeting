import Modal  from "./modal";
import React  from 'react';
import ReactDOM from 'react-dom';


//confirm 弹框
Modal.confirm = (params)=>{
	let el = document.createElement('div');
	el.id = Date.now();
	document.body.appendChild(el);
	
	function onCancel(tag){
		render({modalType:'confirmPop',...params,visible:false,onCancel,afterClose:destroy.bind(this,tag)});
	}
	
	function destroy(tag){
		const unmountResult = ReactDOM.unmountComponentAtNode(el);
		if (unmountResult && el.parentNode) {
    		el.parentNode.removeChild(el);
		}
		
		if( !tag && params.onCancel && typeof params.onCancel === 'function' ){
			params.onCancel();
		}
	}
	
	function render(props){
		ReactDOM.render(<Modal {...props}><span>{params.content}</span></Modal>, el);
	}
	
	render({modalType:'confirmPop', ...params, visible: true, onCancel });
	
	return {
		close: ()=>{
			onCancel(true);
		}
	};
}



//alert 弹框
Modal.alert = (msg,tmpF,tmpP={})=>{
	let params = {},mode = "";
	params.modalType = 'alertPop';
	params.cancelBtn = false;
	params.content = msg;
	params.onSure = ()=>{
		mode && mode.close();
	};
	
	if( tmpF ){
		if( typeof tmpF === "function" ){
			params.onSure = ()=>{
				tmpF();
				mode && mode.close();
			};
			params = {...params,...tmpP};
			
		}else if( typeof tmpF === "object"  ){
			params = {...params,...tmpF,...tmpP};
		}
	}
	
	mode = Modal.confirm(params);
	return mode;
}


export { Modal }
