
/**
 *  弹框的显示隐藏
 */
import * as Type from '@/config/actionTypes';

let defaultState = {
    switchVideoSetting: false,          // 视频设置弹框
    videoLayoutSetting: false,          // 视频布局设置弹框
    shareDoc: false,                    // 共享文档 
    fullScreen: '',                     // 要最大化的画面，参数为画面对应的uid；
    sortVideo: false,                   // 视频排序
    polling : false,                    // 轮巡弹框
    invite: false,                      // 邀请
    type: 'watch',                       
    logout: false                       // 退出会议
}

if( process.env.NODE_ENV === "development" ){
	defaultState.switchVideoSetting = false;
}


export default function (state = defaultState, action) {
    switch (action.type) {
        case Type.SWITCH_VIDEO_SETTING:
            return { ...state, ...action.playload };
        case Type.VIDEO_LAYOUT_SETTING:
            return { ...state, ...action.playload };
        case Type.SHARE_DOC:
            return { ...state, ...action.playload };
        case Type.SWITCH_FULL_SCREEN:
            return { ...state, ...action.playload };
        case Type.SWITCH_SORT_VIDEO:
            return { ...state, ...action.playload };
        case Type.SWITCH_POLLING_SETTING:
            return { ...state, ...action.playload };
        case Type.SWITCH_INVITE_POPUP:
            return { ...state, ...action.playload };
        case Type.SWITCH_LOGOUT_POPUP:
            return { ...state, ...action.playload };
        default:
            return state;
    }

}
