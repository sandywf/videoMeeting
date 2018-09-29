/**
 * 切换大画面下拉框功能
 */
/**
 * 需求
 * 1、在自动模式下
 *   隐藏【快捷切换大画面】按钮；并且禁止快捷键
 * 
 * 	 2、画面列表只有一个的时候
 *   隐藏【快捷切换大画面】按钮；
 */



import React, { Component } from 'react'
import * as cn from "classnames";
import style from './header.less';
import {connect} from 'react-redux';
import {setVideoSetting} from '@/store/settings/action';

class SelectScreen extends Component {
	
    constructor (props){
        super(props);
        this.state = {
            active   : false,  //点击事件触发的显示，隐藏
            hasHover : true,   //用户取消鼠标hover事件，方法暂时不显示下拉框，是浮动状态消失，然后隔一会儿，在添加元素，这个时候元素上的hover状态没有了
        }
        this.toggleShow = this.toggleShow.bind(this);
    }
	
	//点击触发切换
    toggleShow(){
    	let active = this.active?true:this.state.active;
    	this.active = false;
        this.setState({
            active   : !active,
            hasHover : !active
        },()=>{
        	//判断当前状态
	        if( this.state.active ){
	        	setTimeout(()=>{
	        		window.addEventListener('click',this.toggleShow)
	        	},0);
	        }else{
	        	window.removeEventListener('click',this.toggleShow)
	        }
        });
    }
    
    onMouseEnter(){
    	this.setState({
	        hasHover : true
	    });
    }
    

    //选择机位
    switchBigScreen(id){
    	let {setVideoSetting} = this.props;
    	setVideoSetting({bigScreen:id});
    	this.active = true;
    }
    
    
    _renderList() {
    	//产品需求-移入和点击都能触发，需要特殊处理
    	let {mainScreen,screenList} = this.props;
        return (
            <ul className={cn(style['drop-ul'],{[style['drop-ul-show']]:this.state.active})}>
            	{screenList.map((screen,key)=>(
            		<li title={screen.name} key={screen.id} className={cn({[style['selected']]:screen.id === mainScreen})} 
            			onClick={this.switchBigScreen.bind(this,screen.id)}>
            			<span>{screen.name}</span>
            			<span>Ctrl+Shift+{key+1}</span>
            		</li>
            	))}
            </ul>
        )
    }

    render() {
    	let {mainScreen,screenList,mode} = this.props;
    	let {active,hasHover} = this.state;
        let opList = this._renderList();
        let styleClass = cn(
        	style.operation,
        	style['drop-down'],
        	{[style['hover']]:!active && hasHover },
        	{[style['selected']]:active }
        );
        let index = screenList.findIndex(item=>item.id===mainScreen) + 1;
        
        if( screenList.length <= 1 || mode === 1 ){
        	return null;
        }
        
        return (
        	<div className={styleClass}  onClick={this.toggleShow} onMouseEnter={this.onMouseEnter.bind(this)}>
        		<div className={style['main-screen']}>
        			<span title="切换大画面">{index}</span>
        			{opList}
        		</div>
            </div>
        )
    }
}



let mapStateToProps = state=>({
	mainScreen  : state.setInfo.bigScreen,       //主讲的画面
	screenList  : state.setInfo.screenList,      //摄像机列表
	mode        : state.setInfo.mode,            //导播模式
});

let mapDispatchToProps = {
	setVideoSetting
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectScreen);
