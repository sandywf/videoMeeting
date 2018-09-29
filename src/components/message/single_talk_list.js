/**
 * 聊天的部分
 */

import React, { Component } from 'react';
import style from './message.less';
import * as cn from "classnames";
import {connect} from 'react-redux';
import {
    removeSingleTalkUser,
    changeTalkWith
} from '@/store/message/action';

class SingleTalkList extends Component {
    constructor(){
        super();
        this.state ={
            offset: 0
        }
    }
    componentDidMount() {
        this.calcListWidth()
    }

    componentDidUpdate() {
        this.calcListWidth()
    }

    onLeft() {
        if( this.state.offset < 0) {
            this.setState({
                offset: this.state.offset + 288
            })
        }
    }

    onRight(){
        let ulEle = this.refs.list;
        if( Math.abs(this.state.offset - 288) < window.parseInt(ulEle.style.width)) {
            this.setState({
                offset: this.state.offset - 288
            })
        }
    }

    // 计算ul长度
    calcListWidth() {
        let ulEle = this.refs.list;
        ulEle.style.width = (ulEle.children.length * 72)+'px';
        ulEle.style.transform = `translateX(${this.state.offset}px)`
    }

    // 切换正在私聊的人
    changeTalkWith(item){
        this.props.changeTalkWith(item.to)
        this.props.changeCurrentTalkUser(item)
    }

    // 移除正在私聊的人
    removeSingleTalkUser(e,user){
        e.stopPropagation();

        let currentSingle = this.props.single.filter(item=> item.to !== user.to )
        let hasUser = currentSingle.find(item=> item.to === user.to ) || currentSingle[0]

        if (hasUser) { this.changeTalkWith(hasUser) }

        this.props.removeSingleTalkUser(user.to)
        this.props.changeCurrentTalkUser(hasUser)

    }

    // 正在私聊的人
   _renderSingleTalkList(){
        let {single, talkWith} = this.props;
        return single.map((item)=>{
            if(item.to === talkWith) {

            }

            return (
                <li 
                title={item.username}
                onClick={this.changeTalkWith.bind(this,item)}
                key={item.to}
                className={cn({
                    [style.active]: item.to === talkWith})}>
                    {item.username}

                    <span
                        // 点击关闭icon
                        onClick={(e)=>{ this.removeSingleTalkUser(e, item); }}
                        className={cn("iconfont icon-close", style.close)}
                    />
                
                    {item.hasMsg ? <span className={style['has-msg']} />: null}
                </li>
            )
        })
   }
    
    render() {
        return (
             <div className={cn(style['scroll-list'])}>
                <span onClick={this.onLeft.bind(this)} className={cn(style['triangle-left'])} />
                <div  className={cn(style['single-talk-list'])}>
                    <ul ref='list'>
                        {this._renderSingleTalkList()}
                    </ul>
                </div>
                <span onClick={this.onRight.bind(this)} className={cn(style['triangle-right'])} />
            </div> 
        )
    }
};

let mapStateToProps = (state)=>({
    single: state.msgInfo.single,
    uid: state.meetInfo.uid,
    role: state.meetInfo.role,
    talkWith:  state.msgInfo.talkWith,
})

let mapDispatchToProps ={
    removeSingleTalkUser,
    changeTalkWith
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleTalkList);
