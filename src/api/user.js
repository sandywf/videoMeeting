/**
 * 用户相关的 API
 */
import urls from "@/config/apiUrl";
import {Net}  from '@/utils';
//import {userList} from '@/mock/user'

class User extends Net{
    /**
     * 获取用户列表 
     * @param {obj} id  当前会议ID
     */
    getUserList(mid) {
    	return this.post(urls.getMemberList, {mid});
    }

     /**
     * 设置和取消 发言人 
     * @param {array} [params]  当前用户ID
     */
    toggleSpeaker(params) {
    	return this.post(urls.toggleSpeaker, params);
    }
    
    /**
     * 参会者的音视频开关
     * @param {obj} params  当前用户ID
     * {type：Y|N, uid: 'uid',value:'video||audio'}
     */
    toggleAudioAndVideo(params){
    	return this.post(urls.toggleAudioAndVideo, params);
    }
    
    
    /**
     * 参会者的文本聊天开关
     * @param {obj} params  当前用户ID
     * {type：Y|N, uid: 'uid'}
     */
    toggleChat(params){
    	return this.post(urls.toggleChat, params);
    }
    
    /**
     * 参会者的白板开关
     * @param {obj} params  当前用户ID
     * {type：Y|N, uid: 'uid'}
     */
    toggleWhitePad(params){
    	return this.post(urls.toggleWhitePad, params);
    }

    /**
     *  踢出会议
     * @param {obj} memberId:id  当前用户ID
     */
    kickOut(params){
    	return this.post(urls.kickOut, params);
    }

    
    
}

export default new User();