<template>
  <div class="lhq_container">
  	<!--主要内容开始-->
  	<div class="lhq_main">

	  	<!--查询录入框内容开始-->
	    <div class="lhq_header" :style="{padding:(!ishome?'1rem 3.5% 1rem 9%':'1rem 3.5%')}">
	    	<em class="iconfont" @click="toBack()" v-show="!ishome">&#xe601;</em>
	    	<p class="clearfix">
	    		<em class="iconfont">&#xe60b;</em>
	    		<!--<input type="text" placeholder="车型/排量/发动机型号/压盘OEM/轴承型号" v-model="keyWord" />-->
	    		<input type="text" placeholder="车型/发动机型号/后三位编码/规格" v-model="keyWord" />
	    	  <span @click="lhqSearch()">查询</span>
	    	</p>
	    	<!--<span class="lhq_tip" v-show="ishome">*请在上方输入<i>任一</i>下图所示可查询类目进行检索</span>-->
	    	<span class="lhq_tip" v-show="ishome">*请在上方输入可查询类目进行检索</span>
	    	<!--<span class="lhq_tip02" v-show="!ishome"><label v-if="catack!=''">{{catack}}</label><label v-if="cxck!=''">&ensp;<em v-if="catack!=''">&gt;</em>&ensp;{{cxck}}</label></span>-->
	    	<span class="lhq_tip02" v-show="!ishome"><label v-if="cxck!=''">{{cxck}}</label></span>
	    </div>
	    <!--查询录入框内容结束-->


	    <div v-if="ishome">
	    	<!--类目查询内容开始-->
	  		<!--<h2 class="lhq_title"><em></em>可查询目录</h2>
	  		<ul class="lhq_cata clearfix">
	  			<li v-for="item in cataData" @click="toCata(item)">
	  				<span><img :src="item.imgSrc"/><em class="iconfont" v-if="catack.indexOf(item.name) >=0 "><img src="../../assets/images/lhq/icon_com_ck.png"/></em></span>
	  				</br>{{item.name}}
	  			</li>
	  		</ul>-->
	  		<!--类目查询内容结束-->

		    <!--车系查询内容开始-->
		    <h2 class="lhq_title"><em></em>可查询车系</h2>
		    <ul class="lhq_cx">
		    	<li v-for="item in cxData" @click="toCx(item)">
		    		<span><img :src="item.imgSrc"/></span>
	  				</br>{{item.name}}
		    	</li>
		    </ul>
		    <!--车系查询内容结束-->
	    </div>


	    <!--产品列表内容开始-->
	    <div class="lhq_pro" v-show="!ishome">
	        <ul class="lhq_list" v-if="lhqList.length>0">
	          <li v-for="item in lhqList">
	          	<p class="lhqfixed">
		            <span class="numb">{{item.品号}}</span>
			        </p>
	          	<p>
		            <label>车型：</label>
		            <span class="lhqBold">{{item.车型.replace("适用车型","")}}</span>
			        </p>
			        <p>
		            <label>发动机：</label>
		            <span class="lhqBold">{{item.参数一.replace("发动机","")}}</span>
			        </p>
			         <p>
		            <label>参数：</label>
		            <span>{{item.参数二.replace("参数","")}}</span>
			        </p>
			        <p>
		            <label>分离轴承：</label>
		            <span>{{item.轴承型号}}</span>
			        </p>
			        <p>
		            <label>规格：</label>
		            <span>{{item.产品规格}}</span>
			        </p>
			        <!--<p>
		            <label>产品编号：</label>
		            <span class="numb">{{item.品号}}</span>
			        </p>
			        <p>
		            <label>产品规格：</label>
		            <span>{{item.产品规格}}</span>
			        </p>
			        <p>
		            <label>轴承型号：</label>
		            <span>{{item.轴承型号}}</span>
			        </p>
			        <p>
		            <label>车型：</label>
		            <span>{{item.车型}}</span>
			        </p>
			        <p>
		            <label>发动机型号：</label>
		            <span>{{item.参数一}}</span>
			        </p>
			        <p>
		            <label>产品参数：</label>
		            <span>{{item.参数二}}</span>
			        </p>
			        <p>
		            <label>压盘OEM：</label>
		            <span>{{item.压盘oem}}</span>
			        </p>
			        <p>
		            <label>面片OEM：</label>
		            <span>{{item.片oem}}</span>
			        </p>-->
			    </li>
	      </ul>
	      <p  v-if="lhqList.length == 0 && isLoad" class="com_noData">暂无数据</p>
	    </div>
	    <!--产品列表内容结束-->
  	</div>
  	<!--主要内容结束-->

  	<span class="lhq_back" v-show="!ishome" @click="toBack()">返回</span>
  </div>
