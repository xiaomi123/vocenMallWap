<template>
  <div class="proSearch_container">
    <div class="proSearch_banner" v-if="swiperList.length>0">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" style="height: 17rem;">
        <van-swipe-item v-for='item of swiperList' :key='item.id'>
          <img class='swiper-img' :src='item.imgUrl' alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!--查询录入框内容开始-->
    <div class="lhq_header">
      <div class="clearfix tag-item" style="margin-bottom: 1rem;">
          <p>
            <input type="text" placeholder="请输入17位VIN码" v-model="keyWords" />
            <input id="upload_file" type="file"  accept="image/*" @change="fileChange($event)" multiple style="display: none">
            <input id="camera_file" type="file"  accept="image/*" capture="camera" @change="camera($event)" multiple style="display: none">
            <img class="icon-scanner" src="../../assets/images/common/scanner.png" @click="btnShow()" />
            <span @click="winProduct(0)">查询</span>
          </p>
          <label style="color: #666666;">请输入17位车架号或上传清晰图片（前风挡VIN/铭牌/行驶证等）</label>
      </div>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"></van-action-sheet>
    <!--查询录入框内容结束-->

    <!-- 主要内容开始 -->
    <div class="sedan_main">
      <!-- 根据vincode显示车型信息 -->
      <div v-if="showModelInfoByVinCode" class="ub ub-ac" style="background-color: #dff0d8;color: #3c763d;padding:1rem">
        <div class="ub ub-ver ub-f1">
          <div style="margin-bottom: 0.5rem;">{{modelsInfo.Manufacturers}}&nbsp;&nbsp;{{modelsInfo.Brand}}&nbsp;&nbsp;{{modelsInfo.Models}}&nbsp;&nbsp;{{modelsInfo.ChassisCode}}</div>
          <div>{{modelsInfo.ProducedYear}}&nbsp;&nbsp;[{{modelsInfo.ListingYear}}-{{modelsInfo.IdlingYear}}]&nbsp;&nbsp;
          {{modelsInfo.Displacement}}{{modelsInfo.Induction == '自然吸气' ? 'L' : 'T'}}&nbsp;&nbsp;{{modelsInfo.EngineModel}}&nbsp;&nbsp;{{modelsInfo.GearNumber}}{{modelsInfo.TransmissionType == '手动' ? 'MT' : 'AT'}}</div>
        </div>
        <div class="ub ub-ac" style="color: red;" v-show="changeModelIcon" @click="showModels = true">切换车型<van-icon class="ub" name="arrow-down" size="1.5rem" style="margin-left: 0.5rem;" /></div>
      </div>
      <!-- 多个车型切换 -->
      <van-popup v-model="showModels" position="bottom" :close-on-popstate="true" :close-on-click-overlay="false" :closeable="true" :safe-area-inset-bottom="true">
        <div class="modelsPop">
          <h3 class="models-title">车型列表</h3>
          <block v-for="(model,index) in modelsInfoList">
            <div :class="model.LevelId == modelsInfo.LevelId ? 'models-item active' : 'models-item'" @click="changeModels(model)">
              <div style="margin-bottom: 0.5rem;">{{model.Manufacturers}}&nbsp;&nbsp;{{model.Brand}}&nbsp;&nbsp;{{model.Models}}&nbsp;&nbsp;{{model.ChassisCode}}</div>
              <div>{{model.ProducedYear}}&nbsp;&nbsp;[{{model.ListingYear}}-{{model.IdlingYear}}]&nbsp;&nbsp;
              {{model.Displacement}}{{model.Induction == '自然吸气' ? 'L' : 'T'}}&nbsp;&nbsp;{{model.EngineModel}}&nbsp;&nbsp;{{model.GearNumber}}{{model.TransmissionType == '手动' ? 'MT' : 'AT'}}</div>
            </div>
          </block>
        </div>
      </van-popup>
    </div>
    <!-- 主要内容结束 -->

  </div>
</template>

