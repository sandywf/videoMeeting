/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************************!*\
  !*** multi ./src/codyy/index.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\workspace\videoMeeting\src\codyy\index.js */1);


/***/ }),
/* 1 */
/*!****************************!*\
  !*** ./src/codyy/index.js ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./tool */ 2);

__webpack_require__(/*! ./coco3.0 */ 3);

__webpack_require__(/*! ./media_device */ 4);

__webpack_require__(/*! ./env_check_plugin */ 5);

__webpack_require__(/*! ./meeting_plugin */ 6);

__webpack_require__(/*! ./publish_plugin */ 7);

__webpack_require__(/*! ./receive_plugin */ 8);

__webpack_require__(/*! ./preview_plugin */ 9);

__webpack_require__(/*! ./wpad/index.min.js */ 10);

/***/ }),
/* 2 */
/*!***************************!*\
  !*** ./src/codyy/tool.js ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 *
 * 工具类
 * @Author Jason
 * @Date 2016-9-23
 *
 */
(function (global, fn) {
	var turnBox = null,
	    doc = document,
	    toString = Object.prototype.toString,
	    push = Array.prototype.push,
	    slice = Array.prototype.slice,
	    location = window.location,
	    duang = fn.call(Object.create(null)),
	    base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	    hash = {
		'colgroup': 'table',
		'col': 'colgroup',
		'thead': 'table',
		'tfoot': 'table',
		'tbody': 'table',
		'tr': 'tbody',
		'th': 'tr',
		'td': 'tr',
		'optgroup': 'select',
		'option': 'optgroup',
		'legend': 'fieldset'
	},
	    base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

	//用户自定义事件构造器
	var CustomerEvent = function CustomerEvent() {
		if (this instanceof CustomerEvent) {
			this.name = "CustomerEvent";
			this.handles = [];
		} else {
			return new CustomerEvent();
		}
	};

	CustomerEvent.prototype = {
		addCustEvent: function addCustEvent(type, fn) {
			//添加用户自定义事件，type：事件名称，fn：事件处理函数
			var self = this,
			    count = 0,
			    _handles = self.handles || [],
			    len = _handles.length;

			while (len--) {
				var _handle = _handles[len],
				    _target = _handle.target;

				if (_target && _target == self) {
					_handle.events = _handle.events || {};
					_handle.events[type] = _handle.events[type] || [];
					_handle.events[type].push(fn);
					count++;
				}
			}

			if (0 === count) {
				var _handle = {
					target: self,
					events: {}
				};
				_handle.events[type] = [];
				_handle.events[type].push(fn);
				_handles.push(_handle);
			}

			return _handles;
		},
		removeCustEvent: function removeCustEvent(type) {
			//删除自定义事件，type：事件名称
			var self = this,
			    _handles = self.handles || [],
			    len = _handles.length;

			while (len--) {
				var _handle = _handles[len],
				    _target = _handle.target;

				if (_target && _target == self) {
					var _evs = _handle.events;

					for (var key in _evs) {
						if (key === type) {
							delete _evs[key];
						}
					}
				}
			}
		},
		fire: function fire(obj, fn) {
			//触发自定义事件，obj是对象类型参数，obj.type：事件名称，obj.message：传给处理函数的参数，此参数可以是任何类型的
			var self = this,
			    _handles = self.handles || [],
			    len = _handles.length;

			while (len--) {
				var _handle = _handles[len],
				    _target = _handle.target;

				if (_target == self) {
					var _events = _handle.events,
					    _fns = _events[obj.type];
					if (!_fns) return;
					var _len = _fns.length,
					    i = 0;

					while (i < _len) {
						var _fn = _fns[i];

						if (fn) {
							if ("[object Array]" === toString.call(fn)) {
								if (-1 != fn.indexOf(_fn)) {
									"function" === typeof _fn && _fn.call(self, obj.message);
								}
							} else {
								if ("function" != typeof fn) break;
								fn === _fn && _fn.call(self, obj.message);
							}
						} else {
							"function" === typeof _fn && _fn.call(self, obj.message);
						}

						i++;
					}
				}
			}
		}
	};

	//工具类构造函数
	var Tool = function Tool() {
		this.name = "Tool";
		turnBox = document.createElement("DIV");
	};

	Tool.CustomerEvent = CustomerEvent;
	Tool.prototype = new CustomerEvent();
	Tool.prototype.constructor = Tool;

	/**
  * 深拷贝，建议使用overallCopy
  * newObj 需要被拷贝的对象
  * oldObj 接受被拷贝对象的对象
  * return oldObj
  */
	Tool.prototype.deepCopy = function (newObj, oldObj, notCover) {
		if (!newObj) return;
		var oldObj = oldObj || ("[object Object]" === toString.call(newObj) ? {} : []);

		if (toString.call(oldObj) !== toString.call(newObj)) {
			throw "类型不匹配！";
		}

		switch (toString.call(newObj)) {
			case "[object Object]":
				for (var key in newObj) {
					if (void 0 === oldObj[key] || !notCover) {
						var val = newObj[key],
						    type = toString.call(val);

						if ("[object Object]" === type || "[object Array]" === type) {
							var _target = "[object Object]" === type ? {} : [];

							if ("[object Array]" === toString.call(oldObj)) {
								oldObj.push(_target);
							} else {
								oldObj[key] = _target;
							}

							this.deepCopy(val, _target);
						} else {
							if ("[object Array]" === toString.call(oldObj)) {
								oldObj.push(val);
							} else {
								oldObj[key] = val;
							}
						}
					}
				}
				break;
			case "[object Array]":
				var i = 0,
				    len = newObj.length;

				if (len > i) {
					do {
						if (void 0 === oldObj[i] || !notCover) {
							var val = newObj[i],
							    type = toString.call(val);

							if ("[object Object]" === type || "[object Array]" === type) {
								var _target = "[object Object]" === type ? {} : [];

								if ("[object Array]" === toString.call(oldObj)) {
									oldObj.push(_target);
								} else {
									oldObj[key] = _target;
								}

								this.deepCopy(val, _target);
							} else {
								if ("[object Array]" === toString.call(oldObj)) {
									oldObj.push(val);
								} else {
									oldObj[key] = val;
								}
							}
						}
					} while (++i < len);
				} else {
					if (void 0 === oldObj[i] || !notCover) {
						if ("[object Array]" === toString.call(oldObj)) {
							oldObj.push([]);
						} else {
							oldObj[key] = [];
						}
					}
				}
				break;
			default:
				(void 0 === oldObj[i] || !notCover) && (oldObj = newObj.valueOf());
		}

		return oldObj;
	};

	/**
  * 深拷贝，当只有一个参数时，会返回这个对象的复本
  * 参数1 容器，后面所有对象都会拷入这个对象
  * 参数1-n 拷入第1个对象
  * return
  */
	Tool.prototype.overallCopy = function () {
		var args = [].slice.call(arguments, 0),
		    firstArg = args.shift(),
		    len = args.length,
		    self = this;

		if (len) {
			var type = toString.call(firstArg);
			if ("[object Object]" != type && "[object Array]" != type) return firstArg;

			args.forEach(function (arg) {
				var _type = toString.call(arg);
				if ("[object Object]" != _type && "[object Array]" != _type) return;

				if ("[object Object]" === _type) {

					if ("[object Array]" === type) {
						var container = {};
					}

					for (var key in arg) {
						var val = arg[key],
						    type = toString.call(val);

						if (container) {
							if ("[object Object]" === type || "[object Array]" === type) {
								container[key] = self.overallCopy(val);
							} else {
								container[key] = val;
							}
						} else {
							if ("[object Object]" === type || "[object Array]" === type) {
								firstArg[key] = self.overallCopy(val);
							} else {
								firstArg[key] = val;
							}
						}
					}

					if (container) {
						firstArg.push(container);
					}
				} else {
					arg.forEach(function (item, index) {
						var _type = toString.call(item);

						if ("[object Object]" === type) {
							if ("[object Object]" === _type || "[object Array]" === _type) {
								firstArg[index] = self.overallCopy(val);
							} else {
								firstArg[index] = val;
							}
						} else {
							if ("[object Object]" === _type || "[object Array]" === _type) {
								firstArg.push(self.overallCopy(val));
							} else {
								firstArg.push(val);
							}
						}
					});
				}
			});

			return firstArg;
		} else {
			var type = toString.call(firstArg);

			if ("[object Object]" != type && "[object Array]" != type) {
				return firstArg;
			} else {
				if ("[object Object]" === type) {
					var container = {};

					for (var key in firstArg) {
						var val = firstArg[key],
						    type = toString.call(val);

						if ("[object Object]" === type || "[object Array]" === type) {
							container[key] = self.overallCopy(val);
						} else {
							container[key] = val;
						}
					}
				} else {
					var container = [];

					firstArg.forEach(function (item) {
						var type = toString.call(item);

						if ("[object Object]" === type || "[object Array]" === type) {
							container.push(self.overallCopy(item));
						} else {
							container.push(item);
						}
					});
				}
			}

			return container;
		}
	};

	/**
  * 生成任意长度的随机数
  * num 随机数长度
  * return 一个指定长度的随机数，如果没有指定长度，默认生成一个8位的随机数
  */
	Tool.prototype.random = function (num) {
		var str = "",
		    num = num || 8;
		for (; str.length < num; str += (Math.random() + "").substr(2)) {}
		return str.substr(0, num);
	};

	var addEvent = window.addEventListener ? function (item, type, fn, use) {
		if (!item) return;
		item.addEventListener(type, fn, use || false);
	} : function (item, type, fn) {
		if (!item) return;
		item.attachEvent(type, fn);
	};

	/**
  * 为元素添加事件
  * target 需要添加事件的元素标识，可包含的类型（元素对象，id id要以#打头，class class要以.打头， 数组 数组中可包含元素对象 id class）
  * type 事件名称
  * fn 事件处理函数
  * use 是否在扑捉时触发处理函数
  */
	Tool.prototype.addEvent = function (target, type, fn, use, isDom) {
		var self = this;

		var getElement = function getElement(selector) {
			if ("string" !== typeof selector) return;

			var _selector = selector.trim();

			if (_selector.startsWith("#")) {
				addEvent(doc.getElementById(_selector.substring(1, _selector.length)), type, fn, use);
			} else if (_selector.startsWith(".")) {
				var eles = doc.getElementsByClassName(_selector.substring(1, _selector.length));
				var l = eles.length;

				while (l--) {
					addEvent(eles[l], type, fn, use);
				}
			} else {
				var eles = doc.getElementsByTagName(_selector);
				var l = eles.length;

				while (l--) {
					addEvent(eles[l], type, fn, use);
				}
			}
		};

		if ("[object Array]" === toString.call(target) || "[object HTMLCollection]" === toString.call(target)) {
			var len = target.length;

			while (len--) {
				var _target = target[len];

				if (self.isDom(_target)) {
					addEvent(_target, type, fn, use);
				} else {
					getElement(_target);
				}
			}
		} else {
			if (self.isDom(target)) {
				addEvent(target, type, fn, use);
			} else {
				getElement(target);
			}
		}
	};

	/**
  * 删除元素事件
  * 参数含义参考为元素添加事件
  * 注意删除元素事件传入的参数要和为该元素添加事件传入的参数一至
  */
	Tool.prototype.delEvent = function (target, type, fn, use) {
		var self = this;
		var toString = Object.prototype.toString;

		var delEvent = function delEvent(item) {
			if (!item) return;

			if (window.removeEventListener) {
				item.removeEventListener(type, fn, use || false);
			} else {
				item.detachEvent(type, fn);
			}
		};

		var getElement = function getElement(selector) {
			if ("string" !== typeof selector) return;

			var _selector = selector.trim();

			if (_selector.startsWith("#")) {
				delEvent(global.document.getElementById(_selector.substring(1, _selector.length)));
			} else if (_selector.startsWith(".")) {
				var eles = global.document.getElementsByClassName(_selector.substring(1, _selector.length));
				var l = eles.length;

				while (l--) {
					delEvent(eles[l]);
				}
			} else {
				var eles = global.document.getElementsByTagName(_selector);
				var l = eles.length;

				while (l--) {
					delEvent(eles[l]);
				}
			}
		};

		if ("[object Array]" === toString.call(target)) {
			var len = target.length;

			while (len--) {
				var _target = target[len];

				if (self.isDom(_target)) {
					delEvent(_target);
				} else {
					getElement(_target);
				}
			}
		} else {
			if (self.isDom(target)) {
				delEvent(target);
			} else {
				getElement(target);
			}
		}
	};

	/**
  * 向cookie里存储数据
  * name cookie的名称
  * val 存储的数据
  * time 数据过期时间，单位：毫秒
  */
	Tool.prototype.setCookie = function (name, val, config) {
		if (!name || !val) return;
		if (isNaN(config) && config.time && isNaN(config.time)) return;

		var str = "",
		    time = (!isNaN(config) ? config : config.time) || 1,
		    exp = new Date();

		exp.setTime(exp.getTime() + time);
		str = name + "=" + escape(val) + ";expires=" + exp.toGMTString();

		if ("[object Object]" === toString.call(config)) {
			for (var key in config) {
				if ("time" !== key) {
					str += ";" + key + "=" + config[key];
				}
			}
		}

		doc.cookie = str;
	};

	/**
  * 从cookie中获取数据
  * name cookie的名称
  */
	Tool.prototype.getCookie = function (name) {
		if (!name) return;
		var arr = "",
		    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = doc.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return "";
		}
	};

	/**
  * 删除cookie
  * name cookie的名称
  */
	Tool.prototype.delCookie = function (name) {
		if (!name) return;
		var val = this.getCookie(name);
		if (!val) return;
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		doc.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
	};

	/**
  * 判断对象是否是dom元素
  * obj 需要进行判断的对象
  */
	Tool.prototype.isDom = "object" === (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) ? function (obj) {
		return obj instanceof HTMLElement;
	} : function (obj) {
		return obj && "object" === (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) && (1 === obj.nodeType && "string" === typeof obj.nodeName || 9 === obj.nodeType && "#document" === obj.nodeName || "Window" === obj.constructor.name);
	};

	/**
  * 给元素添加class
  * ele 元素，可以是一个元素也可以是一个元素数组
  * classname 要添加的class名称
  */
	Tool.prototype.addClass = function (ele, classname) {
		if (!ele) return;

		if ("[object Array]" === toString.call(ele) || "[object HTMLCollection]" === toString.call(ele)) {
			var i = 0,
			    len = ele.length;

			if (i >= len) return;

			do {
				var el = ele[i];
				if (1 === el.nodeType) {
					var classes = slice.call(el.classList, 0) || el.className.split(/\s+/);
					if (-1 === classes.indexOf(classname)) {
						el.className = el.className.trim() + " " + classname;
					}
				}
			} while (++i < len);
		} else {
			if (1 !== ele.nodeType) return;
			var classes = slice.call(ele.classList, 0) || ele.className.split(/\s+/);
			if (-1 !== classes.indexOf(classname)) return;
			ele.className = ele.className.trim() + " " + classname;
		}

		return ele;
	};

	/**
  * 删除元素上的class
  * 参数含义参考给元素添加class接口
  */
	Tool.prototype.removeClass = function (ele, classname) {
		if (!ele) return;

		if ("[object Array]" === toString.call(ele) || "[object HTMLCollection]" === toString.call(ele)) {
			var i = 0,
			    len = ele.length;

			if (i >= len) return;

			do {
				var el = ele[i];

				if (1 === el.nodeType) {
					el.className = el.className.replace(classname, "").trim();
				}
			} while (++i < len);
		} else {
			if (1 !== ele.nodeType) return;
			ele.className = ele.className.replace(classname, "").trim();
		}
		return ele;
	};

	/**
  * 替换元素上的class
  * oldClass 需要被替换的class
  * newClass 新的class
  */
	Tool.prototype.replaceClass = function (ele, oldClass, newClass) {
		this.removeClass(ele, oldClass);
		this.addClass(ele, newClass);
		return ele;
	};

	/**
  * 在某元素的相对位位置插入新元素字符串
  * el 新插入的元素相对的元素
  * where (beforebegin, afterbegin, beforeend, afterend)
  * html 新插入的元素字符串
  */
	Tool.prototype.insertHTML = function (el, where, html) {
		if (!el) return false;
		where = where.toLowerCase();

		if (el.insertAdjacentHTML) {
			//IE
			el.insertAdjacentHTML(where, html);
		} else {
			var range = el.ownerDocument.createRange(),
			    frag = null;

			switch (where) {
				case "beforebegin":
					range.setStartBefore(el);
					frag = range.createContextualFragment(html);
					el.parentNode.insertBefore(frag, el);
					return el.previousSibling;
				case "afterbegin":
					if (el.firstChild) {
						range.setStartBefore(el.firstChild);
						frag = range.createContextualFragment(html);
						el.insertBefore(frag, el.firstChild);
					} else {
						el.innerHTML = html;
					}
					return el.firstChild;
				case "beforeend":
					if (el.lastChild) {
						range.setStartAfter(el.lastChild);
						frag = range.createContextualFragment(html);
						el.appendChild(frag);
					} else {
						el.innerHTML = html;
					}
					return el.lastChild;
				case "afterend":
					range.setStartAfter(el);
					frag = range.createContextualFragment(html);
					el.parentNode.insertBefore(frag, el.nextSibling);
					return el.nextSibling;
			}
		}
	};

	//弃用，用createElement代替
	/*Tool.prototype.turnStringToDom = function(str) {
  turnBox.innerHTML = str;
  var child = turnBox.children[0].cloneNode(true);
  turnBox.innerHTML = "";
  return child;
  };*/

	/**
  * 创建flash对象
  * wrap 页面中的装载flash的容器对象
  * url swf文件路径
  * config 参数对象
  * return flash对象
  */
	Tool.prototype.buildFlash = function (wrap, url, config) {
		var config = config || {},
		    id = config.id ? config.id : "swf" + this.random(),
		    wrapBox = wrap || document.body,
		    f = (url.indexOf("?") > 0 ? url : url + "?").split("?"),
		    u = [f.shift(), f.join("?")],
		    wh = config.wh ? [config.wh[0] + "px", config.wh[1] + "px"] : ["100%", "100%"],
		    wmode = config.wmode || "transparent";

		var e = '<embed \
				src="' + u[0] + '" \
				name="' + id + '" \
				pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" \
				type="application/x-shockwave-flash" \
				allownetworking="all" \
				allowfullscreen="true" \
				allowFullscreenInteractive="true" \
				allowscriptaccess="always" \
				FlashVars="' + u[1] + '" \
				wmode="' + wmode + '" \
				width="' + wh[0] + '" \
				height="' + wh[1] + '">\
				</embed>';

		e = '<object class="FlashPlayer" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="' + wh[0] + '" height="' + wh[1] + '" id="' + id + '">\
				<param name="wmode" value="' + wmode + '">\
				<param name="allowFullScreen" value="true">\
				<param name="AllowNetworking" value="all">\
				<param name="allowScriptAccess" value="always">\
				<param name="allowFullscreenInteractive" value="true">\
				<param name="movie" value="' + u[0] + '">\
				<param name="FlashVars" value="' + u[1] + '">' + e + '\
			</object>';

		if (config.returnType == "string") {
			return e;
		}

		wrapBox.insertAdjacentHTML('afterBegin', e);
		return document[id];
	};

	/**
  * 将数字转换成时间字符串
  * num 数字
  */
	Tool.prototype.numberToTime = function (num) {
		var format = "HH:mm:ss",
		    num = num / 1000;
		var hour = Math.floor(num / 3600);
		var minute = Math.floor(num % 3600 / 60);
		var second = Math.floor(num % 3600 % 60);
		return format.replace("HH", hour >= 10 ? hour : "0" + hour).replace("mm", minute >= 10 ? minute : "0" + minute).replace("ss", second >= 10 ? second : "0" + second);
	};

	/**
  * 将xml字符串转换成对象
  * xml 需要转换的xml字符串
  * root xml字符串的根元素名称
  */
	Tool.prototype.xml2obj = function (xml, root) {
		var xml = xml.replace(/[<>/']/g, ""),
		    keyValueStrs = xml.split(/\s+/),
		    json = {},
		    len = keyValueStrs.length,
		    i = 0;

		json[root] = {};

		do {
			var keyValueStr = keyValueStrs[i];
			if (keyValueStr && root !== keyValueStr) {
				var _json = keyValueStr.split("=");
				json[root][_json[0]] = _json[1];
			}
		} while (++i < len);

		return json;
	};

	/**
  * 序列化form表单中的数据
  * formName form表单名称
  */
	Tool.prototype.serialize = function (formName) {
		var form = document.forms[formName] || document.getElementsByName(formName)[0],
		    elements = form.elements,
		    len = elements.length,
		    names = [],
		    obj = {},
		    i = 0;

		if (0 >= len) return obj;

		do {
			var ele = elements[i],
			    name = ele.name;

			if (-1 === names.indexOf(name)) {
				names.push(name);
			}
		} while (++i < len);

		len = names.length;

		if (0 >= len) return obj;

		i = 0;
		do {
			var node = form[names[i]];

			if (!node.nodeType && node.length && 0 < node.length && "checkbox" === node[0].type) {
				obj[names[i]] = "";

				for (var key in node) {
					if (node[key].checked) {
						if (obj[names[i]]) obj[names[i]] += ",";
						obj[names[i]] += node[key].value;
					}
				}
			} else {
				obj[names[i]] = node.value;
			}
		} while (++i < len);

		return obj;
	};

	/**
  * 复制input元素中的数据
  * boxId input元素的id
  * btnId 复制按钮id
  * 复制成功后的回调函数，会将复制的数据传入回调函数中
  */
	Tool.prototype.copy = function (boxId, btnId, fn) {
		var self = this;

		this.addEvent("#" + btnId, "click", function () {
			var box = document.getElementById(boxId);
			box.select();
			var text = document.execCommand("Copy");
			box.selectionEnd = 0;
			fn && fn.call(self, text);
		});
	};

	/**
  * 判断元素上是否有某个class
  * ele 需要被判断的元素
  * cls class名称
  * return boolean值，如果有则为true，如果没有则为false
  */
	Tool.prototype.hasClass = function (ele, cls) {
		var className = ele.className,
		    flag = false;

		if (-1 !== className.indexOf(cls)) {
			flag = true;
		}

		return flag;
	};

	/**
  * 获取某个元素的前一个元素
  * node 当前元素
  * return 当前元素的前一个元素
  */
	Tool.prototype.pre = function (node) {
		return node.previousElementSibling || node.previousSibling;
	};

	/**
  * 获取某个元素的下一个元素
  * node 当前元素
  * return 当前元素的下一个元素
  */
	Tool.prototype.next = function (node) {
		return node.nextElementSibling || node.nextSibling;
	};

	/**
  * 获取某个元素前面的所有同级元素
  * node 当前元素
  * return 当前元素前面的所有同级元素集合
  */
	Tool.prototype.preAll = function (node) {
		var list = [],
		    pre = node;

		do {
			pre = this.pre(pre);

			if (pre) {
				list.push(pre);
			}
		} while (pre);

		return list;
	};

	/**
  * 获取某个元素后面的所有同级元素
  * node 当前元素
  * return 当前元素后面的所有同级元素集合
  */
	Tool.prototype.nextAll = function (node) {
		var list = [],
		    next = node;

		do {
			next = this.next(next);

			if (next) {
				list.push(next);
			}
		} while (next);

		return list;
	};

	/**
  * 获取某个元素的所有同级元素
  * node 当前元素
  * return 当前元素的所有同级元素集合
  */
	Tool.prototype.siblings = function (node) {
		var preList = this.preAll(node),
		    nextList = this.nextAll(node),
		    push = Array.prototype.push;

		push.apply(preList, nextList);
		return preList;
	};

	Tool.prototype.encodeHTML = function (html) {
		var reg = /<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>/;

		if (reg.test(html)) {
			html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}

		return html;
	};

	Tool.prototype.decodeHTML = function (html) {
		return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	};

	Tool.prototype.createElement = function (html) {
		var recycled = document.createElement("DIV"),
		    reg = /^<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>$/,
		    html = html.trim();

		var _createElement = function _createElement(html) {
			if (!reg.test(html)) {
				try {
					return doc.createElement(html);
				} catch (e) {
					console.log(e);
				}
			}

			var tagName = hash[RegExp.$1.toLowerCase()];

			if (!tagName) {
				recycled.innerHTML = html;
				return recycled.removeChild(recycled.firstChild);
			}

			var deep = 0,
			    ele = recycled;

			do {
				html = "<" + tagName + ">" + html + "</" + tagName + ">";
				deep++;
			} while (tagName = hash[tagName]);

			ele.innerHTML = html;

			do {
				ele = ele.removeChild(ele.firstChild);
			} while (--deep > -1);

			return ele;
		};

		return _createElement(html);
	};

	Tool.prototype.encodeBase64 = function (str) {
		return utf16to8(str, function (str) {
			var out, i, len;
			var c1, c2, c3;

			len = str.length;
			i = 0;
			out = "";
			while (i < len) {
				c1 = str.charCodeAt(i++) & 0xff;
				if (i == len) {
					out += base64EncodeChars.charAt(c1 >> 2);
					out += base64EncodeChars.charAt((c1 & 0x3) << 4);
					out += "==";
					break;
				}
				c2 = str.charCodeAt(i++);
				if (i == len) {
					out += base64EncodeChars.charAt(c1 >> 2);
					out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
					out += base64EncodeChars.charAt((c2 & 0xF) << 2);
					out += "=";
					break;
				}
				c3 = str.charCodeAt(i++);
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
				out += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
				out += base64EncodeChars.charAt(c3 & 0x3F);
			}

			return out;
		});
	};

	function utf16to8(str, fn) {
		var out, i, len, c;

		out = "";
		len = str.length;

		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if (c >= 0x0001 && c <= 0x007F) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
				out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
				out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
			} else {
				out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
				out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
			}
		}

		return fn.call(null, out);
	}

	Tool.prototype.decodeBase64 = function (str) {
		var c1, c2, c3, c4;
		var i, len, out;

		len = str.length;
		i = 0;
		out = "";

		while (i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c1 == -1);

			if (c1 == -1) break;

			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c2 == -1);

			if (c2 == -1) break;

			out += String.fromCharCode(c1 << 2 | (c2 & 0x30) >> 4);

			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61) return utf8to16(out);
				c3 = base64DecodeChars[c3];
			} while (i < len && c3 == -1);

			if (c3 == -1) break;

			out += String.fromCharCode((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);

			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61) return utf8to16(out);
				c4 = base64DecodeChars[c4];
			} while (i < len && c4 == -1);

			if (c4 == -1) break;

			out += String.fromCharCode((c3 & 0x03) << 6 | c4);
		}

		return utf8to16(out);
	};

	function utf8to16(str) {
		var out, i, len, c;
		var char2, char3;

		out = "";
		len = str.length;
		i = 0;

		while (i < len) {
			c = str.charCodeAt(i++);

			switch (c >> 4) {
				case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
					// 0xxxxxxx
					out += str.charAt(i - 1);
					break;
				case 12:case 13:
					// 110x xxxx   10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
					break;
			}
		}

		return out;
	}

	/**
  * 获取最快的dms端口(不发送任何消息)
  * @params arguments.data dms对象；
  * 		   arguments.time socket连接超时时长；
  * 		   callback 回调函数；
  */
	Tool.prototype.getBestDmsWithoutMessage = function () {
		var args = [].slice.call(arguments, 0),
		    params = args.shift();

		if ("[object Object]" !== toString.call(params)) return;
		if (!params) return;

		var data = params.data,
		    inList = data.internal,
		    exList = data.external,
		    ini = 0,
		    exi = 0,
		    count = 0,
		    inLen = inList.length,
		    exLen = exList.length,
		    inTimeMap = {},
		    exTimeMap = {},
		    inTimeList = [],
		    exTimeList = [],
		    wsList = [],
		    itList = [],

		//timeMap = {},
		//timeList = [],
		outTime = params.time || 30,
		    outIt = null,
		    protocol = "https:" === location.protocol ? "wss://" : "ws://",
		    callback = args.shift(),
		    reg = new RegExp("^(0\.)+");

		outIt && clearTimeout(outIt);

		var closeAllWs = function closeAllWs() {
			while (wsList.length) {
				wsList.shift().close();
			}
		};

		var stopAllIt = function stopAllIt() {
			while (itList.length) {
				clearTimeout(itList.shift());
			}
		};

		var testPort = function testPort(port, type) {
			var start = Date.now(),
			    it = null,
			    ws = null,
			    isTimeout = false;

			var cancelLink = function cancelLink() {
				var end = Date.now(),
				    during = end - start;
				ws && ws.close();
				it && clearTimeout(it);

				if (!isTimeout) {
					if ("in" === type) {
						inTimeList.push(during);
						inTimeMap[during] = port.rtmpUrl;
					} else {
						exTimeList.push(during);
						exTimeMap[during] = port.rtmpUrl;
					}
				}

				count++;

				if (inLen + exLen <= count) {
					var ip = inTimeMap[Math.min.apply(Math, inTimeList)] || exTimeMap[Math.min.apply(Math, exTimeList)];
					callback && callback.call(Object.create(null), !ip ? void 0 : "rtmp://" + ip + "/dms");
					outIt && clearTimeout(outIt);
					closeAllWs();
					stopAllIt();
				}
			};

			ws = new WebSocket(protocol + port.socketUrl);
			wsList.push(ws);

			it = setTimeout(function () {
				isTimeout = true;
				cancelLink();
			}, outTime);

			itList.push(it);

			ws.onopen = function () {
				outIt && cancelLink();
			};
		};

		if (inLen > ini) {
			do {
				(function (port) {
					if (!reg.test(port.socketUrl)) {
						testPort(port, "in");
					} else {
						count++;
					}
				})(inList[ini]);
			} while (++ini < inLen);
		}

		if (exLen > exi) {
			do {
				(function (port) {
					testPort(port, "ex");
				})(exList[exi]);
			} while (++exi < exLen);
		}

		outIt = setTimeout(function () {
			var ip = inTimeMap[Math.min.apply(Math, inTimeList)] || exTimeMap[Math.min.apply(Math, exTimeList)];
			callback && callback.call(Object.create(null), !ip ? void 0 : "rtmp://" + ip + "/dms");
			outIt && clearTimeout(outIt);
			closeAllWs();
			stopAllIt();
		}, outTime);
	};

	/**
  * 获取最快的dms端口(发送消息)
  * @params arguments.obj dms数据,
  *         arguments.time 超时时长
  *         arguments.msgLen 发送的消息长度
  *         arguments.times	发送消息的次数
  *         callback 回调函数
  */
	Tool.prototype.getBestDmsWithMessage = function () {
		var args = [].slice.call(arguments, 0),
		    params = args.shift();

		if ("[object Object]" !== toString.call(params)) return;
		if (!params) return;

		var data = params.data,
		    inList = data.internal,
		    exList = data.external,
		    ini = 0,
		    exi = 0,
		    count = 0,
		    inLen = inList.length,
		    exLen = exList.length,
		    inTimeMap = {},
		    exTimeMap = {},
		    inTimeList = [],
		    exTimeList = [],

		//timeMap = {},
		//timeList = [],
		outTime = params.time || 3000,
		    outIt = null,
		    msg = JSON.stringify({ method: "ping", data: this.random(params.msgLen || 100) }),
		    times = params.times || 1,
		    protocol = "https:" === location.protocol ? "wss://" : "ws://",
		    reg = new RegExp("^(0\.)+"),
		    wsList = [],
		    itList = [],
		    callback = args.shift();

		outIt && clearTimeout(outIt);

		var closeAllWs = function closeAllWs() {
			while (wsList.length) {
				wsList.shift().close();
			}
		};

		var stopAllIt = function stopAllIt() {
			while (itList.length) {
				clearTimeout(itList.shift());
			}
		};

		var testPort = function testPort(port, type) {
			var start = Date.now(),
			    it = null,
			    ws = null,
			    msgCount = 0,
			    isTimeout = false;

			var cancelLink = function cancelLink() {
				var end = Date.now(),
				    during = end - start;
				ws && ws.close();
				it && clearTimeout(it);
				console.info("关闭连接：" + port.socketUrl + "，时长:" + during);

				if (!isTimeout) {
					if ("in" === type) {
						inTimeList.push(during);
						inTimeMap[during] = port.rtmpUrl;
					} else {
						exTimeList.push(during);
						exTimeMap[during] = port.rtmpUrl;
					}
				}

				count++;

				if (inLen + exLen <= count) {
					var ip = inTimeMap[Math.min.apply(Math, inTimeList)] || exTimeMap[Math.min.apply(Math, exTimeList)];
					callback && callback.call(Object.create(null), !ip ? void 0 : "rtmp://" + ip + "/dms");
					outIt && clearTimeout(outIt);
					closeAllWs();
					stopAllIt();
				}
			};

			ws = new WebSocket(protocol + port.socketUrl);
			console.info("连接服务：" + port.socketUrl);
			wsList.push(ws);

			it = setTimeout(function () {
				console.info(port.socketUrl + "测速时间超长！");
				isTimeout = true;
				cancelLink();
			}, outTime);

			itList.push(it);

			ws.onopen = function () {
				console.info("服务器连接成功：" + port.socketUrl);
				console.info("第" + (msgCount + 1) + "次ping服务器：" + port.socketUrl);
				ws.send(msg);
			};

			ws.onmessage = function (res) {
				var res = JSON.parse(res.data);

				if ("pingResponse" === res.method) {
					msgCount++;
					console.info("第" + msgCount + "次收到服务器pingResponse：" + port.socketUrl);

					if (times > msgCount) {
						ws.send(msg);
					} else {
						outIt && cancelLink();
					}
				}
			};
		};

		if (inLen > ini) {
			do {
				(function (port) {
					if (!reg.test(port.socketUrl)) {
						testPort(port, "in");
					} else {
						count++;
					}
				})(inList[ini]);
			} while (++ini < inLen);
		}

		if (exLen > exi) {
			do {
				(function (port) {
					testPort(port, "ex");
				})(exList[exi]);
			} while (++exi < exLen);
		}

		outIt = setTimeout(function () {
			console.info("测速时间超长！");
			var ip = inTimeMap[Math.min.apply(Math, inTimeList)] || exTimeMap[Math.min.apply(Math, exTimeList)];
			callback && callback.call(Object.create(null), !ip ? void 0 : "rtmp://" + ip + "/dms");
			outIt && clearTimeout(outIt);
			closeAllWs();
			stopAllIt();
		}, outTime);
	};

	/**
  * 获取最快的ams端口(发送消息)
  * @params arguments.obj dms数据,
  *         arguments.time 超时时长
  *         arguments.msgLen 发送的消息长度
  *         arguments.times	发送消息的次数
  *         callback 回调函数
  */
	Tool.prototype.getBestAmsWithMessage = function () {
		var args = [].slice.call(arguments, 0),
		    params = args.shift();

		if ("[object Object]" !== toString.call(params)) return;
		if (!params) return;

		var data = params.data,
		    inList = data.internal,
		    exList = data.external,
		    ini = 0,
		    exi = 0,
		    count = 0,
		    inLen = inList.length,
		    exLen = exList.length,
		    inTimeMap = {},
		    exTimeMap = {},
		    inTimeList = [],
		    exTimeList = [],

		//timeMap = {},
		//timeList = [],
		outTime = params.time || 3000,
		    outIt = null,
		    msg = JSON.stringify({ method: "ping", data: this.random(params.msgLen || 100) }),
		    times = params.times || 1,
		    protocol = "https:" === location.protocol ? "wss://" : "ws://",
		    reg = new RegExp("^(0\.)+"),
		    wsList = [],
		    itList = [],
		    callback = args.shift();

		outIt && clearTimeout(outIt);

		var closeAllWs = function closeAllWs() {
			while (wsList.length) {
				wsList.shift().close();
			}
		};

		var stopAllIt = function stopAllIt() {
			while (itList.length) {
				clearTimeout(itList.shift());
			}
		};

		var testPort = function testPort(port, type) {
			var start = Date.now(),
			    it = null,
			    ws = null,
			    msgCount = 0,
			    isTimeout = false;

			var cancelLink = function cancelLink() {
				var end = Date.now(),
				    during = end - start;
				ws && ws.close();
				it && clearTimeout(it);
				console.info("关闭连接：" + port.socketUrl + "，时长:" + during);

				if (!isTimeout) {
					if ("in" === type) {
						inTimeList.push(during);
						inTimeMap[during] = port.rtmpUrl;
					} else {
						exTimeList.push(during);
						exTimeMap[during] = port.rtmpUrl;
					}
				}

				count++;

				if (inLen + exLen <= count) {
					var ip = inTimeMap[Math.min.apply(Math, inTimeList)] || exTimeMap[Math.min.apply(Math, exTimeList)];
					callback && callback.call(Object.create(null), !ip ? void 0 : "http://" + ip + "/dms");
					outIt && clearTimeout(outIt);
					closeAllWs();
					stopAllIt();
				}
			};

			ws = new WebSocket(protocol + port.socketUrl);
			console.info("连接服务：" + port.socketUrl);
			wsList.push(ws);

			it = setTimeout(function () {
				console.info(port.socketUrl + "测速时间超长！");
				isTimeout = true;
				cancelLink();
			}, outTime);

			itList.push(it);

			ws.onopen = function () {
				console.info("服务器连接成功：" + port.socketUrl);
				console.info("第" + (msgCount + 1) + "次ping服务器：" + port.socketUrl);
				ws.send(msg);
			};

			ws.onmessage = function (res) {
				var res = JSON.parse(res.data);

				if ("pingResponse" === res.method) {
					msgCount++;
					console.info("第" + msgCount + "次收到服务器pingResponse：" + port.socketUrl);

					if (times > msgCount) {
						ws.send(msg);
					} else {
						outIt && cancelLink();
					}
				}
			};
		};

		if (inLen > ini) {
			do {
				(function (port) {
					if (!reg.test(port.socketUrl)) {
						testPort(port, "in");
					} else {
						count++;
					}
				})(inList[ini]);
			} while (++ini < inLen);
		}

		if (exLen > exi) {
			do {
				(function (port) {
					testPort(port, "ex");
				})(exList[exi]);
			} while (++exi < exLen);
		}

		outIt = setTimeout(function () {
			console.info("测速时间超长！");
			var ip = inTimeMap[Math.min.apply(Math, inTimeList)] || exTimeMap[Math.min.apply(Math, exTimeList)];
			callback && callback.call(Object.create(null), !ip ? void 0 : "http://" + ip + "/dms");
			outIt && clearTimeout(outIt);
			closeAllWs();
			stopAllIt();
		}, outTime);
	};

	Tool.prototype.attr = function (ele, attrName, attrVal) {
		if (!ele || !attrName || !this.isDom(ele)) return;
		if (void 0 === attrVal) {
			return ele.getAttribute(attrName);
		}
		ele.setAttribute(attrName, attrVal);
	};

	Tool.prototype.removeAttr = function (ele, attrName) {
		if (!ele || !attrName) return;
		if (!this.isDom(ele)) return;
		ele.removeAttribute(attrName);
	};

	//	void 0!==duang?(function() {
	//		duang.module("Tool", []).controller("tool", function() {return new Tool});
	//	}()):(function() {
	//      global.vm = global.vm || {};
	//      global.vm.module = global.vm.module || {};
	//      global.vm.module["tool"] = new Tool();
	//      global["tool"] = global.vm.module["tool"];
	//	}());

	global.tool = new Tool();

	String.prototype.trim = String.prototype.trim || function () {
		this.replace(/(^\s*)|(\s*$)/g, "");
	};

	Array.prototype.unique = Array.prototype.unique || function (param) {
		var arr = this,
		    len = arr.length;
		if (0 === len) return;

		if (void 0 === param) {
			var _arr = new Set(arr);
			arr = Array.from(_arr);
		} else {
			var temp = {},
			    i = 0;

			do {
				var data = arr[i];

				if (!temp[data[param]]) {
					temp[data[param]] = 1;
					i++;
				} else {
					arr.splice(i, 1);
					len = arr.length;
				}
			} while (i < len);
		}

		return arr;
	};

	Array.prototype.removeEmpty = function () {
		var that = this,
		    arr = [];
		that.map(function (item) {
			if (void 0 !== item && null !== item && "" !== item) {
				arr.push(item);
			}
		});
		return arr;
	};

	Date.prototype.format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}return fmt;
	};

	if (!global.$jsonp) {
		var sendScriptRequest = function sendScriptRequest(url, id) {
			//将请求地址以script标签形式插入到页面。（注定是GET请求）
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.id = id;
			script.src = url;
			script.charset = 'utf-8';
			head.appendChild(script);
		},
		    buildTempFunction = function buildTempFunction(callback) {
			//创建一个全局方法，并将方法名当做请求地址的一个参数
			var callName = "jsonp" + Math.floor(Math.random() * 100000000);

			window[callName] = function (data) {
				callback.call(this, data);
				window[callName] = undefined;
				try {
					delete window[callName];
					var jsNode = document.getElementById(callName);
					jsNode.parentNode.removeChild(jsNode);
				} catch (e) {}
			};

			return callName;
		};
		global.$jsonp = function (url, data, callback) {
			//生成GET请求地址
			if (!url) return false;
			callback = buildTempFunction(callback);
			url += url.indexOf("?") > 0 ? "" : "?";

			for (var i in data) {
				url += (!url.endsWith("?") ? "&" : "") + i + "=" + data[i];
			}

			url += "&callback=" + callback;
			sendScriptRequest(url, callback);
		};
	}
})(window, function () {
	return window.duang || void 0;
});

