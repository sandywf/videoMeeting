
/**
 * 消息相关  （测试用）
 */
import * as Type from '@/config/actionTypes';

let defaultState = {
   pad: '',
   padDom: ''
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case Type.INIT_PAD:
        // do something
        return {
            ...state, ...action.data
        }

        default: 
        return state;
    }
}
