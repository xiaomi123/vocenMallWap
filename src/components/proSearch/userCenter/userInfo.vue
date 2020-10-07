<template>
  <div class="userInfo_container">
  	<!--主要内容开始-->
  	<div class="userInfo_main">
  		<ul class="userInfo_list">
  			<li>
  				<label>用&ensp;户&ensp;名</label>
  				<div class="userInfo_name clearfix">
  					<input type="text" v-model="userName" @focus="nameFoucs()" v-bind:disabled="isEdit" ref="useName" />
  					<span v-show="isEdit" @click="toEdit()"><i class="iconfont">&#xe6b6;</i>编辑</span>
  					<span v-show="!isEdit" @click="saveEdit()"><i class="iconfont">&#xe606;</i>完成</span>
  				</div>
  			</li>
  			<li>
  				<label>客户名称</label>
  				<input type="text" v-model="userInfo.dataset[0].ma002" readonly="readonly" />
  			</li>
  			<li>
  				<label>手&ensp;机&ensp;号</label>
  				<input type="text" v-model="userInfo.dataset[0].c_tel" readonly="readonly" />
  			</li>
  			<li>
  				<label>收货地址</label>
  				<span>{{userInfo.dataset[0].ma027}}</span>
  			</li>
  		</ul>
  		<router-link :to="{path: '/proSearch/userCenter/index'}" class="com_btn">返回</router-link>
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name: 'userInfo',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	userName:JSON.parse(sessionStorage.getItem("userinfo")).dataset[0].c_login,
    	isEdit:true,
    	oldName:'',
    }
  },
  methods:{
  	//用户名获取焦点
  	nameFoucs:function(){
  		let this_ = this;
  		this_.oldName = this_.userName;
  	},
  	//修改用户名
  	toEdit:function(){
  		let this_ = this;
  		this_.isEdit = false;
  		this_.$refs.useName.disabled = false;
  		this_.$refs.useName.focus();
  	},
  	//保存用户名
  	saveEdit:function(){
  		let this_ = this;
  		this_.isEdit = true;
  		this_.$refs.useName.disabled = true;
  		this_.$refs.useName.blur();
  		if(this_.oldName != this_.userName){
  			this_.editName();
  		}
  		
  	},
  	//修改用户名
  	editName:function(){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		//获取加密字符
  		this_.$api.get({
        url: this_.$apiUrl.api.getLogin + '?name=' + this_.userInfo.dataset[0].c_login,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.State){
						let codeMdVal =  this_.userInfo.dataset[0].c_id + this_.userName + data.centent.code;
						let mdSign = md5(codeMdVal,codeMdVal).toUpperCase();//md5加密
						
						this_.$api.post({
			        url: this_.$apiUrl.api.modifName,
			        params:{ "c_id": this_.userInfo.dataset[0].c_id, "c_login": this_.userInfo.dataset[0].c_login, "login": this_.userName,"sign":mdSign },
			        success: function (data) {
			        	this_.bus.$emit('loading', false);
			        	if(data.State){
			        		this_.userInfo.dataset[0].c_login = this_.userName;
									sessionStorage.setItem("userinfo",JSON.stringify(this_.userInfo)); //存入修改用户名后userInfo
									this_.bus.$emit('tipShow', data.Message);
			        	}else{
			        		this_.bus.$emit('tipShow', data.Message);
									//this_.addFail(cur);
			        	}
			        	
			        }
			      });
			      
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
						//this_.addFail(cur);
        	}
        	
        }
      });
  	},
  	
  }
}
</script>

