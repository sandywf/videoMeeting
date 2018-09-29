// 做各种数据转换


export const formateRole = (role) => {
    switch (role) {
        case 'MAIN':
            return '主';
        case 'WATCH':
            return '观';
        default:
            return role;
    }
}

