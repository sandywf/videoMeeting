
/**
 * 共享文档
 */
import * as Type from '@/config/actionTypes';

let defaultState = {
	//获取共享文档的列表
	shareDocList   : []       //共享文档的列表
}

//coco通信
export default function (state = defaultState, action) {
	switch (action.type) {
		//更新共享文档列表
		case Type.UPDATE_SHARE_DOC_LIST : 
			return {
				...state,
				shareDocList : action.playload
			};
		//列表添加值
		case Type.Add_SHARE_DOC_LIST :
			{
				state.shareDocList.unshift(action.playload);
				return {
					...state,
					shareDocList : [...state.shareDocList]
				};
			}
		default:
			return state;
	}
}
