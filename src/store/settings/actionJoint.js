//################ 拼接流规则 ###############
/**
 * 画面默认的分辨率为 1280*720
 * 画面需要重写的有以下的情况：
 * 1.视频布局
 * 2.画面列表
 */

const basicWidth = 1280;
const basicHeight = 720;

//一画面
const one = [
	{ xpos : 0, ypos : 0, width : 1, height : 1}
];

//二画面
const two = [
	{ xpos : 0,   ypos : 0, width : 0.5, height : 0.5 },
	{ xpos : 0.5, ypos : 0, width : 0.5, height : 0.5 }
];

//三画面(大画面左侧)
const threeLeftRight = [
	{ xpos : 0,   ypos : 0,   width : 2/3, height : 2/3  },
	{ xpos : 2/3, ypos : 0,   width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 1/3, width : 1/3, height : 1/3  },
];

//三画面(大画面上面)
const threeTopBottom = [
	{ xpos : 0,   ypos : 0,   width : 2/3, height : 2/3  },
	{ xpos : 0,   ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 1/3, ypos : 2/3, width : 1/3, height : 1/3  },
];

//四画面
const four = [
	{ xpos : 0,   ypos : 0,   width : 1/2, height : 1/2  },
	{ xpos : 1/2, ypos : 0,   width : 1/2, height : 1/2  },
	{ xpos : 0,   ypos : 1/2, width : 1/2, height : 1/2  },
	{ xpos : 1/2, ypos : 1/2, width : 1/2, height : 1/2  },
];

//六画面(大画面左侧)
const sixLeft = [
	{ xpos : 0,   ypos : 0,   width : 2/3, height : 2/3  },
	{ xpos : 2/3, ypos : 0,   width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 1/3, width : 1/3, height : 1/3  },
	{ xpos : 0,   ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 1/3, ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 2/3, width : 1/3, height : 1/3  },
];

//六画面(大画面右侧)
const sixRight = [
	{ xpos : 1/3, ypos : 0,   width : 2/3, height : 2/3  },
	{ xpos : 0,   ypos : 0,   width : 1/3, height : 1/3  },
	{ xpos : 0,   ypos : 1/3, width : 1/3, height : 1/3  },
	{ xpos : 0,   ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 1/3, ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 2/3, width : 1/3, height : 1/3  },
];

//八画面
const eight = [
	{ xpos : 0,   ypos : 0,   width : 3/4, height : 3/4  },
	{ xpos : 3/4, ypos : 0,   width : 1/4, height : 1/4  },
	{ xpos : 3/4, ypos : 1/4, width : 1/4, height : 1/4  },
	{ xpos : 3/4, ypos : 2/4, width : 1/4, height : 1/4  },
	{ xpos : 0,   ypos : 3/4, width : 1/4, height : 1/4  },
	{ xpos : 1/4, ypos : 3/4, width : 1/4, height : 1/4  },
	{ xpos : 2/4, ypos : 3/4, width : 1/4, height : 1/4  },
	{ xpos : 3/4, ypos : 3/4, width : 1/4, height : 1/4  },
];

//九画面
const nine = [
	{ xpos : 0,   ypos : 0,   width : 1/3, height : 1/3  },
	{ xpos : 1/3, ypos : 0,   width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 0,   width : 1/3, height : 1/3  },
	{ xpos : 0,   ypos : 1/3, width : 1/3, height : 1/3  },
	{ xpos : 1/3, ypos : 1/3, width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 1/3, width : 1/3, height : 1/3  },
	{ xpos : 0,   ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 1/3, ypos : 2/3, width : 1/3, height : 1/3  },
	{ xpos : 2/3, ypos : 2/3, width : 1/3, height : 1/3  },
];

//画面模式集合
const videoShowMode = { one,two,threeLeftRight,threeTopBottom,four,sixLeft,sixRight,eight,nine };


//当前的拼接流规则，用于是否再次给插件设置拼接画面
let cacheRule = "";


//获取最后的拼接规则，并通知给插件
export const jointVideoStream = (state,dispatch) =>{
	return (dispatch,getState)=>{
		let { videoLayoutMode,virtualCamera,resolution } = getState().setInfo;
		let { speakerList,pollingSetting,role } = getState().meetInfo;
		
		//如果虚拟摄像头还未加载成功，不进行拼接处理
		if( virtualCamera.length === 0 ) return;
		
		//只有支持人才会发送观摩流
		if( role !== "MAIN" ) return;
		
		
		//根据当前的视频布局生成基本的样式
		let layoutList = videoShowMode[videoLayoutMode];
		let showList = [];
		//判断当前是否处于主讲教室轮询状态
		if( pollingSetting.customPolling ){
			//获取轮训的数组
			showList = pollingSetting.pollingList;
		}else{
			//获取发言人的数组
			showList = speakerList;
		}
		
		//根据showList获取虚拟摄像头设置的index值，并填充到布局数组中
		let posArr = resolution.split("*").map(item=>Number(item));
		let resultList = layoutList.map((item,index)=>{
			let layoutObj = {
				xpos   : Math.round( item.xpos   * posArr[0] ),
				ypos   : Math.round( item.ypos   * posArr[1] ),
				width  : Math.round( item.width  * posArr[0] ),
				height : Math.round( item.height * posArr[1] ),
			};
			let tag = showList[index];
			if( tag ){
				let virtualObj = virtualCamera.find(val=>val.userId===tag);
				if( virtualObj ){
					layoutObj.id = virtualObj.index>100?virtualObj.index-100:virtualObj.index;
				}
			}
			if( 'id' in layoutObj  ){
				return layoutObj;
			}else{
				layoutObj.id = 101;
				return layoutObj;
			}
		}).filter(item=>!!item);
		
		
		//将获取的拼接规则通知给发送插件，在插件中进行拼接并发送流数据
		//获取发送流的插件方法
		let ruleStr = JSON.stringify( { customSubPicInfo:resultList } );
		
		//规则一样，则不做处理
		if( ruleStr === cacheRule ) return;
		
		let { plugin } = virtualCamera.find(item=>item.index===0);
		plugin.setCustSplitInfo({
			id   : 100,
			rule : ruleStr
		},(r)=>{
			if( r.param.result === 0 ){
				//如果拼接设置成功，则替换缓存的数据
				cacheRule = ruleStr;
			}
			console.log("===拼接结果===",ruleStr,r);
		});
	};
};