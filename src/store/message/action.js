/**
 * user action
 */

import * as Type from '@/config/actionTypes';
import * as cocoAction  from "@/store/coco/action";
export const sendMsg = (data) => {
    return (dispatch, getstate)=>{
        dispatch({
            type: Type.ADD_MSG,
            params: data 
        })

        if(data.type === 'group') {
           dispatch(cocoAction.callAll('msgAction.addMsg', data))
        } else if (data.type === 'single'){
            dispatch(cocoAction.callOne(data.to, 'ADD_MSG', data))
        }
    }
}

export const addMsg = (data) => {
    return  {
        type: Type.ADD_MSG,
        params: data
    }
}

export const changeTab = (data) => {
    return  {
        type: Type.CHANGE_TAB,
        data: data 
    }
}

// 切换私聊用户
export const changeTalkWith = (data) => {
    return  {
        type: Type.CHANGE_TALK_WIDTH,
        data: data 
    }
}

// 切换私聊用户
export const toggleList = (data) => {
    return  {
        type: Type.TOGGLE_LIST,
        data: data 
    }
}

// 添加私聊发言人
export const addSingleTalkUser = (data) => {
    return  {
        type: Type.ADD_SINGLE_TALK_USER,
        data: data 
    }
}

// 移除私聊发言人
export const removeSingleTalkUser = (data) => {
    return  {
        type: Type.REMOVE_SINGLE_TALK_USER,
        data: data 
    }
}



