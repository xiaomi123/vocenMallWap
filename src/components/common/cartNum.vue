<template>
<!--加减购物车内容开始-->
<div class="cartNum_contain">
	<div class="com_cart">
		<span @click.stop="reduce()">-</span>
		<input type="number" v-model="cartList.qty" @click.stop ="" @focus="numFocus()" @blur="numBlur()" />
		<span @click.stop="add()">+</span>
	</div>
	<div class="cartNum_mask" v-if="disBuy"></div>
</div>
<!--加减购物车内容结束-->
</template>

<script>
export default {
  name: '',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	max:999,
    	min:0,
    	changeQty:0,
    	disBuy:false,
    }
  },
  props:[
    "cartList",
    "num",
    "name"
  ],
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
  		if(!this_.$utils.check.isEmpty(this_.cartList.i_quota_qty)){
  			this_.max = parseInt(this_.cartList.i_quota_qty) - parseInt(this_.cartList.orderqty);
  			if(parseInt(this_.cartList.orderqty) >= parseInt(this_.cartList.i_quota_qty)){
  				this_.disBuy = true;
  			}
  		}else{
  			this_.max = 9999;
  		}
  		if(!this_.$utils.check.isEmpty(this_.cartList.shortQty)){
  			if(parseInt(this_.cartList.shortQty) == 0){
  				this_.disBuy = true;
  			}
  		}
    });
  },
  methods: {
  	//减少购物车
  	reduce:function(){
  		let this_ = this;
  		let qty = parseInt(this_.cartList.qty);
  		let mQty = parseInt(this_.cartList.m_st_qty);
  		let totalNum = parseInt(sessionStorage.getItem("cartTotal"));//购物车总数
  		/*if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty)){
  			this_.min = this_.cartList.i_limit_qty;
  		}*/
  		if((qty-mQty) >= this_.min){
  			this_.cartList.qty = parseInt(this_.cartList.qty) - parseInt(this_.cartList.m_st_qty);

  			//购物车页面统计
  			if(this_.cartList.cartType == 'cart'){
  				//购买数量满多少有活动
  				if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (Number(this_.cartList.qty)>=Number(this_.cartList.i_limit_qty))){
				  	this_.cartList.price = this_.cartList.i_price;
				  }else{
            //购物车清仓活动（购物车出现价格赋值问题添加）
            if(this_.cartList.i_type_no == '1' || this_.cartList.i_type_no == '5' || this_.cartList.i_type_no == '8' || this_.cartList.i_type_no == '9'){
              this_.cartList.price = this_.cartList.i_price;
            }else{
              this_.cartList.price = this_.cartList.backprice;
            }
				  	//this_.cartList.price = this_.cartList.backprice;
				  }
  				this_.bus.$emit('cartChange',{chNum:parseInt(this_.cartList.m_st_qty),chPrice:Number(this_.cartList.price),type:'cut'});
  			}

  			totalNum = totalNum - parseInt(this_.cartList.m_st_qty);//购物车总数
  			if((qty-mQty) == 0){
  				//为0删除购物车
  				if(this_.cartList.cartType == 'cart'){
  					//购物车页面
  					this_.toAdd();
  				}else{
  					//产品列表页
  					this_.toReduce();
  				}
  			}else{
  				this_.toAdd();
  			}
  		}else{
  			if(qty != 0){
  				this_.cartTotal = this_.cartTotal - parseInt(this_.cartList.qty);//购物车总数

  				//购物车页面统计
  				if(this_.cartList.cartType == 'cart'){
  					//购买数量满多少有活动
	  				if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (Number(this_.cartList.qty)>=Number(this_.cartList.i_limit_qty))){
					  	this_.cartList.price = this_.cartList.i_price;
					  }else{
              //购物车清仓活动（购物车出现价格赋值问题添加）
              if(this_.cartList.i_type_no == '1' || this_.cartList.i_type_no == '5' || this_.cartList.i_type_no == '8' || this_.cartList.i_type_no == '9'){
                this_.cartList.price = this_.cartList.i_price;
              }else{
                this_.cartList.price = this_.cartList.backprice;
              }
					  	//this_.cartList.price = this_.cartList.backprice;
					  }
	  				this_.bus.$emit('cartChange',{chNum:parseInt(this_.cartList.qty),chPrice:Number(this_.cartList.price),type:'cut'});
	  			}

		  		this_.cartList.qty = 0;
			  	//删除购物车
				  this_.toReduce();
		  	}else{
		  		this_.bus.$emit('tipShow', "已经不能再少了");
		  	}
  		}

  		//购物车总数
  		sessionStorage.setItem("cartTotal", totalNum); //存入购物车总数
  		this_.bus.$emit('cartTotal', totalNum);

  	},

  	//添加购物车
  	add:function(){
  		let this_ = this;
  		//最小购买量
  		let mQty = this_.cartList.m_st_qty;
			/*if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (parseInt(this_.cartList.m_st_qty)<parseInt(this_.cartList.i_limit_qty)) && this_.cartList.qty==0){
				mQty = this_.cartList.i_limit_qty;
	  	}*/

  		if(this_.cartList.qty < this_.max){
  			this_.cartList.qty = parseInt(this_.cartList.qty) + parseInt(mQty);

  			//购物车总数
  			let totalNum = parseInt(sessionStorage.getItem("cartTotal"));
  			totalNum = totalNum + parseInt(mQty);
  			sessionStorage.setItem("cartTotal", totalNum); //存入购物车总数
  			this_.bus.$emit('cartTotal', totalNum);

  			//购物车页面统计
  			if(this_.cartList.cartType == 'cart'){
  				//购买数量满多少有活动
  				if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (Number(this_.cartList.qty)>=Number(this_.cartList.i_limit_qty))){
				  	this_.cartList.price = this_.cartList.i_price;
				  }else{
            //购物车清仓活动（购物车出现价格赋值问题添加）
            if(this_.cartList.i_type_no == '1' || this_.cartList.i_type_no == '5' || this_.cartList.i_type_no == '8' || this_.cartList.i_type_no == '9'){
              this_.cartList.price = this_.cartList.i_price;
            }else{
              this_.cartList.price = this_.cartList.backprice;
            }

				  }
  				this_.bus.$emit('cartChange',{chNum:parseInt(mQty),chPrice:Number(this_.cartList.price),type:'add'});
  			}

  			this_.toAdd();
  		}else{
  			this_.bus.$emit('tipShow', "已达限购数量");
  		}

  	},

  	//编辑数量获取焦点
  	numFocus:function(){
  		let this_ = this;
  		this_.changeQty = this_.cartList.qty;
  		if(this_.cartList.qty==0){
  			this_.cartList.qty = '';
  		}
  	},

  	//编辑数量失去焦点
  	numBlur:function(){
  		let this_ = this;
  		let totalNum = parseInt(sessionStorage.getItem("cartTotal"));//总数量
  		//this_.cartList.qty = this_.cartList.qty.replace(/\D/g,'').replace(/^0+(?=\d)/,'');
  		if(this_.cartList.qty==''){
  			this_.cartList.qty = 0;
  		}else if(this_.cartList.qty > this_.max){
  			this_.cartList.qty = this_.max;
  			this_.bus.$emit('tipShow', "已达限购数量");
  		}
  		if(this_.changeQty != this_.cartList.qty){
  			let mQty = parseInt(this_.cartList.m_qty);

  			//判断是否有最小限制
  			/*if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && this_.cartList.i_limit_qty != '0' && (parseInt(this_.cartList.qty) < parseInt(this_.cartList.i_limit_qty))){
  				mQty = parseInt(this_.cartList.i_limit_qty);
  			}*/


  			let curQty = parseInt(this_.cartList.qty);
  			let remainder = parseInt(curQty%mQty);
  			if(remainder !=0){
          console.log(this_.cartList.m_qty_type)
          if(this_.cartList.m_qty_type == '1'){
            if(curQty<mQty){
              this_.cartList.qty = mQty;
            }
          }else{
            this_.cartList.qty = curQty + (mQty-remainder);
            this_.bus.$emit('tipShow', "商品自动加到最小单位");
          }

				}
  			if(this_.cartList.qty == 0){
  				totalNum = totalNum - parseInt(this_.changeQty);//总数量

  				if(this_.cartList.cartType == 'cart'){
  					//购物车页面
  					this_.toAdd();

  					//购物车页面统计
	  				this_.bus.$emit('cartChange',{chNum:parseInt(this_.changeQty),chPrice:Number(this_.cartList.price),type:'cut'});

  				}else{
  					//产品列表页
  					this_.toReduce();
  				}

  			}else{
  				totalNum = totalNum + curQty - parseInt(this_.changeQty);//总数量

  				//购物车页面统计
  				if(this_.cartList.cartType == 'cart'){
	  				let cutNum = parseInt(curQty - parseInt(this_.changeQty));
	  				this_.bus.$emit('cartChange',{chNum:cutNum,chPrice:Number(this_.cartList.price),type:'add'});
	  			}

  				this_.toAdd();
  			}

  			//总数量
  			sessionStorage.setItem("cartTotal", totalNum); //存入购物车总数
  			this_.bus.$emit('cartTotal', totalNum);
  		}
  	},

  	//添加购物车
  	toAdd:function(){
  		let this_ = this;
  		//加入购物车价格
  		let price = 0;
  		if(this_.cartList.a_type_no == '2'){
  			//秒杀
		  	price = this_.cartList.price;
		  }else if(this_.cartList.a_type_no == '1' || this_.cartList.a_type_no == '4' || this_.cartList.a_type_no == '5' || this_.cartList.a_type_no == '8' || this_.cartList.a_type_no == '9'){
		  	//特价
		  	//price = this_.cartList.aprice;
		  	price = this_.$utils.check.isEmpty(this_.cartList.aprice) ? this_.cartList.price : this_.cartList.aprice;//价格
		  	if(!this_.$utils.check.isEmpty(this_.cartList.i_quota_qty)){
		  		//购买量>=最大限够
		  		if(parseInt(this_.cartList.orderqty) >= parseInt(this_.cartList.i_quota_qty)){
			  		price = this_.cartList.price;
			  	}
		  	}
        if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (Number(this_.cartList.qty)>=Number(this_.cartList.i_limit_qty)) && !this_.$utils.check.isEmpty(this_.cartList.aprice)){
        	price = this_.cartList.price;
        }else{
        	price = this_.cartList.backprice;
        }

		  } else{
		  	price = this_.$utils.check.isEmpty(this_.cartList.aprice) ? this_.cartList.price : this_.cartList.aprice;//价格
		  }

		  let a_id = (this_.cartList.a_type_no=='2')?'':this_.cartList.activity;
		  if(this_.cartList.cartType == 'cart'){
		  	a_id = this_.cartList.i_a_id;
		  }

		  if(this_.cartList.cartType == 'cart'){
		  	if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (Number(this_.cartList.qty)>=Number(this_.cartList.i_limit_qty)) && !this_.$utils.check.isEmpty(this_.cartList.aprice)){
			  	price = this_.cartList.price;
			  }else{
			  	price = this_.cartList.backprice;
			  }
		  }else{
		  	if(!this_.$utils.check.isEmpty(this_.cartList.i_limit_qty) && (Number(this_.cartList.qty)>=Number(this_.cartList.i_limit_qty)) && !this_.$utils.check.isEmpty(this_.cartList.aprice)){
			  	price = this_.cartList.aprice;
			  }else{
			  	price = this_.cartList.price;
			  }
		  }

  		this_.$api.post({
        url: this_.$apiUrl.api.addCart + '?ma075=' + this_.userInfo.dataset[0].ma075,
        params: {
        	"c_id":this_.userInfo.dataset[0].c_id,
					"dpt":this_.userInfo.dataset[0].dpt,
					"c_ma001":this_.userInfo.dataset[0].ma001,
					"c_ma002":this_.userInfo.dataset[0].ma002,
					"i_ma001":this_.num,
					"i_ma002":this_.name,
					"i_mb001":this_.cartList.mb001,
					"i_mb002":this_.cartList.mb002,
					"i_mb003":this_.cartList.mb003,
					"i_mb004":this_.cartList.mb004,
					"activity":a_id,
					"price":price,
					"backprice":this_.cartList.price,
					"i_limit_qty":this_.cartList.i_limit_qty,
					"oem":this_.cartList.oem,
					"qty":this_.cartList.qty
        },

        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.State){
        		this_.bus.$emit('tipOk', "添加购物车成功！");
        		this_.cartList.s_id = data.centent.s_id;
        		if(this_.cartList.cartType == 'cart'){
	  					//购物车页面
	  					this_.cartList.s_state = data.centent.s_state;
	  					if(this_.cartList.s_is_sortage == 'True'){

	  					}
	  				}

        	}else{
        		this_.bus.$emit('tipShow', data.Message);
						//this_.addFail(cur);
        	}

        }
      });
  	},

  	//删除购物车
  	toReduce:function(){
  		let this_ = this;
  		this_.$api.post({
        url: this_.$apiUrl.api.delCat,
        params:[{"s_id":this_.cartList.s_id}],
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(data.State){
        		this_.bus.$emit('tipOk', "删除购物车成功！");
        		this_.cartList.s_id = '';
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
						//this_.addFail(cur);
        	}

        }
      });

  	},

  	//购物车操作失败
  	addFail:function(){
  		let this_ = this;
  		this_.$api.get({
        url: this_.$apiUrl.api.addCart,
        params:[{"s_id":this_.cartList.s_id}],
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.bus.$emit('tipShow', '网路繁忙，请您退出重试');
        	this_.cartTotal = this_.cartTotal + data - parseInt(this_.cartList.qty);

        	//购物车页面统计
  				if(this_.cartList.cartType == 'cart'){
	  				let cutNum = parseInt(data) - parseInt(this_.cartList.qty);
	  				this_.bus.$emit('cartChange',{chNum:cutNum,chPrice:Number(this_.cartList.price),type:'add'});
	  			}

        	if(this_.$utils.check.isEmpty(data)){
        		this_.cartList.qty = 0;
        	}else{
        		this_.cartList.qty = data;
        	}

        	//总数量
        	sessionStorage.setItem("cartTotal", this_.cartTotal); //存入购物车总数
        	this_.bus.$emit('cartTotal', this_.cartTotal);
        }
      });
  	},


  }
}
</script>
