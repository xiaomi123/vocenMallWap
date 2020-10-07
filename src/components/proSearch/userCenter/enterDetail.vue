<template>
  <div class="buyHistory_container">
  	<div class="dpt_content">
			<!--品牌tab切换内容开始-->
  		<dptList-view @changetab="changetab"></dptList-view>
  		<!--品牌tab切换内容结束-->
		</div>
  	<div class="product_main">
  		<div class="com_date">
  			<input type="text" id="start_time" readonly="readonly" placeholder="请选择日期" />&ensp;-&ensp;
  			<input type="text" id="end_time" readonly="readonly" placeholder="请选择日期" />
  			<input type="text" v-model="note" placeholder="产品名称/产品编号/oem" class="serchNote" />
  			<span @click="toSearch()">查询</span>
  		</div>

  		<div class="product_cont" style="padding-top:1.3rem;">
	  	  <ul class="order_list">
	  			<li v-for="item in saleList">
	  				<h2>订单号：<span>{{item.i_s_code}}</span></h2>
	  				<div class="order_cont">
	  					<ul class="order_det">
		  					<li>
		  						<label>oem/品号:</label>
		  						<span>{{item.i_oem}}</span>
		  					</li>
		  					<li>
		  						<label>品类:</label>
		  						<span>{{item.i_ma002}}</span>
		  						&ensp;
		  						<label>品名:</label>
		  						<span>{{item.i_mb002}}</span>
		  					</li>
		  					<li>
		  						<label>规格:</label>
		  						<span>{{item.i_mb003}}</span>
		  					</li>
		  					<li>
		  						<label>数量:</label>
		  						<span>{{item.i_qty}}</span>
		  						&ensp;
		  						<label>单位:</label>
		  						<span>{{item.i_mb004}}</span>
		  					</li>
		  					<li>
		  						<label>下单日期:</label>
		  						<span>{{item.s_create_time}}</span>
		  					</li>
	  					</ul>
	  				</div>
	  			</li>
	  		</ul>
  	  </div>
  	  <p  v-if="saleList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  </div>
</template>

<script>
import './../../../../static/date/jquery-1.9.1.min.js'
import './../../../../static/date/mobiscroll.core-2.5.2.js'
import './../../../../static/date/mobiscroll.datetime-2.5.1.js'
export default {
  name: 'enterDetail',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	saleList:[],
    	sdt:'',
    	edt:'',
    	note:'',
    	dptIndex:'',//选中品牌
    	isInit:true,//判断是否初始化
    	isLoad:false,
    }
  },

  methods:{
  	//初始化日期
  	initDate:function(){
  		let this_ = this;
      //时间插件
			let today = new Date();
			let optDate = {
				preset: 'date', //日期
				theme: 'android-ics light', //皮肤样式
				display: 'modal', //显示方式
				mode: 'scroller', //日期选择模式
				lang: 'zh',
				showNow: false,
			};
			let optDate2 = {
				preset: 'date', //日期
				theme: 'android-ics light', //皮肤样式
				display: 'modal', //显示方式
				mode: 'scroller', //日期选择模式
				lang: 'zh',
				showNow: false,
				//minDate: new Date(today.getFullYear(), today.getMonth(), (today.getDate())), `
				maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			};
  		let month = today.getMonth()>9 ? (today.getMonth()-1) : ('0'+(today.getMonth()-1));
			let monthEdt = today.getMonth()>9 ? (today.getMonth()+1) : '0'+ (today.getMonth()+1);
			let day = today.getDate()>9 ? today.getDate() : ('0'+today.getDate());
		  let startDate = today.getFullYear() + '-' + month + '-' + day;
		  let endDate = today.getFullYear() + '-' + monthEdt + '-' + day;
		  $("#start_time").mobiscroll(optDate).val(startDate);
			$("#end_time").mobiscroll(optDate2).val(endDate);
			$("#start_time").val(startDate);
			$("#end_time").val(endDate);
  	},

  	//点击查询
  	toSearch:function(){
  		let this_ = this;
  		console.log($("#start_time").val())
  		this_.saleDetailQty(this_.dptIndex,$("#start_time").val(),$("#end_time").val());
  	},

  	//品牌tab切换
  	changetab:function(index){
  		let this_ = this;
  		this_.dptIndex = index;
  		if(this_.isInit){
  			this_.initDate();
  			this_.isInit = false;
  		}
  		this_.saleDetailQty(index,$("#start_time").val(),$("#end_time").val());
  	},
  	//获取产品列表
  	saleDetailQty:function(index,sdt,edt){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		sdt = sdt.split("-").join("");
  		edt = edt.split("-").join("");
  		this_.$api.get({
        url: this_.$apiUrl.api.SaleDetails + '?c_ma001=' + this_.userInfo.dataset1[index].ma001 + '&sdt=' + sdt + '&edt=' + edt + '&note=' + this_.note,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.saleList = data;
        	this_.isLoad = true;
        }
      });
  	},


  }
}
</script>
<style>
	@import url("../../../assets/css/mobiscroll.css");
</style>
