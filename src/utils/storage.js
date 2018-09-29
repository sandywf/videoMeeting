//本地数据缓存
let storage = window.localStorage;
export default class MyStorage{
	constructor(id){
		this.id = id;
		let data = storage.getItem(this.id);
		if( !data ){
			this.init();
		}
	}
	
	init(){
        storage.setItem(this.id,'{"data":{}}');
    }
	
	//设置，更新
	setItem(key,value){
		var mydata = storage.getItem(this.id);
        mydata = JSON.parse(mydata);
        mydata.data[key] = value;
        storage.setItem(this.id,JSON.stringify(mydata));
        return mydata.data;
	}
	
	//获取
	getItem(key){
		var mydata = storage.getItem(this.id);
        mydata = JSON.parse(mydata);
        return mydata.data[key];
	}
	
	//清空
	removeItem(key){
		var mydata = storage.getItem(this.id);
        mydata = JSON.parse(mydata);
        delete mydata.data[key];
        storage.setItem(this.id,JSON.stringify(mydata));
        return mydata.data;
	}
	
	//请求对象
	clearItem(){
		storage.removeItem(this.id);
	}
	
	
	
}
