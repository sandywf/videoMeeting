//时间处理

function padding(v) {
    if (v.toString().length <= 1) return '0' + v;
    return v;
}

/**
 * 将秒数 转换成 00:00:00格式
 */
export const transTime = (t=0)=>{
	let hour=Math.floor(t/60/60),
    	minute=Math.floor(t/60%60),
    	second=Math.floor(t%60);
    
   
    return padding(hour)+":"+padding(minute)+":"+padding(second);
}


export const formateTime = (t)=>{
    let date = new Date(t)
	let hour=date.getHours(),
    	minute=date.getMinutes(),
    	second=date.getSeconds();
    return padding(hour)+":"+padding(minute)+":"+padding(second);
}