/**
 * 聊天的部分
 */

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import style from './message.less';
import * as cn from "classnames";
import {face} from '@/utils';
import {connect} from 'react-redux';
import {
    sendMsg, 
    changeTab, 
    toggleList,
    addSingleTalkUser,
    changeTalkWith
} from '../../store/message/action';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';
import SingleTalkList from './single_talk_list';
import {Modal} from '@/components/modal';
import {formateTime} from '@/utils/time'
require('@/common/css/face.css');

const MsgItem = (props)=>{
    let {avatar, username, content, is_me, id, is_onemin} = props.item
    let msgTime = formateTime(id) // 消息时间

    let currentUser = props.userList.filter(item => item.realName === username)
    let imgHeardAddress =currentUser && currentUser.length > 0 ? currentUser[0].httpsServerAddress : ''
    let imgSrc = avatar && avatar.indexOf('Default.jpg') !== -1 ? props.hostConfig.httpsPublic : imgHeardAddress

    return (
        <React.Fragment>
            {/* 如果是第一条聊天消息 或者 一分钟之后的消息 ,显示聊天时间 */}
            {props.index === 0 || is_onemin ? <p className={style.itemHerder}>{msgTime}</p> : null}
            <li className={cn(style.item, {[style.me]: is_me})}>
                <span onClick={()=>(props.onTalk(props.item))} className={style.avatar}>
                {/* img标签 当图片加载失败时 才会触发onError事件 */}
                <img src={`${imgSrc}/${avatar}`} onError={(e)=>(e.target.src= require('@/asset/images/avatar.png'))} alt='头像'/>
            </span>
                <div className={style.info} style={{ width: '100%' }}>
                    <p className={style.username}>{username}</p>
                    <p className={style.content} dangerouslySetInnerHTML={{__html:content}} />
                </div>
            </li>
        </React.Fragment>
    )
}

const SysMsgItem = (props)=>{
    // 消息的ID用的是时间戳
    let {content, id, userInfo ,isLogout} = props.item;

    if (content) {
        return (
            <li className={style.item}>
               <p dangerouslySetInnerHTML={{__html:content}} />
            </li>
        )
    } else if(userInfo && !isLogout){  // 登陆消息   如果存在多类型消息，数据中添加类型区分
        return (
            <li className={cn(style.item, style['system-item'])}>
               <p>欢迎 <span onClick={props.role !== "WATCH" ? ()=>(props.onTalk(props.item.userInfo)) : null} className={style.name}> {userInfo.username} </span> 参加视频会议[{formateTime(id)}]</p>
            </li>
        )
    } else if(isLogout) { // 判断是否离线
        return (
            <li className={cn(style.item, style['system-item'])}>
               <p><span className={style.name}> {userInfo.username} </span> 已离线[{formateTime(id)}]</p>
            </li>
        )
    } else {
        return null
    }

}

class Message extends Component {
    static propTypes = {

    }

    constructor(props){
		super(props);
		this.state = {
			isShowList : false,
            currentTalkUser: '大家'
		}
		this.toggleList = this.toggleList.bind(this);
    }

    static defaultProps = {
        options: {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true // 不使用时,滚动条消失
        }
    }

	// 控制选择私聊列表的显隐
	toggleList(){
		this.setState({
			isShowList : !this.state.isShowList
		},()=>{
        	//判断当前状态
	        if( this.state.isShowList ){
	        	setTimeout(()=>{
	        		window.addEventListener('click',this.toggleList)
	        	},0);
	        }else{
	        	window.removeEventListener('click',this.toggleList)
	        }
        });
    }

    showFaceIcon(e){
        e.preventDefault();
        e.stopPropagation();

        let {face_btn, textArea} = this.refs;
        face.init(face_btn, textArea, 'https://imgcdn.9itest.com');
        face.show();
    }

