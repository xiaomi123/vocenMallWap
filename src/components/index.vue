<template>
  <div class="index_container">
  	<!--header内容开始-->
  	<div class="index_content" ref="headCont">
  		<div class="index_header clearfix">
	  		<div class="index_header_left">
	  			<!--品牌tab切换内容开始-->
		  		<dptList-view @changetab="changetab"></dptList-view>
		  		<!--品牌tab切换内容结束-->
	  		</div>
	  		<ul class="index_tab">
	  			<li v-for="(item,index) in tabArr" :class="index == tabIndex ? 'active':''" @click="tabSwitch(index)">{{item}}<em></em></li>
	  		</ul>
	  		<router-link :to="{path: '/news'}" class="index_new"><i class="iconfont">&#xe607;</i><em v-if="noReadNum != 0">{{noReadNum}}</em></router-link>
	  		<div class="index_search">
	  			<p>
	  				<input type="text" placeholder="请输入" @focus="toSearch()" />
	  				<i class="iconfont">&#xe60b;</i>
	  			</p>
	  		</div>
	  	</div>
  	</div>
  	<!--header内容结束-->

  	<!--搜索弹层内容开始-->
  	<div class="index_toSearch" v-show="searchDia">
  		<div class="index_searchCont">
  			<!--查询固定header内容开始-->
  			<div class="index_searchKey">
	  			<p class="index_searchBox">
	  				<input type="text" placeholder="请输入" v-model="keyTxt" ref="searchEl" />
		  			<em class="iconfont" v-show="seaCan" @click="clearKey()">&#xe60f;</em>
	  			</p>
	  			<span @click="keySearch()" v-show="seaCan">搜索</span>
	  			<span @click="searchDia=false" v-show="!seaCan">取消</span>
	  		</div>
	  		<!--查询固定header内容结束-->

	  		<!--历史查询记录内容开始-->
	  		<div class="serch_history" v-show="!searchPl && hisRecord.length>0">
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
		  				<router-link :to="{path: '/searchList', query: {'name':'全部','txt':keyTxt}}">
		  				查看全部 <span><i class="iconfont">&#xe74b;</i></span>
		  				</router-link>
		  			</li>
		  			<li v-for="(item,index) in searchData">
		  				<router-link :to="{path: '/searchList', query: item}">
		  				{{item.name}} <span>产品约{{item.count}}个<i class="iconfont">&#xe74b;</i></span>
		  				</router-link>
		  			</li>
		  		</ul>
		  		<p v-else class="com_noData">暂无数据</p>
	  		</div>
	  		<!--查询结果内容结束-->

  		</div>
  	</div>
  	<!--搜索弹层内容结束-->


  	<!--批量导入内容开始-->
		<!--<p class="index_batch"><router-link :to="{path: '/batchIn'}"><i class="iconfont">&#xe605;</i></br>批量导入</router-link></p>-->
		<!--批量导入内容结束-->

		<!--设置密码弹层开始-->
		<div class="setPass_dialog" v-show="setShow">
			<div class="index_setPass">
				<h2>你还未设置密码，请设置密码</h2>
				<p>对同一个手机号码发送短信验证码，支持5条/小时 ，累计10条/天，为了您的使用方便，建议您设置密码，使用用户名密码登陆。</p>
				<ul class="setPass_list">
					<li>
						<label>设置密码</label>
						<input type="password" placeholder="只能字母、数字组合，6-20位字符" v-model="passWord" />
					</li>
					<li>
						<label>确认密码</label>
						<input type="password" placeholder="请再次输入密码" v-model="rePassWord" />
					</li>
				</ul>
				<div class="index_setBtn clearfix">
					<input type="button" value="稍后设置" />
					<input type="button" value="确定" @click="toSetPass()" />
				</div>

			</div>
		</div>
		<!--设置密码弹层结束-->

		<!--送积分弹层内容开始-->
		<div class="give_mask" v-show="giveShow">
			<div class="give_dialog">
				<div class="give_main_cont">
					<div class="give_main">
						<h2>首次登陆送您</h2>
						<p>
							<i class="iconfont">&#xe644;</i>
							20积分
						</p>
						<input type="button" value="确定" class="give_btn" @click="giveShow = false" />
						<span class="iconfont give_close" @click="giveShow = false">&#xe727;</span>
					</div>
				</div>
			</div>
		</div>
		<!--送积分弹层内容结束-->

  	<!--主要内容开始-->
  	<div class="index_main">
  		<!--nav内容开始-->
  		<ul class="index_nav clearfix">
  			<li v-for="(item,index) in navArr">
  				<router-link :to="{path: item.toPath}">
  					<span><img :src="item.icon" alt="" /></span>
  					{{item.name}}
  				</router-link>
  			</li>
  		</ul>
  		<!--nav内容结束-->

  		<!--活动内容开始-->
  		<div class="index_ativity" v-show="tabArr[tabIndex] == '活动'">
  			<h2 v-if="activeData.length>0"><i></i>活动</h2>
  			<ul>
  				<li v-for="item in activeData"><a href="javascript:void(0);" @click="toActivity(item)"><img :src="item.imgSrc" alt="" /></a></li>
  			</ul>
  			<h2 v-if="hotData.length>0"><i></i>新品热品</h2>
  			<ul>
  				<li v-for="list in hotData"><a href="javascript:void(0);" @click="toProduct(list)"><img :src="list.imgSrc" alt="" /></a></li>
  			</ul>
  		</div>
  		<!--活动内容结束-->

  		<!--产品分类内容开始-->
  		<div class="index_sort clearfix" ref="sysSort" v-show="tabArr[tabIndex] == '产品'">
  			<div class="index_sort_left" ref="sysLeft">
  				<ul class="index_xt">
  					<li v-for="(item,index) in proSort" :class="sortIndex == index ? 'active' : ''" @click="toSystem('#anchor-'+index,index)">
  						<i></i>{{item.name}}
  					</li>
  				</ul>
  			</div>
  			<div class="index_sort_right" ref="sysRight">
  				<div class="index_pro" v-for="(list,index) in proSort" :id="'anchor-'+index">
  					<h2>{{list.name}}</h2>
	  				<ul class="index_list clearfix">
	  					<li v-for="item in list.item">
	  						<router-link :to="{path: '/product', query: {num:item.num,name:item.name,title:list.name}}">
	  							<span><img :src="item.imgSrc" /></span>
	  							<em class="cut" v-show="(userInfo.dataset[0].dpt.search('现代') != -1) && (item.num == '1017' || item.num == '1070' || item.num == '1073' || item.num == '1056' || item.num == '1045' || item.num == '1047' || item.num == '1046')"><img src="../assets/images/common/icon_cut.png" /></em>
	  							<em class="cut" v-show="(userInfo.dataset[0].dpt.search('现代') != -1) && (item.num == '1086')"><img src="../assets/images/common/icon_hot.png" /></em>
	  							<em class="cut" v-show="(userInfo.dataset[0].dpt.search('配件一部') != -1) && (item.num == '0088')"><img src="../assets/images/common/icon_new.png" /></em>
	  							<em class="cut" v-show="(userInfo.dataset[0].dpt.search('配件二部') != -1) && (list.name == '德马赫产品')"><img src="../assets/images/common/icon_hot02.png" /></em>
                  {{item.name}}
	  						</router-link>
	  					</li>
	  				</ul>
  				</div>

  			</div>
  		</div>
  		<!--产品分类内容结束-->

  	</div>
  	<!--主要内容结束-->
  	<footer-view></footer-view>
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name: 'index',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	tabArr:['活动','产品'],
    	tabIndex:1,//header中tab切换
    	proSort:[{name:'',item:[]}],//品类分类
    	sortIndex:0,
    	navArr:[
    		{'name':'活动产品','toPath':'/activity/index','icon':require('../assets/images/common/icon_index_nav1.png')},
    		{'name':'我的收藏','toPath':'/collect','icon':require('../assets/images/common/icon_index_nav2.png')},
    		{'name':'历史订单','toPath':'/buyHistory','icon':require('../assets/images/common/icon_index_nav3.png')},
    		{'name':'补货提醒','toPath':'/shortage','icon':require('../assets/images/common/icon_index_nav4.png')},
    	],
  		passWord:'',
  		rePassWord:'',
  		setShow:false,//设置密码弹层
    	giveShow:false,//首次登陆送积分
    	isLoad:false,
    	searchDia:false,//搜索弹层
    	seaCan:false,//搜索取消按钮
    	searchPl:false,//查询结果内容显示隐藏
    	keyTxt:'',//查询录入关键字
    	searchData:[],//关键字查询结果
    	searchTime:null,//延迟请求定时器
    	hotData:[],//新品热品图数据
    	activeData:[],//活动图数据
    	noReadNum:0,//未读消息
    	hisRecord:[],//历史搜索
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.bus.$emit('footer', true);//底部footer

      //送积分弹层
      if(this_.userInfo.dataset[0].give == 1){
      	//this_.giveShow = true;
      	this_.userInfo.dataset[0].give = 0;
				sessionStorage.setItem("userinfo",JSON.stringify(this_.userInfo)); //存入修改用户名后userInfo
      }

      //header中tab切换记录
      if(!this_.$utils.check.isEmpty(sessionStorage.getItem("tabIndex"))){
      	this_.tabIndex = sessionStorage.getItem("tabIndex");
      }

      //系统分类滚动监听
      if(this_.tabIndex == 1){
      	window.addEventListener('scroll',this_.handleScroll,true);
      }
      this_.getMsgNum();//未读消息

      //历史搜索记录
      if(!this_.$utils.check.isEmpty(JSON.parse(localStorage.getItem("hisRecord")))){
      	this_.hisRecord = JSON.parse(localStorage.getItem("hisRecord")).reverse().slice(0,10);
      }

    })
  },
  destroyed: function(){
  	let this_ = this;
 	  window.removeEventListener('scroll', this_.handleScroll,true)
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
			    }, 1000);

	      }
  		}else{
  			this_.seaCan = false;
  			this_.searchData = [];
  		}

    },
    giveShow(curVal, oldVal){
    	let this_ = this;
    	if(!curVal){
    		if(this_.userInfo.dataset[0].ispwd == 1){
    			this_.setShow = true;
    		}
    	}
    }
  },
  methods:{
  	//滚动监听
  	handleScroll:function(){
  		let this_ = this;
  		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  		let offTop = this_.$refs.sysSort.offsetTop-this_.$refs.headCont.offsetHeight-30;
  		let h = document.documentElement.clientHeight || document.body.clientHeight;
      //sconsole.log(offTop+";scrollTop"+scrollTop);
  		if(scrollTop > offTop){
  			this_.$refs.sysLeft.style.position = 'fixed';
  			this_.$refs.sysLeft.style.top = this_.$refs.headCont.offsetHeight+30 + 'px';
  			this_.$refs.sysLeft.style.left = '4%';
  			this_.$refs.sysLeft.style.width = '22%';
  			this_.$refs.sysRight.style.marginLeft = '24%';
  			this_.$refs.sysLeft.style.height = h - this_.$refs.headCont.offsetHeight - 80 + 'px' ;
  			this_.$refs.sysLeft.style.overflowY = 'auto';
  		}else{
  			this_.$refs.sysLeft.style.position = 'initial';
  			this_.$refs.sysLeft.style.top = 'initial';
  			this_.$refs.sysLeft.style.left = 'initial';
  			this_.$refs.sysRight.style.marginLeft = '0';
  			this_.$refs.sysLeft.style.width = '24%';
  			this_.$refs.sysLeft.style.height = 'initial';
  			this_.$refs.sysLeft.style.overflowY = 'initial';
  		}

  	},

  	//系统分类锚点连接
  	toSystem:function(selector,index){
  		let this_ = this;
  		this_.sortIndex=index;
  		let anchor = document.querySelector(selector);
  		//let anchor = this.$el.querySelector(selector);
      document.body.scrollTop = anchor.offsetTop - this_.$refs.headCont.offsetHeight-30;
      document.documentElement.scrollTop = anchor.offsetTop - this_.$refs.headCont.offsetHeight-30;
  	},

  	//tab切换
  	tabSwitch:function(index){
  		let this_ = this;
  		this_.tabIndex = index;
			sessionStorage.setItem("tabIndex",index);
  		document.body.scrollTop = 0+'px';
  		document.documentElement.scrollTop = 0;
  		if(index == 1){
  			this_.$refs.sysLeft.style.position = 'initial';
  			this_.$refs.sysLeft.style.top = 'initial';
  			this_.$refs.sysLeft.style.left = 'initial';
  			this_.$refs.sysRight.style.marginLeft = '0';
  			this_.$refs.sysLeft.style.width = '24%';
  			this_.$refs.sysLeft.style.height = 'initial';
  			this_.$refs.sysLeft.style.overflowY = 'initial';
  		}
  	},

  	//品牌tab切换
  	changetab:function(index){
  		let this_ = this;
  		this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
  		this_.getCate(index);//品类列表
  		this_.activeShow(index);//活动图片展示
  	},

  	//获取品类列表
  	getCate:function(index){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getProCate + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset1[index].ma001 + '&dpt=' + this_.userInfo.dataset1[index].dpt,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);

        	for(var i=0;i<data.length;i++){
        		let sortItem = data[i].item;
        		for(var j=0;j<sortItem.length;j++){
      				if(this_.userInfo.dataset[0].dpt.search("配件一部") != -1){
      					//油品判断
      					if(sortItem[j].num == '0043' || sortItem[j].num == '0046' || sortItem[j].num == '0048' || sortItem[j].num == '0072'){
      						if(this_.userInfo.dataset[0].ma017 == '200'){
      							sortItem[j].imgSrc = require('../assets/images/miniCar/img_index_projl' + sortItem[j].num + '.jpg');
      						}else if(this_.userInfo.dataset[0].ma017 == '201'){
      							sortItem[j].imgSrc = require('../assets/images/miniCar/img_index_prows' + sortItem[j].num + '.jpg');
      						}
      					}else if(this_.userInfo.dataset[0].mr003.search("耐用") != -1){
      						sortItem[j].imgSrc = require('../assets/images/hongtu/img_index_pro' + sortItem[j].num + '.jpg');
      					}else {
      						sortItem[j].imgSrc = require('../assets/images/miniCar/img_index_pro' + sortItem[j].num + '.jpg');
      					}

	        		}else{
	        			if(sortItem[j].num == '1030'){
	        				if(this_.userInfo.dataset[0].ma017 == '210' || this_.userInfo.dataset[0].ma017 == '213'){
	        					sortItem[j].imgSrc = require('../assets/images/sedan/img_index_pro' + sortItem[j].num + '.png');
	        				}else{
	        					sortItem.splice(j--,1);
	        				}
	        			}else{
	        				sortItem[j].imgSrc = require('../assets/images/sedan/img_index_pro' + sortItem[j].num + '.png');
	        			}
	        		}
		        }
        	}
        	this_.proSort = data;
        }
      });
  	},

  	//首页搜索
  	toSearch:function(){
  		let this_ = this;
  		this_.searchDia = true;
  		this_.searchPl = false;
  		this_.keyTxt = '';
  		this_.searchData = [];
  		//弹层input获取焦点
  		this_.$nextTick( () =>{
        this_.$refs.searchEl.focus();
			});

  	},

  	//点击搜索关键字查询
  	keySearch:function(){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.getSearch + '?c_id=' + this_.userInfo.dataset[0].c_id + '&c_ma001=' + this_.userInfo.dataset[0].ma001 + '&brand=' + this_.userInfo.dataset[0].dpt + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&keyword=' + this_.keyTxt,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
      		sessionStorage.setItem("searchList", JSON.stringify({data:data,txt:this_.keyTxt}));//用于点击列表”查看全部“查询
      		this_.$router.push({path: '/searchList',query: {name: '全部'}});
        }
      });

  	},

  	//搜索弹层--搜索框获取焦点
  	/*keyChange:function(){
  		let this_ = this;
  		let searchTime;
  		if(!this_.$utils.check.isEmpty(this_.keyTxt)){
  			this_.seaCan = true;

  			if(this_.$utils.check.searchLength(this_.keyTxt)>=3){

  				clearTimeout(searchTime);
	    		searchTime = setTimeout(function(){
	    			console.log(this_.keyTxt)
	    			this_.seachQuery(this_.keyTxt);

	    		},1000);
  			}
  		}else{
  			this_.seaCan = false;
  		}
  	},*/

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
        		this_.searchData = data;//列表查询
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

  	//活动展示
  	activeShow:function(index){
  		let this_ = this;
  		//轮播图
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.ActiveImg + '?ma001=' + this_.userInfo.dataset1[index].ma001 + '&brand=' + this_.userInfo.dataset1[index].dpt + '&ma017=' + this_.userInfo.dataset1[index].ma017,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	//console.log(data)
        	this_.activeData = [];
        	if (data.length > 0){
        		//有活动
        		for(var i=0;i<data.length;i++){
        			data[i].imgSrc = 'http://120.76.144.84:8089/' + data[i].a_image;
        			this_.activeData.push(data[i]);
        		}
        	}
      		//无活动
      		this_.hotData = [];
      		if(this_.userInfo.dataset1[index].dpt.search("配件二部") != -1){
      			//轿车
      			if(this_.userInfo.dataset1[index].dpt.search("现代") != -1){
      				//韩系
      				this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedan827.jpg'),'name':'发电机','num':'1060'});
      				this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanHx7602.jpg'),'name':'中网格栅','num':'1075'});
      				this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanHx76.jpg'),'name':'元宝梁','num':'1062'});
      				this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanHx642.jpg'),'name':'锁块','num':'1086'});

      			}else{
      				//日系
      				if(this_.userInfo.dataset1[index].mr003 == "沃森代理(日系)"){
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanFtWs7601.jpg')});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanFtWs7602.jpg'),'name':'散热器','num':'1045'});

      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanFtWs71.jpg'),'name':'方向机','num':'1040'});
      				}else if(this_.userInfo.dataset1[index].mr003 == "秀泰代理(日系)"){
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanFtXt7601.jpg')});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanFtXt7602.jpg'),'name':'散热器','num':'1045'});

      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedanFtXt71.jpg'),'name':'方向机','num':'1040'});
      				}else{
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedan05.jpg'),'name':'暖风机','num':'1044'});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/sedan/img_index_sedan02.jpg'),'name':'','num':''});
      				}
      			}

      		}else{
      			//微车
      			if(this_.userInfo.dataset1[index].dpt.search("吉利") != -1){
      				//吉利
      				if(this_.userInfo.dataset1[index].dpt.search("吉利-吉摩") != -1){
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_jlJem01.jpg'),'name':'皮带','num':'0140'});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_jlJem02.jpg'),'name':'涨紧轮','num':'0141'});
      				}else if(this_.userInfo.dataset1[index].dpt.search("吉利-沃森") != -1){
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_jlWs01.jpg'),'name':'皮带','num':'0140'});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_jlWs02.jpg'),'name':'涨紧轮','num':'0141'});
      				}else{
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar03.jpg')});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar04.jpg')});
      				}

      			}else{
      				if(this_.userInfo.dataset1[index].ma017 == '201'){
      					//沃森
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar_ws629.jpg'),'name':'汽油泵总成','num':'0088'});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar05.jpg'),'name':'喇叭','num':'0087'});
      				}else if(this_.userInfo.dataset1[index].ma017 == '200'){
      					//江陵
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar_jl629.jpg'),'name':'汽油泵总成','num':'0088'});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar06.png'),'name':'喇叭','num':'0087'});
      				}else{
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar05.jpg'),'name':'喇叭','num':'0087'});
      					this_.hotData.push({"imgSrc":require('../assets/images/activity/miniCar/img_index_miniCar01.jpg')});
      				}

      			}
      		}

        }
      });

  	},

  	//活动-新品热品跳转
  	toProduct:function(item){
  		let this_ = this;
  		/*let code = '';
  		if(!this_.$utils.check.isEmpty(item.name)){
  			if(item.num == '1060'){
  				code = '57';
  			}
  			this_.$router.push({path:'/product', query: {num:item.num,name:item.name,code:code}});
  		}*/
  		this_.$router.push({path:'/product', query: {num:item.num,name:item.name}});

  	},

  	//活动-活动产品跳转
    toActivity:function(item){
    	let this_ = this;
    	if(item.a_type_no == '1' || item.a_type_no == '4'){
    		//特价
    		this_.$router.push({path:'/activity/specialPrice', query: {a_id:item.a_id}});
    	}else if(item.a_type_no == '2'){
    		//秒杀

    	}else if(item.a_type_no == '3'){
    		//满减
    		this_.$router.push({path:'/activity/fullReduce', query: {a_id:item.a_id}});
    	}

    },

  	//未读消息数量
  	getMsgNum:function(){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.GetMessage + '?c_id=' + this_.userInfo.dataset[0].c_id,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	if(parseInt(data) != 0){
        		this_.noReadNum = data;
        	}
        }
      });
  	},

  	//设置密码
  	toSetPass:function(){
  		let this_ = this;
  		if(this_.$utils.check.isEmpty(this_.passWord)){
  			this_.bus.$emit('tipShow', "密码不能为空");
  			return false;
  		}else if(!this_.$utils.check.pswCheck(this_.passWord)){
  			this_.bus.$emit('tipShow', "密码6-20位数字或字母组成");
  			return false;
  		}else if(this_.passWord != this_.rePassWord){
  			this_.bus.$emit('tipShow', "两次密码不一致");
  			return false;
  		}

  		//获取guid
  		this_.$api.get({
        url: this_.$apiUrl.api.getLogin + '?name='+this_.userInfo.dataset[0].c_login,
        params: {},
        success: function (data) {
        	if(data.State){
        		let codeMdVal = this_.userInfo.dataset[0].c_id + this_.passWord + data.centent.code;
        		let mdPasswd = md5(codeMdVal,codeMdVal).toUpperCase(); //md5加密
        		//修改密码
        		this_.$api.post({
			        url: this_.$apiUrl.api.ModifyPWD,
			        params: {'c_id':this_.userInfo.dataset[0].c_id,'c_login':this_.userInfo.dataset[0].c_login,'password':this_.passWord,'sign':mdPasswd},
			        success: function (data) {
			        	this_.bus.$emit('loading', false);
			        	this_.bus.$emit('tipOk', data.Message);

			        }
			      });


        	}else{
        		this_.bus.$emit('tipShow', data.Message);
        	}
        }
      });

  	}

  }
}
</script>
