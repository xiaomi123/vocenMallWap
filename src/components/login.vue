<template>
	<div class="login_container">
	  <div class="login_main">
	  	<h2>
	  		<span><img src="../assets/images/common/img_login.png"/></span>
	  		沃森订单系统
	  	</h2>
	  	<div class="login_content">

	  		<!--系统升级内容开始-->
	  		<!--<div class="bg_upgrade"></div>-->
	  		<!--系统升级内容结束-->

		  	<!--tab切换内容开始-->
		    <ul class="login_tab clearfix">
		    	<li @click="cur=0" :class="{active:cur==0}" style="width:100%;">用户名登陆</li>
		    	<!-- <li @click="cur=1" :class="{active:cur==1}">手机号登陆</li> -->
		    </ul>
		    <!--tab切换内容结束-->

		    <!--用户名登陆内容开始-->
		    <div class="login_tabCont" v-show="cur==0">
		    	<ul class="login_list">
		    		<li>
		    			<i><img src="../assets/images/common/icon_loginList3.png" alt="" /></i>
		    			<input type="text" placeholder="请输入用户名" v-model="userForm.name" />
		    		</li>
		    		<li>
		    			<i><img src="../assets/images/common/icon_loginList4.png" alt="" /></i>
		    			<input type="password" placeholder="请输入密码" v-model="userForm.passWord" />
		    		</li>
		    	</ul>
		    	<input type="button" value="登录" class="login_btn" @click="login()" />
		    	<p class="login_rem"><i class="iconfont" v-show="!isRem" @click="isRem=true">&#xe6c8;</i><i class="iconfont" v-show="isRem" @click="isRem=false">&#xe6c9;</i>记住密码？</p>
		    </div>
		    <!--用户名登陆内容结束-->

		    <!--手机号登陆内容开始-->
		    <!-- <div class="login_tabCont" v-show="cur==1">
		    	<ul class="login_list">
		    		<li>
		    			<i><img src="../assets/images/common/icon_loginList1.png" alt="" /></i>
		    			<input type="text" placeholder="请输入手机号" maxlength="11" v-model="yzmForm.tel"  />
		    		</li>
		    		<li class="code clearfix">
		    			<i><img src="../assets/images/common/icon_loginList2.png" alt="" /></i>
		  				<input type="text" placeholder="请输入验证码" v-model="yzmForm.yzm" />
		  				<input type="button" value="获取验证码" @click="getYzm()" v-show="isSend" />
		  				<span v-show="!isSend">{{btnTitle}}</span>
		    		</li>
		    	</ul>
		    	<input type="button" value="登录" class="login_btn" @click="yzmLogin()" />
		    </div> -->
		    <!--手机号登陆内容结束-->
	    </div>
	  </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
