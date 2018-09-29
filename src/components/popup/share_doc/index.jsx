//视频设置弹框
import React, { Component } from 'react';
import Less from './index.less';
import { connect } from 'react-redux';
import { Button } from '@/components/tag';
import * as cn from "classnames";
import { default as Upload } from "@/utils/upload";
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';
import { 
	getShareDocList,
	delShareDoc,
	showShareDoc,
	saveShareFileToResourceServer,
	toggleLockShareDoc,
	downloadDoc
} from '@/store/share/action';



//翻译状态
const getStatus = (status,message)=>{
	let result = "";
	switch( status ){
		case 'loaded'    : result = "等待上传";break;
		case 'uploading' : result = "正在上传";break;
		case 'pause'     : result = "暂停上传";break;
		case 'complete'  : result = "上传完成";break;
		case 'error' :
			if( message === 'formatError' ){
				result = "格式错误";
			}else if( message === "largeError" ){
				result = "文件太大";
			}else if( message === "serverError" ){
				result = "服务错误";
			}
		break;
		default:break;
	}
	return result;
}


class ShareDoc extends Component {
	
	static defaultProps = {
        options: {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars : true,
            interactiveScrollbars : true
        }
    }
	
	constructor(props){
		super(props);
		this.state = {
			uploadList : []
		}
		this.showShareDoc  = this.showShareDoc.bind(this);
		this.toggleLockDoc = this.toggleLockDoc.bind(this);
		this.downloadDoc   = this.downloadDoc.bind(this);
		this.deleteDoc     = this.deleteDoc.bind(this);
	}
	
	componentDidMount(){
		let { Button } = this.refs.uploadBtn.refs,
			{getShareDocList,uploadObj,saveShareFileToResourceServer,userType} = this.props,
			{uploadFile} = uploadObj;
		
		//从后台获取上传文件的列表
		getShareDocList();
		
		if( userType === "watch" ) return;
		
		//绑定文档上传插件
		Upload.init(Button,{
			"canMultiple" : true, //是否支持多文件上传
			"canAuto"     : true, //选中文件后是否自动上传     true：自动上传；      false:不自动上传；
			"accept"      : '',   //上传文件的类型   [image,video,audio,zip,application]  为空时全选
			"url"         : uploadFile + "&type=document&validateFlag=true&sequence=111",
			"breakPoint"  : false, //是否开启断点续传
			"_suff"       : ".jpg,.gif,.png,.jpeg,.bmp,.pdf,.doc,.ppt,.docx,.pptx,.xls,.xlsx,.PDF,.DOC,.PPT,.DOCX,.PPTX,.XLS,.XLSX" //获取文件可获取的后缀,强制后缀，为了一些特殊的格式
		}).on('select',(files)=>{
			//添加选中文件
			let {uploadList} = this.state;
			files.forEach(item=>{
				//根据不同的状态显示内容
				item.c_status = getStatus(item.status,item.message);
				//文档包括Office文档、pdf文档、图片
				let suff = item.file.suff;
				if( ".jpg,.gif,.png,.jpeg,.bmp".indexOf(suff) !== -1 ){
					//图片类型
					item.url = uploadFile + "&type=image&validateFlag=true&sequence=111";
					item.type = "image";
				}else if( ".pdf,.doc,.ppt,.docx,.pptx,.xls,.xlsx,.PDF,.DOC,.PPT,.DOCX,.PPTX,.XLS,.XLSX".indexOf(suff) !== -1  ){
					//文档类型
					item.url = uploadFile + "&type=document&validateFlag=true&sequence=111";
					item.type = "application";
				}
			});
			let list = [...files,...uploadList];
			//添加数据
			this.setState({
				uploadList : list
			});
		}).on("removeFile",(tagId)=>{
			//删除选中文件
			let {uploadList} = this.state;
			let list = uploadList.filter(item=>item.tagId !== tagId );
			this.setState({
				uploadList : list
			});
		}).on("oneFinish",(file)=>{
			//某个文件上传结束触发
			let {uploadList} = this.state;
			let list = uploadList.map(item=>{
				if( item.tagId === file.tagId ){
					item = file;
					item.c_status = getStatus(item.status,item.message);
				}
				return item;
			});
			this.setState({
				uploadList : list
			},()=>{
				//如果文件上传成功-则保存到server服务器上
				//并保存到系统服务后台
				if( file.status === 'complete' ){
					saveShareFileToResourceServer(file).then(()=>{
						file.cancel();
					});
				}
			});
		}).on('oneProgress',(file)=>{
			//某个文件上传进度修改
			let {uploadList} = this.state;
			let list = uploadList.map(item=>{
				if( item.tagId === file.tagId ){
					item = file;
					item.c_status = getStatus(item.status,item.message);
				}
				return item;
			});
			this.setState({
				uploadList : list
			});
		});
	}
	
