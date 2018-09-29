/**
 * 创建store
 */
import {createStore, combineReducers, applyMiddleware} from 'redux';
import userInfo from './user/reducer';
import meetInfo from './meet/reducer';
import setInfo from './settings/reducer';
import popupInfo from './popup/reducer';
import cocoInfo from './coco/reducer';
import padInfo from './pad/reducer';
import msgInfo from './message/reducer';
import shareInfo from "./share/reducer";
import thunk from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import * as Type from "@/config/actionTypes";

let middle;
if(process.env.NODE_ENV === 'development' ){
	//middle = 	applyMiddleware(thunk,createLogger());
	 middle = 	applyMiddleware(thunk);
}else{
	middle = 	applyMiddleware(thunk);
}

let store = createStore(
    combineReducers({
        userInfo,              //参会者相关
        meetInfo,              //会议相关
		setInfo,               //设置相关
		popupInfo,             //弹框相关 
        cocoInfo,              //coco相关
        padInfo,               //白板
        msgInfo,
        shareInfo,             //共享文档
    }),
    middle
);
window.STORE = store;
export default store;


//绑定一些特殊情框
//1、页面resize的时候，更新stroe的值
window.addEventListener('resize',()=>{
	store.dispatch({type : Type.UPDATE_RESIZE_TIME});
});