    sendMessage(){
        let {sendMsg, uid, currentTab, talkWith, getUserObj} = this.props;
        let currentUser =  getUserObj(uid);
        if(!currentUser.isCanMessage) {
            Modal.alert(' 您已被禁言！')
            return ;
        } ;

        let {textArea} = this.refs;
        let val = textArea.value;
        if(!val.trim()) return;
        var msg = val.replace(/\[(.*)\]/g, function (match, val) {
            return face.decodePubContent(match);
        });
        let data = {
            content: msg,
            username: currentUser.realName,
            avatar: currentUser.headPic,
            fromId: uid,
            type: currentTab,
            to: talkWith,
            id: new Date().valueOf()
        }

        sendMsg(data)
        textArea.value = ''
    }

    changeTab(type, userObj = {}){
        const { currentTab, changeTab, single, talkWith } = this.props;
        let currentSingleList = single && single.length > 0 ? single.filter(item => item.to === talkWith) : [{}]
        let userName = userObj.username || (currentSingleList.length > 0 ? currentSingleList[0].username : single[0].username)
        this.setState({ currentTalkUser: type === 'group' ? '大家' : userName })
        if(type !== currentTab) {
            changeTab(type);
        }
    }

    currentTalkUser = (user) => {
        this.setState({ currentTalkUser: user ? user.username : '大家' })
    }

    // 和谁私聊
    talkWithSomeOne(userObj){
        let { uid, single, changeTalkWith } = this.props;
        if(userObj.fromId !== uid &&　userObj.to) {
            let hasUser = single.find((item)=>{
                return item.to === userObj.to;
            })
            this.changeTab('single', userObj); //切换到私聊列表
            if (hasUser) {
                // 切换到当前与当前用户的聊天窗口
                console.error(hasUser.to)
                changeTalkWith(hasUser.to)
            } else {//  如果聊天列表里面没有   添加进去
                this.addSingleTalkUser(userObj);
                changeTalkWith(userObj.to)
            }
        } else {
            this.changeTab('group');
        }
    }

    // 添加私聊人员
    addSingleTalkUser(userObj) {
        let {addSingleTalkUser} = this.props;
        addSingleTalkUser(userObj)
    }

    // 渲染消息列表
    _rendMsgList(){
        const { group, currentTab, system, single, talkWith, uid, userList, hostConfig } = this.props;

        if(currentTab === 'system'){
            return system.map((item)=>{
                return <SysMsgItem role={this.props.role} onTalk={this.talkWithSomeOne.bind(this)} item={item} key={item.id}/>
           })
        } else {
            if (currentTab === 'single'  ) {
                let hasUser = single.find((item)=>{
                    return item.to ===talkWith;
                })

                return hasUser ? hasUser.list.map((item, index)=>{
                    // 将最后一条消息存起来,用于显示私聊时间(如果一分钟内没人聊天)
                    let lastItem = hasUser.list[hasUser.list.length - 2] || {}
                    // 当前消息时间和上一条消息时间 是不是大于1分钟
                    let isOneMin = item.id - lastItem.id > 60 * 1000
                    // 如果大于1分钟,则设置状态
                    if (isOneMin) {
                        item.is_onemin = true
                    }
                    if(item.fromId === uid) {
                        item.is_me = true
                    }
                    return <MsgItem hostConfig={hostConfig} userList={userList} lastItem={lastItem} index={index} item={item} key={item.id}/>
               }):null
            } else {
                return group.map((item, index)=>{
                    let lastItem = group[group.length - 2] || {}
                    let isOneMin = item.id - lastItem.id > 60 * 1000
                    if (isOneMin) {
                        item.is_onemin = true
                    }

                    item.to = item.fromId;
                    if(item.fromId === uid) {
                        item.is_me = true
                    }
                    return <MsgItem hostConfig={hostConfig} userList={userList} lastItem={lastItem} index={index} onTalk={this.talkWithSomeOne.bind(this)} item={item} key={item.id}/>
                })
            }
        }
    }