	//演示文档
	showShareDoc(item){
		this.props.showShareDoc(item);
	}
	
	//锁定解锁文档-（锁定后文档不能下载）
	toggleLockDoc(item,type){
		this.props.toggleLockShareDoc({
			id:item.meetDocumentId,
			type
		});
	}
	
	//下载文档
	downloadDoc(item){
		this.props.downloadDoc(item.documentPath,item.documentName);
	}
	
	//删除文档
	deleteDoc(item){
		this.props.delShareDoc(item.meetDocumentId);
	}


	//获取文档列表
	_renderList() {
		let { shareDocList,whiteBoard,title,realName,userType,uid } = this.props,
			{ uploadList } = this.state,
			docLis = [];


		if( (shareDocList.length+uploadList.length) === 0 ){
			docLis.push(
				<li key="none" className={Less['doc-none']}>暂无可用文档</li>
			);
		}else{
			//上传相关
			uploadList.forEach(item=>{
				docLis.push(
					<li key={item.tagId}>
						<div className={Less['doc-title']} title={item.name}>{item.name}</div>
						<div className={Less['doc-source-name']} title={title}>{realName}</div>
						<div className={cn(Less['doc-options'],'iconfont')}>
							<span className="f14 mr10">{item.status === "uploading"?Math.round(item.rate*100)+"%":item.c_status}</span>
							<i title="删除" className="icon-close" onClick={item.cancel.bind(item)}/>
						</div>
					</li>
				);
			});
			//列表相关
			shareDocList.forEach(item=>{
				let lockClass = cn(
					{"Y":"icon-locking","N":"icon-unlock"}[item.locked],
					{[Less['no-event']]:userType !== "MAIN"}
				);

				let opt = [];
				
				//演示文件
				let showFile = (userType === "MAIN" || whiteBoard)?
									(<i key="showFile" title="演示" onClick={()=>this.showShareDoc(item)}  className="icon-show"/>):null;
				//锁定文件
				let lockFile = item.locked==="Y"?
								(<i key="lockFile" title="解锁" onClick={()=>this.toggleLockDoc(item,false)} className={lockClass}/>):
								(<i key="lockFile" title="锁定" onClick={()=>this.toggleLockDoc(item,true)} className={lockClass}/>);
				//下载文件
				let downFile = (userType === "MAIN" || item.locked==="N" )?
								(<i key="downFile" title="下载" onClick={()=>this.downloadDoc(item)}  className="icon-download-notebook"/>):null;
				//删除文件
				let delFile = (userType === "MAIN" || item.uploadUserId === uid )?
								(<i key="delFile" title="删除" onClick={()=>this.deleteDoc(item)} className="icon-close"/>):null;
				
				//转换状态提示
				if( item.transStatus === "TRANS_SUCCESS" ){
					opt = [showFile,lockFile,downFile,delFile];
                    // 转换结束还需要转换成pdf

				}else{
					let transTag = (<span key="transTag" className="f14 mr10">{{'TRANS_TRANSING':'文档转换中','TRANS_FAILED':'转换失败'}[item.transStatus] || '文档转换中'}</span>);
					opt = [transTag,delFile];
				}
				
				docLis.push(
					<li key={item.meetDocumentId}>
						<div className={Less['doc-title']} title={item.documentName.replace(/&amp;/g, '&')}>{item.documentName.replace(/&amp;/g, '&')}</div>
						<div className={Less['doc-source-name']} title={item.uploaderName}>{item.uploaderName}</div>
						<div className={cn(Less['doc-options'],'iconfont')}>
							{opt}
						</div>
					</li>
				);
			});
		}
		return docLis;
	}

	render() {
		let {userType} = this.props;
		return (
			<div className={Less['share-doc']}>
				<div  className={Less['share-list']}>
				<ReactIScroll iScroll={iScroll} options={this.props.options}>
                    <ul>{this._renderList()}</ul>
                </ReactIScroll>
                </div>
				{userType !== "watch"?<Button ref="uploadBtn" className={Less['share-doc-upload']}>开始上传</Button>:null}
			</div>
		);
	}
}


let mapStateToProps = state => {
	let { uid:tag,uploadObj }                      = state.meetInfo,
		{ shareDocList }                           = state.shareInfo,
		{ getUserObj }                             = state.userInfo,
		{whiteBoard,title,realName,userType,uid}   = getUserObj(tag) || {};
	return {
		uploadObj,         //文件服务器相关接口
		shareDocList,      //共享的列表
		whiteBoard,        //是否可以白板
		title,             //用户的title
		realName,          //用户的名称
		userType,          //角色类型
		uid                //用户的id
	}
};


let mapDispatchToProps = {
    getShareDocList,
	delShareDoc,
	saveShareFileToResourceServer,
	toggleLockShareDoc,
	downloadDoc,
	showShareDoc
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareDoc);