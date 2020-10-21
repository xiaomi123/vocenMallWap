<template>
  <div class="userInfo_container">
  	<!--主要内容开始-->
  	<div class="userInfo_main">
  		<ul class="userInfo_list">
  			<li>
  				<label>手&ensp;机&ensp;号</label>
  				<input type="text" v-model="userInfo.dataset[0].c_tel" readonly="readonly" />
  			</li>
  			<!-- <li>
  				<label>验&ensp;证&ensp;码</label>
  				<div class="userInfo_code clearfix">
  					<input type="text" placeholder="请输入验证码" v-model="yzm" />
  					<input type="button" value="获取验证码" @click="getYzm()" v-show="isSend" />
  					<span v-show="!isSend">{{btnTitle}}</span>
  				</div>
  			</li> -->
  			<li>
  				<label>设置密码:</label>
  				<input type="password" v-model="newPass" placeholder="请输入密码" />
  			</li>
  			<li>
  				<label>确认密码</label>
  				<input type="password" v-model="confPass" placeholder="请再次输入密码" />
  			</li>
  		</ul>
  		<span class="com_btn" @click="editOk()">确认</span>
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name: 'editInfo',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	isSend:true,//发送验证码
      btnTitle:60,//倒计时
    	newPass:'',//设置密码
    	confPass:'',
    	yzm:''//验证码
    }
  },
  methods:{

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
  		let tel = this_.userInfo.dataset[0].c_tel;
  		let mdCode = '[{"tel":"'+ tel +'"}]';
  		let mdTel = md5(mdCode,mdCode).toUpperCase();
  		this_.bus.$emit('loading', true);
  		this_.$api.post({
        url: this_.$apiUrl.api.getCode + '?type=1',
        params: {"m":mdTel,"value":'[{"tel":"'+tel+'"}]'},
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

  	/*修改密码*/
  	editOk(){
  		let this_ = this;
  		/*if(this_.isSend){
  			this_.bus.$emit('tipShow', '点击获取验证码');
  			return false;
  		}else if(this_.$utils.check.isEmpty(this_.yzm)){
  			this_.bus.$emit('tipShow', '验证码不能为空');
  			return false;
  		}else if(!this_.$utils.check.pswCheck(this_.newPass)){
  			return false;
  		}else */if(this_.$utils.check.isEmpty(this_.confPass)){
  			this_.bus.$emit('tipShow', '请再次输入密码');
  			return false;
  		}else if(this_.newPass != this_.confPass){
  			this_.bus.$emit('tipShow', '两次密码不一致');
  			return false;
  		}
	  	//获取guid
	  	this_.$api.get({
	      url: this_.$apiUrl.api.getLogin + '?name=' + this_.userInfo.dataset[0].c_login,
	      params: {},
	      success: function (data) {
	      	if(data.State){
	      		let codeMdVal = this_.userInfo.dataset[0].c_id + this_.newPass + data.centent.code;
						let mdSign = md5(codeMdVal,codeMdVal).toUpperCase();//md5加密
	      		this_.$api.post({
				      url: this_.$apiUrl.api.EditPass,
				      params: {"c_id":this_.userInfo.dataset[0].c_id,"c_login":this_.userInfo.dataset[0].c_login,"password":this_.newPass,"sign":mdSign,"tel":this_.userInfo.dataset[0].c_tel,"code":"123456"},//"code":this_.yzm},
				      success: function (data) {
				      	this_.bus.$emit('loading', false);
				      	//console.log(data)
				      	if(data.State){
                  this_.bus.$emit('tipShow', data.Message);
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


  }
}
</script>
