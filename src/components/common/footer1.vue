<template>
<!--公共footer内容开始-->
<div class="com_footer">
	<ul class="com_footList clearfix">
		<li><router-link :to="{path: '/lhqSearch'}"><i class="home"></i>首页</router-link></li>
    <li><router-link :to="{path: '/buyHistory', query:{'type':'1'}}"><i class="record"></i>进货记录</router-link></li>
		<li class="cart"><router-link :to="{path: '/proSearch/cart'}"><em v-if="cartTotal>0">{{cartTotal}}</em><i class="cart"></i>购物车</router-link></li>
		<li><router-link :to="{path: '/proSearch/userCenter/index'}"><i class="user"></i>个人中心</router-link></li>
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
<style scoped>
  .com_footList>li{
    width: 25%;
  }
</style>
