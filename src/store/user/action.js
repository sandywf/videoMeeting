/**
 * user action
 */
import { User } from '@/api/index'
import * as Type from '@/config/actionTypes';
import {callAll,callOne } from "@/store/coco/action";
import * as meetAction from "@/store/meet/action";
import * as setAction from "@/store/settings/action";
import {Modal}  from "@/components/modal";
import { Calc } from '@/utils/index';

/**
 * 获取参会者列表-api请求
 */
export const getUserList = (params)=>{
	return async(dispatch, getState) => {
		let {meetId,mid} = getState().meetInfo;
		let {result} = await User.getUserList(meetId);
		// let speakerList = [];
		let midIndex;
        let newList = result.map((item, index) => {
            item.isLogin = false;
            item.showOp  = false;  // 是否展示用户相关操作标识
            item.isMatch = true;   // 搜索状态标识
			item.uid = item.uid.toString();

            if( item.uid === mid ){
            	midIndex = index;
            }
            //设置title
        	item.title = [
	    		item.clsSchoolName,
	    		(item.teacherInfo||[]).join("/"),
	    		item.realName||item.truename,
	    		item.classroomName?"【"+item.classroomName+"】":''
	    	].filter(res=>!!res).join(" ");
	    	
	    	//设置name名称
	    	item.nameTag = (item.realName||item.truename)+(item.classroomName?"【"+item.classroomName+"】":'');
            
            return item;
        });
        
        //默认将主讲人，提到第一位
        newList.unshift(newList.splice(midIndex,1)[0]);
        
        // 处理数据
        dispatch({
            type: Type.GET_USER_LIST,
            userList: newList
		});

		// 添加用户时候更新用户状态
		let coco = getState().cocoInfo.coco;
		if (coco) {
            coco.loadUser();
		}
	};
};


//  更新用户列表
// export const updataUserList = (userList)=> {
// 	return {
// 		type: Type.UPDATE_USERLIST,
// 		userList: [...userList]
// 	}
// }


// 1.来宾
// 2.邀请参加   后台列表有



/**
 * 登录
 * @param {*} uid 
 */
export const login = (loginUser) => {
	return (dispatch, getState) =>{
		let {userList,entered, unentered} = getState().userInfo;
		let data = {};
		let userObj = userList.find((user)=>(user.uid === loginUser.uid));

		if(userObj) {

			if(!userObj.isLogin) {
				userObj.isLogin = true;
				userObj.deviceName = loginUser.deviceName;

				data = {
					userList: userList,
					entered: entered + 1,
					unentered: unentered - 1
				};
				dispatch({
					type: Type.LOGIN,
					data: data
				})

				dispatch({
					type: Type.ADD_MSG,
        			params: {
						type: 'system',
						id: new Date().valueOf(),
						content: '',
						userInfo: {
							username: userObj.realName,
							fromId: userObj.uid,
							to: userObj.uid
						}
					}
				})
			}

			
		}
	}
}

/**
 * 更新登陆状态
 * @param {*} uid 
 */
export const updateLoginStatus = (userList) => {
    return {
        type: Type.UPDATE_LOGIN_STATUS,
        userList: userList
    }
}

/**
 * 登出
 * @param {*} uid 
 */
export const logout = (userId) => {
	return (dispatch, getState) => {
		//登出用户
		dispatch({
	        type : Type.LOGOUT,
	        uid  : userId
	   	});

        let { userList } = getState().userInfo;
        let userObj = userList.find((user)=>(user.uid === userId));

		if( !userObj ) return;
		
        dispatch({
            type: Type.ADD_MSG,
            params: {
                isLogout: true,
                type: 'system',
                id: new Date().valueOf(),
                content: '',
                userInfo: {
                    username: userObj.realName,
                    fromId: userObj.uid,
                    to: userObj.uid
                }
            }
        })
	}
}

/**
 * 切换用户操作菜单显示隐藏
 * @param {*} uid 
 */
export const search = (keyword) => {
    return {
        type: Type.SEARCH,
        keyword: keyword
    }
}

