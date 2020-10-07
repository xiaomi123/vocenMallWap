<template>
  <div class="com_container">
  	<div class="dpt_content">
			<!--品牌tab切换内容开始-->
  		<dptList-view @changetab="changetab"></dptList-view>
  		<!--品牌tab切换内容结束-->
		</div>
  	<div class="product_main">
  		<div class="product_cont">
	  	  <ul class="product_list">
	  	  	<li v-for="(item,index) in proList" @click="toDetail(item)">
	  	  		<div class="product_left">
	  	  			<proLeft-view :proItem="item"></proLeft-view>
	  	  		</div>
	  	  		<div class="product_right">
	  	  			<iconList-view :collItem="item" :num="item.mb005" :name="item.ma003"></iconList-view>
	  	  			<cart-view :cartList="item" :num="item.mb005" :name="item.ma003"></cart-view>
	  	  			<p>{{item.m_st!=''?item.m_st:''}}</p>
	  	  		</div>
	  	  	</li>
	  	  </ul>
  	  </div>
  	  <p  v-if="proList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  	<footer-view></footer-view>
  </div>
</template>

<script>
export default {
  name: 'shortage',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	proList:[],
    	isLoad:false,
    }
  },
  
  methods:{
  	//品牌tab切换
  	changetab:function(index){
  		let this_ = this;
  		this_.buyHistoryQty(index);
  	},
  	//获取产品列表
  	buyHistoryQty:function(index){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getCart + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset1[index].ma001 + '&ma075=' + this_.userInfo.dataset1[index].ma075 + '&dpt=' + this_.userInfo.dataset1[index].dpt + '&ma017='+ this_.userInfo.dataset1[index].ma017 + '&type=2',
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	let shortArr = [];
        	let unShortArr = [];
        	if(data.length>0){
        		for(var i=0;i<data.length;i++){
						  data[i].cartType = 'product';
						  data[i].mb001 = data[i].s_i_mb001;
						  data[i].mb002 = data[i].s_i_mb002;
						  data[i].mb003 = data[i].s_i_mb003;
						  data[i].mb004 = data[i].s_i_mb004;
						  data[i].aprice = data[i].price;
						  data[i].a_type_no = data[i].i_type_no;
						  data[i].oem = data[i].s_oem;
						  if(parseInt(data[i].qty) == 0){
						  	unShortArr.push(data[i]);
						  }else{
						  	shortArr.push(data[i]);
						  }
						  data[i].shortQty = data[i].qty;
						  data[i].qty = data[i].s_qty;
	        	}
        		shortArr = shortArr.concat(unShortArr);
        	}
        	this_.proList = shortArr;
        	this_.isLoad = true;
        }
      });
  	},
  	
  	//跳转详情
  	toDetail:function(item){
  		let this_ = this;
  		if(item.imgqty>0){
  			this_.$router.push({path:'/proDetail', query: {ma001:item.s_i_ma001,mb001:item.s_i_mb001,mb002:item.s_i_mb002}});
  		}
  		
  	},
  	
  }
}
</script>
<style>
	@import url("../assets/css/mobiscroll.css");
</style>
