<template>
  <div class="myIntegral_container">
  	<!--积分规则弹层内容开始-->
  	<div class="myIntegral_dialog" v-show="isRule">
  		<div class="myIntegral_rule">
  			<h2>网络订单系统积分累积使用规则 <i class="iconfont" @click="isRule=false">&#xe60f;</i></h2>
  			<div class="myIntegral_ruleTxt">
  				<h3>一、订单系统积分定义：</h3>
  				<p>1、积分是指注册用户在沃森本公司网络订单系统上购买产品所产生的交易金额，交易金额每元累积1分。</br>2、实际交易金额是指按照创建订单并完成交易的货物金额，不包含因促销送赠、退换货或者售后质赔的交易金额。</br>3、由沃森本公司人员协助录入单据产生的实际交易金额不累计积分。</p>
  				<h3>二、订单积分使用规则：</h3>
  				<p>1、积分可在积分有礼专区参加积分活动。按活动要求，参加后扣除相应积分。</br>2、现阶段活动包括积分兑换，积分抽奖。</br>3、积分已达到一定兑换标准时，用户可将累积积分按照相应积分兑换活动标准兑换相应礼品和公司产品，兑换成功后沃森本公司从用户名下扣除相应积分。</br>4、积分仅用于兑换礼品、公司产品和积分抽奖，并不得退换及兑换现金。</br>5、用户在积分兑换礼品页面上根据提示添加/修改联系方式。我们将按照用户在兑换时填写的信息来发送礼品，请务必保证其完整真实（以快递公司认可寄达地址为准）。如因地址问题造成无法发放或发错的，将视为弃权处理。</p>
  				<h3>三、积分使用的有效期：</h3>
  				<p>在2020年12月31日前用户获得的积分，有效期至2021年2月底，过期作废。</p>
  				<h3>四、以上解释权归沃森本公司所有。</h3>
  			</div>
  		</div>
  	</div>
  	<!--积分规则弹层内容结束-->
  	
  	<!--主要内容开始-->
  	<div class="myIntegral_content">
  		<div class="userIndex_banner">
  			<p><router-link :to="{path: '/userCenter/index'}" class="iconfont">&#xe601;</router-link>我的积分</p>
  		</div>
  		<div class="myIntegral_info">
				<i class="iconfont">&#xe622;</i>
				<span>当前积分：<em>{{integral}}</em>分</span>
			</div>
			<div class="myIntegral_txt clearfix">
				<h2 class="myIntegral_title">*积分规则</h2>
				凡持在该商城下单消费，系统将自动记录你的消费金额并积分，同时我们将定期举办各式各样的积分活动，让您真正享受到您的每一份支持都将获得我们的真情回报。不同帐户之间的积分不可转让或不可合并使用。
				<p><span @click="isRule = true">详情&ensp;&gt</span></p>
			</div>
			<div class="myIntegral_main">
	  		<h2 class="myIntegral_title">积分明细</h2>
	  		<ul class="myIntegral_list">
	  			<li v-for="item in inteList">
	  				<label>{{item.if_message}}</label>
	  				<span>{{item.if_create_date}}</span>
	  				<em><i v-if="parseInt(item.if_qty)>0">+</i>{{item.if_qty}}</em>
	  			</li>
	  		</ul>
	  		
  		</div>
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'myIntegral',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	integral:0,
    	inteList:[],
    	noInte:true,
    	isRule:false,//规则弹层显示隐藏
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.GetInte();
      
      let pagIndex = 1;
      if(this_.noInte){
      	this_.GetInteFlow(pagIndex);
      }
      
      $(window).on('scroll', function () {
		    // 判断是否滚动到底部的逻辑
		    let pageHeight = $('body').height(),
		        scrollTop = $(window).scrollTop(),
		        winHeight = $(window).height(),
		        thresold = pageHeight - scrollTop - winHeight;
		    if (thresold > -100 && thresold <= 20) {
		    	if(this_.noInte){
		      	pagIndex++;
		    		this_.GetInteFlow(pagIndex);
		      }
		    }
			});
			
    })
  },
  methods:{
  	//我的积分查询
  	GetInte:function(){
  		let this_ = this;
  		this_.$api.get({
        url: this_.$apiUrl.api.GetInte + '?c_id=' + this_.userInfo.dataset[0].c_id,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.integral = data;//积分
        }
      });
  		
  	},
  	
  	//积分明细查询
  	GetInteFlow:function(pagIndex){
  		let this_ = this;
  		let pagesize = 40;
  		this_.$api.get({
        url: this_.$apiUrl.api.GetInteFlow + '?c_id=' + this_.userInfo.dataset[0].c_id +'&pageindex='+ pagIndex +'&pagesize='+pagesize,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.rows.length==0){
        		this_.noInte = false;
        	}
        	this_.inteList=this_.inteList.concat(data.rows);//积分
        	//this_.inteList = data.rows;//积分
        }
      });
  		
  	},
  	
  }
}
</script>

