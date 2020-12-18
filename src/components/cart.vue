<template>
  <div class="cart_container">
  	<!--收货地址、发货详情预览开始-->
		<div class="cart_dialog" v-show="toDetail">
			<div class="cart_diaMain">
				<h2><i></i>收货地址 <span class="iconfont" @click="toDetail = !toDetail">&#xe60f;</span></h2>
				<ul class="cart_address">
	  			<li><label>收货地址：</label><span>{{cartAddress}}</span></li>
	  			<li>
	  				<label>备&emsp;&emsp;注：</label><textarea v-model="subCartsInfo.note"></textarea>
	  			</li>
	  		</ul>
	  		<h2><i></i>发货详情预览<em>（以客服制单为准）</em></h2>
	  		<ul class="cart_detail">
	  			<li v-for="(item,index) in shortage">
	  				<h3  v-if="item.data.rows.length>0" @click="item.isShow = !item.isShow" :class="item.mc001=='9999' ? 'short':''">{{(item.mc001 == '120100' || item.mc001 == '120101' || item.mc001 == '120102' || item.mc001 == '120104' || item.mc001 == '120105') ? '郑州库':item.mc002}}<i :class="!item.isShow?'iconfont':'iconfont tran'">&#xe609;</i></h3>
	  				<ul  v-if="item.data.rows.length>0" class="cart_detList" v-show="item.isShow">
	  					<li v-for="list in shortage[index].data.rows">
	  						<p>
                  {{list.th004}}</br>
	  							{{list.oem}}{{list.th005}}</br>
	  							{{list.th006}}</br>
	  							<em>{{list.a_title}}</em>
	  						</p>
	  						<span>
	  							￥{{list.th012}}</br>
	  							<i>x{{list.th008}}</i>
	  						</span>
	  					</li>
	  				</ul>
	  			</li>
	  		</ul>

	  		<div class="cart_footer">
		  		<p>
						<label class="priceTo">共<i>{{subNum}}</i>件,总金额￥<em>{{subMoney.toFixed(2)}}</em></label>
		  		</p>
					<input type="button" value="提交" @click="toSubmit()" style="background-color:#ff7f50" />
	  	  </div>
			</div>

  	</div>

  	<!--收货地址、发货详情预览结束-->
  	<div class="cart_main">
  		<div class="dpt_content">

	  		<!--品牌切换内容开始-->
				<div class="dpt_contain">
					<div class="index_dpt">
						<span @click.stop="dptShow = !dptShow" style="display: inline-block;padding:1rem 0;"><img :src="dptLogo" alt="" /></span>
						<em :class="dptShow?'iconfont dptBot tran':'iconfont dptBot'" @click.stop="dptShow = !dptShow">&#xe604;</em>
						<i v-show="dptShow"></i>
						<transition name="ul">
							<ul class="index_dpt_list" v-show="dptShow">
								<li v-for="(item,index) in userInfo.dataset1" :class="{active:index==dptIndex}" @click="dptSwitch(index)">
									{{item.mr003}}<em v-if="cartsNum.length>0 ">&ensp;{{cartsNum[index].num!=0?cartsNum[index].num:''}}</em>
								</li>
							</ul>
						</transition>
					</div>
				</div>
				<!--品牌切换内容结束-->

  		</div>

			<!--购物车、缺货切换内容开始-->
			<ul class="cart_tab">
				<li :class="carIndex==0?'active':''" @click="cartTab(0,cartList)"><em></em>购物车({{allNum}})</li>
				<li :class="carIndex==1?'active':''" @click="cartTab(1,shortList)"><em></em>缺货历史({{shortNum}})</li>
				<li>
					<p class="cart_edit">
						<span v-if="isEditor" @click="isEditor = !isEditor"><i class="iconfont"></i>编辑</span>
						<span v-else @click="isEditor = !isEditor">完成</span>
					</p>
				</li>
			</ul>
			<!--购物车、缺货切换内容结束-->

			<div v-show="carIndex==0">
	  		<ul class="product_list cart_list">
	  	  	<li v-for="(item,index) in cartList" @click="isActive(index,cartList)" :class="item.ck?'active':''">
	  	  		<span class="cart_check">
	  	  			<i class="iconfont no">&#xe6c3;</i>
	  	  			<i class="iconfont yes">&#xe6c2;</i>
	  	  		</span>
	  	  		<div class="product_left">
              <div class="proLeft_main">
                {{item.mb001}}&ensp;{{item.mb002New}}
                <em>{{item.s_oem}}</em><br />
                <i>{{item.mb003New}}</i><br />
                <span>
                  <em :class="{oldPrice:item.tj}">￥{{item.price}}</em>
                  <!--{{item.tj?'特价￥':''}}
                  {{item.tj?item.aprice:''}}-->
                  {{item.i_type_no=='2'?'限时秒杀':''}}
                  {{item.i_type_no=='3'?'满减':''}}
                </span>
                <span style="color:red">{{item.s_state}}</span>
                <!--<i v-if="item.a_type_no=='1' && !$utils.check.isEmpty(item.i_limit_qty)" style="color:red">数量满{{item.i_limit_qty}}可享受特价</i>-->
              </div>
            </div>
	  	  		<div class="product_right">
	  	  			<iconList-view :collItem="item" :num="item.s_i_ma001" :name="item.s_i_ma002"></iconList-view>
	  	  			<input v-if="item.state == '产品不存在'" type="text" v-model="item.s_qty" class="cartNo" readonly="readonly" />
	  	  			<cart-view v-else :cartList="item" :num="item.s_i_ma001" :name="item.s_i_ma002"></cart-view>
	  	  		</div>

	  	  	</li>
	  	  </ul>
	  	  <p v-show="cartList.length == 0 && isLoad" class="com_noData">暂无数据</p>
			</div>

  	</div>

  	<div v-show="carIndex==1">
  		<ul class="product_list cart_list">
  	  	<li v-for="(item,index) in shortList" @click="isActive(index,shortList)" :class="item.ck?'active':''">
  	  		<span class="cart_check">
  	  			<i class="iconfont no">&#xe6c3;</i>
  	  			<i class="iconfont yes">&#xe6c2;</i>
  	  		</span>
  	  		<div class="product_left">
            <div class="proLeft_main">
              {{item.mb001}}&ensp;{{item.mb002New}}
              <em>{{item.s_oem}}</em><br />
              <i>{{item.mb003New}}</i><br />
              <span>
                <em :class="{oldPrice:item.tj}">￥{{item.price}}</em>
                {{item.tj?'特价￥':''}}
                {{item.tj?item.aprice:''}}
                {{item.i_type_no=='2'?'限时秒杀':''}}
                {{item.i_type_no=='3'?'满减':''}}
              </span>
              <span>{{item.s_state}}</span>
            </div>
  	  		</div>
  	  		<div class="product_right">
  	  			<iconList-view :collItem="item" :num="item.s_i_ma001" :name="item.s_i_ma002"></iconList-view>
  	  			<input v-if="item.state == '产品不存在'" type="text" v-model="item.s_qty" class="cartNo" readonly="readonly" />
  	  			<cart-view v-else :cartList="item" :num="item.s_i_ma001" :name="item.s_i_ma002"></cart-view>
  	  		</div>

  	  	</li>
  	  </ul>
  	  <p v-show="shortList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>

  	<div class="cart_footer">
  		<p>
  			<span v-show="cartList.length>0">
					<em class="cart_ckAll" @click="checkAll()">
						<i class="iconfont" v-if="!isAll">&#xe6c3;</i>
						<i class="iconfont" v-if="isAll">&#xe6c2;</i>
						全选
					</em>
				</span>
				<label class="priceTo">共<i>{{qtyTotal}}</i>件,总金额￥<em>{{priceTotal==0?'0.00':priceTotal.toFixed(2)}}</em></label>
  		</p>
			<input type="button" value="提交订单" v-if="isEditor" @click="toCount()" />
			<input type="button" value="删除" v-else @click="deletCart()" />
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
    	cartList:[],//购物车数据
    	isLoad:false,//是否含有数据
    	isAll:false,//全选
      isEditor:true,//编辑
      carIndex:0,//购物车缺货切换
      shortList:[],//缺货历史
      qtyTotal:0,//总件数
      priceTotal:0,//总价格
      cartAddress:'',//收货地址
      toDetail:false,//预览显示隐藏
      shortage:[],//预览
      subCartsInfo:{
      	"c_id":'',
				"c_login":'',
				"c_shopname":'',
				"c_ma001":'',
				"c_ma002":'',
				"dpt":'',
				"r_tel":'',
				"r_addr":'',
				"r_id":"",
				"note":'',
				"cart":[],
				"kf":'',
				"ma075":'',
         "ma017":''
      },//提交订单传值
      subNum:0,
      subMoney:0,
      allNum:0,
      shortNum:0,
      //品牌切换
      dptIndex:0,//当前选中品牌
    	dptShow:false,//品牌选中弹层
    	dptLogo:'',
    	storagePlan:'',//提交订单生成预览
      cartsNum:[],//购物车总数
      rouPag:0,//修改路由不跳转
    }
  },
  created:function(){
  	let this_ = this;
  	this_.bus.$on('cartChange', function(cartParm) {
  		let dptCur = this_.dptIndex;
  		if(cartParm.type == 'add'){
  			//this_.priceTotal = Number(this_.priceTotal) - cartParm.qty * cartParm.price + cartParm.qty * cartParm.chPrice;
  			//this_.priceTotal = Number(this_.priceTotal) + cartParm.chPrice * cartParm.chNum;
				this_.qtyTotal = parseInt(this_.qtyTotal) + cartParm.chNum;
				this_.cartsNum[dptCur].num = this_.cartsNum[dptCur].num + cartParm.chNum;
				if(this_.carIndex == 0){
					this_.allNum = this_.allNum + cartParm.chNum;
				}else if(this_.carIndex == 1){
					this_.shortNum = this_.shortNum + cartParm.chNum;
				}

  		}else if(cartParm.type == 'cut'){
	      //this_.priceTotal = Number(this_.priceTotal) - cartParm.chPrice * cartParm.chNum;
				this_.qtyTotal = parseInt(this_.qtyTotal) - cartParm.chNum;
				this_.cartsNum[dptCur].num = this_.cartsNum[dptCur].num - cartParm.chNum;
				if(this_.carIndex == 0){
					this_.allNum = this_.allNum - cartParm.chNum;
				}else if(this_.carIndex == 1){
					this_.shortNum= this_.shortNum - cartParm.chNum;
				}
			}

  		let curCart = [];
  		if(this_.carIndex == 0){
  			curCart = this_.cartList;
  		}else if(this_.carIndex == 1){
  			curCart = this_.shortList;
  		}
  		this_.priceTotal = 0;
  		for(let i=0;i<curCart.length;i++){
  			this_.priceTotal = this_.priceTotal + parseInt(curCart[i].qty)*Number(curCart[i].price);
  		}

    });
    //点击其他地方，品牌弹层隐藏
    　　document.addEventListener('click',(e)=>{
      this_.dptShow = false;
    　　});
  },
  watch:{
    $route(to,from){
      if(!this.$utils.check.isEmpty(from.query.num)){
        this.toDetail = false;
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
  		this_.curDpt();//初始化
    });
  },
  methods:{
  	//品牌切换购物车列表页刷新
  	dptChange:function(index){
  		let this_ = this;
  		this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  		this_.getCart(index,'0','list');//购物车
  		this_.getCart(index,'1','list');//缺货
  		this_.cartAddress = this_.userInfo.dataset1[index].ma027;//收货地址
  		this_.storagePlan = this_.userInfo.dataset1[index].c_i_storage_plan;//生成订单预览
  		this_.allNum = 0;
  		this_.shortNum = 0;
  		this_.priceTotal = 0;
  		this_.qtyTotal = 0;

  		//提交订单传参
  		this_.subCartsInfo.c_id = this_.userInfo.dataset[0].c_id;
  		this_.subCartsInfo.c_login = this_.userInfo.dataset[0].c_login;
  		this_.subCartsInfo.c_shopname = this_.userInfo.dataset[0].c_shopname,
  		this_.subCartsInfo.c_ma001 = this_.userInfo.dataset1[index].ma001;
  		this_.subCartsInfo.c_ma002 = this_.userInfo.dataset1[index].ma002;
  		this_.subCartsInfo.dpt = this_.userInfo.dataset1[index].dpt;
  		this_.subCartsInfo.r_tel = this_.userInfo.dataset1[index].ma006;
  		this_.subCartsInfo.r_addr = this_.userInfo.dataset1[index].ma027;
  		this_.subCartsInfo.kf = this_.userInfo.dataset1[index].kf;
  		this_.subCartsInfo.ma075 = this_.userInfo.dataset1[index].ma075;
      this_.subCartsInfo.ma017 = this_.userInfo.dataset1[index].ma017;
  	},
  	//获取选中品牌品类
  	curDpt:function(){
  		let this_ = this;
  		this_.cartsNum = [];
  		for(var i=0;i<this_.userInfo.dataset1.length;i++){
  			this_.cartsNum.push({'num':0});//购物车总数量
  			this_.getCart(i,'0','count');
  			this_.getCart(i,'1','count');
  			if((this_.userInfo.dataset[0].ma015 == this_.userInfo.dataset1[i].ma015) && (this_.userInfo.dataset[0].ma017 == this_.userInfo.dataset1[i].ma017)){
  				this_.dptIndex = i;
  				this_.swithLogo(this_.userInfo.dataset1[i].ma017,this_.userInfo.dataset1[i].ma015,this_.userInfo.dataset1[i].dpt);
  				this_.dptChange(i);
  			}
  		}

  	},
  	//品牌切换
  	dptSwitch:function(index){
  		let this_ = this;
  		this_.dptShow = false;//品牌弹层
  		this_.isEditor = true;//初始化编辑状态
  		if(this_.dptIndex != index){
  			this_.dptIndex = index;//品牌index

	  		//logo切换
        let ma015 = this_.userInfo.dataset1[index].ma015;
	  		let ma017 = this_.userInfo.dataset1[index].ma017;
	  		let dpt = this_.userInfo.dataset1[index].dpt;
				this_.swithLogo(ma017,ma015,dpt);

	  		if(this_.userInfo.dataset1[index].dpt.search("配件二部") != -1){
					this_.userInfo.dataset[0].c_dpt = '轿车';
				}else if(this_.userInfo.dataset1[index].dpt.search("配件一部") != -1 ){
					this_.userInfo.dataset[0].c_dpt = '微车';
				}
	  		this_.userInfo.dataset[0].dpt = this_.userInfo.dataset1[index].dpt;
				this_.userInfo.dataset[0].kf = this_.userInfo.dataset1[index].kf;
				this_.userInfo.dataset[0].ma001 = this_.userInfo.dataset1[index].ma001;
				this_.userInfo.dataset[0].ma002 = this_.userInfo.dataset1[index].ma002;
				this_.userInfo.dataset[0].ma006 = this_.userInfo.dataset1[index].ma006;
				this_.userInfo.dataset[0].ma007 = this_.userInfo.dataset1[index].ma007;
				this_.userInfo.dataset[0].ma015 = this_.userInfo.dataset1[index].ma015;
				this_.userInfo.dataset[0].ma016 = this_.userInfo.dataset1[index].ma016;
				this_.userInfo.dataset[0].ma017 = this_.userInfo.dataset1[index].ma017;
				this_.userInfo.dataset[0].ma027 = this_.userInfo.dataset1[index].ma027;
			  this_.userInfo.dataset[0].ma075 = this_.userInfo.dataset1[index].ma075;
				this_.userInfo.dataset[0].ma085 = this_.userInfo.dataset1[index].ma085;
				this_.userInfo.dataset[0].mr003 = this_.userInfo.dataset1[index].mr003;
				this_.userInfo.dataset[0].yw = this_.userInfo.dataset1[index].yw;

				sessionStorage.setItem("userinfo",JSON.stringify(this_.userInfo)); //存入修改用户名后userInfo
				this_.dptChange(index);
  		}
  	},

  	//logo切换
  	swithLogo:function(ma017,ma015,dpt){
  		let this_ = this;
      let imgsrc = '/uploadfile/image/logo/img_' + ma017 + '_' + ma015 + '_02.png';
      this_.dptLogo = this_.$apiUrl.imgUrl + imgsrc;


  	// 	if(ma017 == '200' || ma017 == '205'){
			// 	//江陵
			// 	this_.dptLogo = require('../assets/images/logo/img_index_logoJl.png');
			// }else if(ma017 == '201' || ma017 == '210'){
			// 	//沃森
			// 	if(dpt.search("丰田") != -1){
			// 		this_.dptLogo = require('../assets/images/logo/img_index_logoRxWs.png');
			// 	}else{
			// 		this_.dptLogo = require('../assets/images/logo/img_index_logoWcWs.png');
			// 	}

			// }else if(ma017 == '211'){
			// 	//韩系智选
			// 	this_.dptLogo = require('../assets/images/logo/img_index_logoHxZx.png');
			// }else if(ma017 == '212'){
			// 	//秀泰
			// 	if(dpt.search("丰田") != -1){
			// 		//日系秀泰
			// 		this_.dptLogo = require('../assets/images/logo/img_index_logoRxXt.png');
			// 	}else{
			// 		//韩系秀泰
			// 		this_.dptLogo = require('../assets/images/logo/img_index_logoHxXt.png');
			// 	}

			// }else if(ma017 == '213'){
			// 	//韩系吉尔摩
			// 	this_.dptLogo = require('../assets/images/logo/img_index_logoHxJem.png');
			// }else if(ma017 == '202'){
			// 	//吉利沃森
			// 	this_.dptLogo = require('../assets/images/logo/img_index_logoJlWs.png');
			// }else if(ma017 == '203'){
			// 	//吉利吉尔摩
			// 	this_.dptLogo = require('../assets/images/logo/img_index_logoJlJem.png');
			// }else if(ma017 == '204'){
			// 	//微车弘涂
			// 	this_.dptLogo = require('../assets/images/logo/img_index_logoWcHt.png');
			// }
  	},



  	//购物车切换
  	cartTab:function(index,item){
  		let this_ = this;
  		this_.carIndex=index;

  		//判断是否全选，以及数量金额总数
			let ckList = [];
			this_.priceTotal = 0;
			this_.qtyTotal = 0;
			if(item.length>0){
				//有数据
				for(var i=0; i<item.length;i++){
					if(item[i].ck){
						ckList.push(item[i]);//选中项
						//设置所有选中项总数
	  				this_.priceTotal = Number(this_.priceTotal) + Number(item[i].price) * parseInt(item[i].qty);
						this_.qtyTotal = parseInt(this_.qtyTotal) + parseInt(item[i].qty);
					}
				}
				//设置全选
	     	if(ckList.length == item.length){
	     		this_.isAll = true;
	     	}else{
	     		this_.isAll = false;
	     	}
			}else{
				//无数据
				this_.isAll = false;
			}

  	},


  	//产品复选
  	isActive:function(index,list){
  		let this_ = this;
      //如果已经选中了，那就取消选中，如果没有，则选中
      if(list[index].ck){
      	list[index].ck = false;

      	//是否全选
        this_.isAll = false;

        //设置所有选中项总数
				this_.priceTotal = Number(this_.priceTotal) - Number(list[index].price) * parseInt(list[index].qty);
				this_.qtyTotal = parseInt(this_.qtyTotal) - parseInt(list[index].qty);

      }else{
       	list[index].ck = true;

       	//设置所有选中项总数
				this_.priceTotal = Number(this_.priceTotal) + Number(list[index].price) * parseInt(list[index].qty);
				this_.qtyTotal = parseInt(this_.qtyTotal) + parseInt(list[index].qty);

       	//是否全选
	  		let ckList = list.filter(item => item.ck);
       	if(ckList.length == list.length){
       		this_.isAll = true;
       	}
      }

  	},

  	//全选
  	checkAll:function(){
  		let this_ = this;
  		this_.isAll = !this_.isAll;
  		this_.priceTotal = 0;
			this_.qtyTotal = 0;
  		if(this_.carIndex == 0){
				//购物车
	  		for(var i=0;i<this_.cartList.length;i++){
  				this_.cartList[i].ck = this_.isAll;
		      if(this_.isAll && (parseInt(this_.cartList[i].qty)>0)){
		      	//设置所有选中项总数
						this_.priceTotal = Number(this_.priceTotal) + Number(this_.cartList[i].price) * parseInt(this_.cartList[i].qty);
						this_.qtyTotal = parseInt(this_.qtyTotal) + parseInt(this_.cartList[i].qty);
		      }else{
		      	this_.cartList[i].ck = false;
		      }


		    }
			}else if(this_.carIndex == 1){
				//缺货
	  		for(var j=0;j<this_.shortList.length;j++){
		      this_.shortList[j].ck = this_.isAll;
		      if(this_.isAll && (parseInt(this_.cartList[i].qty)>0)){
		      	//设置所有选中项总数
						this_.priceTotal = Number(this_.priceTotal) + Number(this_.shortList[j].price) * parseInt(this_.shortList[j].qty);
						this_.qtyTotal = parseInt(this_.qtyTotal) + parseInt(this_.shortList[j].qty);
		      }else{
		      	this_.shortList[j].ck = false;
		      }
		    }
			}

  	},
  	//删除
  	deletCart(){
  		let this_ = this;
  		let detList = [];
  		if(this_.carIndex == 0){
  			//购物车
  			detList = this_.cartList.filter(item => item.ck);//批量删除数据
  		}else if(this_.carIndex == 1){
  			//缺货
  			detList = this_.shortList.filter(item => item.ck);//批量删除数据
  		}


  		//购物车总数
  		let totalNum = parseInt(sessionStorage.getItem("cartTotal"));
		  let detArr = [];//删除传参
  		for(var i=0;i<detList.length;i++){
  			detArr.push({"s_id":detList[i].s_id});
  			totalNum = totalNum - parseInt(detList[i].qty);//购物车总数变化
  			this_.cartsNum[this_.dptIndex].num = this_.cartsNum[this_.dptIndex].num - parseInt(detList[i].qty);//品牌切换数量变化
  			//购物车和缺货历史切换数量变化
  			if(this_.carIndex == 0){
  				this_.allNum = this_.allNum - parseInt(detList[i].qty);
  			}else if(this_.carIndex == 1){
  				this_.shortNum = this_.shortNum - parseInt(detList[i].qty);
  			}
  		}
  		if(detArr.length>0){
  			this_.$api.post({
	        url: this_.$apiUrl.api.delCat,
	        params:detArr,
	        success: function (data) {
	        	this_.bus.$emit('loading', false);
	        	if(data.State){
	        		this_.bus.$emit('tipShow', '删除购物车成功');
	        		if(this_.carIndex == 0){
	        			this_.cartList = this_.cartList.filter(item => !item.ck);
	        		}else if(this_.carIndex == 1){
	        			this_.shortList = this_.shortList.filter(item => !item.ck);
	        		}

	        		//公共footer购物车数量
			  			sessionStorage.setItem("cartTotal", totalNum); //存入购物车总数
			  			this_.bus.$emit('cartTotal', totalNum);

	        		//设置总金额和数量
	        		this_.priceTotal = 0;
							this_.qtyTotal = 0;
	        	}else{
	        		this_.bus.$emit('tipShow', data.Message);
							//this_.addFail(cur);
	        	}

	        }
	      });
  		}else{
  			this_.bus.$emit('tipShow', '请选择删除产品');
  		}

  	},

  	//购物车查询
  	getCart:function(index,type,isCount){
  		let this_ = this;
  		//购物车
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getCart + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001='+ this_.userInfo.dataset1[index].ma001 +'&ma075=' + this_.userInfo.dataset1[index].ma075 + '&dpt=' + this_.userInfo.dataset1[index].dpt + '&ma017=' + this_.userInfo.dataset1[index].ma017 + '&type='+type,
        params:{},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.isLoad = true;
        	if(data.length>0){
        		for(var i=0;i<data.length;i++){
        			if(isCount=='count'){
        				//遍历品牌，购物车总数计算
        				this_.cartsNum[index].num = parseInt(this_.cartsNum[index].num) + parseInt(data[i].s_qty);
        			}else{
        				//选中品牌切换，列表渲染
	        			var mb002New = data[i].s_i_mb002;
							  if(mb002New.indexOf('(') != -1){
						    	mb002New = data[i].s_i_mb002.split("(")[0] + data[i].s_i_mb002.split("(")[1].split(")")[1];
						    }else if(mb002New.indexOf('（') != -1){
						    	mb002New = data[i].s_i_mb002.split("（")[0] + data[i].s_i_mb002.split("（")[1].split("）")[1];
						    }
					  		data[i].mb002New = mb002New;
		        		//规格若含有oem则去掉
		        		var mb003New = data[i].s_i_mb003;
							  if(mb003New.indexOf(data[i].s_oem) != -1){
							  	mb003New = mb003New.replace(data[i].s_oem,"");
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
							  data[i].mb003New = mb003New;


							  //显示价格
							  data[i].tj = false;
						    if(data[i].i_type_no == '1' || data[i].i_type_no == '4'){
							  	//特价
							  	data[i].tj = true;
							  	//有最大限购
							  	if(!this_.$utils.check.isEmpty(data[i].i_quota_qty)){
							  		//购买量和最大限购
							  		if(parseInt(data[i].orderqty) >= parseInt(data[i].i_quota_qty)){
							  			data[i].tj = false;
							  		}
							  	}
							  }

						    if(data[i].a_isend == '1'){
						    	data[i].s_state = '活动已结束';
						    }

						    //购物车数据格式统一
						    data[i].a_type_no = data[i].i_type_no;
						    data[i].mb001=data[i].s_i_mb001;
						    data[i].mb002=data[i].s_i_mb002;
						    data[i].mb003=data[i].s_i_mb003;
						    data[i].mb004=data[i].s_i_mb004;
						    data[i].aprice = '';
						    data[i].oem = data[i].s_oem;
						    data[i].qty = data[i].s_qty;

						    data[i].cartType = 'cart';//判断是否为购物车页面数据

						    //购物车数量
						    if(type == '0'){
						    	this_.allNum = this_.allNum + parseInt(data[i].s_qty);
						    }else if(type == '1'){
						    	this_.shortNum = this_.shortNum + parseInt(data[i].s_qty);
						    }

						    //是否选中
						    if((!data[i].s_is_sortage) && (parseInt(data[i].s_qty)>0)){
						    	data[i].ck = true;
						    	this_.priceTotal = Number(this_.priceTotal) + Number(data[i].price) * parseInt(data[i].qty);
						    	this_.qtyTotal = parseInt(this_.qtyTotal) + parseInt(data[i].qty);
						    }else{
						    	data[i].ck = false;
						    }
					    }


	        	}


        	}

      		if(isCount=='list'){
      			if(type == '0'){
	      			this_.cartList = data;
	      		}else if(type == '1'){
	      			this_.shortList = data;
	      		}
	      		if(this_.carIndex == 0){
	      			this_.isAll = true;
	      		}else if(this_.carIndex == 1){
	      			this_.isAll = false;
	      		}
      		}


        }
      });


  	},


  	//提交订单
  	toCount:function(){
  		let this_ = this;
  		this_.subCartsInfo.cart = [];
  		this_.subNum = 0;
  		this_.subMoney = 0;
  		for(var i=0;i<this_.cartList.length;i++){
  			if(this_.cartList[i].ck){
  				if(this_.cartList[i].a_isend == '1'){
  					this_.bus.$emit('tipShow', this_.cartList[i].a_title+'已结束，无法提价订单，请删除！');
  					return false;
  				}else if(this_.cartList[i].s_qty == 0){
  					this_.bus.$emit('tipShow', '购物车数量不能为0！');
  					return false;
  				}else if(this_.cartList[i].a_state == '产品不存在'){
  					this_.bus.$emit('tipShow', '请删除不存在产品！');
  					return false;
  				}else{
  					this_.subCartsInfo.cart.push({"s_id":this_.cartList[i].s_id});
  				}
  			}
  		}

  		if(this_.subCartsInfo.cart.length>0){
  			this_.bus.$emit('loading', true);
	  		this_.$api.post({
	        url: this_.$apiUrl.api.DetailCart,
	        params:this_.subCartsInfo.cart,
	        success: function (data) {
	        	this_.bus.$emit('loading', false);
	        	if(!data.State){
	        		cartTip = data.centent + '已结束，无法提价订单，请删除！';
	        		return false;
	        	}

	        }
	      });
  		}else{
  			this_.bus.$emit('tipShow', '请选择产品！');
  			return false;
  		}
      console.log('**********************************');
      console.log(this_.subCartsInfo);
      console.log('ma017:'+this_.userInfo.dataset[0].ma017);
      console.log('storagePlan:'+this_.storagePlan);
      this_.$api.post({
        url: this_.$apiUrl.api.PlaceOrder + '?ma017=' + this_.userInfo.dataset[0].ma017 + '&type=' + this_.storagePlan,
        params:this_.subCartsInfo,
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	for(var i=0;i<data.length;i++){
        		if(data[i].mc001 != '9999'){
        			this_.subNum = parseInt(this_.subNum) + parseInt(data[i].data.footer[0].th008);
        			this_.subMoney = parseFloat(this_.subMoney) + parseFloat(data[i].data.footer[0].th013);
        		}

        		let ylList = data[i].data.rows;
        		for(var j=0;j<ylList.length;j++){
        			if(ylList[j].th008 == 0){
        				ylList.splice(j, 1);
        				j--;
        			}
        		}
        		data[i].isShow = true;
        	}
        	this_.shortage = data;
        }
      });
  		this_.toDetail = true;
      //修改路由，不跳转
      this.$router.push({
          path:'/cart',
          query:{
            num: this_.rouPag++,
          }
      });

  	},

  	//提交
  	toSubmit:function(){
  		let this_ = this;
  		if(this_.$utils.check.isEmpty(this_.subCartsInfo.c_ma001)){
  			this_.bus.$emit('tipShow', '客户编号为空，请重新登陆！');
				return false;
			}else if(this_.$utils.check.isEmpty(this_.subCartsInfo.c_ma002)){
				this_.bus.$emit('tipShow', '客户名称为空，请重新登陆！');
				return false;
			}
  		this_.bus.$emit('loading', true);
  		this_.$api.post({
        url: this_.$apiUrl.api.AdvanceOrder,
        params:this_.subCartsInfo,
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.toDetail = false;//预览弹层隐藏
        	this_.bus.$emit('tipOk', '订单提交成功！');
        	this_.$router.push('/userCenter/order');
        }
      });

  	},

  }
}
</script>
