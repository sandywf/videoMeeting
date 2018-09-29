// 邀请来宾 或者  邀请观摩
import React, { Component } from 'react';
import Less from './index.less';
import { connect } from 'react-redux';
import {Modal}  from "@/components/modal";
class Invite extends Component {

	componentDidMount() {
		let { copyBtn, copyData } = this.refs;
		let {modal} = this.props;
		copyBtn.addEventListener('click', function () {
			let ele = copyData;
			if (ele && ele.select) {
				ele.select();
				try {
					document.execCommand('copy');
					ele.blur();

					Modal.alert('复制成功');
					modal.onCancel();
				}
				catch (err) {
					Modal.alert('浏览器不支持， 请使用 Ctrl/Cmd+C 复制');
				}
			}
		}, true);
	}

	
	render() {
		let { mkey, modal, guestIdentifyCode,monitorIdentifyCode,local } = this.props;
		let type = modal.type;
		let secret =  type=== 'guest' ? guestIdentifyCode : monitorIdentifyCode;

		return (
			<React.Fragment>
				<div className={Less.wrap}>
					<div className={Less.content}>
						<input className={Less.url} defaultValue={`${local}/cmeet/${type}/${mkey}/index.html`}/>

						<p className={Less.key}><span>验证码：</span> {secret}</p>
					</div>
					<div ref='copyBtn' className={Less.btn}>复制</div>
					<textarea ref='copyData' defaultValue={`${local}/cmeet/${type}/${mkey}/index.html (验证码：${secret})`} ></textarea>
				</div>
			</React.Fragment>
		);
	}
}

let mapStateToProps = state => ({
	mkey: state.meetInfo.mkey,
	guestIdentifyCode: state.meetInfo.guestIdentifyCode,
	monitorIdentifyCode: state.meetInfo.monitorIdentifyCode,
	local: state.meetInfo.meetObj.hostConfig.local,
});

let mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
