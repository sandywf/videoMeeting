// 初始化白板 

import store from '@/store/store';
import * as actions from "@/store/coco/action";
import {wPad} from "./codyy";
import {shareApi}         from '@/api';

export default class WPad {
    constructor(role, id){
        this.pad = '';
        this.padDom =  document.createElement('div');
        this.padDom.style.width  = '100%';
        this.padDom.style.height = '100%';
        this.padDom.id = 'pad';
        this.width = 0;    //dom模块宽度
        this.height = 0;   //dom模块高度
        this.minWidth = 480;
        this.minHeight = 270;
        this.init(role, id);
    }

    init(role, id){
        var power = role === 'MAIN' ? true : false;
        this.pad = wPad.init({
            tabLimit: 50, // 白板页签上限
            super: role === 'MAIN',
            id: id,
            layout: "leftTop",
            vertical: true,
            disable: !power,
            wrap:  this.padDom,
            saveImgStep: 5,
            color: "#000",
            toolbars: ["ferula", "pen", "line", "rectangle", "round", "text","image", "color","eraser", "export", "clear"],
            background: "#fff",
            eraserSize: 5,
            ferulaSize: 5,
            autoSaveTime: 5,
            onRender: function(data) {
                store.dispatch(actions.callAll('onRender', data))
            },
            onShowFiles: function(data) {

                store.dispatch(actions.callAll('onShowFiles', data))
            },
            onMousemove: function(data) {
                store.dispatch(actions.callAll('onMousemove', data))
            },
            onClear: function(tid) {
                store.dispatch(actions.callAll('onClear', tid))
            },
            onTabChange: function(tid) {
                if (power) {
                    store.dispatch(actions.callAll('onTabChange', tid))
                }
            },
            onTabRemove: function(tid) {
                store.dispatch(actions.callAll('onTabRemove', tid))
            },
            
            onPageTurn: function(tid, pageNumber, data) {
                if (power) {
                    var params = {
                        tid: tid,
                        pageNumber: pageNumber,
                        documentId: tid// 文档Id
                    }

                    shareApi.showDocToMobile({documentId: tid,pageNum: pageNumber})
                    store.dispatch(actions.callAll('onPageTurn', params))
                }
            }
        });
        
        if (this.pad) {
            this.listenControl();
        }
    }

	//触发页面重新调整
    calcSize(mode) {
        let {offsetWidth,offsetHeight} = this.padDom.parentNode;
        
        if(mode === 'pad') {
            this.padDom.style.height = this.minHeight+"px";
            this.padDom.style.width  = this.minWidth+"px";
            let scalc_w =  offsetWidth/this.minWidth;
            let scalc_h =  offsetHeight/this.minHeight;
            this.padDom.style.transformOrigin = "0 0";
            this.padDom.style.transform = 'scale('+scalc_w+','+scalc_h+')';
            this.padDom.classList.add("pad");
            
        }else{
        	this.padDom.style.height = "100%";
            this.padDom.style.width  = "100%";
            this.padDom.style.transform = 'scale(1,1)';
            this.padDom.classList.remove("pad");
        }
       
        if( offsetWidth !== this.width ||  offsetHeight !== this.height ){
        	this.width  = offsetWidth;
        	this.height = offsetHeight;
        	this.pad.resize();
        }
    }
	
	//监听事件
    listenControl(type,data){
        let pad = this.pad;
        
        switch(type){
        	//渲染数据
        	case 'onRender'    : pad.render(data);break;
        	//文档演示
        	case 'onShowFiles' : pad.showFiles(data);break;
        	//绘制鼠标
        	case 'onMousemove' : pad.mouseCtrl(data);break;
        	//清空白板
        	case 'onClear'     : pad.clear(data);break;
        	
        	//切换tab
        	case 'onTabChange' : pad.changeTab(data);break;
        	//移除tab
        	case 'onTabRemove' : pad.removeTab(data);break;
        	//切换分页
        	case 'onPageTurn'  : pad.turnPage(data.tid,data.pageNumber);break;
        	default:break;
        }
    }
}


