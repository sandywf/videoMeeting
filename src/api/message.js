/**
 * 消息
 * 
 */

import {Net} from '@/utils/index'
class messageApi extends Net{
    /**
     * 获取消息列表
     */
    async getMessageList(){
        try{
            let result = await this.axios();
            return result;
        } catch (err) {

        }
    }
}

export default new messageApi();