/**
 * 切换用户操作菜单显示隐藏
 * @param {*} uid 
 */
export const toggleShowOp = (uid) => {
    return {
        type: Type.TOGGLE_SHOW_OP,
        uid: uid
    }
}

/**
 * 踢出用户
 * @param {*} uid 
 */
export const kickOut = (uid, memberId) => {
	return async (dispatch, getState) =>{
		let {role} = getState().meetInfo;
		if(role === 'MAIN' && memberId) {
			let  {status} = await User.kickOut({memberId: memberId});
			if(status === 1) {
				dispatch({
					type: Type.KICK_OUT,
					uid: uid
				})

				let {coco} = getState().cocoInfo.coco;
				coco.kickOut(uid)
                dispatch(callOne(uid, 'userAction.isKick', true))
			}
		} else {
			dispatch({
				type: Type.KICK_OUT,
				uid: uid
			})
		}
	}
}

// 被踢用户返回上一页或者关闭当前窗口
export const isKick = data => (dispatch, getState) => {
    let {uid,meetId,role, meetObj} = getState().meetInfo;
    let local = meetObj.hostConfig.local
    let jumpLink = `${local}/cmeet/redirect/VIDEO_MEETING/${role}/${meetId}/604.html?skey=${meetObj.skey}&plantformType=""&userId=${uid}`;
    data && Modal.alert('您已被请出会议!', () => { window.location.href = jumpLink })
}

/**
 * 添加（邀请）用户
 * @param {obj} user 
 */
export const addUser = (addUser) => {
	return (dispatch, getState) =>{
		let {userList} = getState().userInfo;
		let userObj = userList.find((user)=>(user.uid === addUser.uid));
		if(!userObj) {
			dispatch({
				type: Type.ADD_USER,
				user: addUser
			})
		}
	}
}


/**
 * 申请发言
 */
let hasRequire = false,
	requireTime = "";

function setRequireTime(){
	hasRequire = true;
	if( requireTime ){
		clearTimeout(requireTime);
	}
	requireTime = setTimeout(()=>{
		hasRequire = false;
	},15000);
}

export const requireSpeaker = () =>{
	return (dispatch, getState) => {
		let {uid,mid,meetObj:{status}} = getState().meetInfo,
			{isSpeaker,nameTag,baseAreaId} = getState().userInfo.userList.find(item=>item.uid===uid) || {},
			params = {
				userId:uid,
				status:true,
				name:nameTag,
				baseAreaId
			};
		
		//判断当前是否是发言人
		if( !isSpeaker ){
			
			//未开始直播，不能申请发言人
			if( status === "INIT" ){
				Modal.alert('主持人暂未开始直播，请耐心等待！');
				return;
			}
			
			//提示申请发言
			if( hasRequire ){
				Modal.alert('你申请发言操作过于频繁，请稍后再试！');
				return;
			}
			
			let m_confirm = Modal.confirm({
				content : "确定要申请发言吗？",
				onSure : ()=>{
					setRequireTime();
					dispatch(callOne(mid,'userAction.responseSpeaker',params,()=>{
						hasRequire = false;
					}));
					m_confirm.close();
				}
		   	});
		}else{
			//提示申请发言
			Modal.alert('确认要取消发言吗？',()=>{
				params.status = false;
				dispatch(callOne(mid,'userAction.responseSpeaker',params));
			});
		}
	}
}

/**
 * 返回发言
 */