</template>

<script>
export default {
  name: 'LhqList',
  data () {
    return {
    	lhqList:[],
    	keyWord:'',
    	isLoad:false,
    	cataData:[
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cata01.png'),name:'车型'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cata02.png'),name:'排量'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cata03.png'),name:'发动机型号'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cata04.png'),name:'压盘OEM'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cata05.png'),name:'片OEM'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cata06.png'),name:'轴承OEM'},
    	],
    	catack:'',
    	cxData:[
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx01.png'),name:'大众'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx02.png'),name:'现代'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx03.png'),name:'别克'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx04.png'),name:'雪佛兰'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx05.png'),name:'丰田'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx06.png'),name:'日产'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx07.png'),name:'马自达'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx08.png'),name:'三菱'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx09.png'),name:'福特'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx10.png'),name:'标志'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx11.png'),name:'吉利'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx12.png'),name:'长城'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx13.png'),name:'奇瑞'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx14.png'),name:'比亚迪'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx15.png'),name:'江淮'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx16.png'),name:'中华'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx17.png'),name:'众泰'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx18.png'),name:'力帆'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx19.png'),name:'宝骏'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx20.png'),name:'五菱'},
    	],
    	cxck:'',
    	ishome:true,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      //this_.lhqSearch();
      document.title = this_.$route.query.title;
    });
  },
  methods:{
  	lhqSearch:function(){
  		let this_ = this;
  		this_.lhqList = [];
  		if(this_.$utils.check.isEmpty(this_.keyWord) && this_.$utils.check.isEmpty(this_.cxck)){
  			this_.bus.$emit('tipShow', "请填写查询条件");
  			return false;
  		}else if(this_.$utils.check.trim(this_.keyWord) == '参数' || this_.$utils.check.trim(this_.keyWord) == '适用车型' || this_.$utils.check.trim(this_.keyWord) == '参数直径' || this_.$utils.check.trim(this_.keyWord) == '发动机' || this_.$utils.check.trim(this_.keyWord) == '齿数'){
  			this_.bus.$emit('tipShow', "该关键词无法有效检索产品");
  			return false;
  		}
  		let cataPar = '';
  		if(!this_.$utils.check.isEmpty(this_.catack)){
  			cataPar = this_.catack.split(",");
  			for(let i=0;i<cataPar.length;i++){
  				let cutCata = '';
	  			if(cataPar[i] == '排量'){
	  				cataPar[i] = '车型';
	  			}else if(cataPar[i] == '发动机型号'){
	  				cataPar[i] = '参数一';
	  			}else if(cataPar[i] == '轴承OEM'){
	  				cataPar[i] = '轴承型号';
	  			}
	  		}

  		}

  		this_.ishome = false;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.GetLiheqi + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.keyWord + '&type=' + cataPar.toString() + '&car=' + this_.cxck,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.isLoad = true;
        	this_.lhqList = data;
        }
      });
  	},

  	//点击目录
  	toCata(item){
  		let this_ = this;
  		if(this_.catack.indexOf(item.name)>=0){
  			let cataArr = this_.catack.split(",");
  			for(let i=0;i<cataArr.length;i++){
  				if(cataArr[i] == item.name){
  					cataArr.splice(i,1);
  					i=-1;
  				}
  			}
  			this_.catack = cataArr.toString();
  		}else{
  			if(this_.catack !=''){
  				this_.catack = this_.catack + ','+ item.name;
  			}else{
  				this_.catack = item.name;
  			}

  		}
  	},
  	//点击车系
  	toCx(item){
  		let this_ = this;
  		this_.cxck = item.name;
  		this_.lhqSearch();
  		this_.ishome = false;
  	},

  	//点击返回箭头
  	toBack(){
  		let this_ = this;
  		this_.ishome = true;
  		this_.cxck='';
  	},

  }
}
</script>
<style scoped>
	.lhq_container{
		width:100%;
		padding-top:7.5rem;
		padding-bottom:5rem;
		background-color:#fff;
	}
	.lhq_header{
		position: fixed;
		top:0;
		left:0;
		z-index: 2;
		width:100%;
		padding:1rem 3.5%;
		background-color:#fff;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	.lhq_header>em{
		position:fixed;
		left:3.5%;
		top:1.6rem;
		font-size:2rem;
		font-weight: bolder;
		color:#666;
	}
	.lhq_header>p{
		position: relative;
		padding-left:3.3rem;
		padding-right:20%;
		margin-bottom:0.5rem;
		border-radius: 6px;
    -webkit-border-radius: 6px;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    box-sizing: border-box;
		-webkit-box-sizing:border-box;
	}
	.lhq_header>p>em{
		position: absolute;
		left:0.2rem;
		top:0.95rem;
		padding:0 0.5rem;
		font-size:1.25rem;
		color:#9f9f9f;
		font-weight: bold;
		border-right:1px solid #ccc;
	}
	.lhq_header>p>input{
		display: block;
		width:100%;
		height:3.3rem;
		padding:0.5rem 0;
		font-size:1.3rem;
		color:#555;
		box-sizing: border-box;
		-webkit-box-sizing:border-box;
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
	}
	.lhq_header>p>span{
		position: absolute;
		right:-1px;
		top:-1px;
		width: 20%;
		height:3.45rem;
		line-height: 3.45rem;
    font-size:1.3rem;
    color: #fff;
    text-align: center;
    background-color: #0066CC;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    -webkit-border-top-right-radius: 6px;
    -webkit-border-bottom-right-radius: 6px;
    box-sizing: border-box;
		-webkit-box-sizing:border-box;
	}
	.lhq_pro{
		width:100%;
    background-color: #fff;
	}
	.lhq_list{
		font-size:1.3rem;
    color: #404040;
    line-height:2rem;
    padding: 0 4%;
	}
	.lhq_list>li{
		padding:1rem 0;
		border-bottom: 1px solid #ddd;
	}
	.lhq_list>li>p{
		font-size:0;
		margin-bottom:0.4rem;
	}
	.lhq_list>li>p>label{
		display: inline-block;
		width:30%;
		font-size:1.3rem;
    color: #404040;
    line-height:2rem;
    vertical-align: top;
	}
	.lhq_list>li>p>span{
		display: inline-block;
		width:70%;
		font-size:1.3rem;
		color: #969696;
		line-height:2rem;
		vertical-align: top;
	}
	.lhq_main{
		width:93%;
		margin:0 auto;
	}
	.lhq_title{
		position: relative;
		padding-left:0.5rem;
		font-size:1.4rem;
		color:#333;
		margin-bottom:1rem;
	}
	.lhq_title>em{
		position: absolute;
		top:0.35rem;
		left:0;
		width:0.2rem;
		height:1.3rem;
		margin-right:0.4rem;
		background-color:#f4bb48;
	}
	.lhq_cata{
		margin-bottom:1.8rem;
	}
	.lhq_cata>li{
		float:left;
		width:16.66%;
		font-size:1rem;
		color:#666;
		text-align: center;
	}
	.lhq_cata>li>span{
		display:inline-block;
		width:80%;
		position: relative;
	}
	.lhq_cata>li>span>em{
		position: absolute;
		right:-0.25rem;
		top:-0.55rem;
		width:1.5rem;
	}
	.lhq_cx{
		font-size:0;
	}
	.lhq_cx>li{
		display: inline-block;
		width:25%;
		font-size:1.2rem;
		color:#999;
		text-align: center;
		margin-bottom:1.3rem;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	.lhq_cx>li>span{
		display: inline-block;
		width:87.27%;
		margin-bottom:0.5rem;
	}
	.lhq_tip{
		display: block;
		font-size:1.2rem;
		color:#999;
		line-height:1.8rem;
	}
	.lhq_tip>i{
		color:red;
	}
	.lhq_list>li>p>span.numb{
		width:initial;
		padding:0.3rem 0.5rem;
		font-size:1.5rem;
		color:#333;
		border:1px solid #333;
	}
	.lhq_tip02{
		display: block;
		font-size:1.3rem;
		color:#0066CC;
		line-height:1.8rem;
	}
	.lhq_tip02>label>em{
		color:#333;
	}
	.lhq_back{
		position: fixed;
		bottom:0;
		left:0;
		width:100%;
		height:4rem;
		line-height: 4rem;
		font-size:1.5rem;
		color:#fff;
		text-align: center;
		background-color:#0066CC;
	}

	.lhq_list>li{
		position:relative;
		padding-right:15%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	.lhq_list>li>p.lhqfixed{
		position: absolute;
		right:0;
		top:45%;
	}
	.lhq_list>li>p>span.lhqBold{
		font-size:1.3rem;
		color:#333;
		font-weight: bold;
	}
</style>