<script>
  import {Swiper,SwiperSlide } from 'vue-awesome-swiper'
  import { crop } from "vue-cropblg"
  import 'swiper/swiper-bundle.css'
  export default {
    components: {
      Swiper,
      SwiperSlide,
      crop
    },
    name: 'LhqSearch',
    data() {
      return {
        //三张轮播，使用变量循环
        swiperList: [],
        /*actionsheet*/
        show: false,
        actions: [{
          name: '拍照VIN'
        }, {
          name: '上传VIN图片'
        }],
        keyWords : "",
        mb001 : "",

        showModels : false,
        changeModelIcon : false,
        showModelInfoByVinCode : false,
        showEmptyText : '暂无适配产品信息',
        modelsInfo : {},
        modelsInfoList : [], //车型列表
        p : 1,
        pageRows : 20,
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        this_.loadSwiper();
        if(!this_.$utils.check.isEmpty(sessionStorage.getItem('vincode'))){
          this_.keyWords = sessionStorage.getItem('vincode');
          sessionStorage.removeItem('vincode');
          this_.vinCodePros();
        }

      });
    },
    created: function(){
      let this_ = this;
      this_.bus.$on('loadSwiper', function(num) {
        this_.loadSwiper();
      });
    },
    methods: {
      loadSwiper(){
        let this_ = this;
        this_.swiperList = [{
          id: '001',
          imgUrl: require("../../assets/images/sedanSearch/img_proSearch_banner01.jpg")
        },{
          id: '002',
          imgUrl: require("../../assets/images/sedanSearch/img_proSearch_banner02.jpg")
        },{
          id: '003',
          imgUrl: require("../../assets/images/sedanSearch/img_proSearch_banner03.jpg")
        },{
          id: '004',
          imgUrl: require("../../assets/images/sedanSearch/img_proSearch_banner04.jpg")
        }]
      },
      lhqSearch: function() {
        let this_ = this;
      },
      onSelect(evt) {
        this.show = false;
        if(evt.name.indexOf('拍照') > -1){
         document.getElementById('camera_file').click();
        }else{
          document.getElementById('upload_file').click();
        }
      },
      //拍照并压缩
      camera(event){
        let this_ = this;
        let reader = new FileReader();
        let img1 = event.target.files[0];

        let img = new Image();
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        let maxW = 640; //设置最大宽度

        reader.onload = function (e) {
          img.src = e.target.result;
        };
        img.onload = function(){
          if(img.width > maxW) {
              img.height *= maxW / img.width;
              img.width = maxW;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, img.width, img.height);
          let compressRate = this_.getCompressRate(1,img1.size/1024/1024);
          let dataUrl = canvas.toDataURL( 'image/jpeg', compressRate);
          sessionStorage.setItem('vinImg',dataUrl);
          this_.$router.push({path:'/sedanSearch/vinCode'});
        }
       reader.readAsDataURL(img1);
      },
      //计算压缩比率，size单位为MB
      getCompressRate(allowMaxSize,fileSize){
        let compressRate = 1;
        if(fileSize/allowMaxSize > 4){
             compressRate = 0.5;
        } else if(fileSize/allowMaxSize >3){
             compressRate = 0.6;
        } else if(fileSize/allowMaxSize >2){
             compressRate = 0.7;
        } else if(fileSize > allowMaxSize){
             compressRate = 0.8;
        } else{
             compressRate = 0.9;
        }
        return compressRate;
      },
      //选择图片上传
      fileChange(event){
        let this_ = this;
        let render = new FileReader();
        let img1 = event.target.files[0];
        let type = img1.type;//文件的类型，判断是否是图片
        let size = img1.size;//文件的大小，判断图片的大小
        if(size > 5242880){
            alert('请选择5M以内的图片！');
            return false;
        }
        render.readAsDataURL(img1);
        render.onload = (e) => {
            var imgcode = e.target.result.split(',')[1];
            sessionStorage.setItem('vinImg',e.target.result);
            this_.$router.push({path:'/sedanSearch/vinCode'});
        }
      },
      //查询
      winProduct(e){
        if(e == 0 && this.keyWords != ""){
          this.vinCodePros();
        }else{
          this.bus.$emit('tipShow', "请输入查询条件");
        }
      },
      //vin点击小摄像头事件
      btnShow(){
        this.show = true;
      },

      //vin码对应产品
      vinCodePros(){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url: this_.$apiUrl.api.VinCode+'?vincode=' + this_.keyWords + "&categoryName="+"&pageindex="+this_.p+"&pagesize="+this_.pageRows + '&platfrom=PTEJ',
          params: {},
          success: function (data) {
            this_.bus.$emit('loading', false);
            if(data.State){
              //车型信息
              this_.modelsInfoList = data.centent.tmparr;
              this_.modelsInfo = data.centent.tmparr[0];
              if(this_.modelsInfoList.length > 1){
                this_.changeModelIcon = true;
              }else{
                this_.changeModelIcon = false;
              }
              this_.showModelInfoByVinCode = true;
            }else{
              this_.bus.$emit('tipShow', data.Message);
            }
          }
        });
      },
      //选择车型
      changeModels(item){
        this.modelsInfo = item;
        this.showModels = false;
        this.p = 1;
      },

    }
  }
</script>
<style scoped>
  @import "../../assets/css/lhqSearch.css";
  .text-info .text{
    font-size:1.3rem;
    color:#cb5f37;
  }
  .modelsPop{
    padding: 0 1rem;
  }
  .modelsPop .models-title{
    font-weight: bold;
    font-size: 1.4rem;
    text-align: center;
    height: 5rem;
    line-height: 5rem;
  }
  .modelsPop .models-item{
    border: 1px solid #CCCCCC;
    padding: 1rem 0.625rem;
    margin-bottom: 1rem;
    border-radius: .5rem;
  }
  .modelsPop .active{
    background-color: #dff0d8;
    border-color: #3c763d;
    color: #3c763d;
  }
</style>
