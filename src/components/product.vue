<template>
  <div class="product_container">
  	<div style="height:5rem;"></div>
  	<!--头部固定搜索框内容开始-->
  	<div class="com_search_cont">
  		<div class="com_search clearfix">
  			<div class="com_search_fl">
  				<div class="com_search02" @click="toFocus()">
  					<div class="com_search_select" @click.stop="selShow = !selShow">
  						<span>{{ckTxt}}</span><em :class="selShow?'iconfont tran':'iconfont'">&#xe604;</em>
  						<transition name="ul">
	  						<ul v-show="selShow">
		  						<li @click.stop="selectAll()">全部</li>
		  						<li @click.stop="selectOne()">{{ckList}}</li>
		  					</ul>
	  					</transition>
  					</div>
  					<input type="text" placeholder="请输入" ref="keyEl" v-model="keyTxt" @keyup.13 = "toSearch()" />
  				</div>
  			</div>
  			<input type="button" class="com_search_fr" value="搜索" @click="toSearch()" />
  		</div>
  	</div>
  	<!--头部固定搜索框内容结束-->
  	<div v-show="searchDia">
  		<ul class="com_search_fix" v-if="searchData.length>0">
				<li><a href="javascript:void(0);" @click="toSearchAll()">查看全部 <span><i class="iconfont">&#xe74b;</i></span></a></li>
				<li v-for="(item,index) in searchData"><a href="javascript:void(0);"  @click="listSearch(item)">{{item.name}} <span>产品约{{item.count}}个<i class="iconfont">&#xe74b;</i></span></a></li>
			</ul>
  	</div>


  	<!--主要内容开始-->
  	<div class="product_main">
  		<div class="product_cont" v-for="list in proList">
  			<h2 class="product_title"><span><img :src="list.imgSrc" alt="" /></span>{{list.name}}</h2>
	  	  <ul class="product_list">
	  	  	<li v-for="(item,index) in list.pro" @click="toDetail(list,item)">
	  	  		<div class="product_left">
	  	  			<proLeft-view :proItem="item"></proLeft-view>
	  	  		</div>
	  	  		<div class="product_right">
	  	  			<iconList-view :collItem="item" :num="list.num" :name="list.name"></iconList-view>
	  	  			<cart-view :cartList="item" :num="list.num" :name="list.name"></cart-view>
	  	  			<p>{{item.m_st!=''?item.m_st:''}}</p>
	  	  		</div>
	  	  	</li>
	  	  </ul>
  	  </div>
  	  <p  v-if="proList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  	<!--主要内容结束-->

  	<!--底部footer内容开始-->
  	<footer-view></footer-view>
  	<!--底部footer内容结束-->
  </div>
</template>

<script>
	import './../../static/date/jquery-1.9.1.min.js'
