
/**
 * 用户相关  登陆 登出 用户详情
 */
import * as Type from '@/config/actionTypes';
import store from '@/store/store';
// {
//     uid: 'test_123', // 用户id
//     userName: ''
//     avatar: '', // 头像url
//     role: 'MASTER', // 角色
//     isLogin: true, // 是否已登陆
//     sortBy: 1, // 列表中排序
//     showOp = false; // 是否展示用户相关操作标识
//     isMatch = true; //搜索状态标识
//     isSpeaker = false;
//     deviceName    //PC 登录的来源
//     isPublishAudio=false
//     isPublishVideo=false
//     nameTag    //用户信息简写
//     title      //详细用户信息
// }

let defaultState = {
    userList: [],  // 所有用户
    isLoginTab: true, // 登录和未登录tab
    entered: 0,
    unentered: 0,
    getUserObj : (id)=>{
    	//获取指定的userObj对象
    	let {userList} = store.getState().userInfo;
    	return userList.find(item=>item.uid===id);
    },
}

export default function (state = defaultState, action) {
    let userList = state.userList;
    let newList = [];
    switch (action.type) {
        case Type.GET_USER_LIST:
            return Object.assign({}, state, {
                userList: action.userList,
                unentered: action.userList.length
            });

        case Type.LOGIN: // 登陆 
            return Object.assign({}, state, action.data);
            
        case Type.LOGOUT: // 登出
            let entered = state.entered;
            let unentered = state.unentered;
            newList = userList.map((user) => {
                if (user.uid === action.uid) {
                    user.isLogin = false;
                    entered -= 1;
                    unentered += 1;
                }
                return user
            })
            return Object.assign({}, state, {
                userList: newList,
                entered: entered,
                unentered: unentered,
            });
        case Type.UPDATE_LOGIN_STATUS: // 更新coco来的登陆消息
            let uidArr = action.userList.map((item) => {
                return {
                	userId     : item.userId,
                	deviceName : item.deviceNames[0]};
            });

            let loginNumber = 0;
            newList = userList.map((user) => {
            	let userObj = uidArr.find(item=>item.userId===user.uid);
            	if( userObj ){
            		user.isLogin = true;
            		user.deviceName = userObj.deviceName;
                loginNumber +=1
            	}
                return user;
            })

            return Object.assign({}, state, {
                userList: newList,
                entered: loginNumber,
                unentered: userList.length - loginNumber,
            });

        case Type.TOGGLE_SPEAKER: //是否允许 发言人
            {
                let {uid, type} = action.params;
                let userObj = getUserById( userList,uid);
                userObj.isSpeaker = (type === 'Y') ? true : false;
                return Object.assign({}, state, {
                    userList: [...userList]
                });                
            }

        case Type.TOGGLE_AUDIO :  //是否允许音频
        	{
	        	let {uid,value} = action.playload,
	        		userObj = getUserById( userList,uid);
	        		userObj.isPublishAudio = value;
	        		
	        	return Object.assign({}, state, {
	                userList: [...userList]
	            });
            }
            
        case Type.TOGGLE_VIDEO :  //是否允许视频
        	{
        		let {uid,value} = action.playload,
	        		userObj = getUserById( userList,uid);
	        		userObj.isPublishVideo = value;
	        		
	        	return Object.assign({}, state, {
	                userList: [...userList]
	            });
            }
        
        case Type.TOGGLE_CHAT : //是否允许文本聊天
        	{
        		let {uid,value} = action.playload,
	        		userObj = getUserById( userList,uid);
	        		userObj.isCanMessage = value;
	        		
	        	return Object.assign({}, state, {
	                userList: [...userList]
	            });
            }
        	
        case Type.TOGGLE_WHITE_PAD : //是否允许白板标注
        	{
        		let {uid,value} = action.playload,
	        		userObj = getUserById( userList,uid);
	        		userObj.whiteBoard = value;
	        		
	        	return Object.assign({}, state, {
	                userList: [...userList]
	            });
            }

        case Type.SEARCH: // 搜索
            newList = userList.map((user) => {
                if (!user.realName.includes(action.keyword)) {
                    user.isMatch = false;
                } else {
                    user.isMatch = true;
                }
                return user
            })

            return Object.assign({}, state, {
                userList: newList
            });

        case Type.KICK_OUT: // 踢出
            let loginFlag = true;
            newList = userList.filter((user) => {
                if (user.uid === action.uid) {
                    loginFlag = user.isLogin
                } else {
                    return user
                }
                return null;
            })

            return Object.assign({}, state, {
                userList: newList,
                entered: loginFlag ? state.entered - 1 : state.entered,
                unentered: !loginFlag ? state.unentered - 1 : state.unentered,
            });

        case Type.ADD_USER: // 邀请一个用户
            return Object.assign({}, state, {
                userList: userList.concat(action.user),
                unentered: state.unentered + 1
            });

        // case Type.IS_KICK: // 被踢
        //     return Object.assign({}, state, {
        //         isKick: action.isKick,
        //     });

        case Type.SWITCH_TAB: // 切换分组
            return Object.assign({}, state, { isLoginTab: action.isLoginTab });

        case Type.TOGGLE_SHOW_OP: // 切换用户操作是否显示
            newList = userList.map((user) => {
                if (user.uid === action.uid) {
                    user.showOp = !user.showOp;
                } else {
                    user.showOp = false;
                }

                user.isMatch = true; // 切换tab初始化搜索状态
                return user
            })
            
            return Object.assign({}, state, { userList: newList });
        
        // case Type.UPDATE_USERLIST: // 切换分组
        //     return Object.assign({}, state, { userList: action.userList });
        default:
            return state;
    }
}


//获取对象
function getUserById(list,id){
    let index = list.findIndex(item=>item.uid===id);
   	let obj = {...list[index]};
	list.splice(index, 1, obj);
	return obj;
}
