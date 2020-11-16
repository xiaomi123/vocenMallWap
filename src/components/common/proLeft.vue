<template>
<!--加减购物车内容开始-->
<div class="proLeft_main" v-if="!$utils.check.isEmpty(proItem02)">
	{{proItem02.mb001}}
	{{proItem02.mb002New}}
  <label v-if="proItem02.mb001.substring(0,2) == 57" class="dmh">德马赫</label>
  <label v-if="proItem02.mb001.substring(0,2) == 58" class="dmh">联保</label>
	<em>{{proItem02.oem}}</em><br />
	<i>{{proItem02.mb003New}}</i><br />
	<span>
		<em :class="{oldPrice:proItem02.jj}" v-show="proItem02.jj">￥{{proItem02.backprice}}</em>
    <label v-if='userInfo.dataset[0].dpt.search("配件二部") != -1'>{{proItem02.jj?'降价￥'+proItem02.price:''}}</label>
		<label v-if='userInfo.dataset[0].dpt.search("配件一部") != -1'>{{proItem02.jj?'现价￥'+proItem02.price:''}}</label>

		<em :class="{oldPrice:proItem.tj}" v-show="proItem02.price!='0.00' && !proItem02.jj">￥{{proItem02.price}}</em>
    <label v-if="userInfo.dataset[0].dpt.search('配件一部') != -1">
      <em v-if="proItem02.mb005=='0098' && userInfo.dataset[0].dpt.search('耐用') != -1">{{proItem02.tj?'限量特价￥'+proItem02.aprice:''}}</em>
      <em v-else>
        <i v-if="proItem02.mb005=='0078' || proItem02.mb005=='0080'">{{proItem02.tj?'补贴价￥'+proItem02.aprice:''}}</i>
        <i v-else>{{proItem02.tj?'特价￥'+proItem02.aprice:''}}</i>
      </em>
    </label>

    <label v-if="userInfo.dataset[0].dpt.search('配件二部') != -1">{{proItem02.tj?'特价￥'+proItem02.aprice:''}}</label>
    <label v-if='proItem02.guideprice != 0 && userInfo.dataset[0].dpt.search("配件一部吉利") != -1'>{{'集采价￥'+proItem02.guideprice}}</label>
    <label v-else style="font-size:1.1rem;color:#999">{{'指导售价￥'+ Math.round(proItem02.guideprice)}}</label>

		<!-- {{proItem02.tj?'特价￥'+proItem02.aprice:''}} -->
		{{proItem02.a_type_no=='2'?'限时秒杀':''}}
		{{proItem02.a_type_no=='3'?'满减':''}}
		<!--<i v-if="proItem02.a_type_no=='3' && proItem02.i_limit_qty != '0'">满{{proItem02.i_limit_qty}}可享受特价</i>-->
		<i v-if="proItem02.a_type_no=='1' && proItem02.i_limit_qty != '0' && !$utils.check.isEmpty(proItem02.i_limit_qty)">最小购买量为{{proItem02.i_limit_qty}}</i>
		<em v-if="isShort">缺货</em>
		<i v-if="proItem02.xg">限购:{{proItem02.i_quota_qty}}</i>
		<i v-if="proItem02.xg && proItem02.orderqty != '0'">限购:{{proItem02.orderqty}}</i>
	</span>
</div>
<!--加减购物车内容结束-->
</template>

<script>
export default {
  name: '',
  data () {
    return {
    	proItem02:'',
    	isShort:false,//缺货
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    }
  },
  props:[
    "proItem",
  ],
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
  		this_.proTo();
    });
  },
  methods: {
  	proTo:function(){
  		let this_ = this;
  		let mb002New = this_.proItem.mb002;
		  if(mb002New.indexOf('(') != -1){
	    	mb002New = this_.proItem.mb002.split("(")[0] + this_.proItem.mb002.split("(")[1].split(")")[1];
	    }else if(mb002New.indexOf('（') != -1){
	    	mb002New = this_.proItem.mb002.split("（")[0] + this_.proItem.mb002.split("（")[1].split("）")[1];
	    }
  		this_.proItem.mb002New = mb002New;
		  let mb003New = this_.proItem.mb003;
		  if(mb003New.indexOf(this_.proItem.oem) != -1){
		  	mb003New = mb003New.replace(this_.proItem.oem,"");
		  	if(mb003New.charAt(mb003New.length-1) == '/' || mb003New.charAt(mb003New.length-1) == '-'){
		  		mb003New = mb003New.substr(0,mb003New.length-1);
		  	}
		  	if(mb003New.indexOf('()') != -1){
		  		mb003New = mb003New.replace('()',"");
		  	}
		  	if(mb003New.indexOf('（）') != -1){
		  		mb003New = mb003New.replace('（）',"");
		  	}

		  }
		  this_.proItem.mb003New = mb003New;

		  //显示价格
		  this_.proItem.tj = false;
		  this_.proItem.jj = false;
		  //if(this_.userInfo.dataset[0].dpt.search("配件二部") != -1){
		  	if(this_.$utils.check.isEmpty(this_.proItem.activity) && !this_.$utils.check.isEmpty(this_.proItem.backprice) && this_.proItem.backprice !=0 && parseFloat(this_.proItem.backprice)>parseFloat(this_.proItem.price)){
		  		this_.proItem.jj = true;
		  	}

		  //}
		  if(this_.proItem.a_type_no == '1' || this_.proItem.a_type_no == '4'){
		  	//特价
		  	this_.proItem.tj = true;
		  	//有最大限购
		  	if(!this_.$utils.check.isEmpty(this_.proItem.i_quota_qty)){
		  		//购买量和最大限购
		  		if(parseInt(this_.proItem.orderqty) >= parseInt(this_.proItem.i_quota_qty)){
		  			this_.proItem.tj = false;
		  		}
		  	}
			}

		  //满减
		  if(this_.proItem.a_type_no == '3'){
		  	if(this_.$utils.check.isEmpty(this_.proItem.i_limit_qty)){
		  		this_.proItem.i_limit_qty = '0';
		  	}
		  }

		  //有最大限购
		  this_.proItem.xg = false;
	  	if(!this_.$utils.check.isEmpty(this_.proItem.i_quota_qty)){
	  		//购买量和最大限购
	  		if(parseInt(this_.proItem.orderqty) >= parseInt(this_.proItem.i_quota_qty)){
	  			this_.proItem.xg = false;
	  		}else{
	  			this_.proItem.xg = true;
	  		}
	  	}

	  	//缺货提示文字
	  	if(!this_.$utils.check.isEmpty(this_.proItem.s_is_sortage)){
	  		if(this_.proItem.s_is_sortage == 'True'){
	  			if(!this_.$utils.check.isEmpty(this_.proItem.shortQty)){
		  			if(parseInt(this_.proItem.shortQty) == 0){
		  				this_.isShort = true;
		  			}
		  		}
	  		}
	  	}

		  this_.proItem02 = this_.proItem;
  	}

  }
}
</script>
