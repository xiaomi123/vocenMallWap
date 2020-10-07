<template>
  <div class="lhq_container">
  	<!--主要内容开始-->
  	<div class="dhxq_main">
      <!--查询录入框内容开始-->
      <div class="lhq_header" :style="{padding:(!ishome?'1rem 3.5% 1rem 9%':'1rem 3.5%')}" ref="headCont">
      	<em class="iconfont" @click="toBack()" v-show="!ishome">&#xe601;</em>
      	<p class="clearfix">
      		<em class="iconfont">&#xe60b;</em>
      		<input type="text" placeholder="编码/适用车型/发动机型号/OEM" v-model="keyWord" />
      	  <span @click="lhqSearch()">查询</span>
      	</p>
      	<span class="lhq_tip" v-show="ishome">*请在上方输入<i>任一</i>下图所示可查询类目进行检索</span>
      	<span class="lhq_tip02" v-show="!ishome"><label v-if="cxck!=''">&ensp;{{cxck}}</label></span>
      </div>
      <!--查询录入框内容结束-->

	    <!--车系查询内容结束-->
      <div v-if="ishome">
      	<div style="padding:0 4%;">
          <h2 class="lhq_title"><em></em>可查询车系</h2>
          <h3 class="dhxqList_h3">热卖品牌</h3>
          <ul class="lhq_cx" id="anchor-热">
          	<li v-for="item in carData[0].list" @click="toCx(item)">
          		<span><img :src="item.imgSrc"/></span>
      				</br>{{item.name}}
          	</li>
          </ul>
        </div>
        <div class="dhxqList_fixed">
        	<ul class="dhxq_fixed_list">
        		<li v-for="(item,index) in fixData" v-if="carData[index].list.length>0" @click="toSystem('#anchor-'+item,index)">{{item}}</li>
        	</ul>
        </div>
        <ul class="dhxq_type">
        	<li v-for="(item,index) in carData" v-if="item.list.length>0 && index>0" :id="'anchor-'+item.title">
        		<h3>{{item.title}}</h3>
        		<ul class="dhxq_list">
        			<li v-for="list in item.list" @click="toCx(list)">
        				<span><img :src="list.imgSrc"/></span>{{list.name}}
        			</li>
        		</ul>
        	</li>
        </ul>
      </div>
      <!--车系查询内容结束-->

	    <!--产品列表内容开始-->
	    <div class="lhq_pro" v-show="!ishome">
         <ul class="lhq_list" v-if="lhqList.length>0">
             <li v-for="item in lhqList">
             	<p class="lhqfixed">
                 <span class="numb">{{item.产品编号}}</span>
               </p>
               <p>
                 <label>车型：</label>
                 <span class="lhqBold">{{item.适用车型}}{{item.类型}}</span>
               </p>
               <p>
                 <label>发动机：</label>
                 <span class="lhqBold">{{item.发动机型号}}</span>
               </p>
               <p>
                 <label style="text-align: center;">OEM：</label>
                 <span>{{item.oem.replace(/\?/g,"")}}</span>
               </p>
               <p>
                 <label>参数：</label>
                 <span>{{item.线长}}</span>
               </p>
               <p>
                 <label>规格：</label>
                 <span>{{item.名称}}</span>
               </p>
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
    	cxData:[
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx01.png'),name:'大众'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx03.png'),name:'别克'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx09.png'),name:'福特'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx05.png'),name:'本田'},//图徐提供
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx05.png'),name:'丰田'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx06.png'),name:'日产'},
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx06.png'),name:'奥迪'},//无图片
    		{imgSrc:require('../../assets/images/lhq/icon_lhq_cx02.png'),name:'现代'}
    	],
    	cxck:'',
    	ishome:true,
    	fixData:[
    		'热','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    	],
    	carData:[
    		{
    			title:'热卖',
    			list:[
    				{name:'大众',imgSrc:require('../../assets/images/lhq/icon_lhq_cx01.png')},
    				{name:'别克',imgSrc:require('../../assets/images/lhq/icon_lhq_cx03.png')},
    				{name:'福特',imgSrc:require('../../assets/images/lhq/icon_lhq_cx09.png')},
    				{name:'本田',imgSrc:require('../../assets/images/lhq/icon_lhq_cx21.png')},
    				{name:'丰田',imgSrc:require('../../assets/images/lhq/icon_lhq_cx05.png')},
    				{name:'日产',imgSrc:require('../../assets/images/lhq/icon_lhq_cx06.png')},
    				{name:'奥迪',imgSrc:require('../../assets/images/lhq/icon_lhq_cx22.png')},
    				{name:'现代',imgSrc:require('../../assets/images/lhq/icon_lhq_cx02.png')},
    			]
    		},
    		{
    			title:'A',
    			list:[
    				{name:'AC Schnitzer',imgSrc:require('../../assets/images/lhq/icon_dhxq_list01.jpg')},
    				{name:'ALPINA',imgSrc:require('../../assets/images/lhq/icon_dhxq_list02.jpg')},
    				{name:'奥迪',imgSrc:require('../../assets/images/lhq/icon_dhxq_list03.jpg')}
    			]
    		},
    		{
    			title:'B',
    			list:[
      			{name:'奔驰',imgSrc:require('../../assets/images/lhq/icon_dhxq_list04.jpg')},
      			{name:'巴博斯',imgSrc:require('../../assets/images/lhq/icon_dhxq_list05.jpg')},
      			{name:'宝马',imgSrc:require('../../assets/images/lhq/icon_dhxq_list06.jpg')},
      			{name:'别克',imgSrc:require('../../assets/images/lhq/icon_dhxq_list07.jpg')},
      			{name:'本田',imgSrc:require('../../assets/images/lhq/icon_dhxq_list08.jpg')},
      			{name:'标致',imgSrc:require('../../assets/images/lhq/icon_dhxq_list09.jpg')},
      			{name:'比亚迪',imgSrc:require('../../assets/images/lhq/icon_dhxq_list10.jpg')},
      			{name:'宝骏',imgSrc:require('../../assets/images/lhq/icon_dhxq_list11.jpg')},
      			{name:'北汽制造',imgSrc:require('../../assets/images/lhq/icon_dhxq_list12.jpg')},
      			{name:'北汽威旺',imgSrc:require('../../assets/images/lhq/icon_dhxq_list13.jpg')},//北汽威望
      			{name:'北汽幻速',imgSrc:require('../../assets/images/lhq/icon_dhxq_list14.jpg')},
      			{name:'奔腾',imgSrc:require('../../assets/images/lhq/icon_dhxq_list15.jpg')},
      			{name:'比速汽车',imgSrc:require('../../assets/images/lhq/icon_dhxq_list16.jpg')}
    			]
    		},
    		{
    			title:'C',
    			list:[
    				{name:'传祺',imgSrc:require('../../assets/images/lhq/icon_dhxq_list17.jpg')},
    				{name:'长城',imgSrc:require('../../assets/images/lhq/icon_dhxq_list18.jpg')},
    				{name:'长安',imgSrc:require('../../assets/images/lhq/icon_dhxq_list19.jpg')},
    				{name:'昌河',imgSrc:require('../../assets/images/lhq/icon_dhxq_list20.jpg')},
    				{name:'成功',imgSrc:require('../../assets/images/lhq/icon_dhxq_list21.jpg')}
    			]
    		},
    		{
    			title:'D',
    			list:[
    				{name:'大众',imgSrc:require('../../assets/images/lhq/icon_dhxq_list22.jpg')},
    				{name:'DS',imgSrc:require('../../assets/images/lhq/icon_dhxq_list23.jpg')},
    				{name:'道奇',imgSrc:require('../../assets/images/lhq/icon_dhxq_list24.jpg')},
    				{name:'东南',imgSrc:require('../../assets/images/lhq/icon_dhxq_list25.jpg')},
    				{name:'大宇',imgSrc:require('../../assets/images/lhq/icon_dhxq_list26.jpg')},
    				{name:'东风小康',imgSrc:require('../../assets/images/lhq/icon_dhxq_list27.jpg')}
    			]
    		},
    		{
    			title:'E',
    			list:[]
    		},
    		{
    			title:'F',
    			list:[
    				{name:'丰田',imgSrc:require('../../assets/images/lhq/icon_dhxq_list28.jpg')},
    				{name:'福特',imgSrc:require('../../assets/images/lhq/icon_dhxq_list29.jpg')},
    				{name:'福田',imgSrc:require('../../assets/images/lhq/icon_dhxq_list30.jpg')},
    				{name:'福汽启腾',imgSrc:require('../../assets/images/lhq/icon_dhxq_list31.jpg')},
    				{name:'富奇',imgSrc:require('../../assets/images/lhq/icon_dhxq_list32.jpg')},
    				{name:'福迪',imgSrc:require('../../assets/images/lhq/icon_dhxq_list33.jpg')}
    			]
    		},
    		{
    			title:'G',
    			list:[
    				{name:'观致',imgSrc:require('../../assets/images/lhq/icon_dhxq_list34.jpg')}
    			]
    		},
    		{
    			title:'H',
    			list:[
    				{name:'华泰',imgSrc:require('../../assets/images/lhq/icon_dhxq_list35.jpg')},
    				{name:'哈弗',imgSrc:require('../../assets/images/lhq/icon_dhxq_list36.jpg')},
    				{name:'汉腾',imgSrc:require('../../assets/images/lhq/icon_dhxq_list37.jpg')},
    				{name:'哈飞',imgSrc:require('../../assets/images/lhq/icon_dhxq_list38.jpg')},
    				{name:'海马',imgSrc:require('../../assets/images/lhq/icon_dhxq_list39.jpg')},
    				{name:'海格',imgSrc:require('../../assets/images/lhq/icon_dhxq_list40.jpg')},
    				{name:'黄海',imgSrc:require('../../assets/images/lhq/icon_dhxq_list41.jpg')}
    			]
    		},
    		{
    			title:'I',
    			list:[]
    		},
    		{
    			title:'J',
    			list:[
    				{name:'Jeep',imgSrc:require('../../assets/images/lhq/icon_dhxq_list42.jpg')},
    				{name:'吉利',imgSrc:require('../../assets/images/lhq/icon_dhxq_list43.jpg')},
    				{name:'金龙',imgSrc:require('../../assets/images/lhq/icon_dhxq_list44.jpg')},
    				{name:'金旅',imgSrc:require('../../assets/images/lhq/icon_dhxq_list45.jpg')},
    				{name:'九龙',imgSrc:require('../../assets/images/lhq/icon_dhxq_list46.jpg')},
    				{name:'江铃',imgSrc:require('../../assets/images/lhq/icon_dhxq_list47.jpg')},
    				{name:'金杯',imgSrc:require('../../assets/images/lhq/icon_dhxq_list48.jpg')},
    				{name:'吉奥',imgSrc:require('../../assets/images/lhq/icon_dhxq_list49.jpg')}
    			]
    		},
    		{
    			title:'K',
    			list:[
    				{name:'凯迪拉克',imgSrc:require('../../assets/images/lhq/icon_dhxq_list50.jpg')},
    				{name:'开瑞',imgSrc:require('../../assets/images/lhq/icon_dhxq_list51.jpg')},
    				{name:'卡尔森',imgSrc:require('../../assets/images/lhq/icon_dhxq_list52.jpg')},
    				{name:'卡升',imgSrc:require('../../assets/images/lhq/icon_dhxq_list53.jpg')},
    				{name:'卡威',imgSrc:require('../../assets/images/lhq/icon_dhxq_list54.jpg')},
    				{name:'凯翼',imgSrc:require('../../assets/images/lhq/icon_dhxq_list55.jpg')}
    			]
    		},
    		{
    			title:'L',
    			list:[
    				{name:'兰博基尼',imgSrc:require('../../assets/images/lhq/icon_dhxq_list56.jpg')},
    				{name:'路虎',imgSrc:require('../../assets/images/lhq/icon_dhxq_list57.jpg')},
    				{name:'理念',imgSrc:require('../../assets/images/lhq/icon_dhxq_list58.jpg')},
    				{name:'雷克萨斯',imgSrc:require('../../assets/images/lhq/icon_dhxq_list59.jpg')},
    				{name:'猎豹',imgSrc:require('../../assets/images/lhq/icon_dhxq_list60.jpg')},
    				{name:'林肯',imgSrc:require('../../assets/images/lhq/icon_dhxq_list61.jpg')},
    				{name:'劳伦士',imgSrc:require('../../assets/images/lhq/icon_dhxq_list62.jpg')},
    				{name:'铃木',imgSrc:require('../../assets/images/lhq/icon_dhxq_list63.jpg')},
    				{name:'陆风',imgSrc:require('../../assets/images/lhq/icon_dhxq_list64.jpg')},
    				{name:'力帆',imgSrc:require('../../assets/images/lhq/icon_dhxq_list65.jpg')},
    			]
    		},
    		{
    			title:'M',
    			list:[
    				{name:'MINI',imgSrc:require('../../assets/images/lhq/icon_dhxq_list66.jpg')},
    				{name:'马自达',imgSrc:require('../../assets/images/lhq/icon_dhxq_list67.jpg')},
    				{name:'MG',imgSrc:require('../../assets/images/lhq/icon_dhxq_list68.jpg')}
    			]
    		},
    		{
    			title:'N',
    			list:[
    				{name:'纳智捷',imgSrc:require('../../assets/images/lhq/icon_dhxq_list69.jpg')}
    			]
    		},
    		{
    			title:'O',
    			list:[
    				{name:'讴歌',imgSrc:require('../../assets/images/lhq/icon_dhxq_list70.jpg')},
    				{name:'欧朗',imgSrc:require('../../assets/images/lhq/icon_dhxq_list71.jpg')},
    				{name:'欧宝',imgSrc:require('../../assets/images/lhq/icon_dhxq_list72.jpg')},
    			]
    		},
    		{
    			title:'P',
    			list:[]
    		},
    		{
    			title:'Q',
    			list:[
    				{name:'起亚',imgSrc:require('../../assets/images/lhq/icon_dhxq_list73.jpg')},
    				{name:'启辰',imgSrc:require('../../assets/images/lhq/icon_dhxq_list74.jpg')},
    				{name:'奇瑞',imgSrc:require('../../assets/images/lhq/icon_dhxq_list75.jpg')}
    			]
    		},
    		{
    			title:'R',
    			list:[
    				{name:'日产',imgSrc:require('../../assets/images/lhq/icon_dhxq_list76.jpg')},
    				{name:'瑞麒',imgSrc:require('../../assets/images/lhq/icon_dhxq_list77.jpg')},
    				{name:'荣威',imgSrc:require('../../assets/images/lhq/icon_dhxq_list78.jpg')},
    			]
    		},
    		{
    			title:'S',
    			list:[
    				{name:'斯柯达',imgSrc:require('../../assets/images/lhq/icon_dhxq_list79.jpg')},
    				{name:'三菱',imgSrc:require('../../assets/images/lhq/icon_dhxq_list80.jpg')},
    				{name:'上汽MAXUS',imgSrc:require('../../assets/images/lhq/icon_dhxq_list81.jpg')},
    				{name:'双环',imgSrc:require('../../assets/images/lhq/icon_dhxq_list82.jpg')}
    			]
    		},
    		{
    			title:'T',
    			list:[]
    		},
    		{
    			title:'U',
    			list:[]
    		},
    		{
    			title:'V',
    			list:[]
    		},
    		{
    			title:'W',
    			list:[
    				{name:'威麟',imgSrc:require('../../assets/images/lhq/icon_dhxq_list83.jpg')},
    				{name:'五菱',imgSrc:require('../../assets/images/lhq/icon_dhxq_list84.jpg')}
    			]
    		},
    		{
    			title:'X',
    			list:[
    				{name:'雪佛兰',imgSrc:require('../../assets/images/lhq/icon_dhxq_list85.jpg')},
    				{name:'现代',imgSrc:require('../../assets/images/lhq/icon_dhxq_list86.jpg')},
    				{name:'雪铁龙',imgSrc:require('../../assets/images/lhq/icon_dhxq_list87.jpg')},
    				{name:'新凯',imgSrc:require('../../assets/images/lhq/icon_dhxq_list88.jpg')},
    				{name:'西雅特',imgSrc:require('../../assets/images/lhq/icon_dhxq_list89.jpg')}
    			]
    		},
    		{
    			title:"Y",
    			list:[
    				{name:'英菲尼迪',imgSrc:require('../../assets/images/lhq/icon_dhxq_list90.jpg')},
    				{name:'一汽',imgSrc:require('../../assets/images/lhq/icon_dhxq_list91.jpg')},
    				{name:'英伦',imgSrc:require('../../assets/images/lhq/icon_dhxq_list92.jpg')},
    				{name:'英致',imgSrc:require('../../assets/images/lhq/icon_dhxq_list93.jpg')},
    				{name:'永源/飞碟',imgSrc:require('../../assets/images/lhq/icon_dhxq_list94.jpg')}
    			]
    		},
    		{
    			title:'Z',
    			list:[
    				{name:'中华',imgSrc:require('../../assets/images/lhq/icon_dhxq_list95.jpg')},
    				{name:'中欧',imgSrc:require('../../assets/images/lhq/icon_dhxq_list96.jpg')},
    				{name:'中兴',imgSrc:require('../../assets/images/lhq/icon_dhxq_list97.jpg')},
    				{name:'众泰',imgSrc:require('../../assets/images/lhq/icon_dhxq_list98.jpg')}
    			]
    		}
    	]
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      //this_.lhqSearch();
      document.title = '氧传感器';//this_.$route.query.title;
    });
  },
  methods:{
    //系统分类锚点连接
    toSystem:function(selector,index){
    	let this_ = this;
    	let anchor = document.querySelector(selector);
    	//let anchor = this.$el.querySelector(selector);
      document.body.scrollTop = anchor.offsetTop - this_.$refs.headCont.offsetHeight - 10;
      document.documentElement.scrollTop = anchor.offsetTop - this_.$refs.headCont.offsetHeight - 10;
    },
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
        url: this_.$apiUrl.api.GetYchuan + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.keyWord + '&type=' + cataPar.toString() + '&car=' + this_.cxck,
        params: {},
        success: function (data) {
          console.log(data);
        	this_.bus.$emit('loading', false);
        	this_.isLoad = true;
        	this_.lhqList = data;
        }
      });
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
    position:relative;
    padding-right:15%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding:1rem 0;
    border-bottom: 1px solid #ddd;
	}
	.lhq_list>li:last-child{
		border-bottom:none;
	}
	.lhq_list>li>p{
		font-size:0;
		margin-bottom:0.4rem;
	}
	.lhq_list>li>p>label{
		display: inline-block;
		width:24%;
		font-size:1.3rem;
    color: #404040;
    line-height:2rem;
		text-align: justify;
    text-align-last: justify;
    vertical-align: top;
	}
	.lhq_list>li>p>span{
		display: inline-block;
		width:65%;
		font-size:1.3rem;
		color: #969696;
		line-height:2rem;
		word-wrap: break-word;
		vertical-align: top;
	}
  .lhq_list>li>p.lhqfixed{
  	position: absolute;
  	right:0;
  	top:35%;
  }
  .lhq_list>li>p>span.lhqBold{
  	font-size:1.3rem;
  	color:#333;
  	font-weight: bold;
  }
	.lhq_main{
		width:93%;
		margin:0 auto;
	}
	.lhq_title{
		position: relative;
		padding:0 4% 0 0.5rem;
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
		padding:0.1rem 0.2rem;
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
	.dhxqList_h3{
		font-size:1.3rem;
		color:#666;
		padding:0 0 1rem 0.8rem;
	}
	.dhxqList_fixed{
		position: fixed;
		top:8rem;
		right:0;
		width:3rem;
		height:100%;
	}
	.dhxq_fixed_list>li{
		padding:0.2rem 0;
		font-size:1.2rem;
		color:#1572d7;
		text-align: center;
	}
	.dhxq_type>li>h3{
		padding:0.5rem 0 0.5rem 6%;
		font-size:1.4rem;
		color:#333;
		background-color:#f9f9f9;
	}
	.dhxq_list{
		border-top:1px solid #ddd;
	}
	.dhxq_list>li{
		font-size:1.3rem;
		color:#333;
		padding:1rem 4%;
		border-bottom:1px solid #ddd;
	}
	.dhxq_list>li>span{
		display: inline-block;
		width:9%;
		margin-right:3%;
	}
</style>
