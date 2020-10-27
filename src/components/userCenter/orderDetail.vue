<template>
  <div class="orderDetail_container">
  	<!--发货详情弹层内容开始-->
  	<div class="orderDetail_dialog" v-show="isLogis">
  		<div class="orderDetail_logis">
  			<h2>物流详情<i class="iconfont" @click="isLogis = !isLogis">&#xe60f;</i></h2>
  			<ul class="logis_list">
  				<li>
  					<em></em>
  					<i class="logis07"></i>
  					<span>收货地址</br><i>{{detData.s_address}} </br>联系方式：{{detData.s_tel}}</i></span>
  				</li>
  				<li v-for="(item,index) in logisData">
  					<label>{{item.f_create_time.split(" ")[0]}}</br><i>{{item.f_create_time.split(" ")[1]}}</i></label>
  					<em v-show="logisData.length-1 != index"></em>
  					<i class="logis01" v-show="item.f_state_text == '生成订单'"></i>
  					<i class="logis02" v-show="item.f_state_text == '已接单'"></i>
  					<i class="logis08" v-show="item.f_state_text == '已打包'"></i>
  					<i class="logis03" v-show="item.f_state_text == '配货中'"></i>
  					<i class="logis04" v-show="item.f_state_text == '已装车'"></i>
  					<i class="logis05" v-show="item.f_state_text == '已发货'"></i>
  					<i class="logis06" v-show="item.f_state_text == '已送达'"></i>
  					<i class="logis09" v-show="item.f_state_text == '已取消'"></i>
  					<span>{{item.f_state_text}}</br><i>{{item.f_message}}</i></span>
  				</li>
  			</ul>
  		</div>
  	</div>
  	<!--发货详情弹层内容结束-->
  	
  	<!--产品明细弹层内容开始-->
  	<div class="orderDetail_dialog" v-show="isPro">
  		<div class="orderDetail_pro">
  			<h2>产品明细<i class="iconfont" @click="isPro = !isPro">&#xe60f;</i></h2>
				<p class="proTip" v-if="proList.length>0">*因为客服会多个订单合并接单,该发货详情有可能含有其他订单产品数量</p>
  			<table v-if="proList.length>0">
  				<tr>
  					<th>oem</th>
  					<th>规格</th>
  					<th>数量</th>
  					<th>单位</th>
  				</tr>
  				<tr v-for="item in proList">
  					<td>{{item.oem}}</td>
  					<td>{{item.std}}</td>
  					<td>{{item.num}}</td>
  					<td>{{item.unit}}</td>
  				</tr>
  			</table>
  			<p class="com_noData" v-if="proList.length==0">暂无数据</p>
  		</div>
  	</div>
  	
  	<!--产品明细弹层内容结束-->
  	
  	<!--主要内容开始-->
  	<div class="orderDetail_header">
			<p>订单号：{{detData.s_code}}</p>
  		<p v-for="list in erpnoArr">
  			销货单号：{{list.erp}}</br>
  			发货仓库：{{list.store}}
  			<span @click="logistics(list.erp)">发货详情</span>
  			<span @click="proDetail(list.erp)">产品明细</span>
  		</p>
  		<p>订单备注：{{detData.s_note}}</p>
		</div>
  	<div class="orderDetail_main">
  		<ul class="orderDetail_list">
  			<li v-for="item in detData.item">
  				{{item.i_oem}}&ensp;{{item.i_mb002}}</br>
  				{{item.i_mb003}}</br>
  				购买：{{item.i_qty}}
  				&ensp;实发：{{item.i_fact_qty}}</br>
  				{{item.a_title}}
  			</li>
  		</ul>
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
export default {
  name: 'orderDetail',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	detData:JSON.parse(sessionStorage.getItem("orderItem")),//订单详情
    	erpnoArr:[],//销货单
    	logisData:[],//物流
    	isLogis:false,//物流弹层
    	isPro:false,//产品明细弹层
    	proList:[],//产品明细
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this.orderDet();
    })
  },
  methods:{
  	//订单详情
  	orderDet:function(){
  		let this_ = this;
  		this_.erpnoArr = [];
  		this_.$api.get({
        url: this_.$apiUrl.api.GetOrder + '?erpno=' + this_.detData.s_erpno + '&dpt=' + this_.userInfo.dataset[0].dpt,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.length>0 && this_.detData.s_state != '待接单'){
        		for(let i=0;i<data.length;i++){
        			if(!this_.$utils.check.isEmpty(data[i].column1)){
	        			let erpItem = {erp:data[i].column1,store:''};
			  				this_.$api.get({
					        url: this_.$apiUrl.api.GetStore + '?billsort=' + data[i].column1.split("-")[0] + '&billno=' + data[i].column1.split("-")[1] + '&ma001=' + this_.userInfo.dataset[0].ma001,
					        params:{},
					        success: function (data02) {
					        	this_.bus.$emit('loading', false);
					        	if(!this_.$utils.check.isEmpty(data02)){
					        		erpItem.store = data02[0].storage;
											this_.erpnoArr.push(erpItem);
										}
					        	
					        }
					      });
	        		}
        		}
        		
					}
        	
        }
      });
  		
  		//header
  		/*let erpno = this_.detData.s_erpno.split(",");
  		if(erpno.length >0 && this_.detData.s_state != '待接单'){
  			for(var i=0;i<erpno.length;i++){
  				let erpItem = {erp:erpno[i],store:''};
  				this_.$api.get({
		        url: this_.$apiUrl.api.GetStore + '?billsort=' + erpno[i].split("-")[0] + '&billno=' + erpno[i].split("-")[1],
		        params:{},
		        success: function (data) {
		        	this_.bus.$emit('loading', false);
		        	if(!this_.$utils.check.isEmpty(data)){
		        		erpItem.store = data[0].storage;
								this_.erpnoArr.push(erpItem);
							}
		        	
		        }
		      });
  			}
  			
  		}*/
  		
  	},
  	
  	//物流详情
  	logistics:function(erpno){
  		let this_ = this;
  		this_.isLogis = true;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.TimeLine + '?s_id=' + this_.detData.s_id + '&copno=' + erpno + '&ma001=' + this_.userInfo.dataset[0].ma001,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.logisData = data.reverse();
        }
      });
  	},
  	
  	//产品明细
  	proDetail:function(erpno){
  		let this_ = this;
  		this_.isPro = true;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.ProDetail + '?erpno=' + erpno +'&dpt=' + this_.userInfo.dataset[0].dpt,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.length>0){
						this_.proList = data;
					}else{
						
					}
        }
      });
  	},
  	
  	
  }
}
</script>