export default {
  name: 'Product',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	proList:[],
    	keyTxt:'',//关键词
    	selShow:false,//查询select
    	ckTxt:'',//选中
    	ckList:'',
    	searchDia:false,
    	searchData:[],
    	searchList:{
    		data:[],
    		txt:''
    	},
    	isLoad:false,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.ckTxt = this_.$route.query.name;
      this_.ckList = this_.$route.query.name;
      this_.getProduct(this_.$route.query.num,this_.$route.query.name);
    })
  },
  watch: {
    keyTxt(curVal, oldVal) {
    	let this_ = this;
    	if(!this_.$utils.check.isEmpty(this_.keyTxt)){
  			if(this_.$utils.check.searchLength(curVal)>=3){
			    // 实现input连续输入，只发一次请求
			    clearTimeout(this_.searchTime);
			    this_.searchTime = setTimeout(() => {
			    	if(this_.ckTxt == '全部'){
			    		this_.seachQuery(curVal);
			    		this_.searchDia = true;

			    	}
			    }, 2000);

	      }
  		}else{
  			this_.searchData = [];
  		}

    }
  },
  methods:{
  	//点击获取焦点
  	toFocus(){
  		let this_ = this;
  		this_.$refs.keyEl.focus()
  	},
  	//点击”查看全部“
		toSearchAll:function(){
			let this_ = this;
			this_.searchDia = false;
			this_.getProList(this_.searchList.data);
		},
  	//点击下拉查询
		listSearch:function(item){
			let this_ = this;
			this_.searchDia = false;
			let paraData = [];
			paraData.push(item);
      this_.getProList(paraData);
		},
		//点击”查询列表“获取产品列表
  	getProList:function(paraData){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.post({
        url: this_.$apiUrl.api.getSearch + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&dpt=' + this_.userInfo.dataset[0].dpt + '&ma075=' + this_.userInfo.dataset[0].ma075,
        params: paraData,
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.productList(data);
        	this_.isLoad = true;
        }
      });
  	},
  	//产品数据渲染
  	productList:function(data){
  		let this_ = this;
  		for(var i=0;i<data.length;i++){
    		for(var j=0;j<data[i].pro.length;j++){
    			data[i].pro[j].cartType = 'product';
          if(this_.$route.query.title == '德马赫产品' || this_.$route.query.title == '联保产品'){
            if(data[i].pro[j].mb001.substring(0,2) != '57' && data[i].pro[j].mb001.substring(0,2) != '58'){
              data[i].pro.splice(i--, 1);
            }
          }
    		}
    		data[i].imgSrc = '';
    		if(this_.userInfo.dataset[0].dpt.search("配件一部") != -1){
					//油品判断
					if(data[i].num == '0043' || data[i].num == '0046' || data[i].num == '0048' || data[i].num == '0072'){
						if(this_.userInfo.dataset[0].ma017 == '200'){
							data[i].imgSrc = require('../assets/images/miniCar/img_index_projl' + data[i].num + '.jpg');
						}else if(this_.userInfo.dataset[0].ma017 == '201'){
							data[i].imgSrc = require('../assets/images/miniCar/img_index_prows' + data[i].num + '.jpg');
						}
					}else if(this_.userInfo.dataset[0].dpt.search("耐用") != -1){
						data[i].imgSrc = require('../assets/images/hongtu/img_index_pro' + data[i].num + '.jpg');
					}else {
						data[i].imgSrc = require('../assets/images/miniCar/img_index_pro' + data[i].num + '.jpg');
					}

    		}else if(this_.userInfo.dataset[0].dpt.search("配件二部") != -1){
    			data[i].imgSrc = require('../assets/images/sedan/img_index_pro' + data[i].num + '.png');
    		}
    	}
    	this_.proList = data;

  	},
  	//站内查询
  	seachQuery:function(keyWord){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.searchData = [];
  		this_.$api.get({
        url: this_.$apiUrl.api.getSearch + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&brand=' + this_.userInfo.dataset[0].dpt + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&keyword=' + keyWord,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if (this_.keyTxt === keyWord){//避免先请求后返回问题，确保给列表赋值是以当前输入的值为参数的
        		this_.searchData = data;
        		this_.searchList.data = data;
        		this_.searchList.txt = this_.keyTxt;
        	}
        }
      });
  	},
  	//查找全部
  	selectAll(){
  		let this_ = this;
  		this_.ckTxt = '全部';
  		this_.selShow = false;
  	},
  	//查找单个
  	selectOne(){
  		let this_ = this;
  		this_.ckTxt = this_.ckList;
  		this_.selShow = false;
  	},
  	//点击搜受
  	toSearch(){
  		let this_ = this;
  		if(this_.ckTxt == '全部'){
  			if(!this_.$utils.check.isEmpty(this_.keyTxt)){
  				this_.proList = [];
  				//点击”搜索“关键字查询，获取产品列表
		  		this_.bus.$emit('loading', true);
		  		this_.$api.get({
		        url: this_.$apiUrl.api.SearchItem + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&brand=' + this_.userInfo.dataset[0].dpt + '&keyword=' + this_.keyTxt + '&ma075=' + this_.userInfo.dataset[0].ma075,
		        params: {},
		        success: function (data) {
		        	this_.bus.$emit('loading', false);
		        	this_.productList(data);
		        	this_.searchDia = false;
		      		this_.isLoad = true;
		        }
		      });
  			}else{
  				this_.bus.$emit('tipShow', "请输入关键字！");
  			}

  		}else{
  			let keyWord = this_.$route.query.name+' '+this_.keyTxt;
  			this_.proList = [];
	  		this_.bus.$emit('loading', true);
	  		this_.$api.get({
	        url: this_.$apiUrl.api.SearchItem + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&brand=' + this_.userInfo.dataset[0].dpt + '&keyword=' + keyWord + '&ma075=' + this_.userInfo.dataset[0].ma075,
	        params: {},
	        success: function (data) {
	        	this_.bus.$emit('loading', false);
	        	this_.productList(data);
	      		this_.isLoad = true;
	        }
	      });
  		}

  	},
  	//获取产品列表
  	getProduct:function(type,name){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getPro + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&dpt=' + this_.userInfo.dataset[0].dpt + '&type=' + type + '&ma075=' + this_.userInfo.dataset[0].ma075 + '&keyWord=',
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	for(var i=0;i<data.length;i++){
					  data[i].cartType = 'product';
            if(this_.$route.query.title == '德马赫产品' || this_.$route.query.title == '联保产品'){
              if(data[i].mb001.substring(0,2) != '57' && data[i].mb001.substring(0,2) != '58'){
                data.splice(i--, 1);
              }
            }

        	}
        	let dataArr = {
        		"name":name,
        		"num":type,
        		"pro":data,
        		"imgSrc":''
        	};
        	dataArr.imgSrc = '';
	    		if(this_.userInfo.dataset[0].dpt.search("配件一部") != -1){
						//油品判断
						if(dataArr.num == '0043' || dataArr.num == '0046' || dataArr.num == '0048' || dataArr.num == '0072'){
							if(this_.userInfo.dataset[0].ma017 == '200'){
								dataArr.imgSrc = require('../assets/images/miniCar/img_index_projl' + dataArr.num + '.jpg');
							}else if(this_.userInfo.dataset[0].ma017 == '201'){
								dataArr.imgSrc = require('../assets/images/miniCar/img_index_prows' + dataArr.num + '.jpg');
							}
						}else if(this_.userInfo.dataset[0].dpt.search("耐用") != -1){
							dataArr.imgSrc = require('../assets/images/hongtu/img_index_pro' + dataArr.num + '.jpg');
						}else {
							dataArr.imgSrc = require('../assets/images/miniCar/img_index_pro' + dataArr.num + '.jpg');
						}

	    		}else if(this_.userInfo.dataset[0].dpt.search("配件二部") != -1){
	    			dataArr.imgSrc = require('../assets/images/sedan/img_index_pro' +dataArr.num + '.png');
	    		}
        	this_.proList.push(dataArr);
        	this_.isLoad = true;
        }

      });
  	},

  	//跳转详情
  	toDetail:function(list,item){
  		let this_ = this;
      if(this_.userInfo.dataset[0].mr003.search("耐用") != -1 || this_.userInfo.dataset[0].mr003.search("吉利") != -1){
        if(this_.userInfo.dataset[0].mr003.search("江陵耐用") != -1){
          sessionStorage.setItem('brandType',3);
        }else if(this_.userInfo.dataset[0].mr003.search("弘途耐用") != -1){
          sessionStorage.setItem('brandType',4);
        }else if(this_.userInfo.dataset[0].mr003.search("吉利") != -1){
          sessionStorage.setItem('brandType',5);
        }
        sessionStorage.setItem('proObj',JSON.stringify(item));
        this_.$api.get({
          url: this_.$apiUrl.api.ProductImage + "?mb001=" + item.mb001,
          params: {},
          success: function (data) {
            if(data.content.length>0){
              let price = '';
              let guideprice = '';
              if(!this_.$utils.check.isEmpty(item.price) && item.price != 0){
                price = item.price;
              }
              if(!this_.$utils.check.isEmpty(item.guideprice) && item.guideprice != 0 && this_.userInfo.dataset[0].mr003.search("耐用") != -1){
                guideprice = item.guideprice;
              }
              this_.$router.push({path:'/proSearch/detail', query: {mb001:item.mb001,title:'订单系统',price:price,guideprice:guideprice}});
            }else{
              this_.bus.$emit('tipShow', "暂无产品详情");
            }

          }
        });
      }else{
        if(item.imgqty>0){
        	this_.$router.push({path:'/proDetail', query: {ma001:list.num,mb001:item.mb001,mb002:item.mb002,imgqty:item.imgqty}});
        }
      }


  	},

  }
}
</script>
