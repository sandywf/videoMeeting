// 
//  actionTypes.js
//  <project>
//  redux action 的key值
//
//  Created by codyy on 2018-05-23.
//  Copyright 2018 codyy. All rights reserved.
// 



/**
 * 设置会议基础设置 type ---对应 meetInfo
 */

export const SET_MEETKEY            = 'SET_MEETKEY';
export const SET_HISTORY            = 'SET_HISTORY';
export const SET_INITDATA           = "SET_INITDATA";
export const HAS_NO_LOGIN           = "HAS_NO_LOGIN";          //登陆超时，未登录
export const SET_CHECK_STATUS       = "SET_CHECK_STATUS";      //自检相关设置
export const END_SELF_CHECK         = "END_SELF_CHECK";        //结束自检
export const START_RECORD           = "START_RECORD";          //开始录制
export const TOGGLE_HEADER_HEADER   = "TOGGLE_HEADER_HEADER";  //是否显示header
export const SET_MAIN_FULL          = "SET_MAIN_FULL";         //主显示区全屏
export const SET_SHARE_DESK         = "SET_SHARE_DESK";        //设置共享桌面
export const SET_SHARE_VIDEO        = "SET_SHARE_VIDEO";       //设置共享视频
export const SET_POLLING_SETTING    = "SET_POLLING_SETTING";   //设置轮巡配置

export const SWITCH_MODE       = "SWITCH_MODE";       //设置音响音量
export const SWITCH_ALL_USER_CHATTING      = "PROHIBIT_CHATTING";   // 切换 所有人的聊天功能是否可用
export const UPDATE_RESIZE_TIME     = "UPDATE_RESIZE_TIME";     // 主模块宽高改变的时候
export const UPDATE_MEET_TITLE     = "UPDATE_MEET_TITLE";     //  更新会议信息





/**
 * 参会者基础 type  --- 对应 userInfo
 */
 export const GET_USER_LIST = 'GET_USER_LIST';
 export const LOGIN = 'LOGIN';
 export const LOGOUT = 'LOGOUT';
 export const TOGGLE_SPEAKER = 'TOGGLE_SPEAKER'; // 取消和设置发言人
 export const TOGGLE_AUDIO = 'TOGGLE_AUDIO';     // 取消和设置音频
 export const TOGGLE_VIDEO = 'TOGGLE_VIDEO';     // 取消和设置视频
 export const TOGGLE_CHAT  = 'TOGGLE_CHAT';      // 取消和设置文本聊天
 export const TOGGLE_WHITE_PAD  = 'TOGGLE_WHITE_PAD';   // 取消和设置白板标注
 
 
 
 
 export const SEARCH = 'SEARCH';
 export const KICK_OUT = 'KICK_OUT';
 export const ADD_USER = 'ADD_USER';
 export const TOGGLE_SHOW_OP = 'TOGGLE_SHOW_OP'; // 控制用户操作菜单显示
 export const SWITCH_TAB = 'SWITCH_TAB'; // 切换分组
 export const UPDATE_LOGIN_STATUS = 'UPDATE_LOGIN_STATUS'; // 获取coco的在线用户列表后更新本地状态
 export const SET_USER_ONLINE_NUMBER = 'SET_USER_ONLINE_NUMBER';

 export const UPDATE_SPEAKER_LIST = 'UPDATE_SPEAKER_LIST'; // 获取coco的在线用户列表后更新本地状态
 export const SET_SPEAKER_LIST = 'SET_SPEAKER_LIST'; // 设置发言人列表
 export const UPDATE_USERLIST = 'UPDATE_USERLIST'; // 更新用户列表
 
 
 
 
 
 /**
  * 是否弹框集合  -- 对应 popupInfo
  */
  export const SWITCH_VIDEO_SETTING = "SWITCH_VIDEO_SETTING";  //视频设置弹框
  export const VIDEO_LAYOUT_SETTING = "VIDEO_LAYOUT_SETTING";  //视频布局设置弹框
  export const SHARE_DOC            = "SHARE_DOC";             //分享文档
  export const SWITCH_FULL_SCREEN   = "SWITCH_FULL_SCREEN";    //单画面全屏
  export const SWITCH_SORT_VIDEO   = "SWITCH_SORT_VIDEO";    // 画面排序
  export const SWITCH_POLLING_SETTING   = "SWITCH_POLLING_SETTING";    // 轮询设置
  export const SWITCH_INVITE_POPUP   = "SWITCH_INVITE_POPUP";    // 邀请弹窗
  export const SWITCH_LOGOUT_POPUP   = "SWITCH_LOGOUT_POPUP";    // 离开和结束会议

  
  
  
  /**
   * 设置相关--对应setInfo
   */
	export const SET_VIDEO_SETTING   = "SET_VIDEO_SETTING";       //设置视屏设置
	export const CHANGE_VIDEO_LAYOUT = "CHANGE_VIDEO_LAYOUT";     //修改视频布局
	export const SET_PLUGIN_JSON     = "SET_PLUGIN_JSON";         //获取插件的json
	export const SET_RTMP_URL        = "SET_RTMP_URL";            //获取rtmpurl
	export const SET_SCREEN_LIST     = "SET_SCREEN_LIST";         //获取设备列表
	export const SET_VIRTUAL_CAMERA  = "SET_VIRTUAL_CAMERA";      //获取虚拟摄像头
	export const SET_HIDE_VIDEO_ARR  = "SET_HIDE_VIDEO_ARR";      //设置要隐藏的视频集合
	export const SET_HIDE_AUDIO_ARR  = "SET_HIDE_AUDIO_ARR";      //设置要隐藏的音频集合  
	export const SET_DOBULE_SCREEN   = "SET_DOBULE_SCREEN";       //设置双屏画面
	export const SET_MEET_PLUGIN     = "SET_MEET_PLUGIN";         //设置会议插件对象
	export const SET_MEET_CAMERA     = "SET_MEET_CAMERA";         //设置会议摄像头
	export const SET_MICROPHONE_SOUND   = "SET_MICROPHONE_SOUND";   //设置麦克风音量
	export const SET_SOUND_VOLUME       = "SET_SOUND_VOLUME";       //设置音响音量
	export const SET_RECORD_STATUS      = "SET_RECORD_STATUS";      //开始，关闭录制状态
	export const SET_RECORD_TIME        = "SET_RECORD_TIME";        //开始，关闭录制状态
	
	export const SET_SHARE_VIDEO_DURATION = "SET_SHARE_VIDEO_DURATION";          //设置总共时长（s）
	export const SET_SHARE_VIDEO_CURRENT_TIME  = "SET_SHARE_VIDEO_CURRENT_TIME"; //设置当前时长
	export const SET_SHARE_VIDEO_PLAY  = "SET_SHARE_VIDEO_PLAY";                 //设置是否播放
	export const SWITCH_LOCK_SCREEN  = "SWITCH_LOCK_SCREEN";					// 切换锁屏
	export const SET_SHARE_VIDEO_SETTING  = "SET_SHARE_VIDEO_SETTING";           //设置是否播放	
	export const INIT_STORAGE          = "INIT_STORAGE";                         //保存本地数据
	export const SET_PREVIEW_PLUGIN    = "SET_PREVIEW_PLUGIN";                   //设置预览插件
	export const SET_SHARE_MEM         = "SET_SHARE_MEM";                        //设置共享内存是否打开
    export const SET_WATCH_CAMERA      = "SET_WATCH_CAMERA";                     //设置观摩的接收虚拟摄像头
  
  
  
  
