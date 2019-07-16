window.app={
	/**
	 * netty服务地址
	 */
	nettyServerUrl:"ws://192.168.2.116:8088/ws",
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
	},
	/**
	 * 退出登录，移除用户全局对象
	 */
	userLogout:function(){
		plus.storage.removeItem("userInfo");
	},
	/**
	 * 保存用户的联系人列表
	 * @param {Object} contactList
	 */
	setContactList:function(contactList){
		var contactListStr=JSON.stringify(contactList);
		plus.storage.setItem("contactList",contactListStr);
	},
	/**
	 * 获取本地缓存中的联系人
	 */
	getContactList:function(){
		var contactListStr=plus.storage.getItem("contactList");
		if(!this.isNotNull(contactListStr)){
			return [];
		}
		return JSON.parse(contactListStr);
	},
	/**
	 * 根据用户id，从本地的缓存（联系人列表）中获取朋友的消息
	 * @param {Object} friendId
	 */
	getFriendFromContactList:function(friendId){
		var contactListStr=plus.storage.getItem("contactList");
		//判读contactListStr是否为空
		if(this.isNotNull(contactListStr)){
			var contactList=JSON.parse(contactListStr);
			for(var i=0;i<contactList.length;i++){
				var friend=contactList[i];
				if(friend.friendUserId==friendId){
					return friend;
					break;
				}
			}
		}else{
			return null;
		}
	},
	/**
	 * 保存用户的聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag 判断本条消息是我发送的，还是朋友发送的，1:我	2:朋友
	 */
	saveUserChatHistory:function(myId,friendId,msg,flag){
		var me=this;
		var chatKey="chat-"+myId+"-"+friendId;
		//从本地缓存获取聊天记录是否存在
		var chatHistoryListStr=plus.storage.getItem(chatKey);
		var chatHistoryList;
		if(me.isNotNull(chatHistoryListStr)){
			//如果不为空
			chatHistoryList=JSON.parse(chatHistoryListStr);
		}else{
			chatHistoryList=[];
		}
		//构建聊天记录对象
		var singleMsg=new me.ChatHistory(myId,friendId,msg,flag);
		//向list中追加msg对象
		chatHistoryList.push(singleMsg);
		plus.storage.setItem(chatKey,JSON.stringify(chatHistoryList));
	},
	/**
	 * 聊天记录的快照，仅仅保存每次和朋友聊天的最后一条消息
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead
	 */
	saveUserChatSnapshot:function(myId,friendId,msg,isRead){
		var me=this;
		var chatKey="chat-snapshot"+myId;
		
		//从本地缓存获取聊天快照列表
		var chatSnapshotListStr=plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if(me.isNotNull(chatSnapshotListStr)){
			//如果不为空
			chatSnapshotList=JSON.parse(chatSnapshotListStr);
			//循环快照列表，并且判断每隔元素是否包含friendId,如果包含则删除
			for(var i=0;i<chatSnapshotList.length;i++){
				if(chatSnapshotList[i].friendId==friendId){
					//删除已经存在的friendId对应的快照对象
					chatSnapshotList.splice(i,1);
					break;
				}
			}
		}else{
			chatSnapshotList=[];
		}
		//构建聊天快照对象
		var singleMsg=new me.ChatSnapshot(myId,friendId,msg,isRead);
		//向list中追加快照对象
		chatSnapshotList.unshift(singleMsg);
		plus.storage.setItem(chatKey,JSON.stringify(chatSnapshotList));
	},
	/**
	 * 获取用户聊天记录
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getUserChatHistory:function(myId,friendId){
		var me=this;
		var chatKey="chat-"+myId+"-"+friendId;
		//从本地缓存获取聊天记录
		var chatHistoryListStr=plus.storage.getItem(chatKey);
		var chatHistoryList;
		if(me.isNotNull(chatHistoryListStr)){
			//如果不为空
			chatHistoryList=JSON.parse(chatHistoryListStr);
		}else{
			chatHistoryList=[];
		}
		return chatHistoryList;
	},
	/**
	 * 获取用户快照记录列表
	 * @param {Object} myId
	 */
	getUserChatSnapshot:function(myId){
		var me=this;
		var chatKey="chat-snapshot"+myId;
		//从本地缓存获取聊天快照
		var chatSnapshotListStr=plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if(me.isNotNull(chatSnapshotListStr)){
			//如果不为空
			chatSnapshotList=JSON.parse(chatSnapshotListStr);
		}else{
			chatSnapshotList=[];
		}
		return chatSnapshotList;
	},
	/**
	 * 和后端的枚举对应
	 */
	CONNECT:1,		// "第一次(或重连)初始化连接"
	CHAT:2, 		//"聊天消息"
	SIGNED:3,		//"消息签收"
	KEEPALIVE:4,	//"客户端保持心跳"
	PULL_FRIEND:5,  //"拉取好友"
	/**
	 * 和后端的ChatMsg聊天模型对象保持一致
	 * @param {Object} senderId
	 * @param {Object} receiverId
	 * @param {Object} msg
	 * @param {Object} msgId
	 */
	ChatMsg:function(senderId,receiverId,msg,msgId){
		this.senderId=senderId;
		this.receiverId=receiverId;
		this.msg=msg;
		this.msgId=msgId;
	},
	/**
	 * 构建消息DataContent模型对象
	 * @param {Object} action
	 * @param {Object} chatMsg
	 * @param {Object} extand
	 */
	DataContent:function(action,chatMsg,extand){
		this.action=action;
		this.chatMsg=chatMsg;
		this.extand=extand;
	},
	/**
	 * 单个聊天记录的对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} flag
	 */
	ChatHistory:function(myId,friendId,msg,flag){
		this.myId=myId;
		this.friendId=friendId;
		this.msg=msg;
		this.flag=flag;
	},
	/**
	 * 快照对象
	 * @param {Object} myId
	 * @param {Object} friendId
	 * @param {Object} msg
	 * @param {Object} isRead 用于判断消息是否已读
	 */
	ChatSnapshot:function(myId,friendId,msg,isRead){
		this.myId=myId;
		this.friendId=friendId;
		this.msg=msg;
		this.isRead=isRead;
	},
	
}
