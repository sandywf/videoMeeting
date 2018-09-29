/*
*计算视频布局  每个视屏模块的大小问题
* 只计算大小
* 不考虑布局
* 先计算整体大小比例  
* 然后进行排序分割  依据宽度比  不参考高度比
*/

// const SIDEWIDTH = 320;
const TOPHEIGHT = 32;
const BASERATIO = 9 / 16;

const layout = {
    modeRatio: {
        'one': {
            wrapRatio: 9 / 16, // 包裹层宽高比例
            widthPercent: 1,  // 小矩形宽度占包裹层的比例
            number: 1 // 个数
        },
        'two': {
            wrapRatio: 9 / 32,
            widthPercent: 1 / 2,
            number: 2
        },
        'threeLeftRight': {
            wrapRatio: 9 / 24,
            widthPercent: 1 / 3,
            number: 3
        },
        'threeTopBottom': {
            wrapRatio: 13.5 / 16,
            widthPercent: 1 / 2,
            number: 3
        },
        'four': {
            wrapRatio: 9 / 16,
            widthPercent: 1 / 2,
            number: 4
        },
        'sixLeft': {
            wrapRatio: 13.5 / 24,
            widthPercent: 1 / 3,
            number: 6
        },
        'sixRight': {
            wrapRatio: 13.5 / 24,
            widthPercent: 1 / 3,
            number: 6
        },
        'eight': {
            wrapRatio: 9 / 16,
            widthPercent: 1 / 4,
            number: 8
        },
        'nine': {
            wrapRatio: 9 / 16,
            widthPercent: 1 / 3,
            number: 9
        }
        // 'sixteen': {
        //     wrapRatio: 9 / 16,
        //     widthPercent: 1 / 4,
        //     number: 16
        // },
    },

    /**
     * 计算出包裹层的 宽高
     * @param {*} type  // 类型
     */
    calcWrapSize(type, dom) {
        let ratio = this.modeRatio[type].wrapRatio || BASERATIO;
        let width = dom ? dom.offsetWidth : ''; // 屏幕视频可用区域宽度
        let height = dom ? dom.offsetHeight - TOPHEIGHT : ''; // 屏幕视频区域可用高度   默认去掉头部菜单高度
        let wrapSize = {};

        if (width * ratio > height) {
            wrapSize.height = height;
            wrapSize.width = height / ratio
        } else {
            wrapSize.height = width * ratio;
            wrapSize.width = width
        }
        return wrapSize;
    },

    /**
     * 大小相同的   
     * @param {*} number  分多少块  1/4/9/16
     */
    sameSize(dom, type) {
        let wrapSize = this.calcWrapSize(type, dom);
        let data = this.modeRatio[type]
        let widthPercent = data.widthPercent;
        let number = data.number;

        let sameSize = {
            widthS: wrapSize.width * widthPercent,
            heightS: wrapSize.width * widthPercent * BASERATIO,
            number
        }
        return { ...sameSize }
    },

    /**
     * 计算一组不同大小的video尺寸
     * @param {*} type 类型
     * @param {*} bigPosition 大矩形位置
     */
    diffSize(dom, type, bigPosition) {
        let wrapSize = this.calcWrapSize(type, dom);
        let data = this.modeRatio[type]
        let widthPercent = data.widthPercent;
        let number = data.number;

        let big = {
            widthB: wrapSize.width * (1 - widthPercent),
            heightB: wrapSize.width * (1 - widthPercent) * BASERATIO,
            position: bigPosition,
        }

        let small = {
            widthS: wrapSize.width * widthPercent,
            heightS: wrapSize.width * widthPercent * BASERATIO,
        }

        return { ...big, ...small, number }
    },

    /**
     * 这个奇葩上下结构 特殊处理
     */
    threeTopBottom(dom) {
        let wrapSize = this.calcWrapSize('threeTopBottom', dom);
        let big = {
            widthB: wrapSize.width,
            heightB: wrapSize.width * BASERATIO,
            position: 'top'
        }

        let small = {
            widthS: wrapSize.width / 2,
            heightS: wrapSize.width / 2 * BASERATIO,
        }

        return { ...big, ...small, number: 3 }
    },

    getSize(dom, type, bigPosition = 'left') {
        let sameSize = ['one', 'four', 'nine', 'sixteen', 'two']
        let diffSize = ['threeLeftRight', 'sixRight', 'sixLeft', 'eight',]
        if (sameSize.indexOf(type) >= 0) {
            return this.sameSize(dom, type);
        } else if (diffSize.indexOf(type) >= 0) {
            return this.diffSize(dom, type, bigPosition);
        } else if ('threeTopBottom' === type) {
            return this.threeTopBottom(dom);
        }
    },

}

export default layout;