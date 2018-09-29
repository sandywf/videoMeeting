//工具类方法集合


/**
 * 切换全屏
 */
export const switchFullScreen = (state)=>{
	if(state){
		//全屏显示画面-相当于f11
		let docElm = document.documentElement;
		//W3C
	    if (docElm.requestFullscreen) {
	      docElm.requestFullscreen();
	    }
    	//FireFox   
		else if (docElm.mozRequestFullScreen) {
		    docElm.mozRequestFullScreen();
		}
		//Chrome等   
		else if (docElm.webkitRequestFullScreen) {
		    docElm.webkitRequestFullScreen();
		}
		//IE11   
		else if (docElm.msRequestFullscreen) {  
		    docElm.msRequestFullscreen();  
		}
	}else{
		//取消全屏
		if (document.exitFullscreen) {  
        	document.exitFullscreen();  
	    }  
	    else if (document.mozCancelFullScreen) {  
	        document.mozCancelFullScreen();  
	    }  
	    else if (document.webkitCancelFullScreen) {  
	        document.webkitCancelFullScreen();  
	    }  
	    else if (document.msExitFullscreen) {  
	        document.msExitFullscreen();  
	    }  
	}
};