import CryptoJS from "crypto-js";
export default {
  name: 'login',
  data () {
    return {
    	cur:0,//tab切换
    	//用户名数据
      userForm:{
      	name:'',
      	passWord:''
      },
      yzmForm:{
      	tel:'',
      	yzm:''
      },
      facility: '1',//登陆传值
      isSend:true,//发送验证码
      btnTitle:60,//倒计时
      isRem:false,
      targetUrl : ""
    }
  },
  mounted: function () {
  	let this_ = this;
    this.$nextTick(function () {
      let this_ = this;
      this_.targetUrl = this_.$route.query.target != undefined ? this_.$route.query.target : "";
      console.log('来源：'+this_.targetUrl);
      //this_.bus.$emit('loading', true);
      //this_.bus.$emit('tipShow', "用户名不能为空");
      //this_.bus.$emit('ShowConfirm',{title:'标题',content:'内容提示语内容提示语内容提示语内容提示语内容提示语',btn:'2'})
  		//this_.login()
    })
  },
  created:function(){
  	let this_ = this;
  	if(localStorage.getItem("isRem") == 'true'){
  		this_.isRem = true;
  		this_.getCookie();
  		this_.login();
  	}
  },
  methods:{
  	/*用户名登陆*/
  	login(){
  		let this_ = this;
  		if(this_.$utils.check.isEmpty(this_.userForm.name)){
  			this_.bus.$emit('tipShow', "用户名不能为空");
  			return false;
  		}else if(this_.$utils.check.isEmpty(this_.userForm.passWord)){
  			this_.bus.$emit('tipShow', "密码不能为空");
  			return false;
  		}/*else if(!this_.$utils.check.pswCheck(this_.userForm.passWord)){
  			this_.bus.$emit('tipShow', "密码6-20位数字或字母组成");
  			return false;
  		}*/
  		//获取guid
  		this_.bus.$emit('loading', true);
    	this_.$api.get({
        url: this_.$apiUrl.api.getLogin + '?name='+this_.userForm.name,
        params: {},
        success: function (data) {
        	if(data.State){
        		let mdPasswd = md5(this_.userForm.passWord + data.centent.code).toUpperCase(); //md5加密
	        	this_.$api.post({
			        url: this_.$apiUrl.api.getLogin,
			        params: {
			        	"loginname": this_.userForm.name,
			        	"password": mdPasswd,
			        	"facility": this_.facility,
			        	//"ip":returnCitySN["cip"],
			        	"ip":"",
			        	"mac":""
			        },
			        success: function (data) {
			        	this_.bus.$emit('loading', false);
			        	if(data.State){
				        	sessionStorage.setItem("token", data.centent.Token); //存入token
				        	let userdata = {
										dataset:data.centent.userinfo.dataset,
										dataset1:(data.centent.userinfo.dataset1).concat(data.centent.userinfo.dataset2)
									};
						      sessionStorage.setItem("userinfo", JSON.stringify(userdata)); //存入userinfo
				          //记住密码
				          if(this_.isRem){
				          	//传入账号，密码，保存天数
	                  this_.setCookie(this_.userForm.name, this_.userForm.passWord, 7);
				          }else{
				          	//清空Cookie
	                  this_.clearCookie();
				          }
				          localStorage.setItem("isRem", this_.isRem);
				          //this_.$router.push('/index');

                  //登录成功后跳转index.vue还是lhqSearch.vue
                  if(this_.targetUrl == "search"){
                    this_.$router.push('/lhqSearch')
                  }else{
                    this_.$router.push('/index');
                  }

			        	}else{
			        		this_.bus.$emit('tipShow', data.Message);
			        	}

			        }
			      });
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
        	}

        }
      });

  	},

  	/*验证码登陆*/
  	yzmLogin(){
  		let this_ = this;
  		if(this_.$utils.check.isEmpty(this_.yzmForm.tel)){
  			this_.bus.$emit('tipShow', "手机号不能为空！");
  			return false;
  		}else if(!this_.$utils.check.checkMobile(this_.yzmForm.tel)){
  			this_.bus.$emit('tipShow', "手机号不合法！");
  			return false;
  		}else if(this_.isSend){
  			this_.bus.$emit('tipShow', "点击获取验证码！");
  			return false;
  		}else if(this_.$utils.check.isEmpty(this_.yzmForm.yzm)){
  			this_.bus.$emit('tipShow', "验证码不能为空！");
  			return false;
  		}
  		this_.bus.$emit('loading', true);
  		this_.$api.post({
        url: this_.$apiUrl.api.getCodeLogin,
        params: {
        	"tel":this_.yzmForm.tel,
        	"code":this_.yzmForm.yzm,
        	"facility":this_.facility,
        	//"ip":returnCitySN["cip"],
        	"ip":"",
        	"mac":""
        },
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.State) {
        		sessionStorage.setItem("token", data.centent.Token); //存入token
        		let userdata = {
							dataset:data.centent.userinfo.dataset,
							dataset1:(data.centent.userinfo.dataset1).concat(data.centent.userinfo.dataset2)
						};
			      sessionStorage.setItem("userinfo", JSON.stringify(userdata)); //存入userinfo
						this_.$router.push('/index');
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
        	}

        }
      });

  	},

  	/*倒计时*/
  	yzmTime(){
  		let this_ = this;
  		let time = 60;
		  let timer = setInterval(() => {
			  if(time == 0) {
			    clearInterval(timer);
			    this_.isSend = true;
			    this_.btnTitle = "获取验证码";
			  } else {
			    this_.btnTitle =time + '秒后重试';
			    this_.isSend = false;
			    time--
			  }
		  },1000);
  	},

  	/*点击获取验证码*/
  	getYzm(){
  		let this_ = this;
  		if(!this_.$utils.check.checkMobile(this_.yzmForm.tel)){
  			return false;
  		}
  		let mdCode = '[{"tel":"'+ this_.yzmForm.tel +'"}]';
  		let mdTel = md5(mdCode,mdCode).toUpperCase();
  		this_.bus.$emit('loading', true);
  		this_.$api.post({
        url: this_.$apiUrl.api.getCode + '?type=0',
        params: {"m":mdTel,"value":'[{"tel":"'+this_.yzmForm.tel+'"}]'},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.State){
        		this_.yzmTime();
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
        	}

        }
      });
  	},

  	//设置cookie方法
    setCookie(mobile, passWord, days) {
      var textVal = CryptoJS.AES.encrypt(passWord, 'secret key 123');//使用CryptoJS方法加密
      var saveDays = new Date(); //获取时间
      saveDays.setTime(saveDays.getTime() + 24 * 60 * 60 * 1000 * days); //保存的天数
      //字符串拼接存入cookie
      window.document.cookie = "mobile" + "=" + mobile + ";path=/;saveDays=" + saveDays.toGMTString();
      window.document.cookie = "password" + "=" + textVal + ";path=/;saveDays=" + saveDays.toGMTString();
    },
  	//读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('='); //再次切割
          //这里会切割出以mobile为第0项的数组、以password为第0项的数组，判断查找相对应的值
          if (arr2[0] == 'mobile') {
            this.userForm.name = arr2[1]; //拿到账号
          } else if (arr2[0] == 'password') {
            //拿到拿到加密后的密码arr2[1]并解密
            var bytes = CryptoJS.AES.decrypt(arr2[1].toString(), 'secret key 123');
            var plaintext = bytes.toString(CryptoJS.enc.Utf8); //拿到解密后的密码（登录时输入的密码）
            this.userForm.passWord = plaintext;
          }
        }
      }
    },
    //清除cookie
    clearCookie() {
      this.setCookie("", "", 0); //账号密码置空，天数置0
    }


  }
}
</script>
<style scoped="scoped">
	.bg_upgrade{
		position: fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:url(../assets/images/common/bg_upgrade.jpg)no-repeat center center;
		background-size:100%;
		z-index: 5;
	}
</style>
