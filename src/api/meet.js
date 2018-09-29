import urls from "@/config/apiUrl";
import { Net } from '@/utils';

class meetApi extends Net {
    /**
     * 获取会议初始化信息
     */
    initData(mkey) {
        return this.get(urls.initData, { mkey })
    }

    /**
     * 获取coco服务器
     */
    getCocoServer(params) {
        return this.post(urls.getCocoServer, params);
    }

    /**
     * 开始会议
     */
    startMeeting(params) {
        return this.post(urls.startMeeting, params);
    }

    // 结束会议
    endMeeting(params) {
        return this.post(urls.endMeeting, params);
    }

    // 参会者退出会议
    logoutMeeting(params){
        return this.post(urls.logoutMeeting, params);
    }

    
    /**
     * 设置轮巡设置
     */
    setPollingSetting(params){
    	return this.post(urls.setPollingSetting, params);
    }
    
    /**
     * 是否开启轮巡
     */
    startPolling(params){
    	return this.post(urls.startPolling, params);
    }

    saveNote(params){
        return this.post(urls.saveNote, params);
    }

    //  更新信息
    updataMeetInfo(){
        return this.post(urls.updataMeetInfo, {});
    }
    
    //根据文件id获取文件路径-主要用于插件截图后将图片显示在白板上
    getFileByFileId(fileId){
    	return this.post(urls.getFileByFileId,{fileId});
    }
    
}

export default new meetApi();