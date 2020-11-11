<template>
  <div class="userIndex_container">
  	<!--主要内容开始-->
  	<div class="userIndex_main">
  		<div class="userIndex_banner">
  			<p><router-link :to="{path: '/lhqSearch'}" class="iconfont">&#xe601;</router-link>个人中心</p>
  		</div>
  		<div class="userIndex_info">
				<span><img src="../../../assets/images/common/img_user.png" alt="" /></span>
				<p>
					<i>{{userInfo.dataset[0].ma002}}</i><br />
					<label>
						<input type="text" v-model="userName" @focus="nameFoucs()" v-bind:disabled="isEdit" ref="useName" />
				  	<em class="iconfont" v-show="isEdit" @click="toEdit()">&#xe710;</em>
				  	<em class="iconfont" v-show="!isEdit" @click="saveEdit()">&#xe606;</em>
					</label>
					<span><router-link :to="{path: '/userCenter/editInfo'}">修改密码</router-link></span>

				</p>
			</div>

  		<ul class="userIndex_list">
  			<li><router-link :to="{path: '/proSearch/userCenter/userInfo'}"><i class="iconfont list01">&#xe608;</i>我的资料<em class="iconfont">&#xe74b;</em></router-link></li>
  			<li><router-link :to="{path: '/proSearch/userCenter/myIntegral'}"><i class="iconfont list02">&#xe622;</i>我的积分<em class="iconfont">&#xe74b;</em></router-link></li>
  			<li><router-link :to="{path: '/proSearch/userCenter/order'}"><i class="iconfont list03">&#xe648;</i>订单查询<em class="iconfont">&#xe74b;</em></router-link></li>
  			<li><router-link :to="{path: '/proSearch/userCenter/enterDetail'}"><i class="iconfont list04">&#xe6d7;</i>进货明细<em class="iconfont">&#xe74b;</em></router-link></li>
  			<li><router-link :to="{path: '/collect'}"><i class="iconfont list05">&#xe643;</i>我的收藏<em class="iconfont">&#xe74b;</em></router-link></li>
  			<li><a href="javascript:void(0)" @click="loginOut()" v-if="isVis"><i class="iconfont" style="color:darkred">&#xe67b;</i>退出登陆</a></li>
  		</ul>

  	</div>
  	<sfooter-view></sfooter-view>
  	<!--主要内容结束-->
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name: 'index',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	userName:JSON.parse(sessionStorage.getItem("userinfo")).dataset[0].c_login,
    	isEdit:true,
    	oldName:'',
      isVis:true,//退出登陆是否显示
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      if(!this_.$utils.check.isEmpty(sessionStorage.getItem('openid'))){
        if(sessionStorage.getItem('openid') == 'oebB1' || sessionStorage.getItem('openid') == 'oebB2' || sessionStorage.getItem('openid') == 'oebB3' || sessionStorage.getItem('openid') == 'oebB4'){
          this_.isVis = false;
        }
      }
      
      document.title = sessionStorage.getItem('pageTitle');
      this_.bus.$emit('footer', true);
    })
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

  	//退出登陆
  	loginOut:function(){
  		let this_ = this;
      this_.$api.get({
        url: this_.$apiUrl.api.LoginOut + '?openid=' + sessionStorage.getItem('openid'),
        params: {},
        success: function (data) {
          if(data.State){
            //清空
            sessionStorage.setItem("token", ""); //清空token
            sessionStorage.setItem("userinfo", ""); //清空userinfo
            let brandType = 3;
            if(!this_.$utils.check.isEmpty(sessionStorage.getItem('brandType'))){
              brandType = sessionStorage.getItem('brandType')
            }
            this_.$router.push('/wxlogin?target=search&openid='+ sessionStorage.getItem('openid') +'&type='+brandType);
          }

        }
      });

  	},


  }
}
</script>
