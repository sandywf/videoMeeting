

/*--------------------------------------------------------------------------*/
/*------------------------------  对外的调用接口 begin   -------------------*/
/*--------------------------------------------------------------------------*/
var UPLOADS = {};
var localFiles = {
	"localName": window.location.host + "_upload",
	"files": {},
	"defaultFile": {
		fileIndex: 0,
		status: "loaded",
		timeOut: 0
	},
	"getItem": function() {
		//获取配置项
		var files = JSON.parse(localStorage.getItem(this.localName) || "{}");
		var now = (new Date()).getTime();
		for(var key in files) {
			if(files.hasOwnProperty(key)) {
				if(now > files[key].timeOut || files[key].status === 'loaded' || files[key].status === 'complete' || files[key].status === 'error') {
					//如果文件超时，或者完成，或者刚加载完成，或上传失败则删除文件。
					delete files[key];
				}
			}
		}
		this.files = files;
		this.setItem();
	},
	"setItem": function() {
		localStorage.setItem(this.localName, JSON.stringify(this.files));
	},
	"getFile": function(id) {
		var file = this.files[id],
			now = (new Date()).getTime();
		if(!file) {
			return;
		}
		if(now > file.timeOut || file.status === 'loaded' || file.status === 'complete' || file.status === 'error') {
			this.removeFile(id);
			this.setItem();
			return;
		}
		return this.files[id];
	},
	"removeFile": function(id) {
		delete this.files[id];
		this.setItem();
	},
	"setFile": function(id, file) {
		if(this.files[id]) {
			Object.assign(this.files[id], file);
		} else {
			this.files[id] = Object.assign({}, this.defaultFile, file);
		}
		this.setItem();
	}
};
var uploadFile = {
	"init": _initFn, //初始化上传插件
	"getObject": _getObjectFn, //根据id整个上传对象
	"setTheme": _setThemeFn, //设置具体业务逻辑
	"setCache": localFiles //设置缓存
};

