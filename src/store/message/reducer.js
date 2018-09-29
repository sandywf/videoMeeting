
/**
 * 消息相关  （测试用）
 */
import * as Type from '@/config/actionTypes';
let defaultState = {
    system: [ // 系统消息
        {
            id: '',  
            content: '',
        }
    ],
    
    single: [
    //     和某人聊天的所有内容, 一个对象就是一个人
    //     {
    //     to: '0', 第一人称,和我私聊的人的id,创建私聊的时候就定了,不会变
    //     username: '0',
    //     hasMsg: false, 和我聊天的人有没有纬未读消息
    //     list:[{ ==> 真正的聊天内容 所有信息都存list
    //         id: '0', // magid  时间戳
    //         content: '0', // 真的的聊天内容
    //         to:'id', // 发给谁这个to就是谁的id
    //         fromId: '', // 谁发送的fromId就是谁的
    //     }],
    // }, {
    //     to: '1',
    //     username: '1',
    //     hasMsg: false,
    //     list:[{
    //         id: '1',
    //         content: '1',
    //         to:'id', // 发给谁的
    //         fromId: '', // 谁发送的
    //     }],
    // }, {
    //     to: '2',
    //     username: 'name2',
    //     hasMsg: false,
    //     list:[{
    //         id: '2',
    //         content: '2',
    //         to:'id', // 发给谁的
    //         fromId: '', // 谁发送的
    //     }],
    // }, {
    //     to: '3',
    //     username: 'name3',
    //     hasMsg: false,
    //     list:[{
    //         id: '3',
    //         content: '3',
    //         to:'id', // 发给谁的
    //         fromId: '', // 谁发送的
    //     }],
    // }
    ],

    group: [
        // {
        //     id: '123',
        //     content: 'sdasd',
        //     to:'id', // 发给谁的
        //     fromId: '', // 谁发送的
        // }
    ],

    sysNumber: 0,
    singleNumber: 0,
    groupNumber: 0,

    currentTab: "group", // group | system | single
    talkWith: '',  // 当前私聊对象的id
    showList: false,

}
  /**
   *  添加消息
   *  data = {
   *    id: 时间戳
   *    type: 数据类型    group | system | single
   *  }
   */
export default (state = defaultState, action) => {
    switch (action.type) {
        case Type.ADD_MSG: // 添加消息
            let type = action.params.type; // 消息类型  group | system | single
            let currentTab = state.currentTab; // 当前tab页 group | system | single
            if(type === 'group') {
                let groupList = state.group.concat();
                let groupNumber = state.groupNumber; // 消息数量

                // 如果不在当前页并且消息数量小于99条的话,新加一条消息
                if(currentTab !== type && groupNumber<99) {
                    groupNumber+=1
                }

                groupList.push(action.params);
                return {
                    ...state, 
                    group:groupList,
                    groupNumber: groupNumber
                }
            } else if (type === 'system') {
                let systemList = state.system.concat();
                let sysNumber = state.sysNumber;
                if(currentTab !== type && sysNumber<99) {
                    sysNumber+=1
                }
                systemList.push(action.params);
                return {
                    ...state, 
                    system:systemList,
                    sysNumber: sysNumber
                }
            } else {
                let singleList = state.single.concat();
                let singleNumber = state.singleNumber;
                if(currentTab !== type && singleNumber<99) {
                    singleNumber+=1
                }
                let msg, talkId ; // msg 消息内容 talkId 发送人的id
                // 添加私聊消息
                // 如果消息是来自coco的,说明是别人给我发送的消息
                if(action.params.fromCoco){
                    talkId = action.params.fromId; // 发送人的id
                    msg = singleList.find((item)=>{
                        return item.to === talkId;
                    })
                } else {
                    talkId = action.params.to;
                    msg = singleList.find((item)=>{
                        return item.to === talkId;
                    })
                }
                
                if(msg) {
                    msg.list.push(action.params);
                    if (state.talkWith !== msg.to) {
                        msg.hasMsg = true;
                    }
                } else {
                    singleList.push({
                        to: talkId,
                        hasMsg: true,
                        username: action.params.username,
                        list: [].concat(action.params)
                    })
                }

                return {...state, single:singleList, singleNumber: singleNumber}
            }
        case Type.CHANGE_TAB: // 切换页签
            let groupNumber = state.groupNumber;
            let sysNumber = state.sysNumber;
            let singleNumber = state.singleNumber;
            if(action.data === 'group') {
                groupNumber = 0;
            } else if(action.data === 'system'){
                sysNumber = 0;
            } else {
                singleNumber=0;
            }
            return{
                ...state,
                currentTab: action.data,
                groupNumber: groupNumber,
                sysNumber: sysNumber,
                singleNumber: singleNumber
            }

        case Type.CHANGE_TALK_WIDTH: // 切换私聊对象
            {
                let singleList = state.single.concat();
                singleList.forEach((item)=>{
                    if(item.to === action.data){
                        item.hasMsg = false;
                    }
                        
                })

                return{
                    ...state, 
                    talkWith: action.data,
                    single: singleList
                }
            }
           
        case Type.REMOVE_SINGLE_TALK_USER: // 移除私聊对象
            {
                let singleList = state.single.concat();
                let id = action.data;
                let currentTab = state.currentTab;
                let newList = singleList.filter((item)=>{
                    return item.to !== id;
                })

                if(newList.length === 0) {
                    currentTab = 'group'
                }

                return {...state, single:newList, currentTab: currentTab}
            }
            
        case Type.ADD_SINGLE_TALK_USER: // 添加私聊对象
            let singleList = state.single.concat();
            singleList.push({
                to: action.data.to,
                username: action.data.username,
                list: []
            })
            return {...state, single:singleList}

        default: 
            return state;
    }
}
