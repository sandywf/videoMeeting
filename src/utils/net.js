import store from "@/store/store";
import * as Type from '@/config/actionTypes';
import fetchJsonp from './jsonp';
import MyStorage from "@/utils/storage";
//改写fetch 方法
/**
 * 改写 fetch 方法
 * 参数添加简单化
 * 可配置化，可添加全局执行方式
 * 添加整体处理的是否过滤化
 * 包括方式
 */
const defaultOptins = {
	url: '',
	method: 'GET',
	data: {},
	timeout: 10000,
	credentials: 'include',
	headers: {}
};



class Net {
	static expireAt = '';

	/**
	 * get参数添加到url上
	 */
	addGet(url, data) {
		let changeParam = (name, value) => { 
			var newUrl = "";
			var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
			var tmp = name + "=" + value;
			if (url.match(reg) != null) { 
				newUrl = url.replace(reg, tmp);
			} else { 
				if (url.match(/\?/))  { 
					newUrl = url + "&" + tmp; 
				} else { 
					newUrl = url + "?" + tmp; 
				}
			}
			url = newUrl;
		}

		if (data && typeof(data) === 'object') {
			Object.keys(data).forEach(temp => {
				changeParam(temp, data[temp]);
			});
		}
		return url;
	}

	/**
	 * fetch封装
	 */
	server(options = {}) {
		options = { ...defaultOptins,
			...options
		};
		options.method = options.method.toUpperCase();
		options.url = options.url;

		let body;
		if (options.method === 'POST') {
			let searchParams = new URLSearchParams();
			Object.keys(options.data).forEach(key => {
				searchParams.set(key, options.data[key]);
			});
			body = searchParams;
		} else {
			body = undefined;
			options.url = this.addGet(options.url, options.data);
		}

		let request = new Request(options.url, {
			method: options.method,
			headers: new Headers(options.headers),
			credentials: options.credentials,
			body
		});


		return Promise.race([
			fetch(request),
			new Promise((resolve, reject) => {
				//监测超时
				setTimeout(() => reject(new Error('request timeout')), options.timeout);
			})
		]);
	}

	/**
	 * 后台服务
	 */
	xhr(method, url, data, option = {}) {
		let { mkey } = store.getState().meetInfo;
		let mystorage = new MyStorage(mkey);
		let token = mystorage.getItem('token');
		
		//在header头，中添加token值
		option.data = data;
		option.method = method;
		option.url = url;
		option.headers = {
			token: token
		}
		return this.server(option).then(response => {
			if (response.ok) {
				let getToken = response.headers.get('token') || "";
				if( getToken ){
					if( token !== getToken ){
						mystorage.setItem('token',getToken);
					}
					Net.expireAt = response.headers.get('expireAt') || "";
				}
				return response.json();
			} else {
				throw new Error('has Error: '+ url);
			}
		}, err => {
			throw err;
		}).then(data => {
			return this.handleResult(data);
		});
	}

	/**
	 * 后台交互放回处理
	 */
	handleResult(data) {
		var result;
		switch (data.status) {
			//请求成功
			case 1:
				result = Promise.resolve(data);
				break;

				//用户名不存在
			case 100000001:
				result = Promise.reject(data);
				//store.dispatch({ type: 'LOGIN_CLASSROOM'});
				break;

				//密码错误
			case 100000002:
				result = Promise.reject(data);
				break;

				//账号被锁定
			case 100000003:
				result = Promise.reject(data);
				break;

				//登录过期未登录
			case 100000004:
				result = Promise.reject(data);
				store.dispatch({
					type: Type.HAS_NO_LOGIN,
					playload: {
						hasLogin: false
					}
				});
				break;

				//身份验证失败
			case 100000005:
				result = Promise.reject(data);
				break;

				//添加用户失败
			case 100100000:
				result = Promise.reject(data);
				break;

				//用户名重复（注册）
			case 100100001:
				result = Promise.reject(data);
				break;

				//用户名不合法（注册）
			case 100100002:
				result = Promise.reject(data);
				break;

				//密码不合法（注册）
			case 100100003:
				result = Promise.reject(data);
				break;

			default:
				//其它错误
				result = Promise.reject(data);
				//Modal.error({content:data.message});
		}
		return result;
	}

	/**
	 * 后台交互扩展post请求
	 */
	post(url, data) {
		return this.xhr('post', url, data);
	}

	/**
	 * 后台交互扩展请求
	 */
	get(url, data) {
		return this.xhr('get', url, data);
	}


	/**
	 * 和插件后台交互
	 */
	p_xhr(method, url, data, option = {}) {
		option.data = data;
		option.method = method;
		option.url = url;
		option.credentials = 'same-origin';
		return this.server(option).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('has Error');
			}
		}, err => {
			throw err;
		}).then(data => {
			if( option.selfHandle ){
				//是否自己进行数据处理(比如上次服务器,回调不一致问题)
				return Promise.resolve(data);
			}
			
			if( data.status === '000000000' ){
				return Promise.resolve(data);
			}else{
				return Promise.reject(data);
			}
		});
	}

	/**
	 * 插件post请求
	 */
	p_post(url, data,option) {
		return this.p_xhr('post', url, data,option);
	}

	/**
	 * 插件get请求
	 */
	p_get(url, data,option) {
		return this.p_xhr('get', url, data,option);
	}
	
	
	
	
	
	/**
	 * 获取dmc相关的数据
	 * jsonp 调用
	 */
	jsonp(url,options){
		//将options添加到url中
		return fetchJsonp(this.addGet(url,options)).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('has Error');
			}
		}, err => {
			throw err;
		});
	}
};


//默认一天超时
var now   = new Date();
now.setDate(now.getDate()+1);
Net.expireAt = now.getTime();





export default Net;