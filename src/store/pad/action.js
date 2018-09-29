/**
 * pad action
 */

import * as Type from '@/config/actionTypes';
import wPad from '@/utils/wpad';
//import * as cocoAction from '@/store/coco/action';
import * as shareAction from '../share/action';

// 初始化Pad
export const initPad = () => {
    return (dispatch, getState) => {
        let {meetInfo} = getState();
        let {role,meetId,uid} = meetInfo;
        let pad = new wPad(role, meetId+"_"+uid);
        
        //添加截屏的按钮，并添加到dom元素中
        let tpl = `<li class="toolbar-item" title="截图"><span class="item-icon iconfont icon-screenshot" level="0"></span></li>`;
        let doms = [...getDomByHtml(tpl)][0];
        pad.padDom.querySelector(".toolbar-list").appendChild(doms);
        
        doms.addEventListener("click",()=>{
        	let {meetPluginObj:mp} = getState().setInfo;
        	// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  当前截屏逻辑⬇️⬇️ ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            // 1. 前端调用插件开启截图功能
            // 2. 插件打开截图功能并选择截图范围
            // 3. 插件将图片上传到server服务器
            // 4. 前端通过插件的监听事件,获取插件上传图片获取的返回值
            // 5. 前端通过白板的showFiles将图片演示出来
            // 6. 前端将服务器上的图片路径保存到后台上传文档的接口中
        	mp.plugin.captureScreen();
        });
        
        
        
        let data = {
            pad: pad,
            padDom: pad.padDom 
        }
        dispatch({
            type: Type.INIT_PAD,
            data: data 
        })
    }
}


//演示文档
export const showDoc = (params,fromId)=>{
	return (dispatch,getState) => {
		let {pad} = getState().padInfo.pad;
		pad.showFiles(params);
	}
}



const getDomByHtml = (tpl)=>{
	let div = document.createElement('div');
	div.innerHTML = tpl;
	return div.children;
}
