<template>
  <div class="buyHistory_container">
  	<div class="dpt_content">
			<!--品牌tab切换内容开始-->
  		<dptList-view @changetab="changetab"></dptList-view>
  		<!--品牌tab切换内容结束-->
		</div>
  	<div class="product_main">
  		<div class="com_date">
  			<input type="text" id="start_time" readonly="readonly" placeholder="请选择日期" v-model="sdt" />&ensp;-&ensp;
  			<input type="text" id="end_time" readonly="readonly" placeholder="请选择日期" v-model="edt" />
  			<input type="text" v-model="note" placeholder="产品名称/产品编号/oem" class="serchNote" />
  			<span @click="toSearch()">查询</span>
  		</div>

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
	  	  			<p >历史购买量:{{item.lsqty!=''?item.lsqty:''}}</p>
	  	  		</div>
	  	  	</li>
	  	  </ul>
  	  </div>
  	  <p  v-if="proList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  	<footer-view v-if="isLy"></footer-view>

    <!--查询系统底部footer内容开始-->
    <sfooter-view v-else></sfooter-view>
    <!--查询系统底部footer内容结束-->
  </div>
</template>

<script>
import './../../static/date/jquery-1.9.1.min.js'
import './../../static/date/mobiscroll.core-2.5.2.js'
import './../../static/date/mobiscroll.datetime-2.5.1.js'
export default {
  name: 'Product',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	proList:[],
    	sdt:'',
    	edt:'',
    	note:'',
    	dptIndex:'',//选中品牌
    	isInit:true,//判断是否初始化
    	isLoad:false,
      isLy:true,//判断是否从查询系统进入
    }
  },
 mounted: function() {
    this.$nextTick(function() {
      let this_ = this;
      if(!this_.$utils.check.isEmpty(this_.$route.query.type)){
        if(this_.$route.query.type == '1'){
          this_.isLy = false;
        }
      }

    });
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
			this_.sdt = startDate;
			this_.edt = endDate;
  	},

  	//点击查询
  	toSearch:function(){
  		let this_ = this;
  		this_.buyHistoryQty(this_.dptIndex,$("#start_time").val(),$("#end_time").val());
  	},

  	//品牌tab切换
  	changetab:function(index){
  		let this_ = this;
  		this_.dptIndex = index;
  		if(this_.isInit){
  			this_.initDate();
  			this_.isInit = false;
  		}
  		this_.buyHistoryQty(index,$("#start_time").val(),$("#end_time").val());
  	},
  	//获取产品列表
  	buyHistoryQty:function(index,sdt,edt){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		sdt = sdt.split("-").join("");
  		edt = edt.split("-").join("");
  		this_.$api.get({
        url: this_.$apiUrl.api.SaleRecord + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset1[index].ma001 + '&ma017=' + this_.userInfo.dataset1[index].ma017 + '&dpt=' + this_.userInfo.dataset1[index].dpt + '&sdt=' + sdt + '&edt=' + edt + '&ma001='+ this_.userInfo.dataset1[index].ma001 + '&ma075=' + this_.userInfo.dataset1[index].ma075 + '&note=' + this_.note,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	for(var i=0;i<data.length;i++){
					  data[i].cartType = 'product';
        	}
        	this_.proList = data;
        	this_.isLoad = true;
        }
      });
  	},

  	//跳转详情
  	toDetail:function(item){
  		let this_ = this;
  		if(item.imgqty>0){
  			this_.$router.push({path:'/proDetail', query: {ma001:item.mb005,mb001:item.mb001,mb002:item.mb002}});
  		}

  	},

  }
}
</script>
<style>
	@import url("../assets/css/mobiscroll.css");
</style>
