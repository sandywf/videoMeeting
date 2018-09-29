/**
 *  用户列表
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './userContent.less'
import classNames from "classnames";
import { connect } from 'react-redux';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';
import { toggleShowOp, switchTab, logout, search } from '@/store/user/action'

import UserInfo from './user'

class UserContent extends Component {
    static propTypes = {
        entered: PropTypes.number,
        unentered: PropTypes.number,
        userList: PropTypes.array,
    }

    static defaultProps = {
        entered: 0,
        unentered: 0,
        userList: [],
        options: {
            mouseWheel: true,
            scrollbars: true, // 激活滚动条功能
            fadeScrollbars: true // 不使用时,滚动条消失
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            fold: false,
        }
        this._renderItem = this._renderItem.bind(this);
    }

    // 高度变化刷新滚动条
    onRefresh(iScrollInstance) {
        // var yScroll = iScrollInstance;
    }

    switchTab(bool) {
        if (bool !== this.props.isLoginTab) {
            this.props.switchTab(bool);
        }
    }

    search() {
        let inputValue = this.refs.search.value.trim();
        this.props.search(inputValue)
    }

    _renderItem() {
        let list = this.props.userList;
        let isLoginTab = this.props.isLoginTab;
        if (list && list.length > 0) {
            let listDom = list.map((item) => {
                if (isLoginTab === item.isLogin && item.isMatch) {
                    return (
                        <UserInfo key={item.uid} user={item} />
                    )
                }
                return null;
            })
            return listDom
        }
    }

    render() {
        let whichTab = this.props.isLoginTab ? 'left' : 'right';
        return (
            <div className={classNames(style['user-content'])}>
                <div className={classNames(style.tab, style[whichTab])}>
                    <div className={classNames(style.item, style['tab-left'])} onClick={this.switchTab.bind(this, true)}>
                        <i className='iconfont icon-use-enter' />
                        <span>已进入({this.props.entered})</span>
                    </div>
                    <div className={classNames(style.item, style['tab-right'])} onClick={this.switchTab.bind(this, false)}>
                        <i className='iconfont icon-not-enter' />
                        <span>未进入({this.props.unentered})</span>
                    </div>
                </div>
                <div className={style.search}>
                    <input type='search' name='search' ref='search' onChange={this.search.bind(this)} placeholder='查询用户'/>
                    <i className={classNames(style['disable'], 'iconfont', 'icon-search')} />
                </div>
                <div className={style['scroll-wrap']}>
                    <ReactIScroll
                        iScroll={iScroll}
                        onRefresh={this.onRefresh}
                        options={this.props.options}
                    >
                        <ul className={style['user-list']}>
                            {this._renderItem()}
                        </ul>
                    </ReactIScroll>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        userList: state.userInfo.userList,
        isLoginTab: state.userInfo.isLoginTab,
        entered: state.userInfo.entered,
        unentered: state.userInfo.unentered,
    }
}

export default connect(mapStateToProps, {
    toggleShowOp,
    switchTab,
    logout,
    search
})(UserContent);