    _renderTab() {
        let {currentTab,groupNumber, singleNumber, sysNumber, single} = this.props;
        return (
            <React.Fragment>
                <div onClick={this.changeTab.bind(this, 'group')} className={cn(style.item, style['tab-left'], { [style.active]: currentTab ==='group'})}>
                    <i className='iconfont icon-group-chat' />
                    <span>群聊</span>
                    {groupNumber?<span className={style.number}>{groupNumber}</span>:null}
                </div>

                { single.length > 0 ?
                    <div onClick={this.changeTab.bind(this, 'single')} className={cn(style.item, style['tab-middle'], { [style.active]: currentTab ==='single'})}>
                        <i className='iconfont icon-private-chat' />
                        <span>私聊</span>
                        {singleNumber ? <span className={style.number}>{singleNumber}</span>: null}
                    </div>: null
                 }
                <div onClick={this.changeTab.bind(this, 'system')} className={cn(style.item, style['tab-right'],  { [style.active]: currentTab ==='system'})}>
                    <i className='iconfont icon-chat-system' />
                    <span>系统</span>
                    {sysNumber ? <span className={style.number}>{sysNumber}</span>: null}
                </div>
            </React.Fragment> 
        )
    }

    _renderOnLineList(){
        let {userList, uid} = this.props;
        let onLineList = userList.filter((user)=>{
            return uid !==user.uid && user.isLogin;
        })

        onLineList.unshift({
            uid:'', 
            realName: '大家'
        })
        
        let dom = onLineList.map((item)=>{
            return (
                <li onClick={this.talkWithSomeOne.bind(this,{
                    to:item.uid,
                    username: item.realName
                })} key={item.uid}>{item.realName}</li>
            )
            })
        return dom;
    }

    keyDownEnter = (e) => {
        if (e.which !== 13) return;
        e.preventDefault();
        this.sendMessage();
    }
    
    render() {
        let {role, currentTab, single, msgStyle} = this.props;

        return (
            <div className={style['message-content']} style={msgStyle && msgStyle}>
                <div className={style.tab}>
                   {this._renderTab()}
                </div>

                <ReactIScroll iScroll={iScroll}
                    onRefresh={this.onRefresh}
                    options={this.props.options}>
                    <ul className={style['message-list']}>
                        {this._rendMsgList()}
                    </ul>
                </ReactIScroll>

                {role !=='WATCH' && currentTab === 'single' && single.length > 0 ?
                    <SingleTalkList changeCurrentTalkUser={this.currentTalkUser}/>
                    : null}

                {role === "WATCH" || currentTab === 'system' ? null :
                    <div className={style['send-content']}>
                        <div className={style['tool-bar']}>
                            <div>
                                对 <span className={style.to}>{this.state.currentTalkUser}</span>
                                <span onClick={this.toggleList} className={style['triangle-down']} />
                            </div>
                            
                            {this.state.isShowList ? <ul className={style['user-list']}>
                                {this._renderOnLineList()}
                            </ul>: null
                            }
                            <div className={style['face-btn']} onClick={(e)=>this.showFaceIcon(e)} ref='face_btn'>
                                <img src={require('@/asset/images/face.png')} alt='笑脸'/>
                            </div>
                        </div>
                        <div className={style['msg-input']}>
                            <textarea maxLength="500" onKeyDown={this.keyDownEnter} ref='textArea' placeholder='请输入您要说的内容...(500字)' />
                        </div>
                        <div className={style.submit}><span onClick={this.sendMessage.bind(this)} className={style.btn}>发送</span></div>
                    </div>
                }
            </div>
        )
    }
};

let mapStateToProps = (state)=>({
    ...state.msgInfo,
    single: state.msgInfo.single,
    getUserObj: state.userInfo.getUserObj,
    userList: state.userInfo.userList,
    uid: state.meetInfo.uid,
    role: state.meetInfo.role,
    hostConfig: state.meetInfo.meetObj.hostConfig,
})

let mapDispatchToProps ={
    sendMsg,
    changeTab,
    toggleList,
    addSingleTalkUser,
    changeTalkWith
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Message);
