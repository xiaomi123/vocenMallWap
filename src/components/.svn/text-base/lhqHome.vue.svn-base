<template>
  <div class="lhq_container">
  	<!--主要内容开始-->
  	<div class="lhq_main">
	  	<!--查询录入框内容开始-->
	  	
	    <div class="lhq_header">
	    	<p class="clearfix">
	    		<input type="text" placeholder="车型/排量/发动机型号/压盘/OEM/片OEM/轴承型号" v-model="keyWord" />
	    	  <span @click="lhqSearch()">查询</span>
	    	</p>
	    </div>
	    <!--查询录入框内容结束-->

	    <!--产品列表内容开始-->
	    <div class="lhq_pro">
	        <ul class="lhq_list" v-if="lhqList.length>0">
	          <li v-for="item in lhqList">
			        <p>
		            <label>产品编号：</label>
		            <span>{{item.品号}}</span>
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
			        </p>
			    </li>
	      </ul>      
	      <p  v-if="lhqList.length == 0 && isLoad" class="com_noData">暂无数据</p>
	    </div>
	    <!--产品列表内容结束-->
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
export default {
  name: 'LhqSearch',
  data () {
    return {
    	lhqList:[],
    	keyWord:'',
    	isLoad:false,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      //this_.lhqSearch();
      //alert(this_.$route.query.title)
      document.title = this_.$route.query.title;
    });
  },
  methods:{
  	lhqSearch:function(){
  		let this_ = this;
  		this_.lhqList = [];
  		if(this_.$utils.check.isEmpty(this_.keyWord)){
  			this_.bus.$emit('tipShow', "请填写查询条件");
  			return false;
  		}else if(this_.$utils.check.trim(this_.keyWord) == '参数' || this_.$utils.check.trim(this_.keyWord) == '适用车型' || this_.$utils.check.trim(this_.keyWord) == '参数直径' || this_.$utils.check.trim(this_.keyWord) == '发动机' || this_.$utils.check.trim(this_.keyWord) == '齿数'){
  			this_.bus.$emit('tipShow', "该关键词无法有效检索产品");
  			return false;
  		}
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.GetLiheqi + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.keyWord,
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.isLoad = true;
        	this_.lhqList = data;
        }
      });
  	},
  	
  }
}
</script>
<style scoped>
	.lhq_container{
		position: relative;
		padding-top:5rem;
		width:100%;
		overflow-x: hidden;
	}
	.lhq_header{
		position: fixed;
		top:0;
		left:0;
		width:100%;
		padding:1rem 0;
		background-color:#eeeeef;
	}
	.lhq_header>p{
		width:94%;
		margin:0 auto;
	}
	.lhq_header>p>input{
		float: left;
		width:80%;
		height:3rem;
		padding:0.5rem 0.5rem;
		font-size:1.2rem;
		color:#555;
		background-color: #fff;
		box-sizing: border-box;
		-webkit-box-sizing:border-box;
		border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    -webkit-border-top-left-radius: 4px;
    -webkit-border-bottom-left-radius: 4px;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
	}
	.lhq_header>p>span{
		float: left;
		width: 20%;
		height:3rem;
		line-height: 3rem;
    font-size:1.3rem;
    color: #fff;
    text-align: center;
    background-color: #0066CC;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    -webkit-border-top-right-radius: 4px;
    -webkit-border-bottom-right-radius: 4px;
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
		width:25%;
		font-size:1.3rem;
    color: #404040;
    line-height:2rem;
		text-align: justify;
    text-align-last: justify;
    vertical-align: top;
	}
	.lhq_list>li>p>span{
		display: inline-block;
		width:75%;
		font-size:1.3rem;
		color: #969696;
		line-height:2rem;
		vertical-align: top;
	}
</style>