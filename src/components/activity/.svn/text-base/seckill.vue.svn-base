<template>
  <div class="seckill_container">
  	<div class="seckill_main">
  		<div class="product_cont" v-if="proList.length>0" v-for="(list,index01) in proList">
  			<h2 class="activity_title">{{list.a_title}}</br><span>活动时间：{{list.a_state_time.replace(/\//g,"-")}}至{{list.a_end_time.replace(/\//g,"-")}}</span></h2>
	  	  <ul class="seckill_list" v-if="proList.length>0">
	  	  	<!--<li>
	  	  		<p>5059060&ensp;玻璃升降器支架 &ensp;82481-2L001</p>
	  	  		<span>规格：I30 前右&ensp;数量：4只</span></br>
	  	  		<div class="seckill_bar clearfix">
							<dl class="barbox"><dd class="barline"><div width="20" class="charts"></div></dd></dl>
							<span>已抢购<em class="salePercent">20</em>%</span>
						</div>
	  	  		<div class="seckill_foot clearfix">
	  	  			<span>秒杀价：<em>¥:0.00</em><i>￥:30.00</i></span>
	  	  			<input type="button" value="马上抢" />
	  	  		</div>
	  	  	</li>-->
	  	  	<li v-for="(item,index02) in list.item">
	  	  		<p>{{item.oem}}&ensp;{{item.mb002}}</p>
	  	  		<span>规格：{{item.mb003}}&ensp;数量：{{item.i_limit_qty}}{{item.mb004}}</span></br>
	  	  		<div class="seckill_bar clearfix">
							<dl class="barbox"><dd class="barline"><div :width="iem.perce" class="charts"></div></dd></dl>
							<span>已抢购<em class="salePercent">perce</em>%</span>
						</div>
	  	  		<div class="seckill_foot clearfix">
	  	  			<span>{{item.a_type_text}}价：<em>¥:{{item.i_price}}</em><i>￥:{{item.price}}</i></span>
	  	  			<input type="button" value="item.btnTxt" class="item.btnTxt == '未开始' ? 'noStart' : '' " @click="toBuy(list.a_id,item,index01,index02)" />
	  	  		</div>
	  	  	</li>
	  	  </ul>
  	  </div>
  	  <div class="product_cont">
  			<h2 class="activity_title">活动标题<label>活动倒计时：</label></br><span>活动时间：2020-3-5至2020-4-5</span></h2>
	  	  <ul class="seckill_list">
	  	  	<li>
	  	  		<p>5059060&ensp;玻璃升降器支架 &ensp;82481-2L001</p>
	  	  		<span>规格：I30 前右&ensp;数量：4只</span></br>
	  	  		<div class="seckill_bar clearfix">
							<dl class="barbox"><dd class="barline"><div width="20" class="charts"></div></dd></dl>
							<span>已抢购<em class="salePercent">20</em>%</span>
						</div>
	  	  		<div class="seckill_foot clearfix">
	  	  			<span>秒杀价：<em>¥:0.00</em><i>￥:30.00</i></span>
	  	  			<input type="button" value="马上抢" />
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
import './../../../static/date/jquery-1.9.1.min.js'
import './../../../static/awardRotate.js'
export default {
  name: 'Product',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	proList:[],
    	isLoad:false,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.getProduct(this_.$route.query.a_id);
      
    })
  },
  methods:{
  	//获取产品列表
  	getProduct:function(a_id){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getActivity + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&brand=' + this_.userInfo.dataset[0].dpt + '&a_id=' + a_id + '&ma075=' + this_.userInfo.dataset[0].ma075 + '&ma017=' + this_.userInfo.dataset[0].ma017,
        params: {},
        success: function (data01) {
        	this_.bus.$emit('loading', false);
        	this_.proList = data01;
        	this_.getActivityState();
        	this_.isLoad = true;
        }
      });
  	},
  	
  	//判断活动状态，是否已抢，抢完
  	getActivityState:function(){
  		let this_ = this;
  		let isStart = '';
  		for(let i=0;i<this_.proList.length;i++){
  			//判断活动是否开始，按钮状态
	    	this_.$api.get({
	        url: this_.$apiUrl.api.ActivityState + '?a_id=' + this_.proList[i].a_id,
	        params: {},
	        success: function (data02) {
	        	this_.bus.$emit('loading', false);
	        	isStart = data02;//对象添加字段，判断活动是否开始
	        	
	        	//判断活动是否已抢，是否抢完
	        	this_.$api.get({
			        url: this_.$apiUrl.api.ActivityItemState + '?c_ma001=' + this_.userInfo.dataset[0].ma001 +'&a_id='+ this_.proList[i].a_id +'&i_id=',
			        params: {},
			        success: function (data03) {
			        	this_.bus.$emit('loading', false);
			        	stateArr = data03;
			        	
			        	let actPro = this_.proList[i].item;
			        	for(let j=0;j<actPro.length;j++){
			        		actPro[j].perce = parseInt((actPro[ij].i_sale_qty/actPro[j].i_qty)*100);//已抢购百分数
			        		for(var k=0; k<stateArr.length; k++){
			        			//判断是否开始
			        			if(isStart == Number(1)){
			        				//已开始
			        				if(stateArr[k].i_id == actPro[j].i_id){
									  		if(stateArr[k].state == Number(-1)){
									  			//已抢完
									  			actPro[j].btnTxt = '已抢完';
									  		}else if(stateArr[k].state == Number(0)){
									  			//已抢
									  			actPro[j].btnTxt = '已抢';
									  		}else if(stateArr[k].state == Number(1)){
									  			//马上抢
									  			actPro[j].btnTxt = '马上抢';
									  		}
									  		break ;
									  	}
			        			}else if(isStart == Number(0)){
			        				//未开始
			        				actPro[j].btnTxt = '未开始';
			        			}
								  	
								  }
			        		
			        	}
			        	
			        	//进度条效果
								$(".charts").each(function(i,item){
					        var a=$(item).attr("width");
					        $(item).animate({
					          width: a+"%"
					        },1000);
					      });
			        	
			        }
			      });
	        	
	        	
	        }
	      });
  		}
  		
  	},
  	
  	//马上抢
  	toBuy:function(a_id,item,index01,index02){
  		let this_ = this;
  		let flashPara = {
  			c_id:this_.userInfo.dataset[0].c_id,
  			c_login:this_.userInfo.dataset[0].c_login,
  			c_ma001:this_.userInfo.dataset[0].ma001,
  			c_ma002:this_.userInfo.dataset[0].ma002,
  			dpt:this_.userInfo.dataset[0].dpt,
  			a_id:a_id,
  			i_id:item.i_id,
  			addr:this_.userInfo.dataset[0].ma027,
  			tel:this_.userInfo.dataset[0].c_tel,
  			kf:this_.userInfo.dataset[0].kf
  		};
  		if(item.btnTxt == '马上抢'){
  			this_.bus.$emit('loading', true);
  			this_.$api.post({
	        url: this_.$apiUrl.api.FlashSale,
	        params:flashPara,
	        success: function (data) {
	        	this_.bus.$emit('loading', false);
	        	if(data.State){
	        		this_.proList[index01].item[index02].perce = parseInt(this_.proList[index01].item[index02].perce) + parseInt((item.i_limit_qty/item.i_qty)*100);
	        		this_.proList[index01].item[index02].btnTxt = '已抢';
	        		this_.bus.$emit('tipOk', '您已抢到，详情请在个人中心订单查询中查看');
	        	}else{
	        		this_.bus.$emit('tipOk',data.Message);
	        		if(data.Message == '服务器繁忙请重试'){
	        			//判断活动是否已抢，是否抢完
			        	this_.$api.get({
					        url: this_.$apiUrl.api.ActivityItemState + '?c_ma001=' + this_.userInfo.dataset[0].ma001 +'&a_id='+ a_id +'&i_id=' + item.i_id,
					        params: {},
					        success: function (data) {
					        	this_.bus.$emit('loading', false);
					        	if(data[0].state == Number(-1)){
												this_.proList[index01].item[index02].btnTxt = "已抢完";
												this_.proList[index01].item[index02].perce = 100;
											}else if(data[0].state == Number(0)){
												this_.proList[index01].item[index02].btnTxt = "已抢";
											}else if(data[0].state == Number(1)){
												this_.proList[index01].item[index02].btnTxt = "马上抢";
											}
					        	
					        	
					        }
					      });
	        		}else if(data.Message == '该活动产品已抢完'){
	        			this_.proList[index01].item[index02].btnTxt = "已抢完";
								this_.proList[index01].item[index02].perce = 100;
	        		}
	        		
	        		
	        	}
	        	
	        }
	      });
  		}else{
  			this_.bus.$emit('tipShow', item.btnTxt);
  		}
  	},
  	
  	//倒计时
  	GetRTime:function(nowTim,startTim,el){
    let EndTime= new Date(startTim);  //活动开始时间
    let NowTime= new Date(nowTim);
    /*var NowTime = new Date();
    if(NowTime.getTime() > EndTime.getTime()){
      EndTime= new Date(endTim);  //活动结束时间
    }*/
    let cutTim = parseInt(el.attr("cutTim"));
    let t =EndTime.getTime() - NowTime.getTime()- cutTim;
    let d=0;
    let h=0;
    let m=0;
    let s=0;
    
    if(t>=0){
      d=Math.floor(t/1000/60/60/24);
      h=Math.floor(t/1000/60/60%24);
      m=Math.floor(t/1000/60%60);
      s=Math.floor(t/1000%60);
      if(d==0&&h==0&&m==0&&s==0){
      	el.find(".runTim").hide();
      	el.find(".tobuy").attr("isbuy","true");
      	el.find(".tobuy").val("马上抢");
      	el.find(".tobuy").removeAttr("disabled");
      	el.find(".seckill_list>li").bind("click",function(){
      		rushBuy($(this),$(this).attr("a_id"),$(this).attr("i_limit_qty"),$(this).attr("i_qty"));
      	});
      	
	    }
    }
  	el.find(".tm-2").html(d + '天');
  	el.find(".tm-3").html(h + '时');
  	el.find(".tm-4").html(m + '分');
  	el.find(".tm-5").html(s + '秒');
    el.attr("cutTim",cutTim + 1000)
}
  	
  	
  }
}
</script>