/***/ }),
/* 3 */
/*!******************************!*\
  !*** ./src/codyy/coco3.0.js ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * COCO3.0
 * @Author Jason
 * @Date 2017-4-19
 */
;(function (fn, undefined) {
    var duang = fn.call(null),
        reLoad = false,
        cocoMap = {},
        cocoTab = [],
        protocol = location.protocol,
        tool = duang ? duang.getModule("Tool").getController("tool") : window.vm && window.vm.module ? window.vm.module.tool : window.tool,
        eventObj = new tool.constructor.CustomerEvent();
    var ctrlEventMap = {
        whitePadAddTab: "onPadTabAdd",
        whitePadRemoveTab: "onPadTabRemove",
        whitePadChangeTab: "onPadTabFocus"
    };
    var defaultConfig = {
        clientType: "client",
        deviceName: "PC",
        userType: "all",
        tabName: "白板",
        beatInterval: 5 * 1000, //发送心跳的时间间隔
        beatWaitTime: 5 * 1000, //发送心跳消息后的等待时长
        linkTimes: 100, //自动重连的次数
        linkInterval: 5 * 1000 //自动重连的时间间隔
    };
    tool.addEvent(window, "beforeunload", function () {
        reLoad = true;
    });
    //心跳
    function KeepAlive(params) {
        if (!(this instanceof KeepAlive)) {
            return new KeepAlive(params);
        }
        var self = this,
            state = 0,
            waitTimer = null,
            beatTimer = null,
            beatWaitTime = params.beatWaitTime || defaultConfig.beatWaitTime,
            beatInterval = params.beatInterval || defaultConfig.beatInterval;
        Object.defineProperty(this, "state", {
            get: function get() {
                return state;
            }
        });
        // 启动心跳
        this.run = function () {
            self.stop();
            beatTimer = setTimeout(function () {
                self.ws.send(JSON.stringify({ command: "keepAliveMessage" }));
                waitTimer = setTimeout(function () {
                    self.stop();
                    self.linkBuilder();
                }, beatWaitTime);
            }, beatInterval);
        };
        //停止心跳
        this.stop = function () {
            if (beatTimer) {
                clearTimeout(beatTimer);
                beatTimer = null;
            }
            if (waitTimer) {
                clearTimeout(waitTimer);
                waitTimer = null;
            }
        };
    }
    KeepAlive.prototype = {
        constructor: KeepAlive
    };
    function COCO() {
        //coco构造
        function _COCO(url, params) {
            if (!(this instanceof _COCO)) {
                return new _COCO(url, params);
            }
            var self = this,
                ws = null,
                groups = [],
                sequence = 0,
                reLink = false,
                linkWaiter = null,
                keepAlive = new KeepAlive(params),
                linkTimes = params.linkTimes || defaultConfig.linkTimes,
                linkInterval = params.linkInterval || defaultConfig.linkInterval;
            if (!/^\s*(?:ws:|wss:).*$/.test(url)) {
                url = ("https:" === protocol ? "wss://" : "ws://") + url;
            }
            if (!/\/(?:ws|wss)\/*\s*$/.test(url)) {
                url = url + ("https:" === protocol ? "/wss" : "/ws");
            }
            this.handles = [];
            this._params = params;
            this.connected = false;
            this.users = { onlineNum: 0 };
            var linkBuilder = function linkBuilder() {
                ws = new WebSocket(url);
                ws.onopen = function () {
                    linkTimes = params.linkTimes || defaultConfig.linkTimes;
                    self.ws = ws;
                    keepAlive.ws = ws;
                    self.fire({ type: "linkup" });
                    reLink = false;
                    if (null != linkWaiter) {
                        clearTimeout(linkWaiter);
                        linkWaiter = null;
                    }
                    ws.send(JSON.stringify({
                        command: "online",
                        body: {
                            userToken: params.userToken,
                            clientType: params.clientType || defaultConfig.clientType,
                            deviceName: params.deviceName || defaultConfig.deviceName
                        }
                    }));
                    cocoTab.push(self);
                    cocoMap[params.groupId] = self;
                };
                ws.onmessage = function (res) {
                    var result = JSON.parse(res.data),
                        command = result.command,
                        msg = result.body;
                    switch (command) {
                        case "online":
                            //用户上线
                            self.connected = true;
                            self.fire({ type: "loginup" });
                            if (void 0 != params.groupId) self.joinGroup(params.groupId);
                            break;
                        case "userGroupAction":
                            //用户离开或加入组通知
                            if ("add" === msg.action) {
                                changeUsers(1, msg.userId);
                                if (msg.userId === params.userId) {
                                    params.groupId = msg.groupId;
                                    groups.push(msg.groupId);
                                }
                                self.fire({ type: "loginNotify", message: { from: msg.userId, groupId: msg.groupId, clientType: msg.clientType, deviceName: msg.deviceName } });
                            } else {
                                changeUsers(-1, msg.userId);
                                if (msg.userId === self._params.userId) {
                                    groups = [].filter.call(groups, function (groupId) {
                                        return groupId !== msg.groupId;
                                    });
                                }
                                self.fire({ type: "logoutNotify", message: { from: msg.userId, groupId: msg.groupId } });
                            }
                            break;
                        case "addGroupResult":
                            //加入组返回消息
                            self.fire({ type: "joinGroup", message: msg });
                            self.getGroupOnline(params.groupId);
                            break;
                        case "kickUser":
                            //被踢消息
                            changeUsers(-1, msg.userId);
                            self.fire({ type: "onKick", message: msg });
                            break;
                        case "offline":
                            //下线
                            changeUsers(-1, msg.userId);
                            self.fire({ type: "offline" });
                            break;
                        case "singleChat":
                            //个人消息
                            if ("control" === msg.message.type) {
                                self.fire({ type: "callOne", message: msg.message.content });
                            } else {
                                self.fire({ type: "recePrivateMsg", message: { from: { userName: msg.sendUserName, userId: msg.sendUserId, userType: msg.sendUserType }, data: msg.message } });
                            }
                            break;
                        case "groupChat":
                            //群消息
                            if (msg.from === self._params.userId) return;
                            if ("control" === msg.type) {
                                self.fire({ type: "callAll", message: msg.content });
                            } else {
                                self.fire({ type: "recePublicMsg", message: msg });
                            }
                            break;
                        case "onlineUsers":
                            //获取用户列表
                            msg.userList.forEach(function (user) {
                                changeUsers(1, user.userId);
                            });
                            self.fire({ type: "loadUser", message: msg.userList });
                            break;
                        case "onlineUsersCount":
                            //获取组内用户活动数量
                            self.fire({ type: "onLoadUserNumber", message: msg.activeUserCount });
                            break;
                        case "whitePad":
                            //接收白板信息
                            self.fire({ type: "onLoadPadData", message: msg.data });
                            break;
                        case "control":
                            //ctrlEventMap
                            msg.data.from != self._params.userId && self.fire({ type: ctrlEventMap[msg.type], message: msg.data });
                            break;
                        case "keepAliveMessage":
                            break;
                        default:
                            //错误信息
                            self.fire({ type: "onError", message: msg });
                    }
                    keepAlive.run();
                };
                ws.onclose = function (err) {
                    !err.wasClean && ws.close();
                    keepAlive.stop();
                    self.connected = false;
                    if (reLoad) return;
                    delete cocoMap[params.groupId];
                    cocoTab.splice(cocoTab.indexOf(self), 1);
                    switch (err.code) {
                        case 1015:
                            self.fire({ type: "onError", message: { code: 0, message: "数字证书验证失败" } });
                            break;
                        case 1000:
                            break;
                        default:
                            if (!reLink) {
                                changeUsers(-1, params.userId);
                                keepAlive.linkBuilder();
                                self.fire({ type: "offline" });
                                self.fire({ type: "logoutNotify", message: { from: params.userId, groupId: params.groupId } });
                            }
                    }
                };
                if (reLink && linkTimes) {
                    linkTimes--;
                    if (linkWaiter) {
                        clearTimeout(linkWaiter);
                        linkWaiter = null;
                    }
                    linkWaiter = setTimeout(function () {
                        ws.onopen = null;
                        ws.onmessage = null;
                        ws.onclose = null;
                        ws.readyState != ws.CLOSED && ws.close();
                        linkBuilder();
                    }, linkInterval);
                }
            };
            keepAlive.linkBuilder = function () {
                reLink = true;
                linkBuilder();
            };
            Object.defineProperties(this, {
                sequence: {
                    get: function get() {
                        return sequence++;
                    }
                }
            });
            linkBuilder();
            this.getGroups = function () {
                return groups || [];
            };
            this.getLastGroup = function () {
                return groups.length <= 0 ? void 0 : groups[groups.length - 1];
            };
            var changeUsers = function changeUsers(type, uid) {
                if (self.users[uid]) {
                    if (-1 === type) {
                        self.users.onlineNum = self.users.onlineNum + type;
                        delete self.users[uid];
                    }
                } else {
                    if (1 === type) {
                        self.users.onlineNum = self.users.onlineNum + type;
                        self.users[uid] = true;
                    }
                }
            };
        }
        _COCO.prototype = eventObj;
        _COCO.prototype.constructor = _COCO;
        _COCO.prototype.addEvent = eventObj.addCustEvent;
        _COCO.prototype.removeEvent = eventObj.removeCustEvent;
        _COCO.prototype.fire = eventObj.fire;
        /**
         * 加入组，用户上线后，加入组，同一个会议的用户进入到同一组
         * @param groupId  组id
         */
        _COCO.prototype.joinGroup = function (groupId) {
            if (void 0 === groupId) return;
            var params = this._params;
            this.ws.send(JSON.stringify({
                command: "addGroup",
                body: {
                    deviceName: params.deviceName || defaultConfig.deviceName,
                    clientType: params.clientType || defaultConfig.clientType,
                    groupId: groupId,
                    userId: params.userId
                }
            }));
        };
        /**
         * 踢人下线
         * @param userId 在线人员id
         * @param groupId 组id，如果"g"===groupId表示在所有组中查找，如果不传的话，会在当前组中查找
         */
        _COCO.prototype.kickOut = function (userId, groupId) {
            if (void 0 === userId) return;
            this.ws.send(JSON.stringify({
                command: "kickUser",
                body: {
                    groupId: "g" === groupId ? "" : groupId || this.getLastGroup(),
                    userId: userId
                }
            }));
        };
        /**
         * 增加一个白板页签
         * @param params.userType 用户类型 user/device/all  默认为all
         * @param params.groupId 组id 默认为当前组id
         * @param params.tabName tab名称
         * @param params.users 用户id list，表示消息发给哪些人
         */
        _COCO.prototype.addPadTab = function (params) {
            var obj = {
                command: "control",
                body: {
                    type: "whitePadAddTab",
                    userType: params.userType || defaultConfig.userType,
                    data: {
                        from: this._params.userId,
                        tabName: params.tabName || defaultConfig.tabName
                    }
                }
            };
            params.data && Object.assign(obj.body.data, params.data);
            if (params.users && 0 < params.users.length) {
                obj.body.clientIds = params.users;
            } else {
                obj.body.groupId = params.groupId || this.getLastGroup();
            }
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 移除一个白板页签
         * @param params.tabId tab的唯一标示
         * @param params.userType 用户类型 user/device/all  默认为all
         * @param params.groupId 组id 默认为当前组id
         * @param params.tabName tab名称
         * @param params.users 用户id list，表示消息发给哪些人
         */
        _COCO.prototype.removePadTab = function (params) {
            var obj = {
                command: "control",
                body: {
                    type: "whitePadRemoveTab",
                    userType: params.userType || defaultConfig.userType,
                    data: {
                        from: this._params.userId,
                        tabName: params.tabName || "",
                        tabId: params.tabId || ""
                    }
                }
            };
            params.data && Object.assign(obj.body.data, params.data);
            if (params.users && 0 < params.users.length) {
                obj.body.clientIds = params.users;
            } else {
                obj.body.groupId = params.groupId || this.getLastGroup();
            }
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 激活指定白板页签
         * @param params.tabId tab的唯一标示
         * @param params.userType 用户类型 user/device/all  默认为all
         * @param params.groupId 组id 默认为当前组id
         * @param params.tabName tab名称
         * @param params.users 用户id list，表示消息发给哪些人
         */
        _COCO.prototype.focusPadTab = function (params) {
            if (void 0 === params.tabId) return;
            var obj = {
                command: "control",
                body: {
                    type: "whitePadChangeTab",
                    userType: params.userType || defaultConfig.userType,
                    data: {
                        from: this._params.userId,
                        tabName: params.tabName || "",
                        tabId: params.tabId
                    }
                }
            };
            if (params.users && 0 < params.users.length) {
                obj.body.clientIds = params.users;
            } else {
                obj.body.groupId = params.groupId || this.getLastGroup();
            }
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 白板消息
         * @param params 白板onRender事件抛出的数据
         */
        _COCO.prototype.write = function (params) {
            var self = this,
                content = params.content || params,
                arr = [];
            if (void 0 === content) return;
            var obj = {
                command: "whitePad",
                body: {
                    tabId: params.tabId || 0,
                    groupId: params.groupId || this.getLastGroup(),
                    data: []
                }
            };
            if ("[object Array]" === toString.call(content)) {
                content.forEach(function (d) {
                    var _d = {
                        sequence: self.sequence,
                        type: d.type || "",
                        content: d.data || d,
                        clientId: self._params.userId
                    };
                    arr.push(_d);
                });
            } else {
                arr.push({
                    sequence: self.sequence,
                    type: content.type || "",
                    content: content.data || content,
                    clientId: self._params.userId
                });
            }
            [].push.apply(obj.body.data, arr);
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 群发文本消息
         * @param params.groupId 组id 默认为当前组id
         * @param params.type 消息内容类型
         * @param params.content 消息内容
         */
        _COCO.prototype.sendMsgToAll = function (params) {
            if (void 0 === params.type || !params.content && -1 === [0, false, null].indexOf(params.content)) return;
            var obj = {
                command: "groupChat",
                body: {
                    groupId: params.groupId || this.getLastGroup(),
                    message: {
                        type: params.type,
                        content: params.content,
                        from: this._params.userId
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 单发文本消息
         * @param params.userId 需要接收到本条消息的人员id
         * @param params.type 消息内容类型
         * @param params.content 消息内容
         */
        _COCO.prototype.sendMsgTo = function (params) {
            if (void 0 === params.userId || void 0 === params.type || !params.content && -1 === [0, false, null].indexOf(params.content)) return;
            var obj = {
                command: "singleChat",
                body: {
                    sendUserId: this._params.userId,
                    receivedUserId: params.userId,
                    message: {
                        type: params.type,
                        content: params.content
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 获取所有在线人员
         * @param groupId 组id
         */
        _COCO.prototype.getGroupOnline = function (groupId) {
            this.ws.send(JSON.stringify({
                command: "onlineUsers",
                body: {
                    groupId: groupId || this.getLastGroup()
                }
            }));
        };
        /**
         * 获取组内人员数量
         * @param groupId 组id
         */
        _COCO.prototype.getGroupCount = function (groupId) {
            this.ws.send(JSON.stringify({
                command: "groupUserCount",
                body: {
                    groupId: groupId || this.getLastGroup()
                }
            }));
        };
        /**
         * 发送控制类消息给某人
         * @param 参数1 需要接收到本条消息的人员id
         * @param 参数2-n 需要传递的参数
         */
        _COCO.prototype.callOne = function () {
            var args = [].slice.call(arguments, 0),
                to = args.shift(),
                params = 1 < args.length ? args : args.shift();
            if (void 0 === to) return;
            var obj = {
                command: "singleChat",
                body: {
                    sendUserId: this._params.userId,
                    receivedUserId: to,
                    message: {
                        type: "control",
                        content: params || {}
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 群发控制类消息
         * @param 参数1 组id 此参数可以省略
         * @param 参数2-n 需要传递的参数
         */
        _COCO.prototype.callAll = function () {
            var args = [].slice.call(arguments, 0),
                groups = this.getGroups(),
                firstArg = args.shift();
            if (-1 === groups.indexOf(firstArg)) {
                (firstArg || -1 != [0, false, null].indexOf(firstArg)) && args.unshift(firstArg);
                firstArg = null;
            }
            var params = 1 < args.length ? args : args.shift(),
                groupId = firstArg || this.getLastGroup();
            if (void 0 === groupId) return;
            var obj = {
                command: "groupChat",
                body: {
                    groupId: groupId,
                    message: {
                        type: "control",
                        from: this._params.userId,
                        content: params || {}
                    }
                }
            };
            this.ws.send(JSON.stringify(obj));
        };
        /**
         * 验证用户是否在线
         * @param id 用户id
         */
        _COCO.prototype.isOnline = function (id) {
            return !!this.users[id];
        };
        return {
            /**
             * 初始化白板
             * @param url COCO服务器地址，必须
             * @param params.userToken 用户的合法token，必须
             * @param params.userId 用户id，必须
             * @param params.groupId 组id，必须
             * @param params.clientType 客户端类型，默认为”web“
             * @param params.deviceName 设备名称，默认为”PC“
             * @param params.beatInterval 心跳发送频率
             * @param params.beatWaitTime 心跳发出等待时长
             */
            init: function init(url, params) {
                if (!url || void 0 === params.userToken || void 0 === params.userId) return;
                return new _COCO(url, params);
            },
            get: function get(param) {
                if (void 0 === param) return;
                return cocoMap[param] || cocoTab[param] || null;
            }
        };
    }
    duang ? duang.module("Tool", []).controller("COCO", COCO) : function () {
        window.vm ? function () {
            vm.module = vm.module || {};
            vm.module["COCO"] = COCO();
        }() : window.COCO = COCO();
    }();
})(function () {
    return window.duang || null;
}, void 0);

/***/ }),
/* 4 */
/*!***********************************!*\
  !*** ./src/codyy/media_device.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 *
 * date: 2018-04-03
 * author: Jason
 * fileName: media_device.js
 * describe: 获取本地音视频设备
 *
 *
 */
;(function (fn, undefined) {
    var defaultParam = { video: false, audio: false },
        toString = Object.prototype.toString,
        duang = fn(),
        tool = duang ? duang.getModule("Tool").getController("tool") : window.tool;

    //获取所有音视频设备，包括虚拟设备
    function getUserMedias() {
        var self = this,
            param = Object.assign({});
        param[self.type] = true;

        navigator.mediaDevices.getUserMedia(param).then(function (stream) {
            var tracks = stream.getTracks();

            if (tracks) {
                tracks.forEach(function (track) {
                    track.stop();
                });
            }

            stream.oninactive = function () {
                console.log('Stream inactive');
            };

            return navigator.mediaDevices.enumerateDevices();
        }).then(function (devices) {
            devices = devices.filter(function (device) {
                var flag = "communications" != device.deviceId && "default" != device.deviceId && self.type + "input" === device.kind;
                if (flag) self.deviceMap[device.label] = device;
                return flag;
            });

            [].push.apply(self.devices, devices);
            self.status = 1;
        }).catch(function (e) {
            self.time--;
            if (self.time > 0) {
                //提供三次进行检查
                setTimeout(function () {
                    self.getDevices();
                }, 400);
            } else {
                console.error(e);
                self.status = 1;
            }
        });
    }

    var eventHandle = new tool.constructor.CustomerEvent();
    eventHandle.handles = [];

    var video = {
        time: 5,
        type: "video",
        devices: [],
        deviceMap: {},
        getDevices: getUserMedias
    };

    var audio = {
        time: 5,
        type: "audio",
        devices: [],
        deviceMap: {},
        getDevices: getUserMedias
    };

    Object.defineProperty(video, "status", {
        set: function set(d) {
            if (1 === d) {
                Object.defineProperty(this, "status", {
                    value: 1
                });

                if (1 === audio.status) {
                    eventHandle.fire({ type: "OnReady", message: [].concat.apply([], this.devices, audio.devices) });
                }
            }
        },
        get: function get() {
            return 0;
        },
        configurable: true
    });

    Object.defineProperty(audio, "status", {
        set: function set(d) {
            if (1 === d) {
                Object.defineProperty(this, "status", {
                    value: 1
                });

                if (1 === video.status) {
                    eventHandle.fire({ type: "OnReady", message: [].concat.apply([], video.devices, this.devices) });
                }
            }
        },
        get: function get() {
            return 0;
        },
        configurable: true
    });

    video.getDevices();
    audio.getDevices();

    var mediaDevice = {
        addEvent: function addEvent(name, handle) {
            if ("[object Function]" != toString.call(handle)) return;
            eventHandle.addCustEvent(name, handle);
            if (1 === audio.status && 1 === video.status) handle();
        },
        getAllMedias: function getAllMedias() {
            if (!audio.status || !video.status) return;
            return [].concat.apply([], video.devices, audio.devices);
        },
        getAllVideos: function getAllVideos() {
            if (!video.status) return;
            return video.devices;
        },
        getAllAudios: function getAllAudios() {
            if (!audio.status) return;
            return audio.devices;
        },
        getVideoByName: function getVideoByName(name) {
            if (!video.status) return;
            return video.deviceMap[name];
        },
        getAudioByName: function getAudioByName(name) {
            return audio.deviceMap[name];
        },
        getMediaByName: function getMediaByName(name) {
            return video.deviceMap[name] || audio.deviceMap[name];
        }
    };

    window.mediaDevice = mediaDevice;
})(function () {
    return window.duang || null;
});

/***/ }),
/* 5 */
/*!***************************************!*\
  !*** ./src/codyy/env_check_plugin.js ***!
  \***************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 *
 * date: 2018-4-12
 * author: Jason
 * fileName: index.js
 * describe: 环境检测
 *
 *
 */
;(function (fn, undefined) {
    "use strict";

    var linkCount = 0,
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang ? duang.getModule("Tool").getController("tool") : window.tool,
        url = ("https:" === location.protocol ? "wss://localhost:9102" : "ws://localhost:9101") + "/envCheck";

    var defaultConfig = {
        linkCountLimit: 3
    };

    var addEvent = window.addEventListener ? function (target, type, fn, use) {
        target.addEventListener(type, fn, use || false);
    } : function (target, fn, type) {
        target.attachEvent("on" + type, fn);
    };

    var eventHandle = {};
    var callbackMap = {};

    var browserNameMap = {
        "Chrome": "谷歌",
        "Firefox": "火狐",
        "Edge": "Edge",
        "MSIE": "IE",
        "360EE": "360",
        "QQBrowser": "QQ",
        "OPR": "opera"
    };

    var eventMap = {
        OnDetectionCamera: "OnGetCamera", //视频设备获取成功后触发的事件
        OnCheckDMSIsConnect: "OnCheckStremServer", //硬件检测
        OnVideoRender: "OnGetVideoInfo", //视频信息
        OnAudioRender: "OnGetAudioInfo", //音频信息
        OnAudioCheck: "OnCheckMicrophone", //音频设备检测
        OnNativeEnvironmentCheck: "OnCheckEnv", //环境检测
        OnBrowserEnvCheck: "OnBrowserEnvCheck",
        OnError: "OnError"
    };

    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };

    var Pip = function Pip() {
        var self = this,
            state = 0,
            //0为初始化，1为执行中，2为执行完毕，-1为出现bug
        taskList = [];

        function __Pip__() {}

        __Pip__.prototype = {
            constructor: __Pip__,
            pip: function pip() {
                if (1 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            then: function then() {
                if (1 === state || -1 === state || 2 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            exec: function exec() {
                state = 1;

                if (taskList.length > 0) {
                    try {
                        run(taskList[0]);
                    } catch (e) {
                        state = -1;
                        console.error(e);
                    }
                }
            }
        };

        function run() {
            var args = arguments[0],
                fName = args.shift(),
                fn = args.pop();

            if ("[object Function]" === toString.call(fName) && void 0 === fn) return fName();
            if ("[object String]" != toString.call(fName) || !self[fName]) throw "no function name";

            if ("[object Function]" != toString.call(fn)) {
                void 0 != fn && args.push(fn);
                fn = null;
            }

            args.push(function () {
                fn && fn.apply(this, [].slice.call(arguments, 0));
                taskList.shift();
                taskList.length > 0 && run(taskList[0]);
            });

            return self[fName] && self[fName].apply(self, args);
        }

        return new __Pip__();
    };

    var WSCheck = function () {
        var ws = null,
            custEvent = new tool.constructor.CustomerEvent();

        var _WSCheck = function _WSCheck(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);
            self.state = 0;
            ++linkCount;

            ws.onopen = function () {
                linkCount = 0;
                self.state = this.readyState;
                var args = [].slice.call(arguments, 0);
                callback1 && callback1.apply(ws, args);
            };

            ws.onmessage = function () {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = JSON.parse(tool.decodeBase64(arg.data));

                if (data.uuid) {
                    var uuid = data.uuid;
                    delete data.uuid;
                    delete data.event;
                    callbackMap[uuid] && callbackMap[uuid].call(self, data.param || data);
                    delete callbackMap[uuid];
                } else {
                    if (eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };

            ws.onclose = function (e) {
                if (!self.state && linkCount >= (params.linkCountLimit || defaultConfig.linkCountLimit)) {
                    var info = {
                        code: 0
                    };

                    Object.defineProperty(info, "description", {
                        value: "未安装检测插件"
                    });

                    obj.fireEvent({ type: eventMap["OnError"], message: info });
                    return;
                }

                self.state = this.readyState;
                if (1000 === e.code) return;

                switch (e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({ type: eventMap["OnError"], message: { code: e.code, message: errorMessageMap[e.code] } });
                        break;
                    default:
                        _WSCheck.call(self, callback1, callback2);
                }
            };

            return this;
        };

        var _send = function _send(msg) {
            ws.send(msg);
        };

        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send
        }, { init: {
                writable: false,
                configurable: false,
                enumerable: false,
                value: _WSCheck
            } });

        return obj;
    }();

    var pluginInterface = {
        compressZip: function compressZip(src, dist, fn) {
            var config = {
                method: "CompressZip",
                parameter: {
                    srcPath: src,
                    desPath: dist
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        extractZip: function extractZip(src, dist, fn) {
            var config = {
                method: "ExtractZip",
                parameter: {
                    srcPath: src,
                    desPath: dist
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        permission: function permission(src, fn) {
            var config = {
                method: "Permission",
                parameter: {
                    path: src
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        denyPermission: function denyPermission(src, fn) {
            var config = {
                method: "DenyPermission",
                parameter: {
                    path: src
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        detectionCamera: function detectionCamera(fn) {
            var config = {
                method: "DetectionCamera"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        checkDMSIsConnect: function checkDMSIsConnect(dms, time, fn) {
            var config = {
                method: "CheckDMSIsConnect",
                parameter: {
                    dms: dms,
                    timeout: time || 2 * 1000
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        videoRenderStop: function videoRenderStop(fn) {
            var config = {
                method: "VideoRenderStop"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        videoRenderStart: function videoRenderStart(winId, deviceName, fn) {
            var config = {
                method: "VideoRenderStart",
                parameter: {
                    windowsHandle: winId,
                    cameraName: deviceName
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        audioRenderStop: function audioRenderStop(fn) {
            var config = {
                method: "AudioRenderStop"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        audioRenderStart: function audioRenderStart(deviceName, fn) {
            var config = {
                method: "AudioRenderStart",
                param: {
                    audioName: deviceName
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        audioCheck: function audioCheck(fn) {
            var config = {
                method: "AudioCheck"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        checkSpeaker: function checkSpeaker(fn) {
            var config = {
                method: "SpeakerCheck"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        nativeEnvironmentCheck: function nativeEnvironmentCheck(fn) {
            var config = {
                method: "NativeEnvironmentCheck"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        },
        checkExtensionScreen: function checkExtensionScreen(fn) {
            var config = {
                method: "CheckExtensionScreen"
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSCheck.send(tool.encodeBase64(JSON.stringify(config)));
        }
    };

    var checkPlugin = {
        init: function init(params, callback) {
            return WSCheck.init(params, callback, function () {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.event;
                eventName && this.fireEvent({ type: eventMap[eventName], message: data.param });
            });
        },
        addEvent: function addEvent(name, fn) {
            if (void 0 === name || void 0 === fn) return;
            WSCheck.addEvent(name, fn);
        },
        removeEvent: function removeEvent(name, fn) {
            if (void 0 === name) return;
            WSCheck.removeEvent(name, fn);
        },
        // 当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        // 参数1 在“wsPublish”中的接口名，string
        // 参数2-n 插件需要的参数
        // 参数n+1 回调函数
        // 目前不用，预留接口
        pip: function pip() {
            var pip = Pip.call(this);
            pip.pip.apply(this, [].slice.call(arguments, 0));
            return pip;
        },
        // 将目录打包成zip
        // src是源目录
        // dist是目标目录
        compressZip: function compressZip(src, dist, fn) {
            if (void 0 === src || void 0 === dist) return;
            pluginInterface.compressZip(src, dist, fn);
        },
        // 将zip文件解压
        // src是源目录
        // dist是目标目录
        extractZip: function extractZip(src, dist, fn) {
            if (void 0 === src || void 0 === dist) return;
            pluginInterface.extractZip(src, dist, fn);
        },
        // 给指定文件设置权限
        // src: 文件路径
        permission: function permission(src, fn) {
            if (void 0 === src) return;
            pluginInterface.permission(src, fn);
        },
        // 解除指定文件权限
        removePerission: function removePerission(src, fn) {
            if (void 0 === src) return;
            pluginInterface.denyPermission(src, fn);
        },
        // 获取摄像头
        getCamera: function getCamera(fn) {
            pluginInterface.detectionCamera(fn);
        },
        checkStreamServer: function checkStreamServer() {
            var args = toString.call(arguments),
                dms = args.shift(),
                fn = args.pop(),
                time = args.shift();
            if (!dms || "[object Function]" === toString.call(dms)) return;
            pluginInterface.checkDMSIsConnect(dms, time || 2 * 1000, fn);
        },
        stopVideoRender: function stopVideoRender(fn) {
            pluginInterface.videoRenderStop(fn);
        },
        startVideoRender: function startVideoRender(winId, deviceName, fn) {
            if (!winId || !deviceName) return;
            pluginInterface.videoRenderStart(winId, deviceName, fn);
        },
        stopAudioRender: function stopAudioRender(fn) {
            pluginInterface.audioRenderStop(fn);
        },
        startAudioRender: function startAudioRender(deviceName, fn) {
            if (!deviceName) return;
            pluginInterface.audioRenderStart(deviceName, fn);
        },
        checkAudio: function checkAudio(fn) {
            pluginInterface.audioCheck(fn);
        },
        checkEnv: function checkEnv(fn) {
            pluginInterface.nativeEnvironmentCheck(fn);
        },
        checkBrowserEnv: function checkBrowserEnv(fn) {
            var info = {
                plat: navigator.platform,
                AVStreaming: {},
                CodyyReceive: {},
                CodyyTransfer: {},
                flash: {},
                PPMeet: {}
            };

            var browserInfo = navigator.userAgent.match(/^\s*.*(chrome|firefox|edge|MSIE|360EE|QQBrowser|OPR)[\/\s]*([\d+\.?]+)*.*$/i);

            browserInfo = {
                name: browserInfo[1],
                version: browserInfo[2] || ""
            };

            Object.defineProperty(browserInfo, "description", {
                get: function get() {
                    return browserNameMap[browserInfo.name];
                }
            });

            [].slice.call(navigator.plugins, 0).forEach(function (plugin) {
                switch (plugin.name) {
                    case "CodyyMultiHD":
                        info.AVStreaming = {};
                        info.AVStreaming.name = plugin.name;
                        info.AVStreaming.version = plugin.version;

                        Object.defineProperty(info.AVStreaming, "description", {
                            get: function get() {
                                return "发送流插件";
                            }
                        });
                        break;
                    case "CodyyReceiveHD":
                        info.CodyyReceive = {};
                        info.CodyyReceive.name = plugin.name;
                        info.CodyyReceive.version = plugin.version;

                        Object.defineProperty(info.CodyyReceive, "description", {
                            get: function get() {
                                return "接收流插件";
                            }
                        });
                        break;
                    case "CodyyTransfer":
                        info.CodyyTransfer = {};
                        info.CodyyTransfer.name = plugin.name;
                        info.CodyyTransfer.version = plugin.version;

                        Object.defineProperty(info.CodyyTransfer, "description", {
                            get: function get() {
                                return "转换插件";
                            }
                        });
                        break;
                    case "PPMEETSR":
                        info.PPMeet = {};
                        info.PPMeet.name = plugin.name;
                        info.PPMeet.version = plugin.version;

                        Object.defineProperty(info.PPMeet, "description", {
                            get: function get() {
                                return "视频会议插件";
                            }
                        });
                        break;
                    case "Shockwave Flash":
                        info.flash = {};
                        info.flash.name = plugin.name;
                        info.flash.version = plugin.version;

                        Object.defineProperty(info.flash, "description", {
                            get: function get() {
                                return "flash";
                            }
                        });
                }
            });

            info.browser = browserInfo;
            "[object Function]" === toString.call(fn) && fn(info);
        },
        checkExtensionScreen: function checkExtensionScreen(fn) {
            pluginInterface.checkExtensionScreen(fn);
        },
        checkSpeaker: function checkSpeaker(fn) {
            pluginInterface.checkSpeaker(fn);
        }
    };

    window.plugin = window.plugin || {};
    window.plugin.checkEnv = checkPlugin;
})(function () {
    return window.duang || null;
});

/***/ }),
/* 6 */
/*!*************************************!*\
  !*** ./src/codyy/meeting_plugin.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 对CodyyMeeting插件的前台封装，方便调用
 * @Author Jason
 * @Date 2017-11-7
 * @Other 依赖tool.js   Websocket
 * 如果项目中加载了duangJs，会codyyMeeting对象加载入duangJs，模块名为：Tool，指令名：CodyyMeeting
 * 如果项目中没有加载duangJs，会将codyyMeeting对象暴露在全局环境中
 * 与底层Websocket服务的连接是在初始化时建立的
 * ws://localhost:9098
 */
;(function (fn, undefined) {
    var duang = fn(),
        cameras = {},
        audios = {},
        isUnload = false,
        pluginVersion = "",
        tool = duang ? duang.getModule("Tool").getController("tool") : window.tool,
        url = "https:" === location.protocol ? "wss://localhost:9099" : "ws://localhost:9098";
    var addEvent = window.addEventListener ? function (target, type, fn, use) {
        target.addEventListener(type, fn, use || false);
    } : function (target, fn, type) {
        target.attachEvent("on" + type, fn);
    };
    addEvent(window, "beforeunload", function () {
        isUnload = true;
    });
    var eventMap = {
        5002: "OnInit",
        5004: "OnServerRecordStart",
        5006: "OnServerRecordStop",
        5010: "OnSetShareVideo",
        5016: "OnShareVideoTimeChange",
        5019: "OnServerRecordPause",
        5020: "OnError",
        5063: "OnCaptureUpload",
        5067: "OnShareVideoEnd",
        5081: "OnLockScreen",
        5082: "OnUnlockScreen",
        9999: "OnDisconnect",
        100000000: "OnStop"
    };
    //获取所有音视频设备，包括虚拟设备
    mediaDevice.addEvent("OnReady", function () {
        var devices = mediaDevice.getAllVideos();
        devices.forEach(function (device) {
            if (/Codyy\w+\((\d+)\)/.test(device.label)) {
                if ("videoinput" === device.kind) {
                    cameras[RegExp.$1] = device;
                }
            }
        });
    });
    var av = {
        preview: function () {
            var stream = null,
                video = null,
                constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    deviceId: {}
                }
            };
            return {
                setCamera: function setCamera(deviceName) {
                    if (!deviceName) return;
                    var camera = cameras[deviceName.match(/Codyy\w+\((\d+)\)/)[1]];
                    if (!camera) {
                        console.error("未获取到相关设备！");
                    } else {
                        constraints.video.deviceId = { exact: camera.deviceId };
                    }
                },
                startPlay: function startPlay(_video) {
                    if (_video) video = _video;
                    if (!video) return;
                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    }
                    navigator.mediaDevices.getUserMedia(constraints).then(function (_stream) {
                        stream = _stream;
                        video.srcObject = _stream;
                    });
                },
                pausePlay: function pausePlay() {
                    video && video.pause();
                },
                stopPlay: function stopPlay() {
                    video && video.pause();
                }
            };
        }()
    };
    var WSCodyyMeeting = function () {
        var ws = null,
            isClose = false,
            custEvent = new tool.constructor.CustomerEvent();
        var _WSCodyyMeeting = function _WSCodyyMeeting(callback1, callback2) {
            var self = this;
            isClose = false;
            ws = new WebSocket(url);
            ws.onopen = function () {
                var args = [].slice.call(arguments, 0);
                callback1 && callback1.apply(ws, args);
            };
            ws.onmessage = function () {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = tool.decodeBase64(arg.data);
                if (!/register/g.test(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        throw e;
                    }
                } else {
                    return callback2.call(self, data);
                }
                if ("5002" === data.event.toString()) {
                    pluginVersion = data.parameter.version;
                    return;
                }
                if (data.uuid) {} else {
                    callback2.call(self, data);
                }
            };
            ws.onclose = function () {
                isClose && callback2.call(self, { event: 100000000 });
                if (isUnload || isClose) return;
                _WSCodyyMeeting(null, callback2);
            };
        };
        var _send = function _send(msg) {
            ws.send(msg);
        };
        var _stop = function _stop() {
            isClose = true;
            ws.close();
        };
        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send,
            stop: _stop
        }, { init: {
                writable: false,
                configurable: false,
                enumerable: false,
                value: _WSCodyyMeeting
            } });
        return obj;
    }();
    var configWrapper = function configWrapper(val) {
        return {
            key: "WSMeetingEngine",
            value: val
        };
    };
    //视频会议里相关插件
    var codyyMeeting = {
        //初始化
        init: function init(params, callback) {
            if (!params) return;
            var self = this;
            var config = {
                method: 5001,
                parameter: params
            };
            WSCodyyMeeting.init(function () {
                var registerConfig = {
                    key: "register",
                    value: params.moduleName
                };
                WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(registerConfig)));
            }, function (data) {
                if (/register/g.test(data)) {
                    callback && callback.call(self);
                    WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
                    return;
                }
                var eventName = eventMap[data.event || ""];
                eventName && this.fireEvent({ type: eventName, message: data.parameter });
            });
        },
        //开始服务器录制
        startServerRecord: function startServerRecord() {
            var config = { method: 5003 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //服务器录制暂停
        pauseServerRecord: function pauseServerRecord() {
            var config = { method: 5018 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //停止服务器录制
        stopServerRecord: function stopServerRecord() {
            var config = { method: 5005 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //开始共享桌面
        startShareDesk: function startShareDesk() {
            var config = { method: 5007 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //停止共享桌面
        stopShareDesk: function stopShareDesk() {
            var config = { method: 5008 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //设置共享视频
        setShareVideo: function setShareVideo(deviceName) {
            if (!deviceName) return;
            var config = {
                method: 5009,
                parameter: {
                    title: document.title,
                    cameraId: deviceName
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.setCamera(deviceName);
        },
        //开始共享视频
        startShareVideo: function startShareVideo(video) {
            var config = { method: 5011 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            //av.preview.startPlay(video);
        },
        //seek到视频某个时间点，单位:s
        shareVideoSeek: function shareVideoSeek(time) {
            if (void 0 === time || isNaN(time)) return;
            var config = {
                method: 5012,
                parameter: {
                    seek: time
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //暂停共享视频
        pauseShareVideo: function pauseShareVideo() {
            var config = { method: 5013 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.pausePlay();
        },
        //停止共享视频
        stopShareVideo: function stopShareVideo() {
            var config = { method: 5014 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.stopPlay();
        },
        //退出视频共享
        exitShareVideo: function exitShareVideo() {
            var config = { method: 5015 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            av.preview.stopPlay();
        },
        //截屏
        captureScreen: function captureScreen() {
            var config = { method: 5017 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //通知插件断开连接
        quit: function quit() {
            var config = { method: 5021 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },
        //调节共享视频音量
        setShareVideoVoice: function setShareVideoVoice(val) {
            var config = {
                method: 5057,
                parameter: {
                    val: val
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },

        // 锁屏
        lockScreen: function lockScreen(val) {
            var config = {
                method: 5060,
                parameter: {
                    val: val
                }
            };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },

        // 取消锁屏
        unlockScreen: function unlockScreen() {
            var config = { method: 5061 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
        },

        addEvent: function addEvent(type, callback) {
            if (void 0 === type || void 0 === callback) return;
            WSCodyyMeeting.addEvent(type, callback);
        },
        removeEvent: function removeEvent(type) {
            if (void 0 === type) return;
            WSCodyyMeeting.removeEvent(type);
        },
        stop: function stop() {
            var config = { method: 5021 };
            WSCodyyMeeting.send(tool.encodeBase64(JSON.stringify(configWrapper(JSON.stringify(config)))));
            WSCodyyMeeting.stop();
        },
        get version() {
            return pluginVersion;
        }
    };
    var plugin = {
        codyyMeeting: codyyMeeting
    };
    !duang ? window.plugin = Object.assign(window.plugin || {}, plugin) : function () {
        duang.module("Tool", []).directive("CodyyMeeting", ["tool"], function () {
            return codyyMeeting;
        });
    }();
})(function () {
    return window.duang || null;
});

/***/ }),
/* 7 */
/*!*************************************!*\
  !*** ./src/codyy/publish_plugin.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 *
 * date: 2018-04-03
 * author: Jason
 * fileName: index.js
 * describe: 流发送插件
 *
 *
 */
;(function (fn, undefined) {
    "use strict";

    var publishPlugin = null,
        cameras = {},
        audios = {},
        number = 1,
        publishVersion = "",
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang ? duang.getModule("Tool").getController("tool") : window.tool,
        url = ("https:" === location.protocol ? "wss://localhost:9099" : "ws://localhost:9098") + "/publish";
    //OnGeneral事件下的不同key
    var eventMap1 = {
        1: "OnMainChange", //主画面索引值改变事件
        2: "OnRateWatch", //流量监测
        3: "OnMouseWatch", //鼠标侦测
        4: "OnVGAMotionWatch", //VGA运动量检测
        5: "OnCPUWatch", //CPU消耗(总体)
        6: "OnGPUWatch", //GPU消耗(总体)
        7: "OnMemoryWatch", //内存消耗
        8: "OnPacketLostRate", //丢包率
        9: "OnBehaviorExplain", //行为分析
        10: "OnBehaviorTrack", //行为轨迹
        11: "OnServerRecordStateChange", //服务器录制状态
        15: "OnRecordLimit"
    };
    var eventMap = {
        101: "OnTransVideoOver", //视频转换结果的通知
        // 102: "OnCreateShareMem",	//共享内存创建名字的通知
        103: eventMap1, //OnGeneral
        104: "OnRemoteControlKeypress", //遥控器按键通知
        105: "OnCenterControlKeypress", //中控台按键通知
        106: "OnStateMessage", //状态上报通知
        107: "OnFunctionResult", //函数结果通知
        108: "OnConnectResult", //主辅互换后连接结果通知

        6104: "OnRunningExceptionReport"
    };
    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };
    var addEvent = window.addEventListener ? function (target, type, fn, use) {
        target.addEventListener(type, fn, use || false);
    } : function (target, fn, type) {
        target.attachEvent("on" + type, fn);
    };
    var eventHandle = {
        199: function _(data) {
            publishVersion = data.version;
        }
    };
    //获取所有音视频设备，包括虚拟设备
    mediaDevice.addEvent("OnReady", function () {
        var devices = mediaDevice.getAllVideos();
        devices.forEach(function (device) {
            if (/Codyy\w+\((\d+)\)/.test(device.label)) {
                if ("videoinput" === device.kind) {
                    cameras[RegExp.$1] = device;
                }
            }
        });
    });
    var Pip = function Pip() {
        var self = this,
            state = 0,
            //0为初始化，1为执行中，2为执行完毕，-1为出现bug
        taskList = [];
        function __Pip__() {}
        __Pip__.prototype = {
            constructor: __Pip__,
            pip: function pip() {
                if (1 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            then: function then() {
                if (1 === state || -1 === state || 2 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            exec: function exec() {
                state = 1;
                if (taskList.length > 0) {
                    try {
                        run(taskList[0]);
                    } catch (e) {
                        state = -1;
                        console.error(e);
                    }
                }
            }
        };
        function run() {
            var args = arguments[0],
                fName = args.shift(),
                fn = args.pop();
            if ("[object Function]" === toString.call(fName) && void 0 === fn) return fName();
            if ("[object String]" != toString.call(fName) || !self[fName]) throw "no function name";
            if ("[object Function]" != toString.call(fn)) {
                void 0 != fn && args.push(fn);
                fn = null;
            }
            args.push(function () {
                fn && fn.apply(this, [].slice.call(arguments, 0));
                taskList.shift();
                taskList.length > 0 && run(taskList[0]);
            });
            return self[fName] && self[fName].apply(self, args);
        }
        return new __Pip__();
    };
    function linkVideo(params, callback) {
        var self = this,
            camera = cameras[params.cameraId || number++];
        var constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                deviceId: {}
            }
        };
        var _linkVideo = function _linkVideo() {
            try {
                constraints.video.deviceId = { exact: camera.deviceId };
                if (self.stream) {
                    self.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                navigator.mediaDevices.getUserMedia(constraints).then(function (_stream) {
                    self.stream = _stream;

                    params.video.onloadstart = function () {
                        var time = 20;
                        var inter = setInterval(function () {
                            params.video.srcObject.getTracks().forEach(function (track) {
                                if (!track.onmute) {
                                    track.onmute = function () {
                                        params.video.load();
                                    };
                                }
                            });
                            time--;
                            if (time == 0) {
                                clearInterval(inter);
                            }
                        }, 1000);
                    };
                    params.video.srcObject = _stream;

                    "[object Function]" === toString.call(callback) && callback();
                }).catch(function (e) {
                    console.error(e.message);
                });
            } catch (e) {
                console.error(e.message);
            }
        };
        if (camera) {
            _linkVideo();
        } else {
            console.error("未找到相关设备！");
        }
    }
    //================发送插件开始=======================================================
    function AvPublish(params, server) {
        if (!this instanceof AvPublish) {
            return new AvPublish(params);
        }
        var self = this,
            custEvent = new tool.constructor.CustomerEvent();
        this.name = "AvPublish";
        this.id = params.id || tool.random(10);
        custEvent.handle = [];
        if (params.background) {
            params.video.style.background = "center contain no-repeat content-box url(" + params.background + ")";
        }
        params.video.setAttribute("autoplay", "autoplay");
        self.addEvent = custEvent.addCustEvent.bind(custEvent);
        self.removeEvent = custEvent.removeCustEvent.bind(custEvent);
        var bindEvent = function bindEvent() {
            var tracks = self.stream.getTracks();
            tracks.forEach(function (track) {
                //流中断
                /*track.onmute = function() {
                    params.video.load();
                    WSPublish.fireEvent({type: "OnBreak", message: {type: track.kind, id: self.id, video: params.video}});
                };*/
            });
        };
        linkVideo.call(self, params, bindEvent);
        this.setVideoElement = function (video) {
            params.video = video;
            linkVideo.call(self, params, bindEvent);
        };
        this.shutdown = function (fn) {
            try {
                if (self.stream) {
                    self.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    fn && fn();
                }
            } catch (e) {
                console.error(e.message);
            }
        };
    }
    AvPublish.prototype = {
        constructor: AvPublish
    };
    //================发送插件结束=======================================================
    //================发送插件服务开始=======================================================
    var WSPublish = function () {
        var ws = null,
            custEvent = new tool.constructor.CustomerEvent();
        var _WSPublish = function _WSPublish(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);
            eventHandle[9999] = function () {
                avPublishInterface.initSenderModule(params, function () {
                    var args = [].slice.call(arguments, 0);
                    callback1 && callback1.apply(ws, args);
                });
            };
            ws.onopen = function () {
                self.state = this.readyState;
                eventHandle[9999]();
            };
            ws.onmessage = function () {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = JSON.parse(tool.decodeBase64(arg.data));
                if (data.uuid) {
                    callbackMap[data.uuid] && callbackMap[data.uuid].call(self, data);
                    delete callbackMap[data.uuid];
                } else {
                    if (eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };
            ws.onclose = function (e) {
                self.state = this.readyState;
                if (1000 === e.code) return;
                switch (e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({ type: "OnError", message: { code: e.code, message: errorMessageMap[e.code] } });
                        break;
                    default:
                        _WSPublish.call(self, params, null, callback2);
                }
            };
            return this;
        };
        var _send = function _send(msg) {
            ws.send(msg);
        };
        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send
        }, { init: {
                writable: false,
                configurable: false,
                enumerable: false,
                value: _WSPublish
            } });
        return obj;
    }();
    //================发送插件服务结束=======================================================
    //发送插件初始化接口
    //此接口对外，供业务层调用初始化发送插件
    //不包括插件服务的初始化
    var avPublish = {
        init: function init(params) {
            if (void 0 === params || !params.video) return;
            publishPlugin = new AvPublish(params, WSPublish);
            return publishPlugin;
        },
        getPlugin: function getPlugin() {
            return publishPlugin;
        }
    };
    var avPublishInterface = {
        /**
         * 启动发送模块,并将需要的设备名称传下来
         * params 从后端获取的参数；（必填）
         */
        initSenderModule: function initSenderModule(params, fn) {
            var config = {
                method: 1,
                delayExitTime: params.delayExitTime || 0,
                param: {
                    stitchDeviceName: params.stitchDeviceName || "",
                    resourceDeviceList: params.resourceDeviceList || [],
                    mcuDeviceName: ""
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        /**
         * 设置初始化参数，这里的参数从后端获取
         * type 代表不同的终端设备，1：导播，2：发送端，3：中控及班班通，4：视频转换；（必填）
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setConfig: function setConfig(type, params, fn) {
            if (!type || !params) return;
            var config = {
                method: 2,
                param: {
                    key: type,
                    value: JSON.stringify(params)
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            console.log("==========================into setConfig======================================");
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //录制控制
        setRecord: function setRecord(key, value, index, fn) {
            if (void 0 === key || void 0 === value || isNaN(key)) return;
            var config = {
                method: 3,
                param: {
                    key: key,
                    id: index,
                    value: value,
                    flag: 0
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //流控制
        setStream: function setStream(key, value, index, flag, fn) {
            if (void 0 === key || void 0 === value || isNaN(key)) return;
            var config = {
                method: 4,
                param: {
                    key: key,
                    id: index,
                    flag: flag,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置截屏上传服务器所需要的参数
        setStitchCapture: function setStitchCapture(url, interval, height, compress, fn) {
            if (isNaN(height) || void 0 === url) return;
            var config = {
                method: 5,
                param: {
                    captureInterval: interval,
                    captureHeight: height || 200,
                    compress: captureCompress,
                    url: url
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置视频设备的参数
        setResourceVideoDevice: function setResourceVideoDevice(key, value, fn) {
            if (void 0 === key || void 0 === value) return;
            var config = {
                method: 6,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置PPT索引功能的参数
        setPPTIndexInfo: function setPPTIndexInfo(key, value, fn) {
            if (void 0 === key || void 0 === value) return;
            var config = {
                method: 7,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置流量监测功能参数
        setTrafficStatistic: function setTrafficStatistic(time, interval, fn) {
            if (time && isNaN(time) || interval && isNaN(interval)) return;
            var config = {
                method: 8,
                param: {
                    time: time || 3000,
                    eventInterval: interval || 3000
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //移除台标,字幕信息
        removeLogoSubtitle: function removeLogoSubtitle(key, id, index, fn) {
            if (void 0 === id || void 0 === index) return;
            var config = {
                method: 9,
                param: {
                    key: key || 1,
                    id: id,
                    value: index
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置片头,片尾开关
        setMovieHeadTail: function setMovieHeadTail(key, _switch, file, fn) {
            if (void 0 === file) return;
            var config = {
                method: 10,
                param: {
                    key: key || 1,
                    switch: _switch || 0,
                    file: file
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置导播相关功能信息,根据key值不同,完成相应功能设置
        setDirectorControl: function setDirectorControl(key, index, value, fn) {
            if (void 0 === key || void 0 === index) return;
            var config = {
                method: 11,
                param: {
                    key: key,
                    id: index,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置拼接器相关功能信息,根据key值不同,完成相应功能设置
        setStitchVideo: function setStitchVideo(key, id, value, fn) {
            if (void 0 === key) return;
            var config = {
                method: 12,
                param: {
                    key: key,
                    id: id,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取电脑磁盘上存储的一些信息
        getSystemInfo: function getSystemInfo(key, value, fn) {
            var config = {
                method: 13,
                param: {
                    key: key,
                    value: value || ""
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置自动更新功能所需参数
        setUpdatePlugin: function setUpdatePlugin(url, fn) {
            var config = {
                method: 14,
                param: {
                    update: 1,
                    updaterUrl: url
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置程序运行状态,根据key值不同,完成相应功能设置
        setProgramState: function setProgramState(key, fn) {
            var config = {
                method: 15,
                param: {
                    key: key
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //打开vnc,班班通预览程序
        startVNCBBT: function startVNCBBT(key, value, fn) {
            var config = {
                method: 16,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //控制班班通预览程序,根据key值不同,完成相应功能设置
        setBBTControl: function setBBTControl(key, value, fn) {
            var config = {
                method: 17,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置录制状态
        setRecordState: function setRecordState(state, fn) {
            var config = {
                method: 18,
                param: {
                    state: state
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置预览窗口大小
        changeWindowSize: function changeWindowSize() {},
        //通用接口设置,根据key值不同,完成相应功能设置
        setGeneralFunction: function setGeneralFunction(key, value, fn) {
            var config = {
                method: 20,
                param: {
                    key: key,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置对话模式初始值
        setConversationArray: function setConversationArray(param, fn) {
            var config = {
                method: 21,
                param: param
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置服务器录制状态
        setServerRecordState: function setServerRecordState(state, fn) {
            var config = {
                method: 22,
                param: {
                    state: state
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        },
        setPreview: function setPreview(index, value, fn) {
            var config = {
                method: 23,
                param: {
                    id: index,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSPublish.send(tool.encodeBase64(JSON.stringify(config)));
        }
    };
    //发送插件服务相关接口
    //此接口对外，供业务层调用初始化发送插件服务
    var wsPublish = {
        init: function init(params, callback) {
            if (void 0 === params) return;
            var self = this;
            return WSPublish.init.call(WSPublish, params, callback, function () {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key ? eventMap[data.event][data.param.key] : eventMap[data.event];
                data.param ? delete data.param.key : data.param = "";
                eventName && this.fireEvent({ type: eventName, message: data.param });
            });
        },
        get version() {
            return publishVersion;
        },
        get state() {
            return WSPublish.state;
        },
        //当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        //参数1 在“wsPublish”中的接口名，string
        //参数2-n 插件需要的参数
        //参数n+1 回调函数
        pip: function pip() {
            var args = [].slice.call(arguments, 0),
                pip = Pip.call(this);
            args.length > 0 && pip.pip.apply(this, args);
            return pip;
        },
        addEvent: function addEvent(type, callback) {
            if (void 0 === type || void 0 === callback) return;
            WSPublish.addEvent(type, callback);
        },
        removeEvent: function removeEvent(type, fn) {
            if (void 0 === type) return;
            WSPublish.removeEvent(type, fn);
        },
        /**
         * 设置导播初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setDirectorConfig: function setDirectorConfig(params, fn) {
            if (!params) return;
            avPublishInterface.setConfig(1, params, fn);
        },
        /**
         * 设置发送插件初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setPublisherConfig: function setPublisherConfig(params, fn) {
            if (!params) return;
            console.info("===========================into setPublisherConfig===================================");
            avPublishInterface.setConfig(2, params, fn);
        },
        /**
         * 设置中控及班班通初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setControllerConfig: function setControllerConfig(params, fn) {
            if (!params) return;
            avPublishInterface.setConfig(3, params, fn);
        },
        /**
         * 设置转换视频文件初始化参数
         * params 从后端获取的参数；（必填）
         * fn 回调函数
         */
        setTransConfig: function setTransConfig(params, fn) {
            if (!params) return;
            avPublishInterface.setConfig(4, params, fn);
        },
        /**
         * 允许录制
         * 参数1 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        ableRecord: function ableRecord() {
            var args = [].slice.call(arguments, 0);
            avPublishInterface.setRecord.apply(avPublishInterface, [].concat.apply([1, 1], args));
        },
        /**
         * 不允许录制
         * 参数1 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        disableRecord: function disableRecord() {
            var args = [].slice.call(arguments, 0);
            avPublishInterface.setRecord.apply(avPublishInterface, [].concat.apply([1, 0], args));
        },
        /**
         * 设置录制路径
         * path 录制路径；（必填）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFilePath: function setRecordFilePath() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if (void 0 === params.path) return;
            avPublishInterface.setRecord(2, params.path, +params.index || 0, fn);
        },
        /**
         * 设置录制路径
         * type 录制文件类型[flv, mp4]；（必填）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFileType: function setRecordFileType() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop(),
                map = { flv: 1, mp4: 2 };
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(3, void 0 === params.type ? 1 : map[params.type], params.index || 0, fn);
        },
        /**
         * 设置appending和非appeding录制模式
         * appending false/true，默认：true
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordAppending: function setRecordAppending() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(4, void 0 === params.appending ? 1 : Number(params.appending), params.index || 0, fn);
        },
        /**
         * 设置录制文件的码率
         * bitrate 码率；默认：4000
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordBitrate: function setRecordBitrate() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(5, void 0 === params.bitrate ? 4000 : params.bitrate, params.index || 0, fn);
        },
        /**
         * 设置录制文件的分辨率
         * resolution 分辨率；默认：1920*1080
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordResolution: function setRecordResolution() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(6, void 0 === params.resolution ? [1920, 1080] : params.resolution, params.index || 0, fn);
        },
        /**
         * 设置录制文件的贞率
         * fps 贞率；默认：24
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordfps: function setRecordfps() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(7, void 0 === params.fps ? 24 : params.fps, params.index || 0, fn);
        },
        /**
         * 设置录制文件的音频存在形式
         * staute 0：无音频，1：只有主讲人音频，2：主辅课堂混音；默认：1
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordVoiceStaute: function setRecordVoiceStaute() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(8, void 0 === params.staute ? 1 : params.staute, params.index || 0, fn);
        },
        /**
         * 设置录制文件的编码设备
         * encode 1：CPU，1：集显，2：独显；默认：1
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordEncodeType: function setRecordEncodeType() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(9, void 0 === params.encode ? 2 : params.encode, params.index || 0, fn);
        },
        /**
         * 设置录制文件大小，用于分段录制
         * size 文件大小，单位b，默认：5*1024*1024
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFileSize: function setRecordFileSize() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(10, void 0 === params.size ? 5 * 1024 * 1024 : params.size, params.index || 0, fn);
        },
        /**
         * 设置录制文件时长，用于分段录制
         * duration 录制时长，单位s，默认：30*60
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * 参数2 回调函数
         */
        setRecordFileDuration: function setRecordFileDuration() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setRecord(11, void 0 === params.duration ? 30 * 60 : params.duration, params.index || 0, fn);
        },
        /**
         * 关闭某路流
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        unpublishStream: function unpublishStream() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(1, 0, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 打开某路流
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        publishStream: function publishStream() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(1, 1, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置流地址
         * streamName 流地址，（必填）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamName: function setStreamName() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if (void 0 === params.streamName) return;
            avPublishInterface.setStream(2, params.streamName, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 开始服务器录制
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        ableServerRecord: function ableServerRecord() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(2, 0, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 停止服务器录制
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        disableServerRecord: function disableServerRecord() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(2, 1, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置流码率
         * bitrate 码率，默认：2000
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamBitrate: function setStreamBitrate() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(4, void 0 === params.bitrate ? 2000 : params.bitrate, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置流分辨率
         * resolution 分辨率，默认1920*1080
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamResolution: function setStreamResolution() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(5, void 0 === params.resolution ? [1920, 1080] : params.resolution, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置流贞率
         * fps 贞率，默认：24
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamfps: function setStreamfps() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(6, void 0 === params.fps ? 24 : params.fps, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置发送的每路流音频存在形式
         * staute 0：无音频，1：只有主讲人音频，2：主辅课堂混音，默认：1
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamVoiceStaute: function setStreamVoiceStaute() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(7, void 0 === params.staute ? 1 : params.staute, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置发送的每路流编码方式
         * encode 1：CPU，2：集显，3：独显，默认：2
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamEncodeType: function setStreamEncodeType() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(8, void 0 === params.encode ? 2 : params.encode, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置发送的每路流编码方式
         * recordMode 0 代表可进行【开始，停止】控制，断流10s后会自动结束录制，如在线课堂 ,默认：0
         *			  1代表可进行【开始，暂停，停止】控制，断流不会结束录制，如智慧课堂）
         *			  2代表【开始，暂停，停止】控制，断流10s后会自动结束录制）
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setServerRecordMode: function setServerRecordMode() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(9, params.recordMode || 0, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 设置发送的每路流编码方式
         * streamMode 0 音视频 1 视频 2 音频 3无，默认：0
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂   13:移动端
         * 参数2 回调函数
         */
        setStreamMode: function setStreamMode() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setStream(10, +(params.streamMode || 0), +(params.index || 0), +(params.direction || 12), fn);
        },
        /**
         * 主辅互换后改变服务器端录制流
         * streamName 流名称
         * append 是否需要append
         * index 机位索引，包括[1, 2, 3, 4, 5, 6]，100为观摩
         * direction 关闭发往哪里的流，11:远程导播  12:辅课堂 13:移动端
         * 参数2 回调函数
         */
        changeServiceRecordStream: function changeServiceRecordStream() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if (void 0 === params.streamName) return;
            avPublishInterface.setStream(11, { url: params.streamName, append: Number(params.append || 1) }, params.index || 0, params.direction || 12, fn);
        },
        /**
         * 拼接画面定时截图发送到平台
         * interval 截图发送间隔，单位秒(int)，默认：10
         * height 生成的jpeg图片高度，默认：100
         * compress Jpeg图片的的压缩质量，50-100(int)，默认：100
         * 参数2 回调函数
         */
        setStitchCapture: function setStitchCapture() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if (!params.url) return;
            avPublishInterface.setStitchCapture(params.url, params.interval || 10, params.height || 100, params.compress || 100, fn);
        },
        /**
         * 设置图象采集设备贞率
         * 参数1 贞率
         * 参数2 回调函数
         */
        setDevicefps: function setDevicefps() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var fps = args.shift() || lastArg;
            if (!fps) return;
            avPublishInterface.setResourceVideoDevice(1, fps, fn);
        },
        /**
         * 设置图象采集设备分辨率
         * 参数1 分辨率
         * 参数2 回调函数
         */
        setDeviceResolution: function setDeviceResolution() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var resolution = args.shift() || lastArg;
            if (!resolution) return;
            avPublishInterface.setResourceVideoDevice(2, resolution, fn);
        },
        /**
         * 设置timeline文件存放路径
         * 参数1 timeline文件路径；（必填）
         * 参数2 回调函数
         */
        setTimelineFile: function setTimelineFile() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var path = args.shift() || lastArg;
            if (!path) return;
            avPublishInterface.setPPTIndexInfo(1, path, fn);
        },
        /**
         * 设置教室名称
         * 参数1 教室名称；（必填）
         * 参数2 回调函数
         */
        setClassroomName: function setClassroomName() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var classroomName = args.shift() || lastArg;
            avPublishInterface.setPPTIndexInfo(2, classroomName, fn);
        },
        /**
         * 设置流量统计参数，统计结果主动抛给页面
         * time 设置插件统计时长
         * interval 设置插件向页面抛出时长
         * 参数2 回调函数
         */
        setTrafficStatisticParam: function setTrafficStatisticParam() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            avPublishInterface.setTrafficStatistic(isNaN(params.time) ? 3000 : +params.time, isNaN(params.interval) ? 3000 : +params.interval, fn);
        },
        /**
         * 移除台标
         * id 代表使用哪个拼接器  0:电影拼接器 100:观摩拼接器 150:预监拼接器；
         * index 台标索引值；（必填）
         * 参数2 回调函数
         */
        removeLogo: function removeLogo() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if (void 0 === params.index) return;
            avPublishInterface.removeLogoSubtitle(1, params.id || 0, params.index, fn);
        },
        /**
         * 移除字幕
         * id 代表使用哪个拼接器  0:电影拼接器 100:观摩拼接器 150:预监拼接器；
         * index 字幕索引值；（必填）
         * 参数2 回调函数
         */
        removeSubtitle: function removeSubtitle() {
            var args = [].slice.call(arguments, 0),
                fn = null,
                params = {},
                lastArg = args.pop();
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            params = args.shift() || lastArg || {};
            if (void 0 === params.index) return;
            avPublishInterface.removeLogoSubtitle(1, params.id || 0, params.index, fn);
        },
        /**
         * 使用片头
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        useMovieHead: function useMovieHead() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var headFile = args.shift() || lastArg;
            if (!headFile) return;
            avPublishInterface.setMovieHeadTail(1, 1, headFile, fn);
        },
        /**
         * 使用片尾
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        useMovieTail: function useMovieTail() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var tailFile = args.shift() || lastArg;
            if (!tailFile) return;
            avPublishInterface.setMovieHeadTail(2, 1, tailFile, fn);
        },
        /**
         * 不使用片头
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        abandonMovieHead: function abandonMovieHead() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var headFile = args.shift() || lastArg;
            if (!headFile) return;
            avPublishInterface.setMovieHeadTail(1, 0, headFile, fn);
        },
        /**
         * 不使用片头
         * 参数1 片头文件路径；（必填）
         * 参数2 回调函数
         */
        abandonMovieTail: function abandonMovieTail() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var tailFile = args.shift() || lastArg;
            if (!tailFile) return;
            avPublishInterface.setMovieHeadTail(2, 0, tailFile, fn);
        },
        /**
         * 拉近焦距
         * 参数1 机位索引
         * 参数2 回调函数
         */
        closerFocus: function closerFocus() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(1, index || 0, 1, fn);
        },
        /**
         * 释放变焦
         * 参数1 机位索引
         * 参数2 回调函数
         */
        fixFocus: function fixFocus() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(1, index || 0, 0, fn);
        },
        /**
         * 拉远焦距
         * 参数1 机位索引
         * 参数2 回调函数
         */
        furtherFocus: function furtherFocus() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(1, index || 0, 2, fn);
        },
        /**
         * 变倍变小
         * 参数1 机位索引
         * 参数2 回调函数
         */
        minifyFocal: function minifyFocal() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(2, index || 0, 1, fn);
        },
        /**
         * 停止变倍
         * 参数1 机位索引
         * 参数2 回调函数
         */
        fixFocal: function fixFocal() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(2, index || 0, 0, fn);
        },
        /**
         * 变倍变大
         * 参数1 机位索引
         * 参数2 回调函数
         */
        largenFocal: function largenFocal() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(2, index || 0, 2, fn);
        },
        /**
         * 使用鼠标滚轮变焦
         * zoom 滚轮滚动幅度
         * index 机位索引
         * 参数2 回调函数
         */
        setWheelZoom: function setWheelZoom() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.zoom || isNaN(params.zoom)) return;
            avPublishInterface.setDirectorControl(3, params.index || 0, params.zoom, fn);
        },
        /**
         * 画面向上调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraUp: function setCameraUp() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index || 0, 1, fn);
        },
        /**
         * 画面向下调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraDowm: function setCameraDowm() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index || 0, 2, fn);
        },
        /**
         * 画面向左调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraLeft: function setCameraLeft() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index || 0, 3, fn);
        },
        /**
         * 画面向右调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraRight: function setCameraRight() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index || 0, 4, fn);
        },
        /**
         * 停止画面调整
         * 参数1 机位索引
         * 参数2 回调函数
         */
        setCameraFix: function setCameraFix() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg;
            avPublishInterface.setDirectorControl(4, index || 0, 0, fn);
        },
        /**
         * 设置预置位
         * index 机位索引
         * preset 预置位
         * 参数2 回调函数
         */
        setPreset: function setPreset() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (void 0 === params.preset) return;
            avPublishInterface.setDirectorControl(5, params.index || 0, params.preset, fn);
        },
        /**
         * 鼠标点击跟踪
         * posx 鼠标点击画面的x坐标，向对画面左上角 （必须）
         * posy 鼠标点击画面的y坐标，向对画面左上角 （必须）
         * width 画面宽度 （必须）
         * height 画面高度 （必须）
         * index 机位索引 （必须）
         * 参数2 回调函数
         */
        mouseClickTrack: function mouseClickTrack() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (void 0 === params.posx || isNaN(params.posx) || void 0 === params.posy || isNaN(params.posy) || void 0 === params.width || isNaN(params.width) || void 0 === params.height || isNaN(params.height)) return;
            avPublishInterface.setDirectorControl(6, params.index || 0, [params.posx, params.posy, params.width, params.height], fn);
        },
        /**
         * 设置导播模式
         * 参数1 导播模式 1=自动  2=手动  3=半自动1 4=半自动2（柯桥）
         * 参数2 回调函数
         */
        setDirectorMode: function setDirectorMode() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var mode = args.shift() || lastArg;
            if (isNaN(mode)) return;
            avPublishInterface.setDirectorControl(7, 0, +mode || 1, fn);
        },
        /**
         * 设置画面进入的特效
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * styleIndex 特效索引 0：无特效 1：从左上角渐入 2：从右上角渐入 3：从左下角渐入 4：从右下角渐入 5：水平从中间向左右拉幕 6：竖直从中间向上下拉幕 7：水平从左往右渐入 8：竖直从上往下渐入 9：中间向四周散开 10：淡入淡出
         * 参数2 回调函数
         */
        setScreenShiftStyle: function setScreenShiftStyle() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(1, params.id || 0, params.styleIndex || 0, fn);
        },
        /**
         * 设置画面拼接模式
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * mode 拼接模式索引 1=全屏模式，2=画中画模式，3=画外画模式，4=对话模式 ， 5=自定义模式
         * 参数2 回调函数
         */
        setSplitMode: function setSplitMode() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(2, params.id || 0, Number(!params.mode || isNaN(params.mode) ? 1 : params.mode), fn);
        },
        /**
         * 当画面拼接模式是画中画、画外画时，设置小画面的位置，其它拼接模式下此接口无效
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * site 1左上/2右上/3左下/4右下
         * 参数2 回调函数
         */
        setSmallScreenSite: function setSmallScreenSite() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(3, params.id || 0, params.site || 4, fn);
        },
        /**
         * 设置画中画/画外画的排列组合
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * list 一个二维数组，代表每大画面情况下小画面的拼接顺序（必须）
         * 参数2 回调函数
         */
        setSmallScreenSequence: function setSmallScreenSequence() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.list) return;
            avPublishInterface.setStitchVideo(4, params.id || 0, params.list, fn);
        },
        /**
         * 设置对话模式的高亮
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * which 高亮哪一边，left：高亮左边，right：高亮右边，none或空：取消高亮
         * 参数2 回调函数
         */
        setHighLight: function setHighLight() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                map = { left: 1, right: 2, none: 0 },
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(5, params.id || 0, map[params.which || "none"], fn);
        },
        /**
         * 设置对话模式的高亮哪个机位
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * index 机位索引
         * 参数2 回调函数
         */
        setHighLightCamera: function setHighLightCamera() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setStitchVideo(6, +(params.id || 0), +(params.index || 0), fn);
        },
        /**
         * 设置主画面索引值
         * 参数1 主画面索引值
         * 参数2 回调函数
         */
        setMainScreenIndex: function setMainScreenIndex() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index = args.shift() || lastArg || 1;
            avPublishInterface.setStitchVideo(8, 0, +index, fn);
        },
        /**
         * 设置扩展屏画面索引值
         * 参数1 扩展屏画面索引值
         * 参数2 回调函数
         */
        setExtansionScreenIndex: function setExtansionScreenIndex() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var index;
            var value = args.shift();
            if (!isNaN(value)) {
                index = value;
            } else {
                index = value || lastArg || 1;
            }
            avPublishInterface.setStitchVideo(8, 200, +index, fn);
        },
        /**
         * 设置用户自定义画面拼接规则
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * rule 拼接规则
         * 参数2 回调函数
         */
        setCustSplitInfo: function setCustSplitInfo() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.rule) return;
            avPublishInterface.setStitchVideo(9, params.id || 0, params.rule, fn);
        },
        /**
         * 启用台标
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * logo.id 标识，如果同时存在多个台标，用于区分不同的台标对象(根据业务需要自己生成，移除台标时使用)
         * logo.filePath 台标文件路径
         * logo.widthScale 台标宽度，相对于视频分辨率的百分比，范围0至1
         * logo.heightScale 台标高度，相对于视频分辨率的百分比，范围0至1
         * logo.position 台标所处位置：1左上/2右上/3左下/4右下
         * logo.x 台标所处位置与左右边的距离
         * logo.y 台标所处位置与上下边的距离
         * 参数2 回调函数
         */
        useLogo: function useLogo() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.logo || void 0 === params.logo.id) return;
            params.logo.switch = 1;
            params.logo.position = params.logo.position || 1;
            avPublishInterface.setStitchVideo(10, +params.id || 0, JSON.stringify(params.logo), fn);
        },
        /**
         * 取消启用台标
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * logo.id 标识，启用台标里生成的
         * 参数2 回调函数
         */
        abandonLogo: function abandonLogo() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.logo || void 0 === params.logo.id) return;
            params.logo.switch = 0;
            avPublishInterface.setStitchVideo(10, params.id || 0, JSON.stringify(params.logo), fn);
        },
        /**
         * 启用字幕
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * subtitle.id 标识，如果同时存在多个台标，用于区分不同的台标对象(根据业务需要自己生成，移除字幕时使用)
         * subtitle.content 字幕内容
         * subtitle.direction 字幕方向，字幕方向1=横向  2=纵向
         * subtitle.position 字幕位置，1=上/左 2=下/右
         * subtitle.x 字幕所处位置与左右边的距离
         * subtitle.y 字幕所处位置与上下边的距离
         * subtitle.scrollDirection 字幕滚动方向 0=不滚动 1=向上 2=向下 3=向左 4=向右
         * subtitle.scrollCount 滚动次数，scrollDirection不为0时有效，值为-1时表示一直滚动
         * subtitle.fontName 字体名称
         * subtitle.fontSize 字体大小
         * subtitle.fontStyle 字体样式，第1个表示是否倾斜， 第2个表示是否下划线，第3个表示是否加粗，（用","分割）
         * subtitle.fontColor 字体透明度和颜色，ARGB，（用","分割）
         * subtitle.backgroundColor 背景透明度和颜色，ARGB，（用","分割）
         * 参数2 回调函数
         */
        useSubtitle: function useSubtitle() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null,
                defaultParams = {
                switch: 1,
                direction: 1,
                position: 1,
                scrollDirection: 0,
                fontName: "宋体",
                fontSize: 24,
                italic: false,
                underline: false,
                bold: false,
                fontColor: "1,0,0,0",
                backgroundColor: "0,0,0,0"
            };
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.subtitle || void 0 === params.subtitle.id || void 0 === params.subtitle.content || 0 === params.subtitle.content.length) return;
            var subtitleInfo = Object.assign(defaultParams, params.subtitle);
            subtitleInfo.fontStyle = [Boolean(subtitleInfo.italic), Boolean(subtitleInfo.underline), Boolean(subtitleInfo.bold)];
            subtitleInfo.fontColor = subtitleInfo.fontColor.split(",").map(function (item) {
                return +item;
            });
            subtitleInfo.backgroundColor = subtitleInfo.backgroundColor.split(",").map(function (item) {
                return +item;
            });
            avPublishInterface.setStitchVideo(11, params.id || 0, JSON.stringify(subtitleInfo), fn);
        },
        /**
         * 取消启用字幕
         * id 代表使用哪个拼接器 0:电影拼接器 100:观摩拼接器 150:预监拼接器 （必须）
         * subtitle.id 标识，启用字幕时生成的
         * 参数2 回调函数
         */
        abandonSubtitle: function abandonSubtitle() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (!params.subtitle || void 0 === params.subtitle.id) return;
            params.subtitle.switch = 0;
            avPublishInterface.setStitchVideo(11, params.id || 0, JSON.stringify(params.subtitle), fn);
        },
        /**
         * 获取磁盘剩余空间
         * 参数1 磁盘地址
         * 参数2 回调函数
         */
        getDiskFreeSpace: function getDiskFreeSpace() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var disk = args.shift() || lastArg;
            if (!disk) return;
            avPublishInterface.getSystemInfo(1, disk, fn);
        },
        /**
         * 获取磁盘剩余空间可录制时长
         * 参数1 磁盘地址
         * 参数2 回调函数
         */
        getRecordFreeTime: function getRecordFreeTime() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var disk = args.shift() || lastArg;
            if (!disk) return;
            avPublishInterface.getSystemInfo(2, disk, fn);
        },
        /**
         * 获取录制文件时长
         * 参数1 录制文件地址
         * 参数2 回调函数
         */
        getRecordTime: function getRecordTime() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var recordFile = args.shift() || lastArg;
            if (!recordFile) return;
            avPublishInterface.getSystemInfo(3, recordFile, fn);
        },
        /**
         * 获取系统麦克风音量
         * 参数1 回调函数
         */
        getMicrophoneValue: function getMicrophoneValue() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.getSystemInfo(4, void 0, fn);
        },
        /**
         * 获取系统扬声器音量
         * 参数1 回调函数
         */
        getLoudspeakerValue: function getLoudspeakerValue() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.getSystemInfo(5, void 0, fn);
        },
        /**
         * 设置自动插件自动更新地址
         * 参数1 新插件地址
         * 参数2 回调函数
         */
        setUpdatePluginUrl: function setUpdatePluginUrl() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var url = args.shift() || lastArg;
            if (!url) return;
            avPublishInterface.setUpdatePlugin(1, url, fn);
        },
        /**
         * 运行插件
         * 参数1 回调函数
         */
        run: function run() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(1, fn);
        },
        /**
         * 停止插件
         * 参数1 回调函数
         */
        stop: function stop() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(2, fn);
        },
        /**
         * 停止VNC
         * 参数1 回调函数
         */
        stopVNC: function stopVNC() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(3, fn);
        },
        /**
         * 打开PPT
         * 参数1 回调函数
         */
        openPPT: function openPPT() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(4, fn);
        },
        /**
         * 暂停PPT
         * 参数1 回调函数
         */
        pausePPT: function pausePPT() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(5, fn);
        },
        /**
         * 关闭PPT
         * 参数1 回调函数
         */
        closePPT: function closePPT() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setProgramState(6, fn);
        },
        /**
         * 打开VNC
         * 参数1 回调函数
         */
        startVNC: function startVNC() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var ip = args.shift() || lastArg;
            if (!ip) return;
            avPublishInterface.startVNCBBT(1, ip, fn);
        },
        /**
         * 打开班班通电脑的浏览器
         * 参数1 地址，浏览器会打开指定地址
         * 参数2 回调函数
         */
        openBBTBrowser: function openBBTBrowser() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var url = args.shift() || lastArg;
            if (!url) return;
            avPublishInterface.startVNCBBT(2, url, fn);
        },
        /**
         * 关闭班班通电脑的浏览器
         * 参数1 回调函数
         */
        closeBBTBrowser: function closeBBTBrowser() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(2, 0, fn);
        },
        /**
         * 放大班班通电脑的浏览器
         * 参数1 回调函数
         */
        enlargeBrowser: function enlargeBrowser() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(2, 1, fn);
        },
        /**
         * 缩小班班通电脑的浏览器
         * 参数1 回调函数
         */
        reduceBrowser: function reduceBrowser() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(2, 2, fn);
        },
        /**
         * 班班通PPT向前翻页
         * 参数1 回调函数
         */
        pageUp: function pageUp() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(1, -1, fn);
        },
        /**
         * 班班通PPT向后翻页
         * 参数1 回调函数
         */
        pageDn: function pageDn() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setBBTControl(1, 1, fn);
        },
        /**
         * 开始录制
         * 参数1 回调函数
         */
        startRecord: function startRecord() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setRecordState(2, fn);
        },
        /**
         * 暂停录制
         * 参数1 回调函数
         */
        pauseRecord: function pauseRecord() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setRecordState(1, fn);
        },
        /**
         * 停止录制
         * 参数1 回调函数
         */
        stopRecord: function stopRecord() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            avPublishInterface.setRecordState(0, fn);
        },
        /**
         * 是否预览
         * has 是否预览
         */
        set hasPreview(has) {
            avPublishInterface.setGeneralFunction(1, has);
        },
        /**
         * 设置虚拟机位个数
         * 参数1 虚拟机位个数
         * 参数2 回调函数
         */
        setVirtualCameraCount: function setVirtualCameraCount() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var count = args.shift() || lastArg;
            if (isNaN(count)) return;
            avPublishInterface.setGeneralFunction(2, count, fn);
        },
        /**
         * 打开系统文件夹
         * 参数1 件夹路径
         * 参数2 回调函数
         */
        openSystemFolder: function openSystemFolder() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var url = args.shift() || lastArg;
            if (!url) return;
            avPublishInterface.setGeneralFunction(3, url, fn);
        },
        /**
         * 设置麦克风音量
         * 参数1 音量
         * 参数2 回调函数
         */
        setMicrophoneValue: function setMicrophoneValue() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = 0;
            }
            var value = args.shift() || lastArg;
            if (isNaN(value)) return;
            avPublishInterface.setGeneralFunction(4, value, fn);
        },
        /**
         * 设置扩音器音量
         * 参数1 音量
         * 参数2 回调函数
         */
        setLoudspeakerValue: function setLoudspeakerValue() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = 0;
            }
            var value = args.shift() || lastArg;
            if (isNaN(value)) return;
            avPublishInterface.setGeneralFunction(5, value, fn);
        },
        /**
         * 设置用户唯一标示
         * 参数1 用户id
         * 参数2 回调函数
         */
        setUserId: function setUserId() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var userId = args.shift() || lastArg;
            if (!userId) return;
            avPublishInterface.setGeneralFunction(6, userId, fn);
        },
        //关机
        closeComputer: function closeComputer() {
            avPublishInterface.setGeneralFunction(7, 1);
        },
        //重起计算机
        restartComputer: function restartComputer() {
            avPublishInterface.setGeneralFunction(7, 2);
        },
        /**
         * 设置音量
         * 参数1 音量
         * 参数2 回调函数
         */
        setVolume: function setVolume() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var d = args.shift() || lastArg;
            if (void 0 == d) return;
            avPublishInterface.setGeneralFunction(8, d, fn);
        },
        /**
         * 开启扩展屏
         * fn 回调函数
         */
        openExtansionScreen: function openExtansionScreen(fn) {
            avPublishInterface.setGeneralFunction(9, 1, fn);
        },
        /**
         * 关闭扩展屏
         * fn 回调函数
         */
        closeExtansionScreen: function closeExtansionScreen(fn) {
            avPublishInterface.setGeneralFunction(9, 0, fn);
        },
        /**
         * 设置对话模式的初始值
         * left 左半个画面的机位索引
         * right 右半个画面的机位索引
         * 参数2 回调函数
         */
        setDefaultConversation: function setDefaultConversation() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (void 0 === params.left || void 0 === params.right) return;
            avPublishInterface.setConversationArray(params, fn);
        },
        //开始服务器端录制
        startServerRecord: function startServerRecord() {
            var args = [].slice.call(arguments, 0),
                fn = args.pop();
            avPublishInterface.setServerRecordState(2, fn);
        },
        //暂停服务器端录制
        pauseServerRecord: function pauseServerRecord() {
            var args = [].slice.call(arguments, 0),
                fn = args.pop();
            avPublishInterface.setServerRecordState(1, fn);
        },
        //停止服务器端录制
        stopServerRecord: function stopServerRecord() {
            var args = [].slice.call(arguments, 0),
                fn = args.pop();
            avPublishInterface.setServerRecordState(0, fn);
        },
        /**
         * 设置预览参数
         * index 机位索引(int) 0:stitch 1~6:resource  100:visitor
         * name 显示的设备名称
         * 参数2 回调函数
         */
        setPreview: function setPreview() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if ("[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avPublishInterface.setConversationArray(params.index || 0, params.name, fn);
        }
    };
    var plugin = {
        wsPublish: wsPublish,
        avPublish: avPublish
    };
    !duang ? window.plugin = Object.assign(window.plugin || {}, plugin) : function () {
        duang.module("Tool", []).directive("PublishPlugin", ["tool"], function () {
            return plugin;
        });
    }();
})(function () {
    return window.duang || null;
});

