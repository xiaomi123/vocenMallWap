<template>
  <div class="product_container">
  	<!--搜索弹层内容开始-->
  	<div class="index_toSearch" v-show="searchDia">
  		<div class="index_searchCont">
  			<!--查询固定header内容开始-->
  			<div class="index_searchKey">
	  			<p class="index_searchBox">
	  				<input type="text" placeholder="请输入" v-model="keyTxt" ref="searchEl" />
		  			<em class="iconfont" v-show="seaCan" @click="clearKey()">&#xe60f;</em>
	  			</p>
	  			<span v-show="seaCan" @click="keySearch()">搜索</span>
	  			<span @click="searchDia=false" v-show="!seaCan">取消</span>
	  		</div>
	  		<!--查询固定header内容结束-->
	  		
	  		<!--历史查询记录内容开始-->
	  		<div class="serch_history" v-show="!searchPl">
	  			<h2>历史搜索 </h2>
	  			<ul>
		  			<li v-for="item in hisRecord">{{item}}</li>
		  		</ul>
	  		</div>
	  		<!--历史查询记录内容结束-->
	  		
	  		<!--查询结果内容开始-->
	  		<div v-show="searchPl">
		  		<ul class="index_searchList" v-if="searchData.length>0">
		  			<li>
		  				<a href="javascript:void(0);" @click="toSearchAll()">
		  				查看全部 <span><i class="iconfont">&#xe74b;</i></span>
		  				</a>
		  			</li>
		  			<li v-for="(item,index) in searchData">
		  				<a href="javascript:void(0);" @click="toSearch(item)">
		  				{{item.name}} <span>产品约{{item.count}}个<i class="iconfont">&#xe74b;</i></span>
		  				</a>
		  			</li>
		  		</ul>
		  		<p v-else class="com_noData">暂无数据</p>
	  		</div>
	  		<!--查询结果内容结束-->
  		</div>
  	</div>
  	<!--搜索弹层内容结束-->
  	
  	<!--主要内容开始-->
  	<div class="product_main searchList_main">
  		<div class="product_head">
  			<div class="product_search">
  				<router-link :to="{path: '/index'}" class="iconfont">&#xe601;</router-link>
	  			<p>
	  				<em class="iconfont">&#xe60b;</em>
	  				<input type="text" placeholder="请输入" v-model="keyTxt" @focus="keyFocus()" />
	  			</p>
  			</div>
  		</div>
  		<div class="product_cont"  v-for="list in proList">
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
  	<!--主要内容开始-->
  	<footer-view></footer-view>
  	
  </div>
</template>

<script>
export default {
  name: 'searchList',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	searchList:JSON.parse(sessionStorage.getItem("searchList")),
    	proList:[],
    	isLoad:false,
    	searchDia:false,//搜索弹层
    	seaCan:false,//搜索取消按钮
    	searchPl:false,//查询结果内容显示隐藏
    	keyTxt:'',//查询录入关键字
    	searchData:[],//关键字查询结果
    	searchTime:null,//延迟请求定时器
    	hisRecord:[],//历史搜索
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.keyTxt = this_.searchList.txt;
      
      let paraData = [];
      if(this_.$route.query.name == '全部'){
  			paraData = this_.searchList.data;
  		}else{
  			paraData.push(this_.$route.query);
  		}
  		
      this_.getProduct(paraData);
      
    })
  },
  watch: {
    keyTxt(curVal, oldVal) {
    	let this_ = this;
    	if(!this_.$utils.check.isEmpty(this_.keyTxt)){
  			this_.seaCan = true;
  			if(this_.$utils.check.searchLength(curVal)>=3){
			    // 实现input连续输入，只发一次请求
			    clearTimeout(this_.searchTime);
			    this_.searchTime = setTimeout(() => {
			      this_.seachQuery(curVal);
			    }, 300);
	      
	      }
  		}else{
  			this_.seaCan = false;
  			this_.searchData = [];
  		}
    	
    }
  },
  methods:{
  	//点击”查询列表“获取产品列表
  	getProduct:function(paraData){
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
					}else if(this_.userInfo.dataset[0].dpt.search("弘途") != -1){
						data[i].imgSrc = require('../assets/images/hongtu/img_index_pro' + data[i].num + '.jpg');
					}else {
						data[i].imgSrc = require('../assets/images/miniCar/img_index_pro' + data[i].num + '.jpg');
					}
    			
    		}else if(this_.userInfo.dataset[0].dpt.search("配件二部") != -1){
    			data[i].imgSrc = require('../assets/images/sedan/img_index_pro' + data[i].num + '.png');
    		}
    	}
    	this_.proList = data;
    	this_.hisSearch();//历史搜索记录值
  	},
  	
  	
  	//历史搜索记录值
  	hisSearch:function(){
  		let this_ = this;
      if(!this_.$utils.check.isEmpty(JSON.parse(localStorage.getItem("hisRecord")))){
      	this_.hisRecord = JSON.parse(localStorage.getItem("hisRecord"));//历史搜索取值
      	for(var i=0;i<this_.hisRecord.length;i++){
      		if(this_.hisRecord[i] == this_.keyTxt){
      			this_.hisRecord.splice(i,1);
      		}
      	}
      	
      }
      this_.hisRecord.push(this_.keyTxt);
      localStorage.setItem("hisRecord", JSON.stringify(this_.hisRecord));//历史搜索存值
      this_.hisRecord = this_.hisRecord.reverse().slice(0,10);
  	},
  	
  	
  	//点击”搜索“关键字查询，获取产品列表
  	keySearch:function(){
  		let this_ = this;
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
  	},
  	
  	//跳转详情
  	toDetail:function(list,item){
  		let this_ = this;
  		if(item.imgqty>0){
  			this_.$router.push({path:'/proDetail', query: {ma001:list.num,mb001:item.mb001,mb002:item.mb002}});
  		}
  		
  	},
  	
  	//点击录入框
  	keyFocus:function(){
  		let this_ = this;
  		this_.searchDia = true;
  		this_.searchPl = false;
  		this_.searchData = [];
  		if(!this_.$utils.check.isEmpty(this_.keyTxt)){
  			this_.seaCan = true;
  		}else{
  			this_.seaCan = false;
  		}
  	},
  	
  	//站内查询
  	seachQuery:function(keyWord){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.searchData = [];
  		this_.searchPl = true;
  		this_.$api.get({
        url: this_.$apiUrl.api.getSearch + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&brand=' + this_.userInfo.dataset[0].dpt + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&keyword=' + keyWord,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if (this_.keyTxt === keyWord){//避免先请求后返回问题，确保给列表赋值是以当前输入的值为参数的
        		this_.searchData = data;
        		sessionStorage.setItem("searchList", JSON.stringify({data:data,txt:this_.keyTxt}));//用于点击列表”查看全部“查询
        	}
        }
      });
  	},
  	
  	//清空搜索关键字
  	clearKey:function(){
  		let this_ = this;
  		this_.keyTxt = '';
  		this_.seaCan = false;
  		this_.searchPl = false;
       this_.searchData = [];
  		this_.$nextTick( () =>{
        this_.$refs.searchEl.focus();
			});
  	},
  	
  	//点击下拉查询
		toSearch:function(item){
			let this_ = this;
			this_.searchDia = false;
			let paraData = [];
			paraData.push(item);
      this_.getProduct(paraData);
		},
		
		//点击”查看全部“
		toSearchAll:function(){
			let this_ = this;
			this_.searchDia = false;
			let paraData = JSON.parse(sessionStorage.getItem("searchList")).data;
			this_.getProduct(paraData);
		}
  	
  }
}
</script>
