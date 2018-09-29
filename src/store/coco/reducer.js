
/**
 * 会议相关初始化
 */
import * as Type from '@/config/actionTypes';

let defaultState = {
	coco  : "",  //coco对象
	url   : '',  //coco链接的ip
	token : ''   //coco使用用户验证的token
}

//coco通信
export default function (state = defaultState, action) {
	switch (action.type) {
		//设置coco
		case Type.SET_COCO:
			return { ...state, coco: action.playload };
		
		//获取coco参数
		case Type.SET_COCO_PARAMS:
			return { ...state,...action.playload };
			
		default:
			return state;
	}
}
