//视频设置弹框
import React, { Component } from 'react';
import Less from './index.less';
import { switchSortVideo } from '@/store/popup/action';
import { setSpeakerList } from '@/store/meet/action';

import { User } from '@/api/index'
import { connect } from 'react-redux';
import classNames from "classnames";
import { SortableComposition as sortable } from "../../../components/sortTable";
const Item = (props) => {
	return (
		<li {...props}>
			{props.children}
		</li>
	)
}
var SortableItem = sortable(Item);

class SortVideo extends Component {

	state = {
		items: []
	};

	componentWillMount() {
		this.setState({
			items: this.formateData()
		})
	}

	componentDidMount() {
		//设置弹框的确认按钮的触发事件
		let {modal} = this.props;
		modal.setSure(()=>{
			//视频设置进行保存
			this.onConfirm(modal);
		});
	}

	renderItem() {
		let items = this.state.items
		return items.map((item = {}, i) => {
			return (
				<SortableItem
					key={i}
					onSortItems={this.onSortItems}
					items={items}
					sortId={i}>
					<div className={classNames({[Less.empty]: item.isEmpty})}>
						<span>{i + 1}</span>
						<span>{item.realName}</span>
					</div>
				</SortableItem>
			);
		});
	}

	formateData() {
		let videos = {
			one: 1,
			two: 2,
			threeLeftRight: 3,
			threeTopBottom: 3,
			four: 4,
			sixLeft: 6,
			sixRight: 6,
			eight: 8,
			nine: 9,
		}
		let { speakerList, videoLayoutMode } = this.props;
		if (speakerList.length < videos[videoLayoutMode]) {
			do {
				speakerList.push("")
			} while (
				speakerList.length < videos[videoLayoutMode]
			)
		}

		return speakerList.map((uid) => {
			if (uid) {
				return this.getUserByUid(uid);
			} else {
				return {
					realName: '空白',
					isEmpty: true
				}
			}
		})
	}

	getUserByUid(uid) {
		let { userList } = this.props;

		let user = (userList || []).filter(user => {
			return user.uid === uid;
		})

		return user[0];
	}

	onSortItems = (items) => {
		this.setState({
			items: items
		});
	}

	onConfirm(modal){
		let speakerList = this.state.items.map((item)=>{
			if(item.uid) {
				return item.uid
			}
			return '';
		})

		User.toggleSpeaker({speakers: speakerList.join(',')}).then(()=>{
			this.props.setSpeakerList(speakerList);
		});

		modal.onCancel();
	}

	render() {
		let listItems = this.renderItem();
		return (
			<div className={Less.content}>
				<p className={Less.tips}>说明：拖动一个动画可与其他画面交换位置</p>
				<div className={Less.title}>
					<span>序号</span>
					<span>画面</span>
				</div>
				<ul className={Less.list}>
					{listItems}
				</ul>
			</div>
		);
	}
}

let mapStateToProps = state => {
	return {
		speakerList: state.meetInfo.speakerList,
		videoLayoutMode: state.setInfo.videoLayoutMode,
		userList: state.userInfo.userList
	}
}

let mapDispatchToProps = {
	switchSortVideo,
	setSpeakerList
}

export default connect(mapStateToProps, mapDispatchToProps)(SortVideo);