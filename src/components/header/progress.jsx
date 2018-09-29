/**
 * 进度条 调节音量
 */
import React, { Component } from 'react';
import style from './header.less';
import classNames from "classnames";

let volume = 0

export default class Progress extends Component {
    constructor(props){
        super();
        this.value = 0;
        this.state = {
            disable: false,
        }
    }

    componentDidMount() {
        // 音量控制
        let isDraging = false;
        let handler = this.refs.handler;
        let progress = this.refs.progress;
        let _this = this;
     
        handler.addEventListener('mousedown', function (e) {
            _this.setMute(false)
            isDraging = true;
            changeVolume(e);

        });

        document.addEventListener('mouseup', function (e) {
            if (isDraging) {
                isDraging = false;
                changeVolume(e);
            }
        });

        document.addEventListener('mousemove', function (e) {
            if (isDraging) {
                changeVolume(e);
            }
        });
        progress.addEventListener('click', function(e){
            _this.setMute(false)
            changeVolume(e);
        })

        var changeVolume = function (e) {
            var position = e.pageX - progress.offsetLeft;
            var percentage = position / progress.offsetWidth;

            if (percentage > 1) {
                percentage = 1;
            }

            if (percentage < 0) {
                percentage = 0;
            }

            // todo 调用插件接口
            // 只有当拖动或者点击的时候才会计算音量
			volume = Math.round(percentage*100);
            _this.props.onChange(volume);
        }
    }

    // 设置静音 Parma: 是否已经静音
    setMute = (isDisable) => {
        let isMuteVolume = !isDisable ? this.value : 0
        this.props.onChange(isMuteVolume);
        this.setState({ disable: isDisable })
    }

    render() {
        let classN = 'icon-' + this.props.type;
        let classDisable = this.state.disable && 'icon-disable';
        let {value} = this.props;
        if( value === 0 ){
        	value = this.value;
        }else{
        	this.value = value;
        }
        
        let percentage = value/100;
        return (
            <div className={classNames(style.operation, style.progress)}>
                <i onClick={() => this.setMute(!this.state.disable)} className={'iconfont ' + classN}>
                    <i className={'iconfont ' + classDisable} />
                </i>
                <div ref='progress' className={style.bar}>
                    <div ref='percent' style={{borderLeftWidth : percentage*90 + 'px'}} className={style.percent} />
                    <span ref='handler' style={{left : -94 + percentage*90 + 'px'}} className={classNames(style['drag-handle'])} />
                </div>
            </div>
        )
    }
};