let requestUsers = {};
export const responseSpeaker = (params,backFn)=>{
	return (dispatch, getState) => {
		let {userId,status, name,baseAreaId, isMobile, isCancel} = params,
			{role} = getState().meetInfo;
		
		if( role !== "MAIN" ) return;
		
		if( status && !isCancel ){
			if( userId in requestUsers ){
				return;
			}else{
				requestUsers[userId] = true;
				//获取要请求成为发言人
				let m_confirm = Modal.confirm({
					content : name+"申请发言，是否同意？",
					onCancel : ()=>{
						delete requestUsers[userId];
						backFn && typeof backFn === "function" && backFn(false);
					},
					onSure : ()=>{
						delete requestUsers[userId];
						backFn && typeof backFn === "function" && backFn(true);
						dispatch(toggleSpeaker({
				            uid  : userId,
				            type : 'Y',
				            baseAreaId
				        }));
						m_confirm.close();
					}
			   	});
			}
		}else if (isMobile){
            let m_confirm = Modal.confirm({
                content : name+"取消发言，是否同意？",
                onCancel : ()=>{
                    delete requestUsers[userId];
                    backFn && typeof backFn === "function" && backFn(false);
                },
                onSure : ()=>{
                    delete requestUsers[userId];
                    backFn && typeof backFn === "function" && backFn(true);
                    dispatch(toggleSpeaker({
                        uid  : userId,
                        type : 'N',
                        baseAreaId
                    }));
                    m_confirm.close();
                }
            });

		} else {
            dispatch(toggleSpeaker({
                uid  : userId,
                type : 'N',
                baseAreaId
            }));
        }
	}
}

/**
 * 设置发言人
 * @param {*} params 
 * params:{
        uid: uid,
        type: 'N'|'Y',
        baseAreaId
    }
 */
export const toggleSpeaker = (params) => {
    return async (dispatch, getState) => {
		let {mid,uid} = getState().meetInfo;
		let {videoLayoutMode} = getState().setInfo;
		let number = Calc.modeRatio[videoLayoutMode]['number']
		let speakerList = getState().meetInfo.speakerList.concat();
		//  设置发言人
		if(params.type === 'Y') {
			let validArr = speakerList.filter((item)=>{
				return item;
			})

			if (number <= validArr.length){
				Modal.alert('主讲人数不能超过画面数量！');
				return;
			} 
		}

    	//是否要发送coco通信
    	let {
    			role,shareDesk,shareVideo,
    			pollingSetting:{isCustom,isPollingSpeaker,customPolling},
    			
    		} = getState().meetInfo,
    		{uid : userId,type} = params,
    		{videoLayoutNum} = getState().setInfo,
    		speakerNum = speakerList.filter(item=>!!item).length;
        
        //发送方，或者接收方为主讲教室时，保存数据
    	if( role === "MAIN" ){
    		//如果当前可用画面数，小于发言人的数量的时候，提示警告
    		//是否在轮巡中，并且是处于支持人和发言人都固定的状态
    		if( type === "Y" && isCustom && isPollingSpeaker && customPolling && (speakerNum+1)>= videoLayoutNum ){
    			Modal.alert("请至少保留一个空画面位置用于轮巡非发言人！");
    			return;
    		}
    		
    		//普通状态下
    		if( type === "Y" &&  (speakerNum+1) > videoLayoutNum ){
    			Modal.alert("发言人的数量不能超过，当前布局可显示画面的数量！");
    			return;
    		}
    		
    		//判断如果是取消发言人，并且要取消的发言人，正在共享视频，或者共享音频中，则需要也关闭共享
    		let shareType = shareDesk === userId?'desk':shareVideo=== userId?'video':'';
    		if( type === 'N' && shareType ){
    			dispatch(callOne(userId,'meetAction.setShare',{
    				userId,
    				type : shareType,
    				status : false
    			}));
    		}
    		//let speakerList = getState().meetInfo.speakerList;
    		//await User.toggleSpeaker({speakers: speakerList});
    		dispatch(callAll('userAction.toggleSpeaker',params));
    	}
    	
    	
        // 处理数据
        dispatch({
            type: Type.TOGGLE_SPEAKER,
            params: params
        });

	
		let index = speakerList.indexOf(userId);
		if (index >= 0) {
			speakerList[index] = '';
		} else if(speakerList.indexOf('')>=0){
			speakerList[speakerList.indexOf('')] = userId
		} else {
			speakerList.push(userId)
		}

        
        
        //修改当前虚拟摄像头中的对应userid的状态
    	dispatch(setAction.toggleVideoDom(params));
        
        //发送方，或者接收方为主讲教室时，保存数据
    	if( uid === mid ){
    		await User.toggleSpeaker({speakers: speakerList});
    	}
    	
    	// 更新 发言人列表
        dispatch(meetAction.setSpeakerList(speakerList));
    }
}

