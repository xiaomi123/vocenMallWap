<template>
  <div>
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in swiper">
        <img :src="imgUrl+image">
      </van-swipe-item>
    </van-swipe>
    <div class="uinn bg-white product-info" style="margin-bottom: 1rem;">

      <p class="title">{{info.title}}</p>
      <van-divider />
      <div class="desc">
        <div class="left">
          <p>类型：{{info.productname}}</p>
          <p>产品编号：{{info.erpcode}}</p>
        </div>
        <div class="right" v-show="isShow">
          <cart-view :cartList="cartList" :num="0" :name="0"></cart-view>
        </div>
      </div>
    </div>

    <div class="uinn bg-white" style="margin-bottom: 1rem;">
      <h2 class="detail-title">适配车型</h2>
      <van-collapse v-model="activeNames">
        <template v-for="(item,index) in tablepara">
          <van-collapse-item :title="item.title" :name="index+1" style="padding: 0;">
            <div class="list-item" v-for="(sub,key) in item.option">
            {{sub.brand}}&nbsp;&nbsp;{{sub.models}}&nbsp;&nbsp;[{{sub.producedYear}}-{{sub.idlingYear}}]&nbsp;&nbsp;{{sub.displacement}}L&nbsp;&nbsp;{{sub.engineModel}}
            </div>
          </van-collapse-item>
        </template>
      </van-collapse>
      <!-- <div class="detail-table">
      	<div class="detail-tr">
      		<div class="detail-th">品牌</div>
          <div class="detail-th">车型</div>
          <div class="detail-th">年份</div>
          <div class="detail-th">排量</div>
      	</div>
        <div class="detail-tr" v-for="(item,index) in tablepara">
          <div class="detail-td">{{item.brand}}</div>
          <div class="detail-td">{{item.models}}</div>
          <div class="detail-td">{{item.producedYear}}—{{item.idlingYear}}</div>
          <div class="detail-td">{{item.displacement}}</div>
        </div>
      </div>-->
    </div>

    <div class="uinn bg-white">
      <h2 class="detail-title">图文详情</h2>
      <div v-html="info.content" id="cvs" style="display: none;"></div>
      <div>
        <img v-for="img in pics" :src="img" />
      </div>
    </div>
    <!-- 购物车-->
    <router-link :to="{path: '/proSearch/cart'}" v-if="isMall">
      <div class="fixed-btn"><van-icon name="cart-o" :badge="cartTotal" size="30" color="#ff0000" /></div>
    </router-link>
  </div>
</template>
<script>
import Consts from '../../api/const.js'
export default {
  name: 'proDetail',
  data () {
    return {
    	userInfo:{},
      imgUrl : "",
      swiper : [], //轮播
      activeNames: ['1'],
      pics : [], //详情图片
      info : {},
      cartList : {},
      tablepara : [], //适用车型
      api : "",
      isShow : false,
      cartTotal : 0 ,//购物车数量
      isMall:true,//用于商城进入购物车隐藏
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.imgUrl = Consts.apiConfig.imgPath;
      document.title = this_.$route.query.title;
      this_.cartList = this_.$route.query.obj;
      if(this_.$utils.check.isEmpty(sessionStorage.getItem("userinfo"))){

      }else{
        this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        if(this_.userInfo.dataset[0].mr003.indexOf('弘途耐用') > -1 || this_.userInfo.dataset[0].mr003.indexOf('江陵耐用') > -1){
            this_.isShow = !this_.isShow;
        }
      }
      this_.init();
      if(this_.$route.query.productId == 'no'){
        this_.isShow = false;
        this_.isMall = false;
      }else{
        this_.getParmas(); //适配车型
      }

    })
  },
  created(){
    let this_ = this;
    this_.bus.$on('cartTotal', function(num) {
      this_.cartTotal = num;
    });
    this_.cartTotal = sessionStorage.getItem('cartTotal');
  },
  methods:{
    init(){
      let this_ = this;
      console.log(this_.$route.query.mb001);
      this_.bus.$emit('loading', true);
      this_.$api.post({
        url: this_.$apiUrl.api.ProductDetails,
        params: {
          mb001 : this_.$route.query.mb001
        },
        success: function (data) {
          console.log(data);
          if(data.State){
            if(data.centent.length !=0){
              this_.swiper = data.centent[0].sliderpics.split(',');
              this_.info = data.centent[0];
              this_.$nextTick(function(){
                let img_list = document.querySelector('#cvs').getElementsByTagName('img');
                for(let i = 0; i < img_list.length; i++){
                  this_.pics.push(this_.imgUrl + img_list[i].attributes[0].value);
                }
              })
            }
            this_.bus.$emit('loading', false);
          }
        }
      });
    },
    getParmas(){
      let this_ = this;
      this_.$api.post({
        url: this_.$apiUrl.api.VehicleByProductId,
        params: {
          productId : this_.$route.query.productId
        },
        success: function (data) {
          console.log(data);
          if(data.State){
            let result = data.centent.data.data;
            const set = new Set();
            result.forEach(item => set.add(item.brand));
            let newData = Array.from({length : set.size}, () => []);
            result.forEach(item => {
            	let index = [...set].indexOf(item.brand);
            	newData[index].push(item);
            })
            for(let i = 0; i < newData.length; i++){
              let obj = {
              	title : "",
              	option : []
              };
              for(let m = 0; m < newData[i].length; m++){
                obj.title = newData[i][m].brand;
                obj.option.push(newData[i][m]);
              }
              this_.tablepara.push(obj)
            }
            console.log(this_.tablepara);

          }
        }
      });
    },
  }
}
</script>
<style scoped>
  @import "../../assets/css/detail.css";
</style>
