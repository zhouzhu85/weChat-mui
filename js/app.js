window.app={
	/**
	 * 后端服务发布的url地址
	 */
	serverUrl:"http://192.168.2.116:8065",
	/**
	 * 图片服务器的url地址
	 */
	imgServerUrl:"http://119.27.169.133/",
	/**
	 * 判断字符串是否为空
	 * @param {Object} str
	 */
	isNotNull:function(str){
		if(str!=null && str!="" && str!=undefined){
			return true;
		}
		return false;
	},
	/**
	 * 封装消息提示框，默认mui的不支持剧中和自定义icon，所以使用h5+
	 * @param {Object} msg
	 * @param {Object} type
	 */
	showToast:function(msg,type){
		plus.nativeUI.toast(msg,{icon:"image/"+type+".png",verticalAlign:"center"});
	},
	/**
	 * 保存用户的全局对象
	 * @param {Object} user
	 */
	setUserGlobalInfo:function(user){
		var userInfoStr=JSON.stringify(user);
		plus.storage.setItem("userInfo",userInfoStr);
	},
	/**
	 * 获取用户的全局对象
	 */
	getUserGlobalInfo:function(){
		var userInfoStr=plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	}
}
