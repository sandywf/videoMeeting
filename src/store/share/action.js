// 
//  action.js
//  <project>
//  共享文档相关-action
//  Created by codyy on 2018-05-24.
//  Copyright 2018 codyy. All rights reserved.
// 

import * as Type          from '@/config/actionTypes';
import {shareApi}         from '@/api';
import * as cocoAction    from '@/store/coco/action';
import * as padAction     from '@/store/pad/action';
import { handleMsgToMobile } from '../../store/coco/mobileAction';

//从后台获取上传文件列表
export const getShareDocList = ()=>{
	return async (dispatch, getState) => {
		let { meetId } = getState().meetInfo;
		let list  =await shareApi.getShareDocList(meetId);
		dispatch({
			type     : Type.UPDATE_SHARE_DOC_LIST,
			playload : list.result
		});
		dispatch(checkTrans());
	}
}

//删除共享文档
export const delShareDoc = (id,fromUid)=>{
	return async (dispatch, getState) => {
		let { meetId } = getState().meetInfo;
		let { shareDocList } = getState().shareInfo;
		
		if( !fromUid ){
			await shareApi.delShareDoc(id,meetId);
			dispatch(cocoAction.callAll("shareAction.delShareDoc",id));
		}
		
		let list = shareDocList.filter(item=>item.meetDocumentId !== id);
		dispatch({
			type     : Type.UPDATE_SHARE_DOC_LIST,
			playload : list
		});
	}
}


//保存文档到reserversource服务器
export const saveShareFileToResourceServer = (obj)=>{
	return async (dispatch, getState) => {
		let { saveFile,doTrans } = getState().meetInfo.uploadObj;
		let {files}  = await shareApi.saveShareFileToResourceServer(saveFile,{ids:obj.successVal.id});
		// 如果没有返回结果或者报错则用传过来的参数obj
		let file = files && files.length > 0 ? files[0] : obj;
		let paramsType = obj.type;
		
		if( obj.type === 'application' ){
			//获取文件信息，判断是否需要进行文档转换
			await shareApi.transformDocToImage(doTrans,{
				filePath   : file.filePath,
				transType  : "png",
				noticeType : "http"
			});
            await shareApi.transformDocToImage(doTrans,{
                filePath   : file.filePath,
                transType  : "pdf",
                noticeType : "http"
            });
			paramsType = 'doc';
		}else if( obj.type === 'image' ){
			paramsType = 'img';
		}
		
		//保存到服务器后台
		let params = {
			docSize          : file.size,
			dynamicPPTFlag   : "N",
			filePath         : file.filePath,
			originName       : file.originName,
			serverResourceId : file.id,
			type             : paramsType
		};
		return dispatch(saveShareDoc(params));
	}
}

//保存文档到平台后台
//	 * 	docSize	文件大小	string	
//	 *	dynamicPPTFlag	动态ppt转换标志：Y/是，N/否	string	
//	 *	filePath	文件路径	string	
//	 *	originName	文件原始名称	string	
//	 *	page	文件页数	number	
//	 *	serverResourceId	资源服务器文件id	string	
//	 *	type	文档类型（文件为 doc）	string
export const saveShareDoc = (params,fromUid)=>{
	return async (dispatch, getState) => {
		let {result:fileObj}  = await shareApi.saveShareDoc(params);
		dispatch(addShareDoc(fileObj));
		//通知其他人，保存文件信息
		dispatch(cocoAction.callAll("shareAction.addShareDoc",fileObj));
	    handleMsgToMobile("shareAction.addShareDoc",fileObj);
	}
}


export const addShareDoc = (obj)=>{
	return async (dispatch, getState) => {
		dispatch({
			type     : Type.Add_SHARE_DOC_LIST,
			playload : obj
		});

		//获取列表中，所有正在进行转换的文档，然后轮巡去检查转换的状态
		dispatch(checkTrans());
	}
}


//轮巡检测后台判断是否已经转换文档结束
let checkIng = false;  //是否正在检测中
export const checkTrans = ()=>{
	return async (dispatch, getState) => {
		//如果已经在检测循环中，则不在触发额外的检测
		if( checkIng ) return;
		
		let { shareDocList } = getState().shareInfo;
		let ids = shareDocList.filter(item=> item.transStatus === 'TRANS_PENDDING').map(item=>item.meetDocumentId);
		
		//如果当前状态下没有正在转换的文件择结束
		if( ids.length === 0 ){
			checkIng = false;
			return;
		}
		
		checkIng = true;
		
		//轮巡文件
		let {result:files} = await shareApi.getShareDocTransStatus(ids);
		//判断结果，更新状态到当前的列表中
		let list = shareDocList.map(item=>{
			let fileObj = files.find(file=>file.meetDocumentId === item.meetDocumentId );
			if( fileObj ){
				return 	fileObj;
			}else{
				return item;
			}
		});
		
		dispatch({
			type     : Type.UPDATE_SHARE_DOC_LIST,
			playload : list
		});
		
		//隔一秒以后进行下一次轮巡检测
		setTimeout(()=>{
			checkIng = false;
			dispatch(checkTrans());
		},1500);
		
	}
}



//锁屏解锁
export const toggleLockShareDoc = (params)=>{
	return async (dispatch, getState) => {
		let { shareDocList } = getState().shareInfo;
		let {id,type} = params;
		let docObj = shareDocList.find(item=>item.meetDocumentId===id);
		let { role } = getState().meetInfo;
		
		if( role === "MAIN" ){
			await shareApi.toggleLockShareDoc(id,type);
			dispatch(cocoAction.callAll("shareAction.toggleLockShareDoc",params));
		}
		
		docObj.locked = type?"Y":"N";
		dispatch({
			type     : Type.UPDATE_SHARE_DOC_LIST,
			playload : [...shareDocList]
		});
	}
}

//下载共享文件
export const downloadDoc = (path,name)=>{
	return async (dispatch, getState) => {
		let {downDoc} = getState().meetInfo.uploadObj;
		
		let eleLink = document.createElement('a');
	    eleLink.download = name;
	    eleLink.style.display = 'none';
	    //eleLink.target = "_blank";
	    eleLink.href = downDoc+"&filePath="+path;
	    document.body.appendChild(eleLink);
	    eleLink.click();
	    document.body.removeChild(eleLink);
	}
}


//演示共享文档
export const showShareDoc = (fileObj,extendParam) => {
	return async (dispatch, getState) => {
		let {meetId,uid} = getState().meetInfo;
		let {serverAddress,serverParams} = getState().meetInfo.uploadObj;
		let imgs = [];
		if( fileObj.type === "img" ){
			imgs.push(serverAddress+"/"+fileObj.documentPath+"?"+serverParams);
		}else if( fileObj.type === "doc" ){
			imgs = JSON.parse(fileObj.transFile).map(item=>{
				return serverAddress+"/"+item.filePath+"?"+serverParams;
			});
		}
		let params = {
			files   : imgs,
            newTab  : true,
            isShow  : true,
            from    : meetId+"_"+uid,
            tabId   : fileObj.meetDocumentId,
            tabName : fileObj.documentName
		}
		
		let resultParams = {...params,...extendParam};

		// 演示是调用此接口,主要为了提供给移动端使用
        await shareApi.showDocToMobile({documentId: fileObj.meetDocumentId,pageNum: fileObj.pageNum})

		//演示文档
		dispatch(padAction.showDoc(resultParams, true));
	}
}
