/**
 * 主要内容部分
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import RightBar from '../rightBar/rightBar';
import VideoContent from '../videoContent/videoContent';
import DemoContent from '../demoContent';
import style from './content.less';
import {connect} from 'react-redux';
import Footer  from '@/components/footerBar/footerBar';
class MainContent extends Component {
    static propTypes = {
    }

    render() {
        let {mode} = this.props;
        return (
            <div className={style.main}>
                <div className={style.inner}>
                    {mode ==='video'? <DemoContent/> : <VideoContent/>}
                    <Footer/>
                </div>
                <RightBar />
            </div>
        )
    }
};

let mapStateToProps = (state)=>({
    mode: state.meetInfo.mode
})

let mapDispatchToProps = {

}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainContent);