/**
 * 点击开关音频
 */
export const toggleAudio = (params)=>{
	return (dispatch, getState) => {
    	let {role,uid} = getState().meetInfo;
        let mainId =  getState().meetInfo.uid;
    	
    	//修改对应的页面样式
        dispatch({
            type     : Type.TOGGLE_AUDIO,
            playload : params
        });
    	
    	//是否要发送coco通信
    	if( role === 'MAIN' ){
    		//通知全部修改状态
    		dispatch(callAll('userAction.toggleAudio',{ mainId, ...params }));
    		//通知后台切换音频开关
    		User.toggleAudioAndVideo({
    			type  : params.type,
    			uid   : params.uid,
    			value : params.value?'Y':'N'
    		});
    	}
    	
    	//修改发送插件的状态
    	if( params.uid === uid &&  role !== 'MAIN' ){
    		//插件操作
    		dispatch(setAction.toggleAudio(uid,params.value));
    	}
	}
}

/**
 * 是否接受视频
 */
export const toggleVideo = (params)=>{
	return (dispatch, getState) => {
    	let {role,uid} = getState().meetInfo;
        let mainId =  getState().meetInfo.uid;
    	
    	//修改对应的页面样式
        dispatch({
            type     : Type.TOGGLE_VIDEO,
            playload : params
        });
    	
    	//是否要发送coco通信
    	if( role === 'MAIN' ){
    		//通知全部修改状态
    		dispatch(callAll('userAction.toggleVideo',{ mainId, ...params }));
    		//通知后台切换音频开关
    		User.toggleAudioAndVideo({
    			type  : params.type,
    			uid   : params.uid,
    			value : params.value?'Y':'N'
    		});
    	}
    	
    	//修改发送插件的状态
    	if( params.uid === uid &&  role !== 'MAIN' ){
    		//插件操作
    		dispatch(setAction.toggleVideo(uid,params.value));
    	}
	}
}

/**
 * 是否允许文本聊天
 */
export const toggleChat = (params)=>{
	return (dispatch, getState) => {
		
    	let {role} = getState().meetInfo;
        let mainId =  getState().meetInfo.uid;
    	
    	//修改对应的页面样式
        dispatch({
            type     : Type.TOGGLE_CHAT,
            playload : params
        });
    	
    	//是否要发送coco通信
    	if( role === 'MAIN' ){
    		//通知全部修改状态
    		dispatch(callAll('userAction.toggleChat',{ mainId, ...params }));
    		//通知后台切换音频开关
    		User.toggleChat({
    			type  : params.value ? 'Y':'N',
    			uid   : params.uid,
    		});
    	}
	}
}



/**
 * 是否允许白板标注
 */
export const toggleWhitePad = (params, fromId)=>{
	return (dispatch, getState) => {
		
    	let {role} = getState().meetInfo;
        let {uid,value} = params;
        let mainId =  getState().meetInfo.uid;
		
    	//修改对应的页面样式
        dispatch({
            type     : Type.TOGGLE_WHITE_PAD,
            playload : params
		});

		if(fromId){
			let {pad} =  getState().padInfo.pad;
			if(value) {
				pad.enable();

			} else {
				pad.disable();
			}
		}
    	
    	//是否要发送coco通信
    	if( role === 'MAIN' ){
    		//通知全部修改状态
    		dispatch(callAll('userAction.toggleWhitePad',{ mainId, ...params }));
    		//通知后台切换音频开关
    		User.toggleWhitePad({
    			type  :value ? 'Y':'N',
    			uid   : uid,
    		});
    	}
    	
	}
}

/**
 * 切换登录和未登录列表
 * @param {*} bool 
 */
export const switchTab = (bool) => {
    return {
        type: Type.SWITCH_TAB,
        isLoginTab: bool
    }
}


/**
 *
 */
// export const setUserOnLineNumber = (number) => {
//     return {
//         type: Type.SET_USER_ONLINE_NUMBER,
//         isLoginTab: number
//     }
// }
