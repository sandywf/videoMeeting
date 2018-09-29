# 视频会议-参数平台化		


## 目录  
- [背景介绍](#背景介绍)
- [项目介绍](#项目介绍)
- [目录结构](#目录结构)
- [项目安装](#项目安装)
- [代码解释](#代码解释)

### 背景介绍
>1、老版本视频会议功能，以flash插件为基础，进行项目开发。当前大环境下，各大浏览器都在对flash插件，减少支持，为了后续项目发展，
需要去插件化。  
2、老版本视频会议功能，需要依赖浏览器插件，调用本地软件，进行视频处理。浏览器插件的编写，发布不方便，且对浏览器型号、版本号，
都有部分依赖。故参数平台化采用websocket的方式和软件进行通信，进行功能实现，支持各大主流浏览器。


### 项目介绍
1. ui设计图。[UI](/doc/ui)  
2. 设计原型。[design](/doc/design)  
3. 文档说明。[doc](/doc/授课平台_视频会议_需求规格说明书_V5.4.0.docx)  

### 目录结构
```
videoMeeting/
  README.md
  node_modules/
  package.json
  config/              //全局配置项
  build/               //打包目录
  dll/                 //react,redux,以及codyy内部方法，集合
  	env/
  	prod/
  scripts/             //启动命令
  	build.js
  	dll.js
  	start.js
  	test.js
  public、
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

### 项目安装

1·获取代码

		git clone git@10.5.60.10:frontend/videoMeeting.git  

2.更新开发环境

		npm install  
	
3.启动命令

		npm run dll       //打包通用文件，如react，redux，已经公司内容js文件,默认已经打包到了dll，一般不用
		npm start         //启动开发环境。如果需要修改代理服务器，可通过  set PROXY=https://baidu.com && npm start（window环境）实现
		npm build         //构建生产环境。
		
		
### 代码解释

1.页面初始化加载：
		
			/**
			 * 会议初始化
			 *
			 * promise.all
			 * 		|---getMeetInitData    //获取会议相关数据
			 * 		|---getUserList        //获取参会者列表
			 * 		|--then
			 * 			|---initSetting
			 * 			|		|---promise.all
			 * 			|				|--- setApi.getRtmpUrl   //获取发布的dms流服务器
			 * 			|				|--- getPlgunJson        //本地大json
			 * 			|				|--- getVideoSetting     //后台视屏相关设置
			 * 			|				|---then
			 * 			|					 |---handlePluginJson  //处理大json
			 * 			|							 |---setScreenList      //设置当前设备的机位数组，并绑定快捷捷切换画面功能
			 * 			|							 |---bindVideoAndCrame  //根据大json，生产虚拟video，并绑定虚拟摄像头，方便启用（包括发布流，和接受流）
			 * 			|---getCocoServer    //获取coco服务地址
			 * 					|---setCoco  //链接coco服务器
			 * 
			 */
