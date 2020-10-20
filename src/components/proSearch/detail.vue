<template>
  <div style="font-size: 1.2rem;">
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in swiper" class="canvImg">
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
          <p class="text-red" v-if="isShow"><em style="font-size: 1rem;">￥</em><em style="font-size: 1.4rem;">{{parseInt(cartList.price)}}</em></p>
        </div>
        <div class="right cart-box" v-if="isCart">
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
    </div>

    <div class="uinn bg-white">
      <h2 class="detail-title">图文详情</h2>
      <div v-html="info.content" id="cvs" style="display: none;"></div>
      <div class="canvImg">
        <img v-for="img in pics" :src="img" />
      </div>
    </div>
    <!-- 购物车-->
    <router-link :to="{path: '/proSearch/cart'}" v-if="isShow && isCart">
      <div class="fixed-btn"><van-icon name="cart-o" :badge="cartTotal" size="30" color="#ff0000" /></div>
    </router-link>
  </div>
</template>
<script>
import Consts from '../../api/const.js'
import Watermark from './../../../static/warterMark.js';
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
      isCart : false,
      //isMall:true,//用于商城进入购物车隐藏
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.imgUrl = Consts.apiConfig.imgPath;
      document.title = sessionStorage.getItem('pageTitle');

      if(!this_.$utils.check.isEmpty(sessionStorage.getItem('userinfo'))){
        this_.isCart = true;
        this_.isShow = true;
        if(this_.$route.query.title == '订单系统'){
          this_.isCart = false;
          this_.isShow = false;
        }

        if(this_.$route.query.obj != ""){
          this_.cartList = JSON.parse(this_.$route.query.obj);

          //this_.isCart = true;
        }else{
          this_.userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
          //this_.isCart = true;
          this_.init_1();
        }
      }
      this_.init();
      this_.getParmas(); //适配车型

      if(sessionStorage.getItem('brandType') == 3){
        Watermark.set('江陵耐用')
      }else if(sessionStorage.getItem('brandType') == 4){
        Watermark.set('弘途耐用')
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
      this_.$api.get({
        url: this_.$apiUrl.api.ProductImage + "?mb001=" + this_.$route.query.mb001,
        params: {},
        success: function (data) {
          //console.log(data);
          if(data.content.length !=0){
            this_.swiper = data.content[0].sliderpics.split(',');
            this_.info = data.content[0];
            this_.$nextTick(function(){
              let img_list = document.querySelector('#cvs').getElementsByTagName('img');
              for(let i = 0; i < img_list.length; i++){
                this_.pics.push(this_.imgUrl + img_list[i].attributes[0].value);
              }
            })
          }
          this_.bus.$emit('loading', false);

          // if(data.State){
          //   if(data.cented.length !=0){
          //     this_.swiper = data.centent[0].sliderpics.split(',');
          //     this_.info = data.centent[0];
          //     this_.$nextTick(function(){
          //       let img_list = document.querySelector('#cvs').getElementsByTagName('img');
          //       for(let i = 0; i < img_list.length; i++){
          //         this_.pics.push(this_.imgUrl + img_list[i].attributes[0].value);
          //       }
          //     })
          //   }
          //   this_.bus.$emit('loading', false);
          // }
        }
      });
    },
    init_1(){

      let this_ = this;
      this_.$api.get({
        url: this_.$apiUrl.api.ProductMB001+'?mb001='+this_.$route.query.mb001+'&c_id='+this_.userInfo.dataset[0].c_id+'&c_ma001='+this_.userInfo.dataset[0].ma001+'&ma017='+this_.userInfo.dataset[0].ma017+'&dpt='+this_.userInfo.dataset[0].dpt+'&ma075='+this_.userInfo.dataset[0].ma075,
        params: {},
        success: function (data) {
          console.log(data);
          this_.cartList = data[0];
        }
      });
    },
    getParmas(){
      let this_ = this;
      this_.$api.post({
        url: this_.$apiUrl.api.VehicleByProductNo,
        params: {
          productNo : this_.$route.query.mb001
        },
        success: function (data) {
          //console.log(data);
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
