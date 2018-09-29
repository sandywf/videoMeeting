/**
 * 共享文档相关列表
 */
import urls from "@/config/apiUrl";
import {Net}  from '@/utils';
//import {userList} from '@/mock/user'

class Share extends Net{
	
    /**
     * 获取共享文档列表
     * @param {obj} id  当前会议ID
     */
    getShareDocList(mid) {
    	return this.get(urls.getShareDocList, {mid});
    }

	/**
	 * 删除共享文档
	 */
	delShareDoc(documentId,mid){
		return this.post(urls.delShareDoc, {documentId,mid});
	}
	
	/**
	 * 获取共享文档转换的状态
	 */
	getShareDocTransStatus(docIds){
		return this.get(urls.getShareDocTransStatus, {docIds});
	}
	
	/**
	 * 将上传结果保存到resourceServer服务器上
	 * url：路径
	 * params：参数
	 */
	saveShareFileToResourceServer(url,params){
		return this.p_get(url,params,{selfHandle:true});
	}
	/**
	 * 通知server服务器进行转码
	 */
	transformDocToImage(url,params){
		params.noticeUrl = urls.transShareDocReceiveNotice;
		return this.p_get(url,params,{selfHandle:true});
	}
	
	/**
	 * 保存共享文档
	 * {
	 * 	docSize	文件大小	string	
	 *	dynamicPPTFlag	动态ppt转换标志：Y/是，N/否	string	
	 *	filePath	文件路径	string	
	 *	originName	文件原始名称	string	
	 *	page	文件页数	number	
	 *	serverResourceId	资源服务器文件id	string	
	 *	type	文档类型（文件为 doc）	string
	 * }
	 */
	saveShareDoc(params){
		return this.post(urls.saveShareDoc,params);
	}
	
	/**
	 * 锁定解锁文档
	 * documentId	文档ID	string	
 	 * type	锁定标志：Y/是，N/否	string	
	 */
	toggleLockShareDoc(documentId,type){
		type = type === true?"Y":"N";
		return this.post(urls.toggleLockShareDoc,{documentId,type});
	}

    /**
     * 将上传结果保存到resourceServer服务器上
     * url：路径
     * params：参数
     */
    showDocToMobile(params){
        return this.post(urls.changeDocPage,params);
    }

    transDocToPdf(url, params){
        return this.post(url,params);
    }
	
}

export default new Share();