var isDOM = ( typeof HTMLElement === 'object' ) ?
    function(obj){
      return obj instanceof HTMLElement;
    } :
    function(obj){
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

function _initFn(obj, opt) {
	let dom = obj,
		id = obj;
	if( !isDOM(dom) ){
		dom = document.querySelector(obj);
	}else{
		id = dom.id;
		if( !id ){
			id = dom.id = 'Upload_'+Date.now();
		}
	}
	var pluginObj = new _uploadFile(dom, opt);
	UPLOADS[id] = pluginObj;
	localFiles.getItem();
	return pluginObj;
}

function _getObjectFn(id) {
	return UPLOADS[id];
}

function _setThemeFn(opt, fn) {
	defaultOpts.template = opt.template || "";
	Object.assign(defaultOpts, opt);
	Object.assign(defaultFn, fn);
}
/*--------------------------------------------------------------------------*/
/*------------------------------  对外的调用接口 end   ---------------------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------  main begin   ---------------------------*/
/*--------------------------------------------------------------------------*/
//初始化参数
var defaultOpts = {
	"canMultiple": true, //是否支持多文件上传
	"canAuto": true, //选中文件后是否自动上传     true：自动上传；      false:不自动上传；
	"accept": '', //上传文件的类型   [image,video,audio,zip,application]  为空时全选
	"mime": "", //上传文件的类型  直接以mime格式进行添加。
	"showId": "", //上传文件的展示位置：  上传列表的展示；
	"showSort": "before", //文件列表默认的排序方式 before：栈顺序 after:倒栈模式
	"templateUrl": "",
	"template": "",
	"drag": "", //拖动定义的css标签名
	"url": "", //文件上传服务器
	"fileName": "fileName", //上传到后端的文件对应的名称
	"blobName": "blob", //上传到后端的blob对应的名称
	"eachSize": 1024 * 1024, //每个文件分隔的大小（默认500kb)
	"formData": {}, //额外表单部分
	"limit": 0, //上传文件数的最大值
	"maxSize": 0, //上传文件长度最大限制
	"breakPoint": true, //是否开启断点续传
	"timeOut": 30 * 60 * 1000, //断点续传文件的超时间隔
	"_suff": "" //获取文件可获取的后缀,强制后缀，为了一些特殊的格式
};
//on 的 方法集合
var defaultFn = {
	
	//打开文件夹之前（可以用于一些特殊提示，只有true才会打开文件夹）
	"beforeSelect": function() {
		return true;
	},
	
	//打开文件夹之后（可以提前进行文件的一些判断）
	"afterSelect": function(files) {
		//返回处理以后的files对象，
		//如果放回false则不进行下面的处理
		return files;
	},
	
	//选中文件后，回调个个文件的状态（多文件上传的时候放回一个文件，否则返回文件数组）
	"select": "", //选择文件后的回调
	
	"warn": "", //页面上警告内容
	"status": "", //整体状态发生改变
	"success": "", //上传成功的回调
	//$$FN 改写插件逻辑使用，一般外部不建议使用
	"$$beforeSendBlob": "",   //发送单个碎片之前的操作
	"$$afterSendBlob": "",    //发送碎片成功后的操作
	"$$setHeader": '',        //xhr.open 和 xhr.send 中间添加或修改header协议
	"error": "",              //上传失败的回调
	"removeFile": "",         //删除某个文件后的回调  返回id（dosomething）
	"oneFinish" : "",         //某个文件上传结束后触发（成功，失败都触发）
	"oneProgress" : "",       //某个文件上传进度获取
};
//插件根方法
function _uploadFile(dom, opt) {
	var $ = this;
	$.idDom = dom; //id的对象
	$.codyyUploadFile = ""; //file控件对象
	$.files = {}; //当前选中的文件
	$.status = "null"; //插件的状态 null:还未添加文件；uploading：在上传中；pause：停止上传中；complate:全部上传完
	$.fn = Object.assign({}, defaultFn);
	$.setting = Object.assign({}, defaultOpts, opt);
	setBindEvent($);
	$.initFile();
	return $;
}
//插件初始化
_uploadFile.prototype.on = $_onFn; //绑定回调事件
_uploadFile.prototype.emit = $_emitFn; //触发绑定事件
_uploadFile.prototype.initFile = $_initFileFn; //初始化插件
_uploadFile.prototype.addFile = $_addFileFn; //触发文件选择
_uploadFile.prototype.removeFile = $_removeFileFN; //删除某个文件
_uploadFile.prototype.send = $_sendFn; //开始上传
_uploadFile.prototype.pause = $_pauseFn; //暂停上传
_uploadFile.prototype.cancel = $_cancelFn; //清除上传
/*------------------------------  mian方法 fun   -------------------------*/
//绑定事件
function $_onFn(name, fn) {
	this.fn[name] = fn;
	return this;
}
//触发事件
function $_emitFn() {
	var args = [];
	for(var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	var event = args[0];
	if(event && this.fn[event] && typeof(this.fn[event] === 'function')) {
		return this.fn[event].apply(this, args.slice(1));
	}
}
/**
 * 生成点击上传文件的按钮
 */
function $_initFileFn() {
	var _self = this;
	var codyyUploadFile = getElementObj("<input type='file' style='display: none' class='codyyUploadFile'>");
	_self.codyyUploadFile = codyyUploadFile;
	//判断是否支持多选
	if(_self.setting.canMultiple) {
		codyyUploadFile.setAttribute('multiple', '');
	}
	//设置文件选择的类型（文件选择时进行过滤）
	var suff = this.setting.mime || getMIME(_self.setting.accept);
	if(suff !== "*" && _self.setting._suff) {
		_self.setting._suff = _self.setting._suff + "," + suff;
	} else {
		_self.setting._suff = suff;
	}

	codyyUploadFile.setAttribute('accept', _self.setting._suff);
	_self.idDom.appendChild(codyyUploadFile);
	//获取列表设置的模板文件
	if(this.setting.templateUrl) {
		this.setting.template = document.getElementById(this.setting.templateUrl).innerHTML;
	}
	//点击选中按钮触发选择文件
	_self.idDom.addEventListener('click', function() {
		if(_self.emit("beforeSelect")) {
			_self.codyyUploadFile.click();
		}
	});
	//选择文件的触发事件
	codyyUploadFile.addEventListener('change', function() {
		//获取文件信息
		_self.emit("_select", _self.codyyUploadFile.files);
	});
	//拖动上传
	if(_self.setting.drag) {
		var dragDom = document.querySelector(_self.setting.drag);
		if(dragDom) {
			document.addEventListener("dragenter", function(e) {
				dragDom.classList.add('drag');
				e.preventDefault();
			}, false);
			document.addEventListener("dragleave", function(e) {
				dragDom.classList.remove('drag');
				e.preventDefault();
			}, false);
			document.addEventListener("dragover", function(e) {
				dragDom.classList.add('drag');
				e.preventDefault();
			}, false);
			document.addEventListener("drop", function(e) {
				dragDom.classList.remove('drag');
				e.preventDefault();
				return false;
			}, false);
			dragDom.addEventListener("dragleave", function(e) {
				dragDom.classList.remove('dragenter');
			}, false);
			dragDom.addEventListener("dragenter", function(e) {
				dragDom.classList.add('dragenter');
				e.preventDefault();
			}, false);
			dragDom.addEventListener("drop", function(e) {
				e.preventDefault();
				e.stopPropagation();
				_self.emit("_select", e.dataTransfer.files);
				dragDom.classList.remove('drag');
				dragDom.classList.remove('dragenter');
				return false;
			}, false);
		}
	}
}
/**
 * 手动点击触发-弹出选中框
 */
function $_addFileFn() {
	var $ = this;
	if($.emit("beforeSelect")) {
		$.codyyUploadFile.click();
	}
}
/**
 * 删除某个文件对象
 * @param id
 * @private
 */
function $_removeFileFN(id) {
	var $ = this;
	$.emit("removeFile", id);
	delete $.files[id];
	$.emit("_progress");
}
/**
 * 全部上传
 */
function $_sendFn() {
	var $ = this;
	for(var key in $.files) {
		if($.files.hasOwnProperty(key)) {
			var file = $.files[key];
			//如果错误则重传
			if(file.status !== "error") {
				file.send();
			}
		}
	}
}
/**
 * 全部暂停
 */
function $_pauseFn() {
	var $ = this;
	for(var key in $.files) {
		if($.files.hasOwnProperty(key)) {
			$.files[key].pause();
		}
	}
}
/**
 * 全部取消
 */
function $_cancelFn() {
	var $ = this;
	for(var key in $.files) {
		if($.files.hasOwnProperty(key)) {
			$.files[key].cancel();
		}
	}
}
/****************** 内部触发事件 begin ***********************
 /**
 * 绑定全部的监听事件。主要用于回调
 * @param self
 */
function setBindEvent(self) {
	//设置基本接口
	self.on("_select", _selectFn) //切换文件后，触发的事件
		.on("_progress", _progressFn)
		.on("_warn", _warnFn);
}
/**
 * 选中当前文件后触发，对on.change返回相应的文件信息
 * @private
 */
function _selectFn(fileList) {
	//判断文件是否已经上传-判断文件上传是否支持多个
	var $ = this,
		files = [...fileList],
		hasNew = false,
		maxFiles = [],
		formatFiles = [],
		tagId,
		selectList = [];
	
	files = [...($.emit("afterSelect", files) || [])];
	$.codyyUploadFile.value = "";
	if( files.length === 0 ) return;

	if($.setting.canMultiple) {
		//判断文件是否超过限定个数
		if( $.setting.limit > 0 && Object.keys($.files).length + files.length > $.setting.limit) {
			$.emit("_warn", 1);
			return false;
		}
		for(var i = 0; i < files.length; i++) {
			tagId = getAsscii(files[i].size + files[i].name);
			
			//判断文件是否已经上传过了，不可以多次上传同一个文件
			if(!$.files[tagId]) {
				hasNew = true;
				files[i].tagId = tagId;
				files[i].mode = files[i].type ? files[i].type : '.' + getSuffix(files[i].name);
				files[i].suff = '.' + getSuffix(files[i].name);

				$.files[tagId] = new ResumableFile($, files[i], tagId);
				
				//largeError:文件过大;
				if($.setting.maxSize !== 0 && files[i].size > $.setting.maxSize) {
					maxFiles.push($.files[tagId]);
					$.files[tagId].status = 'error';
					$.files[tagId].message = 'largeError';
				}
				//formatError: 格式错误;
				if($.setting._suff !== "*" && $.setting._suff.indexOf(files[i].mode) < 0 && $.setting._suff.indexOf(files[i].suff) < 0 ) {
					formatFiles.push($.files[tagId]);
					$.files[tagId].status = 'error';
					$.files[tagId].message = 'formatError';
				}
				//获取可用的file列表
				selectList.push($.files[tagId]);
			}
		}
	}else{
		let oneFile = files[0];
		tagId = getAsscii( oneFile.size + oneFile.name );
		if(!$.files[tagId]) {
			hasNew = true;
			oneFile.tagId = tagId;
			oneFile.mode = oneFile.type ? oneFile.type : '.' + getSuffix(oneFile.name);
			oneFile.suff = '.' + getSuffix(oneFile.name);

			for(var key in $.files) {
				if($.files.hasOwnProperty(key)) {
					$.files[key].cancel();
				}
			}
			
			$.files = {};
			$.files[tagId] = new ResumableFile($, oneFile, tagId);
			
			if($.setting.maxSize !== 0 && oneFile.size > $.setting.maxSize) {
				maxFiles.push($.files[tagId]);
				$.files[tagId].status = 'largeError';
				$.files[tagId].message = '文件过大，无法上传';
			}
			//formatError: 格式错误;
			if($.setting._suff !== "*" && $.setting._suff.indexOf(oneFile.mode) < 0 && $.setting._suff.indexOf(oneFile.suff) < 0 ) {
				formatFiles.push($.files[tagId]);
				$.files[tagId].status = 'formatError';
				$.files[tagId].message = '格式不正确，无法上传';
			}
			//获取可用的file列表
			selectList.push($.files[tagId]);
		}
	}
	
	if(maxFiles.length > 0) {
		$.emit("_warn", 2, maxFiles);
	}
	if(formatFiles.length > 0) {
		$.emit("_warn", 3, formatFiles);
	}
	
	if(hasNew) {
		//获取全部选中的列表
		$.emit("select",selectList);
		
		//判断是否自动上传文件
		if($.setting.canAuto) {
			//上传文件
			$.send();
		}
	}
}
/**
 * 上传进度发生改变
 * 获取全部上传的状态（null：还未选中任何文件；hasError:有文件上传失败；hasUploading:有文件在上传中；
 *                      allPause：所有文件都不在上传且有文件还未上传完成；complete：所有文件上传成功）
 * @private
 */
function _progressFn() {
	var $ = this,
		result = {
			rate: 0,
			status: $.status,
			filesInfo: []
		},
		status,
		isComplete = true,
		isNull = true,
		hasUploading = false,
		hasError = false,
		allSize = 0,
		allLoaded = 0,
		successArr = [];
	for(var key in $.files) {
		if($.files.hasOwnProperty(key)) {
			isNull = false;
			var file = $.files[key];
			var fileInfo = {
				'id': file.id,
				'status': file.status,
				'loaded': file.loaded,
				'size': file.size,
				'file': file,
				'rate': file.rate.toFixed(2)
			};
			if(file.status !== 'complete') {
				isComplete = false;
			}
			if(file.status === 'uploading') {
				hasUploading = true;
			}
			if(file.status === "error") {
				hasError = true;
			}
			result.filesInfo.push(fileInfo);
			allSize += file.size;
			allLoaded += file.loaded;
			successArr.push(file.successVal);
		}
	}
	if(isNull) {
		status = "null";
	} else if(hasError) {
		status = "error";
	} else if(isComplete) {
		status = "complete";
		$.emit('success', successArr);
	} else if(hasUploading) {
		status = "uploading";
	} else {
		status = "pause";
	}
	//用户的回调接口
	result.status = status;
	result.rate = allSize === 0 ? 0 : Math.round(parseFloat(allLoaded / allSize) * 100) / 100;
	$.emit('progress', result);
	if(status !== $.status) {
		$.status = status;
		$.emit("status", status);
	}
}

function _warnFn(code, info) {
	//错误整理
	var msg = "";
	switch(code) {
		case 1:
			msg = "文件数量超出限制，不添加新选中文件！";
			break;
		case 2:
			msg = "忽略超过限定大小的文件！";
			break;
		default:break;
	}
	this.emit('warn', code, msg, info);
}
/****************** 内部触发事件 end ***********************
 /*--------------------------------------------------------------------------*/
/*--------------------------------  main end   ---------------------------*/
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
/*------------------------------  file 方法begin   -------------------------*/
/*--------------------------------------------------------------------------*/
/**
 * 文件的基类
 * @param uploadObj          //上传插件的方法
 * @param file               //选中的文件
 * @param tagId                 //文件的唯一标识
 * @returns {ResumableFile}
 * @constructor
 */
function ResumableFile(uploadObj, file, tagId) {
	var $ = this;
	$.setting = uploadObj.setting;
	$.uploadObj = uploadObj;
	$.file = file;
	$.url = uploadObj.setting.url;
	$.src = (file.type.indexOf('image/') !== -1 || file.type.indexOf('video/') !== -1 || file.type.indexOf('audio/') !== -1) ? window.URL.createObjectURL(file) : ""; //如果是图片|视频|音频 可提前查看
	$.name = file.name;
	$.size = file.size;
	$.totalSize = file.size > 1024 ?
		file.size / 1024 > 1024 ?
		file.size / (1024 * 1024) > 1024 ?
		(file.size / (1024 * 1024 * 1024)).toFixed(2) + 'GB' :
		(file.size / (1024 * 1024)).toFixed(2) + 'MB' :
		(file.size / 1024).toFixed(2) + 'KB' :
		(file.size).toFixed(2) + 'B'; //格式话，文件大小
	$.tagId = tagId;
	$.status = 'loaded'; //文件的状态   loaded | uploading | pause | complete | error | formatError:格式错误 | largeError：文件太大
	$.xhr = '';
	if($.setting.breakPoint) {
		$.eachSize = $.setting.eachSize;
	} else {
		$.eachSize = $.size;
	}
	$.fileCount = Math.ceil($.size / $.eachSize);
	$.loaded = 0; //已经上传的数据
	$.fileIndex = 0; //已经上传的个数
	$.typeMime = file.type || file.mode; //文件类型
	$.type = file.type.split("/")[0];
	$.$$watchs = []; //所有页面上的监听事件
	$.rate = 0;
	$.successVal = ""; //上传完成后的返回对象
	$.dom = "";
	$.formData = {}; //设置默认的formData对象
	$.message = ''; //错误的具体信息用于报错提示
	$.init();
	return $;
}
ResumableFile.prototype.init = fileInit; //初始化
ResumableFile.prototype.send = fileSend; //文件开始上传
ResumableFile.prototype.pause = fileAbort; //暂停当前文件的上传
ResumableFile.prototype.cancel = fileCancel; //取消上传，并且删除
ResumableFile.prototype.refresh = fileRefresh; //重新上传
function fileInit() {
	var $ = this;

	//用户参数的处理
	if($.setting.formData) {
		for(var key in $.setting.formData) {
			if($.setting.formData.hasOwnProperty(key)) {
				$.formData[key] = $.setting.formData[key];
				//$.formData.append(key, $.setting.formData[key]);
			}
		}
	}
	$.formData[$.setting.fileName] = $.name;
	// $.formData.append($.setting.fileName, $.name);
	var cacheFile = localFiles.getFile.call(localFiles, $.tagId);
	if(cacheFile) {
		Object.assign($, cacheFile);
		$.status = 'pause';
		$.loaded = $.fileIndex * $.eachSize;
		$.rate = Math.round(parseFloat($.loaded / $.size) * 100) / 100;
	}
	
	refreshCache($);
	$.xhr = new XMLHttpRequest();
	//$.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	var handle = {
		"progress": function(e) {
			var gap=0;
			if(e.total >= $.eachSize) {
				gap = e.total - $.eachSize;
			} else {
				gap = e.total - ($.size - $.eachSize * ($.fileCount - 1));
			}
			//监听文件上传的真实进度；
			var compute = Math.round(e.loaded - gap);
			$.loaded = parseInt(compute, 10) + $.fileIndex * $.eachSize;
			$.rate = Math.round(parseFloat($.loaded / $.size) * 100) / 100;
			//触发整体的更新
			$.uploadObj.emit('_progress');
			$.uploadObj.emit("oneProgress",$);
		},
		"load": function() {
			if($.xhr.status !== 200) {
				handle.error();
				return;
			}
			var result = JSON.parse($.xhr.responseText);
			$.uploadObj.emit('$$afterSendBlob', $, result);
			//根据$$afterSendBlob判断$.status是否为error，如果是则组织接下来的操作
			handleResult($,result);
			
			if($.status !== 'error') {
				$.fileIndex++;
				//重新计算上传文件的长度
				if($.fileIndex === $.fileCount) {
					$.status = 'complete';
					$.successVal = result.files[0];
					$.uploadObj.emit("oneFinish",$);
				} else {
					//继续上传
					$.send(true);
				}
			}else{
				$.uploadObj.emit("oneFinish",$);
			}
			$.uploadObj.emit('_progress');
			refreshCache($);
		},
		"error": function() {
			//上传失败
			$.status = 'error';
			$.message = 'serverError';
			$.uploadObj.emit('_progress');
			$.uploadObj.emit("oneFinish",$);
			refreshCache($);
		},
		"abort": function() {
			$.status = "pause";
			$.uploadObj.emit('_progress');
			refreshCache($);
		}
	};
	$.xhr.upload.addEventListener('progress', handle.progress, false);
	$.xhr.addEventListener('load', handle.load, false);
	$.xhr.addEventListener('abort', handle.abort, false);
	$.xhr.addEventListener('error', handle.error, false);
}
//判断缓存中是否已经包含当前值
function refreshCache($) {
	localFiles.setFile.call(localFiles, $.tagId, {
		fileIndex: $.fileIndex,
		timeOut: (new Date()).getTime() + $.setting.timeOut,
		status: $.status
	});
}

/**
 * 单文件启动上传
 * @param next    判断是否是直接启东，直接启东需要判断状态是否正确 默认false
 * @returns {boolean}
 */
function fileSend(next) {
	var $ = this;
	//判断文件能否继续删除
	if($.fileIndex >= $.fileCount || $.status === "error" || $.status === 'formatError' || $.status === 'largeError') {
		return false;
	}
	if(!next) {
		if($.status === "uploading" || $.status === "complete") {
			return false;
		}
	}
	$.status = "uploading";
	//--获取任务信息并且切片。
	//$.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	//--切片
	$.begin = $.eachSize * $.fileIndex;
	$.end = ($.fileIndex + 1) === $.fileCount ? $.size : $.eachSize * ($.fileIndex + 1);
	var fileBlob = $.file.slice($.begin, $.end);
	//var fd = $.formData;
	//fd.set($.setting.blobName,fileBlob);
	var fd = new FormData();
	for(var key in $.formData) {
		if($.formData.hasOwnProperty(key)) {
			fd.append(key, $.formData[key]);
		}
	}
	if(!$.setting.breakPoint) {
		fd.append($.setting.blobName, $.file);
		$.fileCount = 1;
	} else {
		fd.append($.setting.blobName, fileBlob);
	}
	$.uploadObj.emit("$$beforeSendBlob", $);
	$.xhr.open('post', $.url, true);
	$.uploadObj.emit("$$setHeader", $);
	$.xhr.send(fd);
}
//暂停文件上传
function fileAbort() {
	var $ = this;
	$.xhr.abort();
}
//暂停并取消上传
function fileCancel() {
	var $ = this;
	$.pause();
	$.dom && $.dom.remove();
	$.uploadObj.removeFile($.tagId);
	localFiles.removeFile($.tagId);
}

//重新上传
function fileRefresh() {
	var $ = this;
	//文件过大，或者格式不正确的情况下不能重新上传
	if($.status !== 'formatError' && $.status !== 'largeError') {
		$.message = '';
		$.rate = 0;
		$.loaded = 0;
		$.status = "loaded";
		$.fileIndex = 0;
		$.successVal = '';
		//判断缓存中是否已经包含当前值
		refreshCache($);
		$.send();
	}
}
/*--------------------------------------------------------------------------*/
/*------------------------------  file 方法end   -------------------------*/
/*--------------------------------------------------------------------------*/
/*------------------------------   设置常用的文件类型   ------------------------------*/
/**
 * 将tpl转换成 dom对象
 * @param str
 * @returns {*}
 */
function getElementObj(str) {
	var div = document.createElement("div");
	div.innerHTML = str;
	return div.children[0];
}
/**
 * 获取input的accept，
 * 不使用image/* ,浏览器响应速度太慢
 * @param accepts
 * @returns {string}
 */
function getMIME(accepts) {
	var str = "",
		mime = [],
		getMime = function(type) {
			switch(type) {
				case 'image':
					type = 'image/gif,image/jpeg,image/jpg,image/png,image/svg';
					break;
				case 'audio':
					type = "audio/mp3,audio/wav,audio/x-ms-wma,audio/midi";
					break;
				case 'video':
					type = "video/x-msvideo,video/ogg,video/ogg,video/mp4,video/3gpp,video/3gpp2,video/x-ms-wmv,.flv";
					break;
				case 'mp4':
					type = "video/mp4";
					break;
				case 'zip':
					type = "application/zip,application/octet-stream,application/x-zip-compressed";
					break;
				case 'rar':
					type = "application/x-rar-compressed";
					break;
				case 'text':
					type = "text/*";
					break;
				case 'word':
					type = "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					break;
				case 'ppt':
					type = "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
					break;
				case 'excel':
					type = "application/vnd.ms-excel,application/x-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					break;
				case 'pdf':
					type = "application/pdf";
					break;
				default:
					type = "*";
					break;
			}
			return type;
		};
	if( !accepts ){
		return "";
	}else if(typeof(accepts) === 'string') {
		str = getMime(accepts);
	} else {
		accepts.forEach(function(accept) {
			mime.push(getMime(accept));
		});
		str = mime.join(",");
	}
	return str;
}
/**
 * 将字符串转换成asscii码
 */
function getAsscii(str) {
	str = str.toString();
	var num = "asscii";
	for(var i = 0; i < str.length; i++) {
		num += str.charCodeAt(i);
	}
	return num;
}

function handleResult(obj,data){
	if( !data.result ){
		obj.status = 'error';
		var message = "";
		switch(data.code){
			case 10016 : message="formatError";break;
			case 10009 : message="largeError";break;
			default:break;
		}
		obj.message = message;
		return false;
	}else{
		return true;
	}
}


//获取后缀名
function getSuffix(fileName, tag) {
	var tagVal = tag || ".";
	var index1 = fileName.lastIndexOf(tagVal);
	var index2 = fileName.length;
	return fileName.substring(index1 + 1, index2);
}
window.UPLOADS = UPLOADS;
export default uploadFile;