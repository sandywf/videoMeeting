/**
 * 侧边栏模块
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './module.less';
import classNames from "classnames";
import {switchMode} from '@/store/meet/action';
import { connect } from 'react-redux';
import { meetApi } from '@/api';
import ReactIScroll from 'react-iscroll';
import FreeScrollBar from 'react-free-scrollbar';

class Module extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired, 
        type: PropTypes.string.isRequired // 模块类型 pad|video|user|note|message 
    }
    constructor(props) {
        super(props);
        this.state = {
            scrollBarHeight: "100%",
            isScrollBar: false,
            fold: false,
            showVideo: false,
            textValue: '',
        };
    }

    toggleShow(){
        let moduleType = this.props.type;
        if(moduleType === 'video' || moduleType==='pad' ) return ;
        this.setState({
            fold: !this.state.fold,
            // 收起note会出现底部的文字展示不全的问题,这里为了处理这个问题,展开的时候加20px
            scrollBarHeight: this.state.fold && this.state.scrollBarHeight + 20
        }, () => {
            this.props.onChange && this.props.onChange(this.state.fold)
        })
    }

    componentDidMount(){
        let meetId = this.props.meetId;
        let val = window.localStorage.getItem(`${meetId}_note`);
        if(val) {
            this.setState({
                textValue: val,
            })
        }
    }

    switchMode() {
        let {mode} = this.props;
        let realMode =  mode === "video" ? 'pad' : 'video'
		this.props.switchMode(realMode)
    }

    toggleVideoShow () {
        this.setState({
            showVideo: !this.state.showVideo
        })
    }

    downloadNote(e){
        e.stopPropagation();
        let ele = this.refs.notes;
        let val = ele.value.trim()
        if(val) {
            this.downloadTxt(val)
            meetApi.saveNote({
                content: val
            })
        }
    }

    // 下载文件
    downloadTxt(content) { 
        var eleLink = document.createElement('a');
        eleLink.download = 'note.txt';
        eleLink.style.display = 'none';
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }

    clearNote(e) {
        e.stopPropagation();
        this.refs.notes.value = '';
        let meetId = this.props.meetId;
        window.localStorage.setItem(`${meetId}_note`, '')
        this.setState({ textValue: '' })
    }

    saveNoteToLocal(){
        let ele = this.refs.notes;
        let val = ele.value.trim();
        let meetId = this.props.meetId;
        window.localStorage.setItem(`${meetId}_note`, val);
        this.setScrollBarHeight()
        this.setState({
            textValue: val,
        })
    }

    renderOperation(){
        let { type,role } = this.props; 
        let opDom = '';

        if(type === 'pad') {
            opDom = <div className={style['title-op']}>
                    <i className='iconfont icon-doc-switch' onClick={this.switchMode.bind(this)} />
                </div>
        } else if(type === 'video') {
            opDom = <div className={style['title-op']}>
            	{role!=="WATCH"?<i className='iconfont icon-screen-style-switch' onClick={this.toggleVideoShow.bind(this)} />:null}
                
                <i className='iconfont icon-doc-switch' onClick={this.switchMode.bind(this)} />
            </div>
        } else if(type === 'note') {
            opDom = <div className={style['title-op']}>
                { !this.state.fold && <i onClick={(e)=>(this.clearNote(e))} className='iconfont icon-delete-notebook' /> }
                { !this.state.fold && <i onClick={(e)=>(this.downloadNote(e))} className='iconfont icon-download-notebook' /> }
            </div>
            
        }
        return opDom;
    }

    // 设置滚动条 param: 是否需要滚动条(Boolean)
    // setScroll = isNeedScroll => {
    //     this.setState({ isScrollBar: isNeedScroll })
    // }

    // FreeScrollBar组件需要子元素的高来控制滚动条,所以每次鼠标移入或者内容更改的时候重新计算宽高
    // 暂时先这样吧,产品不喜欢浏览器自带的滚动条样式,而此处有textarea的滚动条样式,很难修改
    // scrollHeight: 滚动大小，指的是包含滚动内容的元素大小（元素内容的总高度）
    setScrollBarHeight = (e) => {
        let textAreaHeight = this.refs.notes.scrollHeight
        this.setState({
            scrollBarHeight: textAreaHeight,
        })
    }

    render() {
        let moduleType = this.props.type;
        let textarea = moduleType === 'note' ? (
            <div className={style['note-area']}>
                <FreeScrollBar autohide={true} style={{ height: "100%", backgroundColor: "#fff" }}>
                    <textarea
                        maxLength="2000"
                        style={{height: this.state.scrollBarHeight , overflow: "hidden"}}
                        // style={{ overflow: this.state.isScrollBar ? "scroll" : "hidden" }}
                        onMouseEnter={this.setScrollBarHeight}
                        // onWheel={() => this.setScroll(true)} // 监听鼠标滚轮事件,出现滚动条
                        // onMouseLeave={() => this.setScroll(false)} // 鼠标移出区域,隐藏滚动条
                        // onTouchStart={() => this.setScroll(true)} // touch开始,出现滚动条
                        // onTouchEnd={() => this.setScroll(false)} // touch结束,隐藏滚动条
                        onChange={this.saveNoteToLocal.bind(this)}
                        value={this.state.textValue}
                        ref='notes'
                        placeholder='请输入您需要记录的内容...(2000字)'
                    />
                </FreeScrollBar>
            </div>) : null;
           
        return (
            <div className={classNames({[style.showVideo] : this.state.showVideo, [style.fold] : this.state.fold}, style.module, style[moduleType])}>
                <div className={style.header} onClick={this.toggleShow.bind(this)}>
                    <span className={style.title}>{this.props.title}</span>
                    {this.renderOperation()}
                </div>
                {this.props.children}
                {textarea}
            </div>
        )
    }
};

let mapStateToProps = (state) => ({
	role : state.meetInfo.role,
    mode: state.meetInfo.mode,
    meetId: state.meetInfo.meetId
});

let mapDispatchToProps = {
	switchMode
}
export default connect(mapStateToProps, mapDispatchToProps)(Module);
