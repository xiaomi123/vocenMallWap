<template>
  <div class="com_container">
  	<div class="dpt_content">
			<!--品牌tab切换内容开始-->
  		<dptList-view @changetab="changetab"></dptList-view>
  		<!--品牌tab切换内容结束-->
		</div>
  	<div class="product_main">
  		<div class="product_cont" v-for="(list,index) in proList">
  			<h2 class="activity_title" v-show="list.item.length>0" @click="toggle(index)">{{list.a_title}}</br><span>活动时间：{{list.a_state_time}}至{{list.a_end_time}}</span></h2>
	  	  <ul class="product_list" v-show="list.item.length>0">
	  	  	<li v-for="ite in list.item" @click="toDetail(list,ite)">
	  	  		<div class="product_left">
	  	  			<proLeft-view :proItem="ite"></proLeft-view>
	  	  		</div>
	  	  		<div class="product_right">
	  	  			<iconList-view :collItem="ite" :num="ite.mb005" :name="ite.ma003"></iconList-view>
	  	  			<cart-view :cartList="ite" :num="ite.mb005" :name="ite.ma003"></cart-view>
	  	  			<span>{{ite.m_st!=''?ite.m_st:''}}</span>
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
  name: 'activityIndex',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	proList:[],
    	curIndex:-1,
    	isLoad:false,
    }
  },
  methods:{
  	//toggle切换
  	toggle:function(index){
  		let this_ = this;
  		if(this_.curIndex == index){
  			this_.curIndex = -1;
  		}else{
  			this_.curIndex = index;
  		}
  		
  	},
  	//品牌tab切换
  	changetab:function(index){
  		let this_ = this;
  		this_.getProduct(this_.$route.query.a_id,index);
  	},
  	//获取产品列表
  	getProduct:function(a_id,index){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getActivity + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset1[index].ma001 + '&brand=' + this_.userInfo.dataset1[index].dpt + '&a_id=&ma075=' + this_.userInfo.dataset1[index].ma075 + '&ma017=' + this_.userInfo.dataset1[index].ma017,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	for(var i=0;i<data.length;i++){
        		for(var j=0;j<data[i].item.length;j++){
        			//购物车数据格式统一
					    data[i].item[j].a_type_no = data[i].a_type_no;
					    data[i].item[j].aprice = data[i].item[j].i_price;
					    data[i].item[j].activity = data[i].item[j].i_a_id;
					    data[i].a_state_time = data[i].a_state_time.replace(/\//g,"-");
					    data[i].a_end_time = data[i].a_end_time.replace(/\//g,"-");
					    data[i].item[j].cartType = 'product';
        		}
					  
        	}
        	
        	this_.proList = data;
        	this_.isLoad = true;
        }
      });
  	},
  	
  	//跳转详情
  	toDetail:function(list,item){
  		let this_ = this;
  		if(item.imgqty>0){
  			this_.$router.push({path:'/proDetail', query: {ma001:list.num,mb001:item.mb001,mb002:item.mb002}});
  		}
  		
  	},
  	
  }
}
</script>