/***/ }),
/* 8 */
/*!*************************************!*\
  !*** ./src/codyy/receive_plugin.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


;(function (fn, undefined) {
    "use strict";

    var receivePluginTab = [],
        receivePluginObj = {},
        _receivePluginObj = {},
        cameras = {},
        audios = {},
        number = 1,
        receiveVersion = "",
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang ? duang.getModule("Tool").getController("tool") : window.tool,
        custEvent = new tool.constructor.CustomerEvent(),
        url = ("https:" === location.protocol ? "wss://localhost:9099" : "ws://localhost:9098") + "/receive";
    var eventMap1 = {
        1: "OnCPUWatch",
        2: "OnGPUWatch",
        3: "OnMemoryWatch"
    };
    var eventMap = {
        1101: "OnRateWatch",
        1102: "OnDisConnect",
        1103: "OnFunctionResult",
        1104: "OnStateMessage",
        1105: eventMap1,
        1106: "OnStreamResolution"
    };
    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };
    var addEvent = window.addEventListener ? function (target, type, fn, use) {
        target.addEventListener(type, fn, use || false);
    } : function (target, fn, type) {
        target.attachEvent("on" + type, fn);
    };
    var eventHandle = {
        1999: function _(data) {
            receiveVersion = data.version;
        }
    };
    //获取所有音视频设备，包括虚拟设备
    mediaDevice.addEvent("OnReady", function () {
        var devices = mediaDevice.getAllVideos();
        devices.forEach(function (device) {
            if (/Codyy\w+\((\d+)\)/.test(device.label)) {
                if ("videoinput" === device.kind) {
                    cameras[RegExp.$1] = device;
                }
            }
        });
    });
    var Pip = function Pip() {
        var self = this,
            state = 0,
            //0为初始化，1为执行中，2为执行完毕，-1为出现bug
        taskList = [];
        function __Pip__() {}
        __Pip__.prototype = {
            constructor: __Pip__,
            pip: function pip() {
                if (1 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            then: function then() {
                if (1 === state || -1 === state || 2 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            exec: function exec() {
                state = 1;
                if (taskList.length > 0) {
                    try {
                        run(taskList[0]);
                    } catch (e) {
                        state = -1;
                        console.error(e);
                    }
                }
            }
        };
        function run() {
            var args = arguments[0],
                fName = args.shift(),
                fn = args.pop();
            if ("[object Function]" === toString.call(fName) && void 0 === fn) return fName();
            if ("[object String]" != toString.call(fName) || !self[fName]) throw "no function name";
            if ("[object Function]" != toString.call(fn)) {
                fn && args.push(fn);
                fn = null;
            }
            args.push(function () {
                fn && fn.apply(this, [].slice.call(arguments, 0));
                taskList.shift();
                taskList.length > 0 && run(taskList[0]);
            });
            return self[fName] && self[fName].apply(self, args);
        }
        return new __Pip__();
    };
    function linkVideo(params, callback) {
        var self = this,
            camera = cameras[params.cameraId || number++];
        var constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                deviceId: {}
            }
        };
        var _linkVideo = function _linkVideo() {
            try {
                constraints.video.deviceId = { exact: camera.deviceId };
                if (self.stream) {
                    self.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                navigator.mediaDevices.getUserMedia(constraints).then(function (_stream) {
                    self.stream = _stream;
                    params.video.onloadstart = function () {
                        var time = 20;
                        var inter = setInterval(function () {
                            params.video.srcObject.getTracks().forEach(function (track) {
                                if (!track.onmute) {
                                    track.onmute = function () {
                                        params.video.load();
                                    };
                                }
                            });
                            time--;
                            if (time == 0) {
                                clearInterval(inter);
                            }
                        }, 1000);
                    };
                    params.video.srcObject = _stream;
                    "[object Function]" === toString.call(callback) && callback();
                });
            } catch (e) {
                console.error(e.message);
            }
        };
        if (camera) {
            _linkVideo();
        } else {
            console.error("未获取到相关设备！");
        }
    }
    //================接收插件开始=======================================================
    function AvReceive(params, server) {
        if (!this instanceof AvReceive) {
            return new AvReceive(params);
        }
        this.name = "AvReceive";
        var self = this;
        var bindEvent = function bindEvent() {
            var tracks = self.stream.getTracks();
            tracks.forEach(function (track) {
                /*track.onmute = function() {
                    //流中断
                    params.video.load();
                    self.fireEvent({type: "OnBreak", message: {type: track.kind, id: self.id, video: params.video}});
                };*/
            });
        };
        this.id = params.id || tool.random(10);
        this.taskList = [];
        linkVideo.call(self, params, bindEvent);
        this.addEvent = custEvent.addCustEvent;
        this.removeEvent = custEvent.removeCustEvent;
        this.fireEvent = custEvent.fire;
        this.handles = [];
        if (params.background) {
            params.video.style.background = "center contain no-repeat content-box url(" + params.background + ")";
        }
        params.video.setAttribute("autoplay", "autoplay");
        this.setVideoElement = function (video) {
            params.video = video;
            linkVideo.call(self, params, bindEvent);
        };
        this.shutdown = function (fn) {
            try {
                if (self.stream) {
                    self.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    fn && fn();
                }
            } catch (e) {
                console.error(e.message);
            }
        };
    }
    AvReceive.prototype = {
        constructor: AvReceive,
        //当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        //参数1 在“wsPublish”中的接口名，string
        //参数2-n 插件需要的参数
        //参数n+1 回调函数
        pip: function pip() {
            var args = [].slice.call(arguments, 0),
                pip = Pip.call(this);
            args.length > 0 && pip.pip.apply(this, args);
            return pip;
        },
        /**
         * 录制
         * fn 回调函数
         */
        ableRecord: function ableRecord(fn) {
            avReceiveInterface.setReceiveRecord(1, this.deviceName, 1, fn);
        },
        /**
         * 不录制
         * fn 回调函数
         */
        disableRecord: function disableRecord(fn) {
            avReceiveInterface.setReceiveRecord(1, this.deviceName, 0, fn);
        },
        /**
         * 设置录制文件类型
         * 参数1 文件类型 flv,mp4
         * 参数2 回调函数
         */
        setRecordFileType: function setRecordFileType() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                map = { flv: 1, mp4: 2 },
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var type = args.shift() || lastArg || "flv";
            avReceiveInterface.setReceiveRecord(2, this.deviceName, map[type], fn);
        },
        /**
         * 设置录制文件类型
         * 参数1 是否appending ture/false
         * 参数2 回调函数
         */
        setRecordAppending: function setRecordAppending() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var appending = args.shift() || lastArg || 1;
            avReceiveInterface.setReceiveRecord(3, this.deviceName, Number(appending), fn);
        },
        /**
         * 开始录制
         * fn 回调函数
         */
        startRecord: function startRecord(fn) {
            avReceiveInterface.setReceiveRecord(4, this.deviceName, 2, fn);
        },
        /**
         * 暂停录制
         * fn 回调函数
         */
        paruseRecord: function paruseRecord(fn) {
            avReceiveInterface.setReceiveRecord(4, this.deviceName, 1, fn);
        },
        /**
         * 停止录制
         * fn 回调函数
         */
        stopRecord: function stopRecord(fn) {
            avReceiveInterface.setReceiveRecord(4, this.deviceName, 0, fn);
        },
        /**
         * 设置录制文件全路径
         * 参数1 录制文件全路径
         * 参数2 回调函数
         */
        setRecordFileName: function setRecordFileName() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var fileName = args.shift() || lastArg;
            if (!fileName) return;
            avReceiveInterface.setReceiveRecord(5, this.deviceName, fileName, fn);
        },
        /**
         * 设置录制文件类型，
         * 参数1 文件类型 0=只录制视频  1=只录制音频 2=音视频全录
         * 参数2 回调函数
         */
        setRecordType: function setRecordType() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var type = args.shift() || lastArg || 2;
            avReceiveInterface.setReceiveRecord(6, this.deviceName, type, fn);
        },
        /**
         * 设置接收流名称，
         * 参数1 流名称
         * 参数2 回调函数
         */
        setStreamName: function setStreamName() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var streamName = args.shift() || lastArg;
            if (void 0 === streamName) return;
            avReceiveInterface.setReceiveStream(1, this.deviceName, streamName, fn);
        },
        /**
         * 设置缓冲时长，
         * 参数1 缓冲时长
         * 参数2 回调函数
         */
        setButterTime: function setButterTime() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var time = args.shift() || lastArg;
            avReceiveInterface.setReceiveStream(2, this.deviceName, isNaN(time) ? 0 : time, fn);
        },
        /**
         * 设置接收类型，
         * 参数1 接收类型 0//音视频都不接,1//只接视频, 2//只接音频, 3//音视频都接
         * 参数2 回调函数
         */
        setReceiveType: function setReceiveType() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var type = args.shift();
            type = void 0 === type ? lastArg || 3 : type;
            avReceiveInterface.setReceiveStream(3, this.deviceName, type, fn);
        },
        /**
         * 设置编码器
         * 参数1 编码器 1=CodyyFfmpeg 2=CodyyIntel
         * 参数2 回调函数
         */
        setEncodeType: function setEncodeType() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var encodeType = args.shift() || lastArg || 1;
            avReceiveInterface.setReceiveStream(4, this.deviceName, encodeType, fn);
        },
        /**
         * 设置共享内存名称
         * 参数1 共享内存名称 CodyyMultiHD 插件的OnCreateShareMem事件产生的shareName
         * 参数2 回调函数
         */
        setShareMemoryName: function setShareMemoryName() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var name = args.shift() || lastArg;
            if (void 0 === name) return;
            avReceiveInterface.setReceiveStream(5, this.deviceName, name, fn);
        },
        /**
         * 设置流量统计参数，统计结果主动抛给页面
         * time 设置插件统计时长
         * interval 设置插件向页面抛出时长
         * 参数2 回调函数
         */
        setTrafficStatisticParam: function setTrafficStatisticParam() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {} || 1;
            avReceiveInterface.setTrafficStatistic(this.deviceName, isNaN(params.time) ? 3000 : +params.time, isNaN(params.interval) ? 3000 : +params.interval, fn);
        },
        /**
         * 运行插件
         * fn 回调函数
         */
        run: function run(fn) {
            avReceiveInterface.setProgramState(this.deviceName, 1, fn);
        },
        /**
         * 停止插件
         * fn 回调函数
         */
        stop: function stop(fn) {
            avReceiveInterface.setProgramState(this.deviceName, 2, fn);
        },
        /**
         * 设置共享内存的分辨率大小，该接口需要在设置共享内存名字之前调用
         * width 宽
         * height 高
         * 参数2 回调函数
         */
        setMemoryResolution: function setMemoryResolution() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            avReceiveInterface.setMemoryResolution(this.deviceName, isNaN(params.width) ? 1920 : params.width, isNaN(params.height) ? 1080 : params.height, fn);
        },
        /**
         * 使用扩展屏显示预览，该接口需要在run方法之前调用
         * fn 回调函数
         */
        useExtendScreen: function useExtendScreen(fn) {
            avReceiveInterface.setRenderMode(this.deviceName, 0, fn);
        },
        /**
         * 使用扩展屏显示预览，该接口需要在run方法之前调用
         * switch 音频快播的开关 0/1
         * max 阈值
         * time 持续的时间间隔
         * 参数2 回调函数
         */
        setFastPlayParam: function setFastPlayParam() {
            var args = [].slice.call(arguments, 0),
                lastArg = args.pop(),
                fn = null;
            if (lastArg && "[object Function]" === toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }
            var params = args.shift() || lastArg || {};
            if (void 0 === params.switch || void 0 === params.max || void 0 === params.time) return;
            avReceiveInterface.setMemoryResolution(params.switch, params.max, params.time, fn);
        }
    };
    //================接收插件结束=======================================================
    //================接收插件服务开始=======================================================
    var WSReceive = function () {
        var ws = null;
        var _WSReceive = function _WSReceive(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);
            eventHandle[9999] = function () {
                avReceiveInterface.initReceiveModule(params, function () {
                    var args = [].slice.call(arguments, 0);
                    callback1 && callback1.apply(ws, args);
                });
            };
            ws.onopen = function () {
                self.state = this.readyState;
                eventHandle[9999]();
            };
            ws.onmessage = function () {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = JSON.parse(tool.decodeBase64(arg.data));
                if (data.uuid) {
                    callbackMap[data.uuid] && callbackMap[data.uuid].call(self, data);
                    delete callbackMap[data.uuid];
                } else {
                    if (eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };
            ws.onclose = function (e) {
                self.state = this.readyState;
                if (1000 === e.code) return;

                switch (e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({ type: "OnError", message: { code: e.code, message: errorMessageMap[e.code] } });
                        break;
                    default:
                        _WSReceive.call(self, params, null, callback2);
                }
            };
        };
        var _send = function _send(msg) {
            ws.send(msg);
        };
        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send
        }, { init: {
                writable: false,
                configurable: false,
                enumerable: false,
                value: _WSReceive
            } });
        return obj;
    }();
    //================接收插件服务结束=======================================================
    var avReceiveInterface = {
        //与服务器连接成功后,启动接收模块
        initReceiveModule: function initReceiveModule(params, fn) {
            var deviceList = params.deviceList || [];
            if (deviceList.length <= 0) return;
            var config = {
                method: 1001,
                delayExitTime: params.delayExitTime || 0,
                param: {
                    deviceList: deviceList
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置录制相关信息
        setReceiveRecord: function setReceiveRecord(key, deviceName, value, fn) {
            var config = {
                method: 1002,
                param: {
                    key: key,
                    deviceName: deviceName,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置发送相关信息
        setReceiveStream: function setReceiveStream(key, deviceName, value, fn) {
            var config = {
                method: 1003,
                param: {
                    key: key,
                    deviceName: deviceName,
                    value: value
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置流量监测功能参数
        setTrafficStatistic: function setTrafficStatistic(deviceName, time, interval, fn) {
            var config = {
                method: 1004,
                param: {
                    deviceName: deviceName,
                    time: time,
                    eventInterval: interval
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置程序运行状态
        setProgramState: function setProgramState(deviceName, key, fn) {
            var config = {
                method: 1005,
                param: {
                    key: key,
                    deviceName: deviceName
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置共享内存分辨率
        setMemoryResolution: function setMemoryResolution(deviceName, width, height, fn) {
            var config = {
                method: 1007,
                param: {
                    deviceName: deviceName,
                    width: width,
                    height: height
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置预览的模式(是否使用扩展屏显示)
        setRenderMode: function setRenderMode(deviceName, mode, fn) {
            var config = {
                method: 1008,
                param: {
                    deviceName: deviceName,
                    mode: mode
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //设置音频快播的参数
        setFastPlayParam: function setFastPlayParam(_switch, max, time, fn) {
            var config = {
                method: 1009,
                param: {
                    fastPlaySwitch: _switch,
                    thresholdValue: max,
                    keepThresholdTime: time
                }
            };
            var uuid = tool.random(20);
            config.uuid = uuid;
            if (fn && "[object Function]" === toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSReceive.send(tool.encodeBase64(JSON.stringify(config)));
        }
    };
    //接收插件初始化接口
    //此接口对外，供业务层调用初始化接收插件
    //不包括插件服务的初始化
    var avReceive = {
        init: function init(params) {
            if (void 0 === params || !params.video) return;
            var plugin = new AvReceive(params, WSReceive);
            receivePluginTab.push(plugin);
            plugin.deviceName = params.deviceName || "";
            if (void 0 !== params.id) receivePluginObj[params.id] = plugin;
            if (void 0 !== params.deviceName) _receivePluginObj[plugin.deviceName] = plugin;
            return plugin;
        },
        getPluginByIndex: function getPluginByIndex(index) {
            index = index || 0;
            return receivePluginTab[index];
        },
        getPluginById: function getPluginById(id) {
            if (void 0 === id) return;
            return receivePluginObj[id];
        }
    };
    //接收插件服务相关接口
    //此接口对外，供业务层调用初始化插件服务
    var wsReceive = {
        init: function init(params, callback) {
            if (void 0 === params) return;
            var self = this;
            return WSReceive.init.call(WSReceive, params, callback, function () {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key ? eventMap[data.event][data.param.key] : eventMap[data.event];
                data.param ? delete data.param.key : data.param = "";
                if (eventName) {
                    if (data.param.deviceName) {
                        var receivePlugin = _receivePluginObj[data.param.deviceName];
                        receivePlugin && receivePlugin.fireEvent({ type: eventName, message: data.param });
                    } else {
                        this.fireEvent({ type: eventName, message: data.param });
                    }
                }
            });
        },
        get state() {
            return WSReceive.state;
        },
        addEvent: function addEvent(type, callback) {
            if (void 0 === type || void 0 === callback) return;
            WSReceive.addEvent(type, callback);
        },
        removeEvent: function removeEvent(type, fn) {
            if (void 0 === type) return;
            WSReceive.removeEvent(type, fn);
        },
        get version() {
            return receiveVersion;
        }
    };
    var plugin = {
        wsReceive: wsReceive,
        avReceive: avReceive
    };
    !duang ? window.plugin = Object.assign(window.plugin || {}, plugin) : function () {
        duang.module("Tool", []).directive("ReceivePlugin", ["tool"], function () {
            return plugin;
        });
    }();
})(function () {
    return window.duang || null;
});

/***/ }),
/* 9 */
/*!*************************************!*\
  !*** ./src/codyy/preview_plugin.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 *
 * date: 2018-04-03
 * author: Jason
 * fileName: index.js
 * describe: 预览插件，主要是用来做本地画面预览
 *
 *
 */
;(function (fn, undefined) {
    "use strict";

    var plugin = {},
        cameras = {},
        streamMap = {},
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang ? duang.getModule("Tool").getController("tool") : window.tool,
        url = ("https:" === location.protocol ? "wss://localhost:9099" : "ws://localhost:9098") + "/preview";

    var eventMap3 = {
        1: "OnCameraBack",
        2: "OnMicrophoneBack",
        3: "OnLoudSpeakerBack",
        4: "OnDiscreteGraphicsCard",
        5: "OnIntegratedGraphicsCard",
        3000: "OnRegister"
    };

    var eventMap = {
        3100: eventMap3,
        3101: "OnSelectDevice",
        3102: eventMap3,
        9999: "OnDisconnect",
        100000000: "OnStop"
    };

    var errorMessageMap = {
        1002: "协议错误",
        1015: "证书错误"
    };

    var eventHandle = {};

    var addEvent = window.addEventListener ? function (target, type, fn, use) {
        target.addEventListener(type, fn, use || false);
    } : function (target, fn, type) {
        target.attachEvent("on" + type, fn);
    };

    var Pip = function Pip() {
        var self = this,
            state = 0,
            //0为初始化，1为执行中，2为执行完毕，-1为出现bug
        taskList = [];

        function __Pip__() {}

        __Pip__.prototype = {
            constructor: __Pip__,
            pip: function pip() {
                if (1 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            then: function then() {
                if (1 === state || -1 === state || 2 === state) return;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            exec: function exec() {
                state = 1;

                if (taskList.length > 0) {
                    try {
                        run(taskList[0]);
                    } catch (e) {
                        state = -1;
                        console.error(e);
                    }
                }
            }
        };

        function run() {
            var args = arguments[0],
                fName = args.shift(),
                fn = args.pop();

            if ("[object String]" != toString.call(fName) || !self[fName]) throw "no function name";

            if ("[object Function]" != toString.call(fn)) {
                fn && args.push(fn);
                fn = null;
            }

            args.push(function () {
                fn && fn.apply(this, [].slice.call(arguments, 0));
                taskList.shift();
                taskList.length > 0 && run(taskList[0]);
            });

            return self[fName] && self[fName].apply(self, args);
        }

        return new __Pip__();
    };

    //获取所有音视频设备，包括虚拟设备
    mediaDevice.addEvent("OnReady", function () {
        var devices = mediaDevice.getAllVideos();

        devices.forEach(function (device) {
            if (/Codyy\w+\((\d+)\)/.test(device.label)) {
                if ("videoinput" === device.kind) {
                    cameras[RegExp.$1] = device;
                }
            }
        });
    });

    var WSPreview = function () {
        var ws = null,
            custEvent = new tool.constructor.CustomerEvent();

        var _WSPreview = function _WSPreview(callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);

            var initPreviewModule = function initPreviewModule() {
                var config = { method: 3000 };
                WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
            };

            ws.onopen = function () {
                var args = [].slice.call(arguments, 0);
                initPreviewModule();
                callback1 && callback1.apply(ws, args);
            };

            ws.onmessage = function () {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = JSON.parse(tool.decodeBase64(arg.data));

                if (data.uuid) {
                    callbackMap[data.uuid] && callbackMap[data.uuid].call(self, data);
                    delete callbackMap[data.uuid];
                } else {
                    if (eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };

            ws.onclose = function (e) {
                self.state = this.readyState;
                if (1000 === e.code) return callback2.call(obj, { event: 100000000 });

                switch (e.code) {
                    case 1002:
                    case 1015:
                        obj.fireEvent({ type: "OnError", message: { code: e.code, message: errorMessageMap[e.code] } });
                        break;
                    default:
                        _WSPreview.call(self, null, callback2);
                }
            };

            return this;
        };

        var _send = function _send(msg) {
            ws.send(msg);
        };

        var _stop = function _stop() {
            ws.close();
        };

        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send,
            stop: _stop
        }, { init: {
                writable: false,
                configurable: false,
                enumerable: false,
                value: _WSPreview
            } });

        //当插件抛出OnDisconnect事件时，自动重新初始化
        obj.addEvent("OnDisconnect", function () {
            initPreviewModule();
        });

        return obj;
    }();

    function PreviewPlugin() {
        if (!this instanceof PreviewPlugin) {
            return new PreviewPlugin();
        }

        this.name = "PreviewPlugin";
    }

    PreviewPlugin.prototype = {
        constructor: PreviewPlugin,
        //当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        //参数1 在“wsPublish”中的接口名，string
        //参数2-n 插件需要的参数
        //参数n+1 回调函数
        //目前不用，预留接口
        pip: function pip() {
            var pip = Pip.call(this);
            pip.pip.apply(this, [].slice.call(arguments, 0));
            return pip;
        },
        //获取所有摄像头
        getCameras: function getCameras() {
            var config = {
                method: 3001,
                param: {
                    key: 1
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取所有麦克风
        getMicrophones: function getMicrophones() {
            var config = {
                method: 3001,
                param: {
                    key: 2
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取所有扬声器
        getLouderspeakers: function getLouderspeakers() {
            var config = {
                method: 3001,
                param: {
                    key: 3
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //获取所有独立显卡
        getDiscreteGraphics: function getDiscreteGraphics() {
            var config = {
                method: 3001,
                param: {
                    key: 4
                }
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //选择当前设备打开预览
        selectDevice: function selectDevice(params) {
            if (!params) return;

            var config = {
                method: 3002,
                param: params
            };

            WSPreview.send(tool.encodeBase64(JSON.stringify(config)));
        },
        //
        runView: function runView(cameraId, video) {
            if (void 0 === cameraId || !video) return;
            var stream = streamMap[cameraId],
                camera = cameras[cameraId];
            video.setAttribute("autoplay", "autoplay");

            var constraints = {
                audio: false,
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    deviceId: {}
                }
            };

            var _runView = function _runView() {
                try {
                    constraints.video.deviceId = { exact: camera.deviceId };

                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });

                        delete streamMap[cameraId];
                    }

                    navigator.mediaDevices.getUserMedia(constraints).then(function (_stream) {
                        streamMap[cameraId] = _stream;
                        video.srcObject = _stream;
                    });
                } catch (e) {
                    console.error(e.message);
                }
            };

            if (camera) {
                _runView();
            } else {
                console.error("未获取到相关设备！");
            }
        },
        stop: function stop() {
            WSPreview.stop();
        }
    };

    var wsPreview = {
        init: function init(callback) {
            this.addEvent("OnRegister", callback);

            return WSPreview.init.call(WSPreview, null, function () {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key ? eventMap[data.event][data.param.key] : eventMap[data.event];
                data.param ? delete data.param.key : data.param = "";
                eventName && this.fireEvent({ type: eventName, message: data.param });
            });
        },
        addEvent: function addEvent(type, callback) {
            if (void 0 === type || void 0 === callback) return;
            WSPreview.addEvent(type, callback);
        },
        removeEvent: function removeEvent(type) {
            if (void 0 === type) return;
            WSPreview.removeEvent(type);
        },
        get version() {
            return previewVersion;
        }
    };

    var avPreview = {
        init: function init() {
            return new PreviewPlugin();
        }
    };

    plugin = {
        wsPreview: wsPreview,
        avPreview: avPreview
    };

    !duang ? window.plugin = Object.assign(window.plugin || {}, plugin) : function () {
        duang.module("Tool", []).directive("PreviewPlugin", ["tool"], function () {
            return plugin;
        });
    }();
})(function () {
    return !window.duang ? null : window.duang;
});

/***/ }),
/* 10 */
/*!*************************************!*\
  !*** ./src/codyy/wpad/index.min.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var require;var require;

!function e(t, a, n) {
  function i(s, o) {
    if (!a[s]) {
      if (!t[s]) {
        var l = "function" == typeof require && require;if (!o && l) return require(s, !0);if (r) return r(s, !0);var c = new Error("Cannot find module '" + s + "'");throw c.code = "MODULE_NOT_FOUND", c;
      }var d = a[s] = { exports: {} };t[s][0].call(d.exports, function (e) {
        var a = t[s][1][e];return i(a || e);
      }, d, d.exports, e, t, a, n);
    }return a[s].exports;
  }for (var r = "function" == typeof require && require, s = 0; s < n.length; s++) {
    i(n[s]);
  }return i;
}({ 1: [function (e, t, a) {
    !function () {
      "use strict";
      var e = { circular: 0, quadrate: 1 },
          t = null,
          a = null;function n(e) {
        this.name = e.name || "Eraser", this.interimBuffer = [], this.buffer = [];
      }n.prototype = { constructor: n, active: function active() {}, mouseRender: function mouseRender(a) {
          var n = this;a = { type: "eraser", data: [a.x, a.y, n.params.eraserSize], mode: e[n.current.name], from: n.params.id, width: n.mainCanvas.offsetWidth, height: n.mainCanvas.offsetHeight }, t = a, n.mouseRender.call(n, a);
        }, largen: function largen() {
          var e = this,
              a = e.params.eraserSize,
              n = e.mainCanvas.clientWidth,
              i = e.mainCanvas.clientHeight;a++, e.params.eraserSize = Math.min.apply(Math, [a, n, i]), t.data[2] = e.params.eraserSize, e.mouseRender.call(e, t);
        }, lesser: function lesser() {
          var e = this,
              a = e.params.eraserSize;a--, e.params.eraserSize = Math.max.apply(Math, [5, a]), t.data[2] = e.params.eraserSize, e.mouseRender.call(e, t);
        }, bufferRender: function bufferRender(t, n) {
          if (t) {
            var i = this,
                r = { type: "eraser", data: [], status: 1, origin: !0, mode: e[i.current.name], from: i.params.id, width: i.mainCanvas.offsetWidth, height: i.mainCanvas.offsetHeight };!n && a ? (t.ex = a.x, t.ey = a.y) : (t.ex = t.x, t.ey = t.y), t.size = i.params.eraserSize, r.data.push(t), i.render(r), a = t;
          }
        }, render: function render() {}, destory: function destory() {
          this.current.mouseRender.call(this, { x: -1, y: -1 });
        } };var i = window.vm || {};i.module = i.module || {}, i.module.eraser = n, window.vm = i;
    }();
  }, {}], 2: [function (e, t, a) {
    !function () {
      "use strict";
      function e(e) {
        this.name = e.name || "Ferula", this.buffer = [];
      }e.prototype = { constructor: e, active: function active() {}, mouseRender: function mouseRender(e) {
          var t = this;e = { type: "ferula", data: [e.x, e.y], from: t.params.id, width: t.mainCanvas.offsetWidth, height: t.mainCanvas.offsetHeight }, e, t.mouseRender.call(t, e);
        }, destory: function destory() {
          this.current.mouseRender.call(this, { x: -1, y: -1 });
        } };var t = window.vm || {};t.module = t.module || {}, t.module.ferula = e, window.vm = t;
    }();
  }, {}], 3: [function (e, t, a) {
    !function () {
      "use strict";
      function e(e) {
        this.name = e.name || "Image", this.interimBuffer = [], this.buffer = [];
      }e.prototype = { constructor: e, active: function active() {}, renderBuffer: function renderBuffer(e) {
          var t = this;e = { type: "image", data: [e], status: 0, origin: !0, from: t.params.id, width: t.mainCanvas.offsetWidth, height: t.mainCanvas.offsetHeight };t.toolbarMap.image.interimBuffer.push(e);
        }, render: function render(e) {
          if (e) {
            var t = this,
                a = t.toolbarMap.image.interimBuffer.shift();if (a) do {
              a.status = 1, a.data = [].concat.apply(a.data, e), t.toolbarMap.image.buffer.push(a), t.render(a), a = t.toolbarMap.image.interimBuffer.shift();
            } while (a);
          }
        }, destory: function destory() {} };var t = window.vm || {};t.module = t.module || {}, t.module.image = e, window.vm = t;
    }();
  }, {}], 4: [function (e, t, a) {
    !function () {
      "use strict";
      var e = window.vm || {},
          t = Object.prototype.toString,
          a = window.URL || window.webkitURL,
          n = window.CustomEvent,
          i = {},
          r = 0,
          s = [],
          o = /(\bmobile\b|\bandroid\b)/i.test(navigator.userAgent),
          l = /\bfirefox\b/i.test(navigator.userAgent),
          c = /\bMSIE\b/i.test(navigator.userAgent),
          d = /\bchrome\b/i.test(navigator.userAgent),
          u = { click: o ? "touchend" : "click", down: o ? "touchstart" : "mousedown", move: o ? "touchmove" : "mouserun", up: o ? "touchend" : "mouseup", wheel: l ? "DOMMouseScroll" : "mousewheel", fullScreen: c ? "MSFullscreenChange" : d ? "webkitfullscreenchange" : l ? "mozfullscreenchange" : "fullscreenchange" },
          f = { leftTop: "left-top", rightTop: "right-top", rightBottom: "right-bottom", leftBottom: "left-bottom" },
          h = { data: null, noCache: !1, noTab: !1, super: !1, noToolbar: !1, layout: "leftTop", size: "100%", fontSize: 16, vertical: !1, disable: !1, wrap: document.body, autoSaveTime: 10, saveImgStep: 5, color: "#000", background: "#fff", eraserSize: 5, ferulaSize: 5, tabLimit: 20, toolbars: o ? ["pen", "line", "rectangle", "round", "text", "image", "eraser", "export", "clear"] : ["ferula", "pen", "line", "rectangle", "round", "text", "image", "eraser", "export", "clear", "color"] },
          p = { rectangle: ["rectstroke", "rect"], line: ["line", "arrow"], round: ["circle", "roundel", "ellipesstroke", "ellipes"], eraser: ["circular", "quadrate"] },
          m = { ferula: "教鞭", circle: "空心圆", roundel: "实心圆", ellipesstroke: "空心椭圆", rectstroke: "空心矩形", pen: "画笔", circular: "圆形橡皮擦", quadrate: "方形橡皮擦", rect: "实心矩形", ellipes: "实心椭圆", text: "文本", line: "直线", arrow: "箭头", color: "颜色", export: "导出", scissors: "截图", clear: "清空", image: "图片" },
          v = { ferula: "icon-teach-rod", circle: "icon-round-a", roundel: "icon-round-c", ellipesstroke: "icon-ellipse-b", rectstroke: "icon-rectangle-a", pen: "icon-pen", circular: "icon-xiangpica", quadrate: "icon-rubber", rect: "icon-rectangle-c", ellipes: "icon-ellipse-a", text: "icon-font", line: "icon-line", arrow: "icon-arrow", color: "icon-colour", export: "icon-keep", scissors: "icon-screenshot", clear: "icon-empty", image: "icon-pic" },
          g = { 0: "白板", 1: "文档演示" },
          b = '\t\t<div class="pad-wrap @LAYOUT@ @DISABLED@ @NOTOOLBAR@ @NOTAB@">\t\t\t<div class="toolbar-wrap">\t\t\t\t<ul class="toolbar-list">@TOOLBARS@</ul>\t\t\t</div>\t\t\t<div class="can-wrap-outer">\t\t\t\t<div class="can-wrap">\t\t\t\t\t<input type="text" class="text-input tool-input"/>\t\t\t\t\t<canvas class="main-can">抱歉！您的浏览器版本太低，暂时不支持此白板！</canvas>\t\t\t\t\t<canvas class="buffer-can-4"></canvas>\t\t\t\t\t<canvas class="buffer-can-3"></canvas>\t\t\t\t\t<canvas class="buffer-can-2"></canvas>\t\t\t\t\t<canvas class="buffer-can-1"></canvas>\t\t\t\t</div>\t\t\t\t<div class="split-page-wrap"></div>\t\t\t</div>\t\t\t<div class="pad-tab-wrap">\t\t\t\t<ul class="pad-tab-list"></ul>\t\t\t</div>\t\t\t<input type="file" accept="image/png, image/jpeg" class="file-input tool-input"/>\t\t\t<input type="color" class="color-input tool-input"/>\t\t</div>',
          w = '<li class="toolbar-item" title="@TITLE@"><span class="item-icon iconfont @ICONCLASS@" item="@ITEM@" level="@LEVEL@"></span>@CHILDTOOLBARS@</li>',
          y = '<ul class="child-toolbar-list">@CHILDTOOLBARITEM@</ul>',
          C = '\t\t<div class="split-page">\t\t\t<a href="javascript:void(0);" class="pre-page-btn iconfont icon-zuofanye"></a>\t\t\t<a href="javascript:void(0);" class="next-page-btn iconfont icon-youfanye"></a>\t\t\t<span><input type="text" class="page-number-input"/>/@TOTAL@<a href="javascript:void(0);" class="go-page-btn">GO</a></span>\t\t</div>',
          x = '<li class="toolbar-item full-screen-btn-wrap"><span class="item-icon full-screen-btn iconfont icon-enlarge" item="fullScreen"></span></li>';e.module = e.module || {};var E = { addEvent: window.addEventListener ? function (e, t, a, n) {
          e.addEventListener(t, a, n || !1);
        } : function (e, t, a) {
          e.attachEvent("on" + t, a);
        }, delEvent: window.addEventListener ? function (e, t, a, n) {
          e.removeEventListener(t, a, n || !1);
        } : function (e, t, a) {
          e.detachEvent("on" + t, a);
        }, redefineEvent: function redefineEvent(e, t, a, i) {
          var r = a || window,
              s = !1,
              o = function o() {
            if (!s) {
              var e = [].slice.call(arguments, 0)[0] || window.event;s = !0, window.requestAnimationFrame(function () {
                r.dispatchEvent(new n(t, { detail: e })), s = !1;
              });
            }
          };return this.addEvent(r, e, o, i), o;
        }, addClass: function addClass(e, t) {
          void 0 !== e && void 0 !== t && (new RegExp("\\b" + t + "\\b", "g").test(e.className) || (e.className = e.className + " " + t));
        }, removeClass: function removeClass(e, t) {
          if (void 0 !== e && void 0 !== t) {
            var a = new RegExp("\\b" + t + "\\b", "g");a.test(e.className) && (e.className = e.className.replace(a, ""));
          }
        }, preNode: function preNode(e) {
          return e.previousElementSibling || e.previousSibling;
        }, nextNode: function nextNode(e) {
          return e.nextElementSibling || e.nextSibling;
        }, css: function css(e, t, a) {
          e.style[t] = a || "";
        } },
          T = function () {
        var e = [],
            a = document.createElement("DIV"),
            n = '<div class="scroll-x-wrap pad-hide"><span class="scroll-x scroll-toolbar"></span></div>',
            i = '<div class="scroll-y-wrap pad-hide"><span class="scroll-y scroll-toolbar"></span></div>';function r(e) {
          if (!(this instanceof r)) return new r(e);var t = this,
              s = !1,
              l = "x",
              c = { x: 0, y: 0 },
              d = null,
              u = e.node.parentNode;t.params = e, t.events = {}, t.scrollObj = {};var f = function f(r) {
            a.innerHTML = "x" === r ? n : i;var s = a.removeChild(a.firstChild);u.appendChild(s), t.scrollObj[r] = { container: s, toolbar: s.getElementsByClassName("scroll-toolbar")[0] }, "x" === r ? (e.node.clientWidth < e.node.scrollWidth && s.classList.remove("pad-hide"), t.scrollObj[r].left = 0) : (e.node.clientHeight < e.node.scrollHeight && s.classList.remove("pad-hide"), t.scrollObj[r].top = 0);
          };Object.defineProperty(this, "disable", { set: function set(e) {
              s = e;
            }, get: function get() {
              return s;
            } }), e.type ? f(e.type) : (f("x"), f("y"));var h = function h() {
            var a = [].slice.call(arguments, 0),
                n = t.scrollObj[l],
                i = a[0] || window.event;i = o ? i : i.detail ? i.detail : i;if ("x" === l) {
              var r = i.x || i.clientX,
                  s = { type: "x", from: e.id, coverWidth: n.coverWidth, distance: n.left + (r - c.x) };c.x = r;
            } else {
              var d = i.y || i.clientY;s = { type: "y", from: e.id, coverHeight: n.coverHeight, distance: n.top + (d - c.y) };c.y = d;
            }t.scroll(s);
          },
              p = function p() {
            E.delEvent(document, "mousemove", d), E.delEvent(document, "mouseup", p);
          };t.scrollObj.x && E.addEvent(t.scrollObj.x.toolbar, "mousedown", function () {
            if (!s) {
              var e = [].slice.call(arguments, 0)[0] || window.event;d = E.redefineEvent("mousemove", "mouserun", document), c.x = e.x || e.clientX, l = "x", E.addEvent(document, "mouserun", h), E.addEvent(document, "mouseup", p);
            }
          }), t.scrollObj.y && E.addEvent(t.scrollObj.y.toolbar, "mousedown", function () {
            if (!s) {
              var e = [].slice.call(arguments, 0)[0] || window.event;d = E.redefineEvent("mousemove", "mouserun", document), c.y = e.y || e.clientY, l = "y", E.addEvent(document, "mouserun", h), E.addEvent(document, "mouseup", p);
            }
          });
        }return r.prototype = { constructor: r, scroll: function scroll(e) {
            var t = this.params,
                a = this.scrollObj[e.type],
                n = (a.container, a.toolbar);if ("x" === e.type) {
              e.distance = e.distance * (a.coverWidth / e.coverWidth);var i = Math.max(0, Math.min(a.coverWidth, e.distance));t.node.scrollLeft = i, n.style.left = a.moveWidth * (i / a.coverWidth) + "px", this.scrollObj.x.left = i;
            } else {
              e.distance = e.distance * (a.coverHeight / e.coverHeight);var r = Math.max(0, Math.min(a.coverHeight, e.distance));t.node.scrollTop = r, n.style.top = a.moveHeight * (r / a.coverHeight) + "px", this.scrollObj.y.top = r;
            }void 0 != this.params.id && e.from != this.params.id || this.fire("scroll", e);
          }, toOrigin: function toOrigin(e) {
            var t = this.params;e ? "x" === e ? (this.scrollObj.x.toolbar.style.left = 0, t.node.scrollLeft = 0) : (this.scrollObj.y.toolbar.style.top = 0, t.node.scrollTop = 0) : (this.scrollObj.x.toolbar.style.left = 0, this.scrollObj.y.toolbar.style.top = 0, t.node.scrollLeft = 0, t.node.scrollTop = 0);
          }, resize: function resize() {
            var e = this.params;if (this.scrollObj.x) {
              var t = (n = this.scrollObj.x).toolbar,
                  a = e.node.scrollWidth - e.node.clientWidth;t.style.width = Math.max(n.container.clientWidth - a / 10, 50) + "px", n.coverWidth = a, n.moveWidth = n.container.clientWidth - t.offsetWidth, 0 === n.moveWidth ? n.container.classList.add("pad-hide") : n.container.classList.remove("pad-hide");
            }if (this.scrollObj.y) {
              t = (n = this.scrollObj.y).toolbar;var n,
                  i = e.node.scrollHeight - e.node.clientHeight;t.style.height = Math.max(n.container.clientHeight - i / 10, 50) + "px", n.coverHeight = i, n.moveHeight = n.container.clientHeight - t.offsetHeight, 0 === n.moveHeight ? n.container.classList.add("pad-hide") : n.container.classList.remove("pad-hide");
            }
          }, addEvent: function addEvent(e, t) {
            var a = this.events;a[e] ? a[e].push(t) : a[e] = [t];
          }, delEvent: function delEvent(e, a) {
            var n = this.events;"[object Function]" === t.call(a) ? n[e].splice(n[e].indexOf(a), 1) : delete n[e];
          }, fire: function fire() {
            var e = [].slice.call(arguments, 0),
                a = e.shift(),
                n = this.events;n[a] && n[a].forEach(function (a) {
              "[object Function]" === t.call(a) && a.apply(Object.create(null), e);
            });
          } }, { init: function init(t) {
            if (t.node) {
              var a = new r(t);return e.push(a), a;
            }
          }, resize: function resize() {
            e.forEach(function (e) {
              e.resize();
            });
          } };
      }(),
          O = { get uuid() {
          return Date.now().toString();
        }, scale: function scale(e) {
          var t = e,
              a = t.type,
              n = null,
              i = null;switch (n && i || (n = this.mainCanvas.width / t.width, i = this.mainCanvas.height / t.height), a) {case "pen":
              t.data.x = t.data.x * n, t.data.y = t.data.y * i;break;case "text":
              t.data[0] = t.data[0] * n, t.data[1] = t.data[1] * n;break;case "image":case "file":
              break;case "eraser":
              t.data.x = t.data.x * n, t.data.y = t.data.y * i, t.data.size = t.data.size * n;break;default:
              t.data[0] && (t.data[0] = isNaN(t.data[0]) ? t.data[0] : t.data[0] * n), t.data[1] && (t.data[1] = isNaN(t.data[1]) ? t.data[1] : t.data[1] * n), t.data[2] && (t.data[2] = isNaN(t.data[2]) ? t.data[2] : t.data[2] * n), t.data[3] && (t.data[3] = isNaN(t.data[3]) ? t.data[3] : t.data[3] * n);}
        }, copy: function copy() {
          var e = [].slice.call(arguments, 0),
              a = e.shift();if (e.length) return "[object Object]" != (s = t.call(a)) && "[object Array]" != s ? a : (e.forEach(function (e) {
            var n = t.call(e);if ("[object Object]" == n || "[object Array]" == n) if ("[object Object]" === n) {
              if ("[object Array]" === o) var i = {};for (var r in e) {
                if (e.hasOwnProperty(r)) {
                  var s = e[r],
                      o = t.call(s);i ? i[r] = "[object Object]" === o || "[object Array]" === o ? O.copy(s) : s : a[r] = "[object Object]" === o || "[object Array]" === o ? O.copy(s) : s;
                }
              }i && a.push(i);
            } else e.forEach(function (e, n) {
              var i = t.call(e);"[object Object]" === o ? a[n] = "[object Object]" === i || "[object Array]" === i ? O.copy(s) : s : "[object Object]" === i || "[object Array]" === i ? a.push(O.copy(s)) : a.push(s);
            });
          }), a);if ("[object Object]" != (s = t.call(a)) && "[object Array]" != s) return a;if ("[object Object]" === s) {
            var n = {};for (var i in a) {
              if (a.hasOwnProperty(i)) {
                var r = a[i],
                    s = t.call(r);n[i] = "[object Object]" === s || "[object Array]" === s ? O.copy(r) : r;
              }
            }
          } else {
            n = [];a.forEach(function (e) {
              var a = t.call(e);"[object Object]" === a || "[object Array]" === a ? n.push(O.copy(e)) : n.push(e);
            });
          }return n;
        }, saveAsImage: function saveAsImage(e, t) {
          for (var a = this, n = 0, i = [], r = null, s = e.length, o = a.tab.getActive(), l = a.createImageCanvas, c = function c(t) {
            var n = t.shift();if (!n) return function () {
              var t = l.toDataURL(),
                  n = a.tab.getPage(o.id);l.width = l.width;var s = { type: "image", data: [t, 0, 0], width: 0, height: 0, status: 1, origin: !0, from: "auto" };n && (s.pageNumber = n.getPageNumber()), r && e.push(r), e.push(s), [].push.apply(e, i), a.tab.saveData.call(a);
            }();"file" === n.type ? (r = n, c(t)) : O.render.call(a, n, function () {
              c(t);
            }, !0);
          }; s--;) {
            var d = e.pop();if (i.unshift(d), d.origin && n++, a.params.saveImgStep <= n) {
              l.width = l.width, e.length ? c(e) : [].push.apply(e, i);break;
            }
          }
        }, trim: function trim(e) {
          if (e && "[object String]" == t.call(e)) return e.replace(/^\s*|\s*$/, "");
        }, splitPage: function splitPage(e) {
          var a = {},
              n = [],
              i = [];for (var r in e.forEach(function (e) {
            "[object String]" === t.call(e) ? i.push(e) : (a[e.pageNumber] = a[e.pageNumber] || [], a[e.pageNumber].push(e));
          }), a) {
            a.hasOwnProperty(r) && n.push(r);
          }return n.sort(function (e, t) {
            return e - t;
          }), n.forEach(function (e) {
            i.push(a[e]);
          }), i;
        }, renderPen: function renderPen(e, t, a) {
          var n = this,
              i = a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : n.mainCanvas,
              r = e.data,
              s = i.width / e.width,
              o = i.height / e.height,
              l = i.getContext("2d");0 === e.status ? i.width = i.width : n.bufferCanvas.width = n.bufferCanvas.width, l.strokeStyle = e.color, l.lineWidth = 1, l.save(), l.scale(s, o), r.forEach(function (e, t) {
            0 === t ? (l.beginPath(), l.moveTo(e.x, e.y)) : l.lineTo(e.x, e.y);
          }), l.stroke(), l.restore(), t && t();
        }, renderRect: function renderRect(e, t, a) {
          var n = this,
              i = (e.mode, a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : n.mainCanvas),
              r = e.data,
              s = i.width / e.width,
              o = i.height / e.height,
              l = i.getContext("2d");0 === e.status ? i.width = i.width : n.bufferCanvas.width = n.bufferCanvas.width, l.save(), l.scale(s, o), l.beginPath(), 0 === e.mode ? (l.strokeStyle = e.color, l.lineWidth = 1, l.strokeRect(r[0], r[1], r[2], r[3])) : (l.fillStyle = e.color, l.fillRect(r[0], r[1], r[2], r[3])), l.restore(), t && t();
        }, renderLine: function renderLine(e, t, a) {
          var n = this,
              i = e.mode,
              r = a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : n.mainCanvas,
              s = e.data,
              o = r.width / e.width,
              l = r.height / e.height,
              c = r.getContext("2d");if (0 === e.status ? r.width = r.width : n.bufferCanvas.width = n.bufferCanvas.width, c.strokeStyle = e.color, c.lineWidth = 1, c.save(), c.scale(o, l), c.beginPath(), c.moveTo(s[0], s[1]), c.lineTo(s[2], s[3]), 1 === i) {
            var d = 180 * Math.atan2(s[1] - s[3], s[0] - s[2]) / Math.PI,
                u = (d + 30) * Math.PI / 180,
                f = (d - 30) * Math.PI / 180,
                h = 15 * Math.cos(u),
                p = 15 * Math.sin(u),
                m = 15 * Math.cos(f),
                v = 15 * Math.sin(f);c.moveTo(h + s[2], p + s[3]), c.lineTo(s[2], s[3]), c.moveTo(m + s[2], v + s[3]), c.lineTo(s[2], s[3]);
          }c.stroke(), c.restore(), t && t();
        }, renderRound: function renderRound(e, t, a) {
          var n = this,
              i = e.mode,
              r = a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : n.mainCanvas,
              s = e.data,
              o = r.width / e.width,
              l = r.height / e.height,
              c = r.getContext("2d");switch (0 === e.status ? r.width = r.width : n.bufferCanvas.width = n.bufferCanvas.width, c.save(), c.scale(o, l), c.beginPath(), i) {case 0:
              c.strokeStyle = e.color, c.lineWidth = 1, c.arc(s[0], s[1], s[2], 0, 2 * Math.PI), c.stroke();break;case 1:
              c.fillStyle = e.color, c.arc(s[0], s[1], s[2], 0, 2 * Math.PI), c.fill();break;case 2:
              c.strokeStyle = e.color, c.lineWidth = 1;var d = s[2] > s[3] ? s[2] : s[3],
                  u = s[2] / d,
                  f = s[3] / d;c.scale(u, f), c.arc(s[0] / u, s[1] / f, d, 0, 2 * Math.PI), c.closePath(), c.stroke();break;case 3:
              c.fillStyle = e.color;d = s[2] > s[3] ? s[2] : s[3], u = s[2] / d, f = s[3] / d;c.scale(u, f), c.arc(s[0] / u, s[1] / f, d, 0, 2 * Math.PI), c.closePath(), c.fill();}c.restore(), t && t();
        }, renderText: function renderText(e, t, a) {
          var n = this,
              i = a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : n.mainCanvas,
              r = e.data,
              s = i.width / e.width,
              o = i.height / e.height,
              l = i.getContext("2d");0 === e.status ? i.width = i.width : n.bufferCanvas.width = n.bufferCanvas.width, l.fillStyle = e.color, l.font = e.size + "px sans-serif", l.save(), l.scale(s, o), l.beginPath(), l.fillText(r[2], r[0], r[1]), l.restore(), t && t();
        }, renderImage: function renderImage(e, t, a) {
          var n = this,
              i = a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : "file" === e.type ? n.fileCanvas : n.mainCanvas,
              r = e.data,
              s = e.width,
              o = e.height,
              l = n.tplImage,
              c = i.getContext("2d");l.src = r[0], l.onload = function () {
            var r = l.width,
                d = l.height;if ("file" !== e.type || 0 == e.status || a || (s = n.params.width, o = n.params.height, n.tab.resizePad(s, o), n.tab.resizePadPixel(s, o)), c.save(), "file" === e.type) {
              var u = r,
                  f = d;o > s / (r / d) ? f = d + d * (o / s - d / r) >> 0 : o = s / (r / d) >> 0, n.tab.resizePad(s, o), n.tab.resizePadPixel(u, f), c.drawImage(l, (u - r) / 2, (f - d) / 2, r, d);
            } else {
              var h = i.width,
                  p = i.height,
                  m = r * (h / s),
                  v = d * (p / o),
                  g = h - m,
                  b = p - v;if (g >= 0 && b >= 0) {
                var w = g / 2,
                    y = b / 2;c.drawImage(l, w, y, m, v);
              } else {
                var C = h / p,
                    x = l.width / l.height;C > x ? c.drawImage(l, (h - p * x) / 2, 0, p * x, p) : c.drawImage(l, 0, (p - h / x) / 2, h, h / x);
              }
            }c.restore(), t && t();
          };
        }, delete: function _delete(e, t, a) {
          var n = this,
              i = a ? n.createImageCanvas : 0 === e.status ? n.bufferCanvas : n.mainCanvas,
              r = e.data,
              s = i.width / e.width,
              o = i.height / e.height,
              l = i.getContext("2d");0 === e.status ? i.width = i.width : n.bufferCanvas.width = n.bufferCanvas.width, r.forEach(function (t) {
            if (0 === e.mode) {
              var a = t.size / 2 * Math.sin(Math.atan((t.y - t.ey) / (t.x - t.ex))) || 0,
                  r = t.size / 2 * Math.cos(Math.atan((t.y - t.ey) / (t.x - t.ex))) || 0,
                  c = t.ex + a,
                  d = t.ey - r,
                  u = t.ex - a,
                  f = t.ey + r,
                  h = t.x + a,
                  p = t.y - r,
                  m = t.x - a,
                  v = t.y + r;l.save(), l.scale(s, o), l.beginPath(), l.arc(t.x, t.y, t.size / 2, 0, 2 * Math.PI), l.clip(), l.clearRect(0, 0, i.width, i.height), l.restore();
            } else {
              c = t.ex - t.size / 2, d = t.ey - t.size / 2, u = t.ex - t.size / 2, f = t.ey + t.size / 2, h = t.x + t.size / 2, p = t.y - t.size / 2, m = t.x - t.size / 2, v = t.y + t.size / 2;l.save(), l.scale(s, o), l.beginPath(), l.rect(c, d, t.size, t.size), l.clip(), l.clearRect(0, 0, i.width, i.height), l.restore();
            }l.save(), l.scale(s, o), l.beginPath(), l.moveTo(c, d), l.lineTo(u, f), l.lineTo(h, p), l.lineTo(m, v), l.closePath(), l.clip(), l.clearRect(0, 0, n.params.width, n.params.height), l.restore();
          }), t && t();
        }, render: function render(e, t, a) {
          var n = this;switch (e.type) {case "pen":
              O.renderPen.call(n, e, t, a);break;case "rectangle":
              O.renderRect.call(n, e, t, a);break;case "line":
              O.renderLine.call(n, e, t, a);break;case "round":
              O.renderRound.call(n, e, t, a);break;case "text":
              O.renderText.call(n, e, t, a);break;case "image":case "file":
              O.renderImage.call(n, e, t, a);break;case "eraser":
              O.delete.call(n, e, t, a);}
        } },
          j = { eraser: function eraser(e) {
          var t = this.mouseIconCanvas,
              a = e.data,
              n = e.mode,
              i = t.width / e.width,
              r = t.height / e.height,
              s = t.getContext("2d");if (t.width = t.width, -1 !== a[0] && -1 !== a[1]) if (s.scale(i, r), s.beginPath(), 0 === n) s.arc(a[0], a[1], a[2] / 2, 0, 2 * Math.PI), s.stroke();else {
            var o = a[0] - a[2] / 2,
                l = a[1] - a[2] / 2;s.rect(o, l, a[2], a[2]), s.stroke();
          }
        }, ferula: function ferula(e) {
          var t = this.mouseIconCanvas,
              a = e.data,
              n = this.params.ferulaSize,
              i = t.width / e.width,
              r = t.height / e.height,
              s = t.getContext("2d");t.width = t.width, -1 !== a[0] && -1 !== a[1] && (s.scale(i, r), s.beginPath(), s.fillStyle = "red", s.arc(a[0], a[1], n, 0, 2 * Math.PI), s.fill());
        }, render: function render(e) {
          var t = e.type;j[t] && j[t].call(this, e);
        } },
          N = function () {
        var e = document.createElement("UL"),
            a = '<li class="pad-tab-item" title="@LABEL@">@LABEL@@DELETEBTN@</li>',
            n = '<i class="iconfont icon-close"></i>';function i(i) {
          var r = this,
              s = {},
              o = {},
              l = {},
              c = {},
              d = [],
              f = !1,
              h = {},
              p = i.getElementsByClassName("pad-tab-list")[0];r.build = function (i, f) {
            if (i) {
              if (!(d.length >= this.params.tabLimit)) {
                var h = this,
                    m = f.type,
                    v = f.data,
                    b = f.from,
                    w = 0 !== f.type && (!!h.params.super || b == h.params.id),
                    y = f.id ? f.id : 0 === m ? 0 : O.uuid,
                    C = a.replace(/@LABEL@/g, f.name ? f.name : g[m]).replace(/@DELETEBTN@/g, w ? n : "");e.innerHTML = C, d.push(y);var x = e.firstElementChild || e.firstChild;return s[y] = x, o[y] = v || [], l[y] = i, w && E.addEvent(x.getElementsByTagName("i")[0], u.click, function () {
                  var e = [].slice.call(arguments, 0)[0] || window.event;window.event ? (e.returnValue = !1, e.cancelBubble = !0) : (e.preventDefault(), e.stopPropagation()), r.remove.call(h, y), h.params.onTabRemove && h.params.onTabRemove(y);
                }), E.addEvent(x, u.click, function () {
                  !0 !== h.params.disable && this !== c.tab && (r.active.call(h, y), h.params.onTabChange && h.params.onTabChange(y));
                }), p.appendChild(x), h.container[y] = { data: o[y], type: m, splitPage: 0, from: b }, r.resizeTab(), f.name && (h.container[y].tabName = f.name), y;
              }"[object Function]" === t.call(this.params.onError) && this.params.onError({ code: 0, message: "白板页签已达上限" });
            }
          }, r.push = function (e, t) {
            var a = this,
                n = 0;o[e] || (o[e] = []), o[e].push(t), a.tab.saveData.call(a), o[e].forEach(function (e) {
              "auto" != e.from && n++;
            }), n - a.params.saveImgStep >= a.params.saveImgStep && O.saveAsImage.call(a, o[e], a.container[e].type);
          }, r.saveData = function () {
            var e = this;if (!f && "never" !== e.params.autoSaveTime) {
              e.params.autoSaveTime = isNaN(e.params.autoSaveTime) ? 10 : +e.params.autoSaveTime;var t = setTimeout(function () {
                for (var a in h) {
                  if (h.hasOwnProperty(a)) {
                    var n = h[a];o[a].length = 0, [].push.apply(o[a], n.getData());
                  }
                }!e.params.noCache && window.localStorage.setItem(e.id + "_pad", JSON.stringify(e.container)), clearTimeout(t), f = !1;
              }, 1e3 * e.params.autoSaveTime);f = !0;
            }
          }, r.resizeTab = function () {
            var e = p.clientWidth / d.length;e = e > 112 ? 112 : e, p.style.setProperty("--tab-width", e - 12 + "px");
          }, r.remove = function (e) {
            var t = this,
                a = s[e],
                n = d.indexOf(e);delete s[e], delete o[e], delete l[e], delete t.container[e], delete h[e], p.removeChild(a), d.splice(n, 1), c.id == e && (e = d[Math.max(n - 1, 0)], t.tab.active.call(t, e)), t.tab.resizeTab(), !t.params.noCache && window.localStorage.setItem(t.id + "_pad", JSON.stringify(t.container));
          }, r.active = function (e, t, a) {
            if (!s[e]) return !1;var n = this,
                i = o[e];if (E.removeClass(c.tab, "active"), t || (n.tab.resizePad(), n.tab.resizePadPixel()), !a && n.scroll.toOrigin(), c.page && (c.page.hide(), delete c.page), n.container[e].type != c.type && (E.css(c.canvas || n.mainCanvas, "background"), E.css(l[e], "background", n.params.background)), c.tab = s[e], c.data = o[e], c.canvas = l[e], c.id = e, c.type = n.container[e].type, c.name = n.container[e].tabName || "", c.page = h[e], E.addClass(c.tab, "active"), c.page && c.page.show(), i && !c.page) {
              c.canvas.width = c.canvas.width;var r = 0,
                  d = i.length;if (d) {
                var u = function u() {
                  var e = i[r];e && O.render.call(n, e, function () {
                    ++r < d && u();
                  });
                };u();
              }
            }return !0;
          }, r.getActive = function () {
            return c;
          }, r.getTab = function (e) {
            return s[e];
          }, r.clear = function (e) {
            var a = this;if (void 0 === e) c.page ? c.page.clear.call(a) : (c.data.length = 0, c.canvas.width = c.canvas.width, "[object Function]" === t.call(a.params.onClear) && a.params.onClear({ tabId: c.id }));else {
              var n = e.tabId;h[n] ? h[n].clear.call(a, e) : (o[n] && (o[n].length = 0), l[n] && (l[n].width = l[n].width));
            }!a.params.noCache && window.localStorage.setItem(a.id + "_pad", JSON.stringify(a.container));
          }, r.cleanCache = function () {
            !this.params.noCache && window.localStorage.removeItem(this.id + "_pad");
          }, r.setPage = function (e, t) {
            h[e] = t, this.container[e].splitPage = 1;
          }, r.getPage = function (e) {
            return h[e];
          }, r.render = function (e, a) {
            O.render.call(this, e, function () {
              if ("[object Function]" === t.call(a)) {
                var n = O.copy(e),
                    i = {};i[c.id] = { data: n, type: c.type, splitPage: c.page ? 1 : 0 }, a(i);
              }
            }), e.status && this.tab.push.call(this, c.id, e);
          };
        }return i.prototype = { constructor: i }, i;
      }();function I(e) {
        if (!this instanceof I) return new I(e);var a = this,
            n = 1,
            i = e.that,
            r = O.splitPage(e.data),
            s = r.length,
            o = e.tabId,
            l = e.show || !1,
            c = document.createElement("DIV"),
            d = i.params.wrap.getElementsByClassName("split-page-wrap")[0];c.innerHTML = C.replace(/@TOTAL@/g, s);var f = c.removeChild(c.firstElementChild || c.firstChild),
            h = f.getElementsByClassName("pre-page-btn")[0],
            p = f.getElementsByClassName("next-page-btn")[0],
            m = f.getElementsByClassName("go-page-btn")[0],
            v = f.getElementsByClassName("page-number-input")[0];E.addEvent(h, u.click, function () {
          i.params.disable || n <= 1 || a.pre();
        }), E.addEvent(p, u.click, function () {
          i.params.disable || n >= s || a.next();
        }), E.addEvent(m, u.click, function () {
          if (!i.params.disable) {
            var e = v.value;a.go(e, function () {
              e = v.value, i.params.onPageTurn && i.params.onPageTurn(o, e, r[e - 1][0]);
            });
          }
        }), E.addEvent(v, "input", function () {
          /^\s*([0-9]+).*\s*$/.test(this.value) ? this.value = RegExp.$1 : this.value = n;
        }), E.addEvent(v, "keypress", function () {
          var e = [].slice.call(arguments, 0),
              t = window.event || e[0];if (13 === t.keyCode || 13 === t.which) {
            var n = v.value;a.go(n, function () {
              n = v.value, i.params.onPageTurn && i.params.onPageTurn(o, n, r[n - 1][0]);
            });
          }
        }), this.pre = function () {
          n--, this.go(n, function () {
            i.params.onPageTurn && i.params.onPageTurn(o, n, r[n - 1][0]);
          });
        };var g = function g(e, a, n) {
          var s = r[e - 1];"[object Array]" === t.call(s) ? s.some(function (t, r) {
            if (!(r < a)) {
              var o = !1;return "file" === t.type ? (o = !0, O.render.call(i, t, function () {
                s.length - 1 <= r ? n && n() : g(e, ++r, n);
              })) : (O.render.call(i, t), s.length - 1 <= r && n && n()), o;
            }
          }) : O.render.call(i, s, n);
        };this.go = function (e, a) {
          switch (g(e = (e = e <= 1 ? 1 : e) >= s ? s : e, 0, function () {
            "[object Function]" === t.call(a) && a();
          }), n = e, v.value = e, !0) {case n <= 1 && n < s:
              E.addClass(h, "no"), E.removeClass(p, "no");break;case n > 1 && n >= s:
              E.removeClass(h, "no"), E.addClass(p, "no");break;default:
              E.removeClass(h, "no"), E.removeClass(p, "no");}
        }, this.next = function () {
          n++, this.go(n, function () {
            i.params.onPageTurn && i.params.onPageTurn(o, n, r[n - 1][0]);
          });
        }, this.show = function () {
          if (d.innerHTML = "", r.length > 1) switch (d.appendChild(f), i.params.splitpageLayout) {case "left":
              d.style.left = "10px";break;case "center":
              d.style.left = (d.parentNode.clientWidth - d.offsetWidth) / 2 + "px";break;default:
              d.style.right = "10px";}this.go(n);
        }, this.hide = function () {
          i.tab.getActive().page == a && r.length > 1 && d.removeChild(f);
        }, this.getPageNumber = function () {
          return n;
        }, this.empower = function () {
          v.removeAttribute("readonly");
        }, this.disable = function () {
          v.setAttribute("readonly", "readonly");
        }, r.forEach(function (a, n) {
          "[object String]" === t.call(a) && (r[n] = [{ data: [a, 0, 0], pageNumber: n + 1, width: i.mainCanvas.offsetWidth, height: i.mainCanvas.offsetHeight, status: 1, type: "file", from: e.from }]);
        }), this.push = function (e, t) {
          var a = i.tab.getActive(),
              s = 0;e.pageNumber = void 0 != t ? t : n, r[e.pageNumber - 1].push(e), i.tab.saveData.call(i), r[e.pageNumber - 1].forEach(function (e) {
            "file" != e.type && "auto" != e.from && s++;
          }), s - i.params.saveImgStep >= i.params.saveImgStep && O.saveAsImage.call(i, r[e.pageNumber - 1], i.container[a.id].type);
        }, this.getData = function () {
          for (var e = 0, t = []; e < s;) {
            [].push.apply(t, r[e]), e++;
          }return t;
        }, this.clear = function (e) {
          var a = (e ? e.pageNumber : n) || n;r[a - 1].length = 1, i.tab.saveData.call(i), (void 0 === e || e.tabId == i.tab.getActive().id && e.pageNumber == n) && (i.mainCanvas.width = i.mainCanvas.width, void 0 === e && "[object Function]" === t.call(i.params.onClear) && i.params.onClear({ tabId: i.tab.getActive().id, pageNumber: a }));
        }, this.render = function (e, a) {
          var i = this;O.render.call(i, e, function () {
            if ("[object Function]" === t.call(a)) {
              var r = O.copy(e),
                  s = {},
                  o = i.tab.getActive();s[o.id] = { data: r, type: o.type, pageNumber: n, splitPage: o.page ? 1 : 0 }, a(s);
            }
          }), e.status && i.tab.getActive().page.push.call(i, e);
        }, i.params.disable && this.disable(), i.tab.saveData.call(i), l && this.show();
      }function S(n) {
        if (!this instanceof S) return new S(n);var i = new Image();i.setAttribute("crossOrigin", "anonymous");var s = { pad: this, params: n, waitList: [], container: {}, tplImage: i, id: n.id || r++, render: function render(e) {
            var a = s.tab.getActive();a.page ? a.page.render.call(s, e, function (e) {
              "[object Function]" === t.call(n.onRender) && n.onRender(e);
            }) : s.tab.render.call(s, e, function (e) {
              "[object Function]" === t.call(n.onRender) && n.onRender(e);
            });
          }, mouseRender: function mouseRender(e) {
            if (j.render.call(s, e), n.onMousemove) {
              var t = O.copy(e),
                  a = {},
                  i = s.tab.getActive();a[i.id] = { data: t, type: i.type }, n.onMousemove(a);
            }
          } };(function () {
          var n = this,
              i = this.params,
              r = i.wrap,
              s = i.toolbars,
              l = {},
              c = !1,
              d = null,
              h = null,
              g = null,
              C = new FileReader(),
              j = !1,
              S = "",
              B = !1,
              P = r.requestFullscreen || r.webkitRequestFullscreen || r.mozRequestFullScreen || r.msRequestFullscreen,
              A = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen,
              k = null,
              L = null,
              R = null,
              M = null,
              z = null,
              H = null,
              W = null,
              D = null;s.forEach(function (t) {
            var a = p[t];switch (t) {case "handPad":case "color":case "clear":case "export":
                break;default:
                a ? a.forEach(function (a) {
                  l[a] = new e.module[t]({ name: a });
                }) : l[t] = new e.module[t]({ name: t });}var n = w.replace(/@ITEM@/g, a ? a[0] : t).replace(/@ICONCLASS@/g, a ? v[a[0]] : v[t]).replace(/@TITLE@/g, a ? m[a[0]] : m[t]).replace(/@LEVEL@/g, 0);if (n = n.replace(/@CHILDTOOLBARS@/g, a ? y : ""), a) {
              var i = "";a.forEach(function (e) {
                i += w.replace(/@ITEM@/g, e).replace(/@ICONCLASS@/g, v[e]).replace(/@TITLE@/g, m[e]).replace(/@CHILDTOOLBARS@/g, "").replace(/@LEVEL@/g, 1);
              }), n = n.replace(/@CHILDTOOLBARITEM@/g, i);
            }S += n;
          }), 0 != i.fullScreen && (S += x);var F = b.replace(/@LAYOUT@/g, f[i.layout] + (i.vertical ? " vertical" : "")).replace(/@TOOLBARS@/g, S).replace(/@DISABLED@/g, i.disable ? "disabled" : "").replace(/@NOTOOLBAR@/g, i.noToolbar ? "no-toolbar" : "").replace(/@NOTAB@/g, i.noTab ? "no-tab" : ""),
              $ = i.data || (i.noCache ? null : JSON.parse(window.localStorage.getItem(n.id + "_pad")));r.innerHTML = F, this.toolbarMap = l;var q = r.getElementsByClassName("can-wrap")[0],
              U = r.getElementsByClassName("toolbar-list")[0],
              Y = U.getElementsByClassName("full-screen-btn")[0];k = r.getElementsByClassName("color-input")[0], L = r.getElementsByClassName("file-input")[0], R = r.getElementsByClassName("text-input")[0], M = r.getElementsByClassName("main-can")[0], z = r.getElementsByClassName("buffer-can-1")[0], H = r.getElementsByClassName("buffer-can-2")[0], W = r.getElementsByClassName("buffer-can-3")[0], D = r.getElementsByClassName("buffer-can-4")[0];E.redefineEvent("mousemove", "mouserun", z);var V = function V() {
            var e = q.clientWidth,
                t = q.clientHeight;switch (!0) {case /^\s*(\d+)\s*\*\s*(\d+)\s*$/.test(i.size):
                e = +RegExp.$1, t = +RegExp.$2;break;case /^\s*(\d+)\s*:\s*(\d+)\s*$/.test(i.size):
                var a = q.clientWidth,
                    n = q.clientHeight;switch (!0) {case RegExp.$1 / RegExp.$2 > a / n:
                    e = a, t = a / RegExp.$1 * RegExp.$2;break;case RegExp.$1 / RegExp.$2 < a / n:
                    t = n, e = n / RegExp.$2 * RegExp.$1;break;default:
                    e = a, t = n;}break;case /^\s*(\d+)%\s*$/.test(i.size):
                var a = q.clientWidth,
                    n = q.clientHeight;e = a / 100 * RegExp.$1, t = n / 100 * RegExp.$1;break;default:
                e = q.clientWidth, t = q.clientHeight;}i.width = e >> 0, i.height = t >> 0;
          };E.addEvent(q, u.wheel, function () {
            var e = [].slice.call(arguments, 0),
                t = e[0] || window.event;if (window.event ? (t.returnValue = !1, t.cancelBubble = !0) : (t.preventDefault(), t.stopPropagation()), 1 != G.disable && G.scrollObj.y.coverHeight > 0) {
              var a = { type: "y", from: i.id, coverHeight: G.scrollObj.y.coverHeight, distance: G.scrollObj.y.top + ("DOMMouseScroll" === t.type ? 3 === t.detail ? 100 : -100 : t.deltaY) / 5 };G.scroll(a);
            }
          });var X = q.clientWidth,
              _ = q.clientHeight;E.redefineEvent("resize", "sizeChange", window), E.addEvent(window, "sizeChange", function () {
            var e = q.clientWidth,
                t = q.clientHeight;e == X && t == _ || (V(), n.tab.active.call(n, n.tab.getActive().id, null, !0), X = e, _ = t), n.tab.resizeTab();
          });var J = function J(e, t) {
            var a = e || i.width,
                n = t || i.height;if (M.style.width = z.style.width = H.style.width = W.style.width = D.style.width = a + "px", M.style.height = z.style.height = H.style.height = W.style.height = D.style.height = n + "px", M.style.left = z.style.left = H.style.left = W.style.left = D.style.left = 0, M.style.top = z.style.top = H.style.top = W.style.top = D.style.top = 0, a < q.clientWidth) {
              var r = (q.clientWidth - a) / 2;M.style.left = z.style.left = H.style.left = W.style.left = D.style.left = r + "px";
            }if (n < q.clientHeight) {
              var s = (q.clientHeight - n) / 2;M.style.top = z.style.top = H.style.top = W.style.top = D.style.top = s + "px";
            }G && G.resize();
          },
              K = function K(e, t) {
            var a = e || i.width,
                n = t || i.height;M.width = z.width = H.width = W.width = D.width = a, M.height = z.height = H.height = W.height = D.height = n;
          };n.tab = new N(i.wrap), n.textInput = R, n.mouseIconCanvas = z, n.createImageCanvas = W, n.fileCanvas = D, n.mainCanvas = M, V();var G = T.init({ node: q, id: i.id });G.disable = i.disable, n.scroll = G, G.addEvent("scroll", function (e) {
            "[object Function]" === t.call(i.onScroll) && i.onScroll(e);
          }), Object.defineProperty(n.tab, "resizePad", { value: J }), Object.defineProperty(n.tab, "resizePadPixel", { value: K }), E.addEvent(k, "change", function () {
            n.params.color = this.value;
          }), E.addEvent(r.getElementsByClassName("pad-wrap")[0], u.fullScreen, function () {
            B = !B, E.removeClass(Y, B ? "icon-enlarge" : "icon-narrow"), E.addClass(Y, B ? "icon-narrow" : "icon-enlarge");
          });var Q = function Q(e) {
            o ? (e ? E.addClass(r, "pad-full-screen") : E.removeClass(r, "pad-full-screen"), B = e, E.removeClass(Y, B ? "icon-enlarge" : "icon-narrow"), E.addClass(Y, B ? "icon-narrow" : "icon-enlarge"), n.tab.active.call(n, n.tab.getActive().id)) : e ? P.call(r.getElementsByClassName("pad-wrap")[0]) : A.call(document);
          };n.pad.resize = function (e, t) {
            isNaN(e) || isNaN(t) ? (V(), n.tab.active.call(n, n.tab.getActive().id)) : (J(e, t), K(e, t), n.tab.active.call(n, n.tab.getActive().id, !0));
          }, n.pad.scroll = function (e) {
            G.scroll(e);
          }, n.pad.fullScreen = function () {
            B || Q(!0);
          }, n.pad.exitFullScreen = function () {
            B && Q(!1);
          }, n.pad.showFiles = function (e) {
            var a = e.files,
                i = e.newTab,
                r = e.isShow,
                s = void 0 != e.from ? e.from : n.params.id,
                o = e.tabId,
                l = e.tabName,
                c = n.tab.getActive();a = "[object Array]" === t.call(a) ? a : [a];var d = function d() {
              var o = new I({ data: a, show: r, that: n, width: e.width, height: e.height, from: s, tabId: i ? u : c.id });n.tab.setPage.call(n, void 0 != u ? u : c.id, o), c.page = o, n.params.id == s && "[object Function]" === t.call(n.params.onShowFiles) && (e.from = s, n.params.onShowFiles(e));
            };if (i) {
              var u = n.tab.build.call(n, D, { type: 1, id: o, name: l, from: s });e.tabId = u, r && (n.tab.active.call(n, u), d(), s == n.params.id && n.params.onTabChange && n.params.onTabChange(u));
            } else 0 == n.tab.getActive().id ? (n.toolbarMap.image.renderBuffer.call(n, e.files), n.toolbarMap.image.render.call(n, [0, 0])) : (n.pad.clear(), d());
          }, C.onload = function (e) {
            n.toolbarMap.image.renderBuffer.call(n, e.target.result), n.toolbarMap.image.render.call(n, [0, 0]), L.value = "";
          }, E.addEvent(L, "change", function () {
            C.readAsDataURL(this.files[0]);
          }), E.addEvent(R, "input", function () {
            this.style.width = this.scrollWidth + "px";
          }), E.addEvent(R, "keyup", function () {
            var e = [].slice.call(arguments, 0),
                t = e[0] || window.event;if (13 === t.which) {
              var a = O.trim(this.value);d.render.call(n, a);
            }
          }), E.addEvent(document, "keydown", function () {
            var e = [].slice.call(arguments, 0),
                t = e[0] || window.event,
                a = t.which;if (n.active) switch (!0) {case 107 === a || 187 === a && t.shiftKey:
                d && d.largen && d.largen.call(n);break;case 109 === a || 189 === a && t.shiftKey:
                d && d.lesser && d.lesser.call(n);}
          }), E.addEvent(U, u.click, function () {
            if (!i.disable) {
              var e = [].slice.call(arguments, 0),
                  t = e[0] || window.event,
                  r = t.srcElement || t.target,
                  s = +r.getAttribute("level"),
                  o = r.getAttribute("item");if (o) {
                switch (d && d.destory.call(n), o) {case "handPad":
                    (c = !c) ? r.setAttribute("active", "") : r.removeAttribute("active");break;case "color":
                    k.click();break;case "clear":
                    n.tab.clear.call(n);break;case "export":
                    !function () {
                      var e = n.tab.getActive().name || O.uuid,
                          t = document.createElement("A"),
                          i = n.createImageCanvas,
                          r = i.getContext("2d"),
                          s = n.params.wrap.getElementsByClassName("pad-wrap")[0];r.drawImage(n.fileCanvas, 0, 0), r.drawImage(n.mainCanvas, 0, 0);var o = i.toDataURL().split(","),
                          l = atob(o[1]),
                          c = l.length,
                          d = new Uint8ClampedArray(c);for (; c--;) {
                        d[c] = l.charCodeAt(c);
                      }var u = a.createObjectURL(new Blob([d], { mime: "image/octet-stream;Content-Disposition:attachment" }));t.className = "export-image", t.href = u, t.download = e + ".png", s.appendChild(t), t.click();var f = setTimeout(function () {
                        f && clearTimeout(f), a.revokeObjectURL(u);
                      }, 300);i.width = i.width, s.removeChild(t);
                    }();break;case "image":
                    L.click();break;case "fullScreen":
                    Q(!B);break;default:
                    if (!(d = l[o] || d)) return;if (n.current = d, d.active(), 0 === s) {
                      h && h.removeAttribute("active"), h = r;var u = U.getElementsByClassName("selected-item")[0];r.parentNode != u && E.removeClass(u, "selected-item"), E.addClass(r.parentNode, "selected-item");
                    }if (1 === s) {
                      g && g.removeAttribute("active");var f = E.preNode(r.parentNode.parentNode);f.title = r.parentNode.title, f.className = f.className.replace(/\bicon-[\w-]+\b/, r.className.match(/\bicon-[\w-]+\b/)), f.setAttribute("item", o), g = r;
                    }r.setAttribute("active", "");}o && (window.event ? (t.returnValue = !1, t.cancelBubble = !0) : (t.preventDefault(), t.stopPropagation()));
              }
            }
          }), E.addEvent(U, "mousedown", function () {
            var e = [].slice.call(arguments, 0),
                t = e[0] || window.event;window.event ? (t.returnValue = !1, t.cancelBubble = !0) : (t.preventDefault(), t.stopPropagation());
          });var Z = 0,
              ee = 0;if (E.addEvent(z, u.move, function () {
            var e = [].slice.call(arguments, 0)[0] || window.event;if (e = o ? e : e.detail ? e.detail : e, !(o && e.targetTouches.length > 1)) {
              var t = this.getBoundingClientRect(),
                  a = o ? e.targetTouches[0].clientX : e.clientX,
                  r = o ? e.targetTouches[0].clientY : e.clientY,
                  s = { x: a - (t.x || t.left), y: r - (t.y || t.top) };if (d) {
                var l = d.name.toLowerCase();if (c || j) switch (l) {case "ferula":
                    d.mouseRender.call(n, s);break;case "circular":case "quadrate":
                    d.mouseRender.call(n, s);default:
                    d.bufferRender.call(n, s);} else d.mouseRender && d.mouseRender.call(n, s);
              } else if (j) {
                if (!0 === G.disable) return;var u = Z - a,
                    f = ee - r;o && (u /= 10, f /= 10), G.scrollObj.x.coverWidth > 0 && (G.scroll({ type: "x", from: i.id, distance: G.scrollObj.x.left + u, coverWidth: G.scrollObj.x.coverWidth }), Z = a), G.scrollObj.y.coverHeight > 0 && (G.scroll({ type: "y", from: i.id, distance: G.scrollObj.y.top + f, coverHeight: G.scrollObj.y.coverHeight }), ee = r);
              }
            }
          }), E.addEvent(z, u.down, function () {
            var e = [].slice.call(arguments, 0)[0] || window.event,
                t = this.getBoundingClientRect(),
                a = U.getElementsByClassName("selected-item")[0],
                i = { x: (o ? e.targetTouches[0].clientX : e.clientX) - (t.x || t.left), y: (o ? e.targetTouches[0].clientY : e.clientY) - (t.y || t.top) };window.event ? (e.returnValue = !1, e.cancelBubble = !0) : (e.preventDefault(), e.stopPropagation()), Z = o ? e.targetTouches[0].clientX : e.clientX, ee = o ? e.targetTouches[0].clientY : e.clientY, j = !0, d && (E.removeClass(a, "selected-item"), d.bufferRender && d.bufferRender.call(n, i, !0));
          }), E.addEvent(document, u.down, function () {
            var e = U.getElementsByClassName("selected-item")[0];E.removeClass(e, "selected-item"), d && d.destory.call(n);
          }), E.addEvent(document, "mouseup", function () {
            j && (j = !1, d && d.render && d.render.call(n));
          }), E.addEvent(z, u.up, function () {
            [].slice.call(arguments, 0)[0] || window.event, j = !1, d && d.render && d.render.call(n);
          }), E.addEvent(q, "mouseleave", function () {
            d && d.destory.call(n);
          }), n.bufferCanvas = H, $) Object.keys($).sort(function (e, t) {
            return e - t;
          }).forEach(function (e) {
            var t = $[e],
                a = n.tab.build.call(n, 0 === t.type ? M : D, { type: t.type, data: t.data, id: e, name: t.tabName, from: t.from });if (t.splitPage) {
              var i = new I({ data: t.data, show: 0 === t.type, that: n, tabId: a });n.tab.setPage.call(n, a, i);
            }0 === t.type && n.tab.active.call(n, a);
          });else {
            var te = n.tab.build.call(n, M, { type: 0 });n.tab.active.call(n, te);
          }
        }).call(s);var l = function l(e) {
          var t = s.tab.getActive();for (var a in e) {
            if (e.hasOwnProperty(a)) {
              var n = e[a],
                  i = (n.type, n.data);if (a == t.id) t.page ? t.page.getPageNumber() == n.pageNumber ? t.page.render.call(s, i) : i.status && t.page.push.call(s, i, +n.pageNumber) : s.tab.render.call(s, i);else if (s.tab.getTab(a)) {
                if (i.status) {
                  var r = s.tab.getPage(a);r ? r.push.call(s, i, +n.pageNumber) : s.tab.push.call(s, a, i);
                }
              } else s.tab.build.call(s, s.fileCanvas, { type: 1, data: [i], id: a, from: i.from });
            }
          }
        };this.render = function (e) {
          "[object Object]" == t.call(e) ? l(e) : console.error("TypeError: data must be Object");
        }, this.renderAll = function (e) {
          "[object Object]" == t.call(e) ? e.forEach(function (e) {
            l(e);
          }) : console.error("TypeError: data must be Array");
        }, this.mouseCtrl = function (e) {
          "[object Object]" == t.call(e) ? function (e) {
            for (var t in e) {
              if (e.hasOwnProperty(t)) {
                (a = e[t]).type;var a = a.data;j.render.call(s, a);
              }
            }
          }(e) : console.error("TypeError: data must be Object");
        }, this.clear = function (e) {
          s.tab.clear.call(s, e);
        }, this.disable = function () {
          E.addClass(n.wrap.firstElementChild || n.wrap.firstChild, "disabled"), n.disable = !0;
        }, this.enable = function () {
          E.removeClass(n.wrap.firstElementChild || n.wrap.firstChild, "disabled"), n.disable = !1;
        }, this.createImage = function () {
          return s.mainCanvas.toDataURL();
        }, this.getData = function (e) {
          return s.container[e] || s.container;
        }, this.changeTab = function (e) {
          return s.tab.active.call(s, e);
        }, this.turnPage = function (e, t) {
          e == s.tab.getActive().id && s.tab.getPage.call(s, e).go(t);
        }, this.removeTab = function (e) {
          void 0 != e && s.tab.remove.call(s, e);
        }, E.addEvent(n.wrap, "mouseenter", function () {
          s.active = !0;
        }), E.addEvent(n.wrap, "mouseleave", function () {
          s.active = !1;
        });
      }I.prototype = { constructor: I }, window.wPad = { init: function init(e) {
          var t = O.copy({}, h);(t = O.copy(t, e)).id = void 0 == t.id ? O.uuid : t.id;var a = new S(t);return void 0 != t.id && (i[t.id] = a), s.push(a), a;
        }, getPadById: function getPadById(e) {
          if (void 0 !== e) return i[e];
        }, getPadByIndex: function getPadByIndex(e) {
          if (void 0 !== e) return s[e];
        } };
    }();
  }, {}], 5: [function (e, t, a) {
    !function () {
      "use strict";
      var e = { line: 0, arrow: 1 };function t(e) {
        this.name = e.name || "Line", this.interimBuffer = [], this.points = [], this.buffer = [];
      }t.prototype = { constructor: t, active: function active() {}, bufferRender: function bufferRender(t, a) {
          var n = this;a ? (n.current.points = [], n.current.points.push(t.x), n.current.points.push(t.y)) : (n.current.points[2] = t.x, n.current.points[3] = t.y), a || (n.current.interimBuffer.pop(), t = { type: "line", data: t = [].concat.apply([], n.current.points), status: 0, mode: e[n.current.name], origin: !0, color: n.params.color, from: n.params.id, width: n.mainCanvas.offsetWidth, height: n.mainCanvas.offsetHeight }, n.current.interimBuffer.push(t), n.render(t));
        }, render: function render() {
          var e = this.current.interimBuffer.shift();if (e) do {
            e.status = 1, this.current.buffer.push(e), this.render(e), e = this.current.interimBuffer.shift();
          } while (e);
        }, destory: function destory() {} };var a = window.vm || {};a.module = a.module || {}, a.module.line = t, window.vm = a;
    }();
  }, {}], 6: [function (e, t, a) {
    !function () {
      "use strict";
      function e(e) {
        this.name = e.name || "Pen", this.interimBuffer = [], this.buffer = [];
      }e.prototype = { constructor: e, active: function active() {}, bufferRender: function bufferRender(e, t) {
          var a = this,
              n = t ? { type: "pen", data: [], status: 0, origin: !!t, color: a.params.color, from: a.params.id, width: a.mainCanvas.offsetWidth, height: a.mainCanvas.offsetHeight } : a.current.interimBuffer.pop();n.data.push(e), a.current.interimBuffer.push(n), a.render(n);
        }, render: function render() {
          var e = this.current.interimBuffer.shift();if (e) do {
            e.status = 1, this.current.buffer.push(e), this.render(e), e = this.current.interimBuffer.shift();
          } while (e);
        }, destory: function destory() {} };var t = window.vm || {};t.module = t.module || {}, t.module.pen = e, window.vm = t;
    }();
  }, {}], 7: [function (e, t, a) {
    !function () {
      "use strict";
      var e = { rectstroke: 0, rect: 1 };function t(e) {
        this.name = e.name || "Rectangle", this.interimBuffer = [], this.points = [], this.buffer = [];
      }t.prototype = { constructor: t, active: function active() {}, bufferRender: function bufferRender(t, a) {
          var n = this;a ? (n.current.points = [], n.current.points.push(t.x), n.current.points.push(t.y)) : (n.current.points[2] = t.x - (n.current.points[0] || 0), n.current.points[3] = t.y - (n.current.points[1] || 0), n.current.interimBuffer.pop(), t = { type: "rectangle", data: t = [].concat.apply([], n.current.points), status: 0, mode: e[n.current.name], origin: !0, color: n.params.color, from: n.params.id, width: n.mainCanvas.offsetWidth, height: n.mainCanvas.offsetHeight }, n.current.interimBuffer.push(t), n.render(t));
        }, render: function render() {
          var e = this.current.interimBuffer.shift();if (e) do {
            e.status = 1, this.current.buffer.push(e), this.render(e), e = this.current.interimBuffer.shift();
          } while (e);
        }, destory: function destory() {} };var a = window.vm || {};a.module = a.module || {}, a.module.rectangle = t, window.vm = a;
    }();
  }, {}], 8: [function (e, t, a) {
    !function () {
      "use strict";
      var e = { circle: 0, roundel: 1, ellipesstroke: 2, ellipes: 3 };function t(e) {
        this.name = e.name || "Round", this.interimBuffer = [], this.points = [], this.buffer = [];
      }t.prototype = { constructor: t, active: function active() {}, bufferRender: function bufferRender(t, a) {
          var n = this;if (a) n.current.points = [], n.current.points.push(t.x), n.current.points.push(t.y);else {
            var i = [],
                r = n.current.points[0],
                s = n.current.points[1],
                o = e[n.current.name],
                l = t.x - r,
                c = t.y - s;i.push((r + t.x) / 2), i.push((s + t.y) / 2), 0 === o || 1 === o ? i.push(Math.abs(l) > Math.abs(c) ? Math.abs(l) / 2 : Math.abs(c) / 2) : (i.push(Math.abs(l) / 2), i.push(Math.abs(c) / 2)), n.current.interimBuffer.pop(), t = { type: "round", data: i, status: 0, mode: o, origin: !0, color: n.params.color, from: n.params.id, width: n.mainCanvas.offsetWidth, height: n.mainCanvas.offsetHeight }, n.current.interimBuffer.push(t), n.render(t);
          }
        }, render: function render() {
          var e = this.current.interimBuffer.shift();if (e) do {
            e.status = 1, this.current.buffer.push(e), this.render(e), e = this.current.interimBuffer.shift();
          } while (e);
        }, destory: function destory() {} };var a = window.vm || {};a.module = a.module || {}, a.module.round = t, window.vm = a;
    }();
  }, {}], 9: [function (e, t, a) {
    !function () {
      "use strict";
      function e(e) {
        this.name = e.name || "Text", this.interimBuffer = [], this.points = [], this.buffer = [];
      }e.prototype = { constructor: e, active: function active() {}, bufferRender: function bufferRender(e, t) {
          var a = this;t && (a.current.points = [], a.current.points.push(e.x), a.current.points.push(e.y), a.textInput.style.cssText = "visibility: visible; z-index: 101; font-size: " + a.params.fontSize + "; left: " + (e.x + a.mainCanvas.offsetLeft) + "px; top: " + (e.y + a.mainCanvas.offsetTop - a.textInput.offsetHeight / 2 - 18) + "px", a.textInput.focus(), e = { type: "text", data: [e.x, e.y], status: 0, origin: !!t, color: a.params.color, size: a.params.fontSize, from: a.params.id, width: a.mainCanvas.offsetWidth, height: a.mainCanvas.offsetHeight }, a.current.interimBuffer.push(e));
        }, render: function render(e) {
          if ("[object String]" == Object.prototype.toString.call(e) && (e = e.replace(/^\s*|\s*$/, ""))) {
            var t = this,
                a = t.current.interimBuffer.pop();a && (a.data.push(e), t.textInput.value = "", t.textInput.removeAttribute("style"), a.status = 1, t.current.buffer.push(a), t.render(a), t.current.interimBuffer.length = 0);
          }
        }, destory: function destory() {
          var e = this,
              t = e.textInput.value.replace(/^\s*|\s*$/, "");t && e.current.render.call(e, t), e.textInput.value = "", e.textInput.removeAttribute("style");
        } };var t = window.vm || {};t.module = t.module || {}, t.module.text = e, window.vm = t;
    }();
  }, {}] }, {}, [1, 2, 3, 5, 6, 7, 8, 9, 4]);
//# sourceMappingURL=index.min.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=codyy.js.map