/**
 * coco相关 -- 对应 cocoInfo
 */
 export const SET_COCO_SERVER  = "SET_COCO_SERVER";             //获取coco服务
 export const SET_COCO         = "SET_COCO";                    //设置coco
 export const SET_COCO_PARAMS  =  "SET_COCO_PARAMS";            //设置coco参数
 //监听事件
 export const COCO_ON_LOGIN_UP = "COCO_ON_LOGIN_UP";            //链接上coco
 export const COCO_ON_JOIN_GROUP = "COCO_ON_JOIN_GROUP";        //当前用户，添加到组
 export const COCO_ON_LOGIN_NOTIFY = "COCO_ON_LOGIN_NOTIFY";    //某个用户登录还是退出
 export const COCO_ON_KICK     = "COCO_ON_KICK";                //监听用户被踢出
 export const COCO_ON_OFFLINE  = "COCO_ON_OFFLINE";             //监听用户重复登录被踢出
 export const COCO_ON_CALLONE  = "COCO_ON_CALLONE";             //点对点通信
 export const COCO_ON_CALLALL  = "COCO_ON_CALLALL";             //点对全部通信
 export const COCO_ON_LOADUSER = "COCO_ON_LOADUSER";            //获取用户列表
 export const COCO_ON_PADINFO  = "COCO_ON_PADINFO";             //白板消息
 export const COCO_ON_ERROR    = "COCO_ON_ERROR";               //coco错误通知
 //发送事件
 export const COCO_CALL        = "COCO_CALL";                   //发送消息
 export const CALL_ALL         = "CALL_ALL";                    //发送消息
 export const CALL_ONE         = "CALL_ONE";                    //发送消息

 

//  白板
export const INIT_PAD = "INIT_PAD";

// 消息相关
export const SEND_MSG = "SEND_MSG";
export const ADD_MSG = "ADD_MSG";
export const CHANGE_TAB = "CHANGE_TAB"; 
export const CHANGE_TALK_WIDTH = "CHANGE_TALK_WIDTH";  // 切换私聊对象
export const TOGGLE_LIST = "TOGGLE_LIST";  //  切换用户列表是否显示

export const REMOVE_SINGLE_TALK_USER = "REMOVE_SINGLE_TALK_USER";  // 移除私聊发言人
export const ADD_SINGLE_TALK_USER = "ADD_SINGLE_TALK_USER";  //  添加私聊发言人

//共享文档
export const UPDATE_SHARE_DOC_LIST  = "UPDATE_SHARE_DOC_LIST";   //共享文档
export const Add_SHARE_DOC_LIST  = "Add_SHARE_DOC_LIST";         //添加共享文档

