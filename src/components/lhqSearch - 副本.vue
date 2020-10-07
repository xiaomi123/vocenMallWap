<template>
  <div class="proSearch_container">
  	<div class="proSearch_banner" v-if="swiperList.length>0">
  		<swiper :options="swiperOption" class="swiper-container">
        <!-- slides -->
        <swiper-slide class="swiper-item" v-for='item of swiperList' :key='item.id'>
            <img class='swiper-img' :src='item.imgUrl' alt="" />
        </swiper-slide>
        <!-- Optional controls ,显示小点-->
        <div class="swiper-pagination"  slot="pagination"></div>
	    </swiper>
  	</div>

  	<!--主要内容开始-->
  	<div class="proSearch_main">
  		<h2 class="clearfix"><i class="iconfont">&#xe619;</i>耐用品系列<span>点击下方图标可查询<i class="iconfont">&#xe7d3;</i></span></h2>
  		<ul class="proSearch_list clearfix">
  			<li class='lhq'>
  				<router-link :to="{path:'/proSearch/lhqList',query:{mb001:$route.query.mb001,title:$route.query.title}}"><p>离合器套装</p></router-link>
  			</li>
  			<li class='dhxq'>
  				<!--<p>正在开发中</p>-->
  				<router-link :to="{path:'/proSearch/dhxqList',query:{mb001:$route.query.mb001,title:$route.query.title}}">点火线圈</router-link>
  			</li>
  			<li class='ycg'>
  				<!-- <p>正在开发中...</p> -->
  				<router-link :to="{path:'/proSearch/ycgqList',query:{mb001:$route.query.mb001,title:$route.query.title}}">氧传感器</router-link>
  			</li>
  			<li class='qyb'>
  				<p>正在开发中...</p>
  				<router-link to="/proSearch/lhqList">汽油泵</router-link>
  			</li>
  		</ul>
  		<p class="proSearch_tip">
  			<i class="iconfont">&#xe604;</i></br>
  			更多产品开发中......
  		</p>
  	</div>
  	<!--主要内容结束-->
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
export default {
	components:{
		Swiper,
		SwiperSlide,
	},
  name: 'LhqSearch',
  data () {
    return {
    	swiperOption:{
        // 参数选项,显示小点
        pagination:'.swiper-pagination',
        //循环
        loop:true,
        //每张播放时长3秒，自动播放
        autoplay:true,
        autoplay:{
			    disableOnInteraction: false
				},
				disableOnInteraction: false,
				observer: true,//修改swiper自己或子元素时，自动初始化swiper
  			observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //滑动速度
        speed:1000,
        delay:1000
      },
      //三张轮播，使用变量循环
      swiperList:[
        // {
        //   id:'001',
        //   imgUrl:require("../assets/images/lhq/img_proSearch_banner01.png")
        // },
        {
          id:'002',
          imgUrl:require("../assets/images/lhq/img_proSearch_banner03.jpg")
        }
      ],

    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      document.title = this_.$route.query.title;
    });
  },
  methods:{
  	lhqSearch:function(){
  		let this_ = this;

  	},
  }
}
</script>
<style scoped>
	.proSearch_container{
		position: fixed;
		width:100%;
		height:100%;
		left:0;
		top:0;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		background-color:#fff;
	}
	.proSearch_banner{
		margin-bottom:1rem;
	}
	.proSearch_main{
		padding:1rem 4%;
	}
	.proSearch_main>h2{
		font-size:1.4rem;
		margin-bottom:1rem;
	}
	.proSearch_main>h2>i{
		display: inline-block;
		margin-right:0.3rem;
		color:#dc171e;
	}
	.proSearch_main>h2>span{
		float:right;
		font-size:1.2rem;
		color:#666;
	}
	.proSearch_main>h2>span>i{
		display: inline-block;
		margin-left:0.3rem;
		font-size:1.8rem;
	}
	.proSearch_list{
		margin-bottom:1rem;
	}
	.proSearch_list>li{
		float:left;
		width:48.706%;
		padding-top:30.3898%;
		margin-bottom:0.8rem;
		position: relative;
	}
	.proSearch_list>li>p{
		position: absolute;
		top:0;
		left:0;
		width:100%;
		height:100%;
		font-size:1.5rem;
		color:#fff;
		padding-top: 13%;
		padding-left:8%;
		background: rgba(0,0,0,.65);
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border-radius: 0.6rem;
		-webkit-border-radius: 0.6rem;
	}
	.proSearch_list>li>a{
		display: block;
		font-size:1.5rem;
		color:#fff;
		padding:0 8%;
		margin-top:-50%;
	}
	.proSearch_list>li:nth-child(2n){
		float:right;
	}
	.proSearch_list>li.lhq{
		background:url(../assets/images/lhq/img_proSearch_lhq.png)no-repeat center top;
		background-size:100%;
	}
	.proSearch_list>li.dhxq{
		background:url(../assets/images/lhq/img_proSearch_dhxq.png)no-repeat center top;
		background-size:100%;
	}
	.proSearch_list>li.ycg{
		background:url(../assets/images/lhq/img_proSearch_ycg.png)no-repeat center top;
		background-size:100%;
	}
	.proSearch_list>li.qyb{
		background:url(../assets/images/lhq/img_proSearch_qyb.png)no-repeat center top;
		background-size:100%;
	}
	.proSearch_tip{
		font-size:1.2rem;
		color:#999;
		text-align: center;
	}
	.proSearch_tip>i{
		font-size:1rem;
		color:#d3d3d3;
	}
</style>
