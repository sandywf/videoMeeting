/**
 * 反馈模块  操作消息
 */ 

import React, {Component} from "react";
export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: "loading", // "warning" "loading" "success" ,"error"
            message: "",
            show: false    // "false"
        };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.show && this.state.show) {
            // 打开时
        }
    }

    closeFeedback() {
        this.setState({
            show: false
        });
    }

    render() {
        var show = this.state.show ? "show" : "";
        show += this.state.animated ? " anim" : "";
        let imageIcon = null;
        let loadAnimation = null;

        var typeName = this.state.types;
        var icon = "";
        if (typeName === "info" || typeName === "warning" || typeName === "error" || typeName === "success") {
            if (typeName === "info") {
                icon = "";
            } else if (typeName === "warning" || typeName === "error") {
                icon = "";
            } else { // 默认是success
                icon = "";
            }
            imageIcon = (<span className={" " + icon}></span>);
        } else {
            loadAnimation = (<Loading />);
        }
        return (
            <div id="feedback_panel" className={this.state.types + " " + show}>
                <div className="main-cont">
                    <div className="message">
                        {imageIcon}
                        {loadAnimation}
                        {this.state.message}
                    </div>
                </div>
            </div>
        );
    }
};


// 加载动画
const Loading = (props) => {
    return (
        <div id="loading_anim">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>
    )
}

