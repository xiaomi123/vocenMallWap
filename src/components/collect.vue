<template>
  <div class="com_container">
  	<div class="dpt_content">
			<!--品牌tab切换内容开始-->
  		<dptList-view @changetab="changetab"></dptList-view>
  		<!--品牌tab切换内容结束-->
		</div>
  	<div class="product_main">
  	  <ul class="product_list">
  	  	<li v-for="(item,index) in collList" v-if="item.f_id != ''">
  	  		<div class="product_left">
  	  			<proLeft-view :proItem="item"></proLeft-view>
  	  		</div>
  	  		<div class="product_right">
  	  			<iconList-view :collItem="item" :num="item.f_i_ma001" :name="item.f_i_ma002"></iconList-view>
  	  			<cart-view :cartList="item" :num="item.f_i_ma001" :name="item.f_i_ma002"></cart-view>
  	  		</div>
  	  	</li>
  	  </ul>
  	  <p  v-if="collList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  	<footer-view></footer-view>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	collList:[],
    	isLoad:false,
    }
  },
  methods:{
  	//品牌tab切换
  	changetab:function(index){
  		let this_ = this;
  		this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  		this_.getCollect(index);//品类列表
  	},
  	
  	//收藏列表查询
  	getCollect:function(dptindex){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.GetFavorite + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001='+ this_.userInfo.dataset1[dptindex].ma001 +'&ma075=' + this_.userInfo.dataset1[dptindex].ma075 + '&dpt='+ this_.userInfo.dataset1[dptindex].dpt,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.isLoad = true;
        	for(var i=0;i<data.length;i++){
        		data[i].mb001 = data[i].f_i_mb001;
        		data[i].mb002 = data[i].f_i_mb002;
        		data[i].mb003 = data[i].f_i_mb003;
        		data[i].mb004 = data[i].f_i_mb004;
        		data[i].oem = data[i].f_oem;
        		data[i].id = i;
        	}
        	this_.collList = data;
        }
      });
  	},
  	
  }
}
</script>
