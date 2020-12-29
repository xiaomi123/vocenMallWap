<template>
  <div class="order_container">
  	<!--主要内容开始-->
  	<div class="order_main">
  		<!--订单状态切换内容开始-->
			<ul class="order_tab clearfix">
				<li v-for="(item,index) in tabList" :class="tabIndex == index ? 'active':''" @click="orderTab(index)">{{item.name}}</li>
			</ul>
			<!--订单状态切换内容结束-->
  		<ul class="order_list">
  			<li v-for="(item,index) in orderList">
  				<h2>{{item.s_type}}<span>{{item.s_code}}</span><em>{{item.s_state}}</em></h2>
  				<div class="order_cont">
  					<ul class="order_det">
	  					<li>
	  						<label>品牌:</label>
	  						<span>{{item.s_dpt}}</span>
	  					</li>
	  					<li>
	  						<label>数量:</label>
	  						<span>{{item.s_qty}}</span>
	  					</li>
	  					<li>
	  						<label>日期:</label>
	  						<span>{{item.s_create_time}}</span>
	  					</li>
	  					<li>
	  						<label>备注:</label>
	  						<span>{{item.s_note}}</span>
	  					</li>
	  				</ul>
	  				<p class="order_detBtn">
	  					<span @click="orderDet(item)">详情</span>
	  					<span v-show="parseInt(item.s_state_no) > 0 && parseInt(item.s_state_no) < 4" @click="reGoods(item.s_c_id,item.s_id,index)">确认收货</span>
	  				</p>
  				</div>
  			</li>
  		</ul>
  		<p v-show="orderList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'order',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	tabList:[
    		{"name":"全部订单","value":""},
    		{"name":"待接单","value":"0"},
    		{"name":"已接单","value":"1"},
    		{"name":"配货中","value":"2"},
    		{"name":"已发货","value":"3"},
    		{"name":"已送达","value":"4"}
    	],
    	tabIndex:0,
    	orderList:[],
    	noOrder:true,
    	pagIndex:1,//分页
    	isLoad:false,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.GetOrder(this_.tabIndex,this_.pagIndex);//订单查询
      $(window).on('scroll', function () {
		    // 判断是否滚动到底部的逻辑
		    let pageHeight = $('body').height(),
		        scrollTop = $(window).scrollTop(),
		        winHeight = $(window).height(),
		        thresold = pageHeight - scrollTop - winHeight;
		    if (thresold > -100 && thresold <= 20) {
		    	if(this_.noOrder){
		      	this_.pagIndex++;
		    		this_.GetOrder(this_.tabIndex,this_.pagIndex);
		      }
		    }
			});

    });
  },
  created:function(){
  	let this_ = this;
  	this_.bus.$on('confirmOk', function(para) {
  		//确认收货
  		this_.bus.$emit('loading', true);
  		this_.$api.post({
        url: this_.$apiUrl.api.Arrival,
        params:{"c_id":para.s_c_id,"c_login":this_.userInfo.dataset[0].c_login,"s_id":para.s_id},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.orderList[para.curIndex].s_state_no = 4;
          this_.orderList[para.curIndex].s_state = '已送达';
          this_.bus.$emit('tipOk', data.Message);
        }
     });

    });
  },
  methods:{
  	//tab切换
  	orderTab:function(index){
  		let this_ = this;
  		this_.tabIndex = index;
  		this_.pagIndex = 1;
  		this_.orderList = [];
  		this_.isLoad = false;
  		this_.GetOrder(index,this_.pagIndex);//订单查询
  	},

  	//查询订单
  	GetOrder:function(index,pagIndex){
  		let this_ = this;
  		let pagesize = 5;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.GetOrder + '?c_id=' + this_.userInfo.dataset[0].c_id + '&state=' + this_.tabList[index].value + '&pageindex='+ pagIndex +'&pagesize='+pagesize,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.isLoad = true;
        	if(this_.$utils.check.isEmpty(data.data)){
        		this_.noOrder = false;
        	}else{
        		this_.orderList = this_.orderList.concat(data.data);
        	}

        }
      });
  	},
  	//确认收货
  	reGoods:function(s_c_id,s_id,index){
  		let this_ = this;
  		this_.bus.$emit('ShowConfirm',{title:'提示',content:'是否确认收货？',btn:'2',s_c_id:s_c_id,s_id:s_id,curIndex:index});
  		//this_.confirmOk(s_c_id,s_id);
  		//console.log(s_c_id)
  	},

  	//查看详情
  	orderDet:function(listIte){
  		let this_ = this;
  		sessionStorage.setItem("orderItem", JSON.stringify(listIte));
  		this_.$router.push('/userCenter/orderDetail');
  	},

  }
}
</script>
