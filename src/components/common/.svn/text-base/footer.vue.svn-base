<template>
<!--公共footer内容开始-->
<div class="com_footer">
	<ul class="com_footList clearfix">
		<li><router-link :to="{path: '/index'}"><i class="home"></i>首页</router-link></li>
		<li><router-link :to="{path: '/activity/index'}"><i class="activity"></i>活动</router-link></li>
		<li class="cart"><router-link :to="{path: '/cart'}"><em v-if="cartTotal>0">{{cartTotal}}</em><i class="cart"></i>购物车</router-link></li>
		<li><router-link :to="{path: '/userCenter/index'}"><i class="user"></i>个人中心</router-link></li>
	</ul>
</div>

<!--公共footer内容结束-->
</template>

<script>
export default {
  name: '',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
      cartTotal:0
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.GetCartNum();
    })
  },
  created() {
    var this_ = this;
    this_.bus.$on('cartTotal', function(num) {
      this_.cartTotal = num;
    });
  },

  methods: {
  	GetCartNum:function(){
  		let this_ = this;
  		this_.$api.get({
        url: this_.$apiUrl.api.cartTotal + '?c_id=' + this_.userInfo.dataset[0].c_id,
        params:{},
        success: function (data) {
        	sessionStorage.setItem("cartTotal", data); //存入购物车总数
        	this_.cartTotal = data;
        }
      });
  		
  	}
  }
}
</script>
