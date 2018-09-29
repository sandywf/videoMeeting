//视频设置弹框
import React, { Component } from 'react';
import Less from './index.less';
import { videoLayoutSetting } from '@/store/popup/action';
import { connect } from 'react-redux';
import { changeVideoLayout } from '@/store/settings/action';
import classNames from "classnames";
import { Calc } from '@/utils/index';
import {Modal}  from "@/components/modal";

const chnNumChar = {
    1: '一',
    2: '二',
    3: '三',
    4: '三',
    5: '四',
    6: '六',
    7: '六',
    8: '八',
    9: '九',
}

class VideoLayoutSetting extends Component {
	static defaultProps = {
		videoLayoutMode: 'four'
	}

	state = {
        isIndex: null
    }

	// 切换视屏布局
	changeVideoLayout(mode) {
		let {speakerList,videoLayoutMode } = this.props;

		if (videoLayoutMode !== mode) {
			let validArr = speakerList.filter((item)=>{
				return item;
			})

			if (Calc.modeRatio[mode].number < validArr.length){
				Modal.alert('主讲人数不能超过画面数量！');
				return;
			} else {
				this.props.changeVideoLayout(mode, true);
				this.props.modal.onCancel();
			}
			
		} 
	}

	// 鼠标移入模块布局模块, 将当前index作为标记
    mouseEnterModule = index => {
	    this.setState({
            isIndex: index
        })
    }

	_renderMode() {
		let defaultMode = ['one', 'two', 'threeLeftRight', 'threeTopBottom', 'four', 'sixLeft', 'sixRight', 'eight', 'nine']; //, 'sixteen'

		return defaultMode.map((item, index) => {
			let isActive = '';
			if (this.props.videoLayoutMode === item || this.state.isIndex === index) {
				isActive = 'active'
			}
			return (
				<li
                    className={classNames(Less[isActive], Less[item], this.state.isIndex === index && Less['isHoverLi'])}
					onClick={this.changeVideoLayout.bind(this, item)}
                    onMouseEnter={() => this.mouseEnterModule(index)}
                    onMouseLeave={() => this.mouseEnterModule(null)}
					key={index}
                >
					<p
                        style={this.state.isIndex === index ? { color: "#1BC840", marginTop: index !== 3 ? 95 : 100, fontSize: 19, fontWeight: 500 } : null }
                        className={classNames(Less.LayoutWord)}
                    >
                        {`${chnNumChar[index + 1]}分屏`}
                    </p>
				</li>
			)
		})
	}

	render() {
		return (
			<React.Fragment>
				<ul className={Less.wrap}>
					{this._renderMode()}
				</ul>
				<i onClick={this.props.modal.onCancel} className={classNames(Less['video-layout-close'], 'iconfont icon-close')} />
			</React.Fragment>
		);
	}
}

let mapStateToProps = state => ({
	videoLayoutMode: state.setInfo.videoLayoutMode,
	speakerList: state.meetInfo.speakerList
});

let mapDispatchToProps = {
	videoLayoutSetting,
	changeVideoLayout
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoLayoutSetting);