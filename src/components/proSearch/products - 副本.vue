<template>
  <div class="proSearch_container">
    <div class="proSearch_banner">
     <img :src="categoryBanner">
    </div>

    <!--查询录入框内容开始-->


    <div class="lhq_header" v-show="categoryName != ''">
      <ul class="tab-list">
        <li v-for="(list,index) in tabList" :class="index == tabCurrent ? 'active' : ''" @click="changeTab(index)">{{list}}</li>
      </ul>
      <div class="clearfix tag-item" v-if="tabCurrent == 0 || tabCurrent == 5">
        <p>
          <input type="text" placeholder="请输入VIN码" v-model="keyWords" />
          <input id="upload_file" type="file"  accept="image/*" @change="fileChange($event)" multiple style="display: none">
          <input id="camera_file" type="file"  accept="image/*" capture="camera" @change="camera($event)" multiple style="display: none">
          <img class="icon-scanner" src="../../assets/images/common/scanner.png" @click="show = true" />
          <span @click="search()">查询</span>
        </p>
        <label style="color: #666666;">VIN码：如LFV3B28R1C3080426</label>
      </div>
      <div class="clearfix tag-item" v-else-if="tabCurrent == 1">
        <!-- <p>
          <input type="text" placeholder="请输入车型品牌" v-model="keyWords" />
          <span @click="search()">查询</span>
        </p> -->
        <p>
          <input type="text" placeholder="点击选择车型" v-model="keyWords" readonly="readonly" @click="barandList()" />
          <span @click="barandList()">查询</span>
        </p>
      </div>
      <div  class="clearfix tag-item" v-else>
        <p>
          <input type="text" v-if="tabCurrent == 2" placeholder="请输入品牌件码" v-model="keyWords" />
          <input type="text" v-if="tabCurrent == 4" placeholder="请输入至少3位产品编码" v-model="keyWords" />
          <input type="text" v-if="tabCurrent == 3" placeholder="请输入发动机型号" v-model="keyWords" />
          <span @click="search()">查询</span>
        </p>
      </div>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"></van-action-sheet>
    <!--查询录入框内容结束-->


    <!-- 根据vincode显示车型信息 -->
    <div v-if="showModelInfoByVinCode" style="background-color: #dff0d8;color: #3c763d;padding:1rem">
      <div style="margin-bottom: 0.5rem;">{{modelsInfo.Brand}}&nbsp;&nbsp;{{modelsInfo.Models}}&nbsp;&nbsp;{{modelsInfo.Manufacturers}}</div>
      <div>[{{modelsInfo.ListingYear}}-{{modelsInfo.IdlingYear}}]&nbsp;&nbsp;{{modelsInfo.Displacement}}L&nbsp;&nbsp;
      {{modelsInfo.FuelType}}&nbsp;&nbsp;{{modelsInfo.EngineModel}}</div>
    </div>
    <!-- 根据发动机型号显示车型信息 -->
    <!-- <div v-if="showModelInfoByEngineModel" style="background-color: #dff0d8;color: #3c763d;padding:1rem">
      <div style="margin-bottom: 0.5rem;">{{chexingObj.newFactory}}&nbsp;&nbsp;{{chexingObj.models}}</div>
      <div>[{{chexingObj.producedYear}}-{{chexingObj.idlingYear}}]&nbsp;&nbsp;{{chexingObj.displacement}}L&nbsp;&nbsp;
      {{chexingObj.engineModel}}</div>
    </div> -->

    <!--主要内容开始-->
    <div class="proSearch_main">

      <div class="list-item ub" v-for="(list,index) in proList">
        <img :src="imgUrl+list.titlepicurl" class="ub ub-img1 imgwh" @click="detail(list)" />
        <div  class="ub ub-f1 ub-ver">
          <div class="ub" @click="detail(list)">
            <div class="ub ub-f1 ub-ver">
              <div class="ub pro-title">{{list.prod[4]}}{{list.prod[1]}}</div>
              <div class="ub" style="margin: 1rem 0;font-size: 1rem;">品号：{{list.prod[5]}}</div>
              <div class="ub" v-if="list.prod[1].indexOf('点火线圈') > -1" style="margin: 1rem 0;font-size: 1rem;">电压：{{list.spec[1]}}</div>
            </div>
            <div class="ub ub-pc ub-ac"><span style="border:2px solid #333333;padding: 0.4rem;font-size: 1.5rem;font-weight: bold;">{{list.prod[5].substring(list.prod[5].length - 3)}}</span></div>
          </div>

          <!-- <div class="ub ub-ae">
            <div class="ub ub-f1" v-if="isCart">
              <cart-view :cartList="list.params" :num="0" :name="0"></cart-view>
            </div>
            <div class="ub ub-f1 ub-pe">
              <router-link :to="{path:'/proSearch/detail',query:{obj:list.params,mb001:list.prod[5],title:$route.query.title,productId:list.prod[0]}}"><van-tag type="primary">查看详情</van-tag></router-link>
            </div>
          </div> -->
          <div class="ub ub-ac" v-if="isCart">
            <div class="ub ub-f1" style="color: #FF0000;">价格：{{list.params.price}}</div>
            <div class="ub ub-f1" style="width: 40%;"><cart-view :cartList="list.params" :num="0" :name="0"></cart-view></div>
          </div>
        </div>
      </div>

      <div v-show="showEmpty" style="text-align: center;">
        <p style="margin-bottom: 1rem;">暂无适配产品信息</p>
        <p>人工请联系18838987090（离合器）</p>
        <p>15138697525（点火线圈/氧传感器）</p>
      </div>

    </div>
    <!--主要内容结束-->

    <!-- 购物车-->
    <router-link :to="{path: '/proSearch/cart'}">
      <div class="fixed-btn"><van-icon name="cart-o" :badge="cartTotal" size="30" color="#ff0000" /></div>
    </router-link>

    <!-- 遮罩层-->
    <van-overlay :show="isMask" @click="isMask = false">
      <div class="dialog" @click.stop>
          <header class="dialog-nav">
            <em class="iconfont" @click="closeDialog()">&#xe601;</em>
            <h1 class="dialog-title">VIN码识别</h1>
          </header>
          <div class="dialog-content">
            <div class="cropper">
              <vueCropper
              				ref="cropper"
              				:img="option.img"
              				:outputSize="option.size"
              				:outputType="option.outputType"
                      :info="option.info"
                      :full="option.full"
                      :canMove="option.canMove"
                      :canMoveBox="option.canMoveBox"
                      :original="option.original"
                      :autoCrop="option.autoCrop"
                      :autoCropWidth="option.autoCropWidth"
                      :autoCropHeight="option.autoCropHeight"
                      :fixedBox="option.fixedBox"
                      :mode="option.mode"
                      @imgLoad="imgLoad"
              			></vueCropper>
            </div>
            <input type="button" class="oper" style="font-size:1.5rem;margin:3px 5px;" value="放大" title="放大" @click="changeScale(1)">
            <input type="button" class="oper" style="font-size:1.5rem;margin:3px 5px;" value="缩小" title="缩小" @click="changeScale(-1)">
            <input type="button" class="oper" style="font-size:3rem;margin:3px 5px;" value="↺" title="左旋转" @click="rotateLeft">
            <input type="button" class="oper" style="font-size:3rem;margin:3px 5px;" value="↻" title="右旋转" @click="rotateRight">
            <div style="font-size: 1.4rem;">识别错了？请重新调整图片位置，然后<van-button type="warning" size="small" @click="getCutImg()" style="margin-left: 1.5rem;border-radius: 0.5rem;">开始识别</van-button></div>
            <div class="dialog-grid">
              <div style="color: red;text-align: center;margin-bottom: 1rem;">请核查识别结果与图片数据是否一致</div>
              <van-password-input
                :value="keyWords"
                :mask="false"
                length="17"
              />
              <van-button class="dialog-btn" type="danger" size="small" block @click="search()">查看解码消息</van-button>
            </div>
          </div>
      </div>
    </van-overlay>

  </div>
</template>

<script>
  import Consts from '../../api/const.js'
  import {Swiper,SwiperSlide } from 'vue-awesome-swiper'
  import { VueCropper }  from 'vue-cropper'
  import 'swiper/swiper-bundle.css'
  export default {
    components: {
      Swiper,
      SwiperSlide,
      VueCropper
    },
    name: 'LhqSearch',
    data() {
      return {
        /*actionsheet*/
        show: false,
        actions: [{
          name: '拍照VIN'
        }, {
          name: '上传VIN图片'
        }],
        isMask : false,

        crap: false,
        option:{
          img: '',
          size: 1,
          info:true,
          full: false,
          outputType: 'png',
          fixedBox: true,
          original: false,
          canMove: true,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 250,
          autoCropHeight: 100,
          mode : "cover"
        },
        tabList : ["VIN码","按车型","OE码","发动机型号","编码"], //查询分类
        tabCurrent : 0,
        keyWords : "",
        categoryName : "" ,//分类
        categoryBanner : "", //品类导航图
        imgUrl : '',
        proList : [], //产品列表
        chexingObj : "", //车型查询参数
        userInfo:{}, //用户信息
        isCart : false, //是否显示购物车
        showEmpty : false, //没有产品
        modelsInfo : {
          Brand : '',
          Models : "",
          Manufacturers : '', //厂家
          Induction : '', //近气形式
          Displacement : '', //排量
          ListingYear : '', //上市年份
          IdlingYear : '', //停产年份
          FuelType : '' ,//燃油类型
          EngineModel : '' //发动机型号
        },
        showModelInfoByVinCode : false,
        showModelInfoByEngineModel : false,
        cartTotal : 0 //购物车数量
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        this_.imgUrl = Consts.apiConfig.imgPath;
        document.title = this_.$route.query.title;
        let type = this_.$route.query.type;
        this_.tabCurrent = this_.$route.query.type == 5 ? 0 : this_.$route.query.type;
        this_.keyWords = this_.$route.query.words;
        this_.categoryName = this_.$route.query.categoryName;
        this_.chexingObj = this_.$route.query.obj != undefined ? this_.$route.query.obj : "";
        this_.showNavImg();
        if(type == 0){ //vin码
          this_.vinCodePros();
        }else if(type == 1 || type == 3 || type == 5){ //车型、发动机型号、类型
          // if(type == 4){
          //  this_.showModelInfoByEngineModel = !this_.showModelInfoByEngineModel;
          // }
          this_.carsPros();
        }else if(type == 2){ //OE码
          this_.byOemNo();
        }else if(type == 4){ //编码
          this_.byProductNo();
        }
      });
    },
    created(){
      let this_ = this;
      this_.bus.$on('cartTotal', function(num) {
        this_.cartTotal = num;
        this_.showNavImg();
      });
      this_.cartTotal = sessionStorage.getItem('cartTotal');
    },
    methods: {
      lhqSearch: function() {
        let this_ = this;
      },
      //显示对应的品类图
      showNavImg(){
        let this_ = this;
        if(sessionStorage.getItem('brandType') == '3'){
          if(this_.categoryName == '' || this_.categoryName.indexOf('离合器') > -1){
            this_.categoryBanner = require('../../assets/images/lhq/img_proSearch_banner01.jpg');
          }else if(this_.categoryName.indexOf('点火线圈') > -1){
            this_.categoryBanner = require('../../assets/images/lhq/img_proSearch_banner02.jpg');
          }else{
            this_.categoryBanner = require('../../assets/images/lhq/img_proSearch_banner03.jpg');
          }
        }else if(sessionStorage.getItem('brandType') == '4'){
          if(this_.categoryName == '' || this_.categoryName.indexOf('离合器') > -1){
            this_.categoryBanner = require('../../assets/images/lhq/h_img_proSearch_banner01.jpg');
          }else if(this_.categoryName.indexOf('点火线圈') > -1){
            this_.categoryBanner = require('../../assets/images/lhq/h_img_proSearch_banner02.jpg');
          }else{
            this_.categoryBanner = require('../../assets/images/lhq/h_img_proSearch_banner03.jpg');
          }
        }
      },
      //vin码对应产品
      vinCodePros(){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url: this_.$apiUrl.api.VinCode+'?vincode=' + this_.keyWords + "&categoryName="+this_.categoryName,
          params: {},
          success: function (data) {
            console.log(data);
            if(data.State){
              //车型信息
              this_.modelsInfo.Brand = data.centent.result[0].Brand;
              this_.modelsInfo.Models = data.centent.result[0].Models;
              this_.modelsInfo.Manufacturers = data.centent.result[0].Manufacturers;
              this_.modelsInfo.Induction = data.centent.result[0].Induction;
              this_.modelsInfo.Displacement = data.centent.result[0].Displacement;
              this_.modelsInfo.ListingYear = data.centent.result[0].ListingYear;
              this_.modelsInfo.IdlingYear = data.centent.result[0].IdlingYear;
              this_.modelsInfo.FuelType = data.centent.result[0].FuelType;
              this_.modelsInfo.EngineModel = data.centent.result[0].EngineModel;
              this_.showModelInfoByVinCode = !this_.showModelInfoByVinCode;
              if(data.centent.plist != ""){
                let result = JSON.parse(data.centent.plist);
                this_.getPorductPics(result);
              }else{
                this_.showEmpty = !this_.showEmpty;
              }
            }
            this_.bus.$emit('loading', false);
          }
        });
      },
      //按车型匹配产品
      carsPros(){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url : this_.$apiUrl.api.ProductByVehicle,
          params :{
            engineModel : this_.tabCurrent == 3 ? this_.keyWords : "", //发动机型号
            brand : this_.chexingObj.brand != undefined ? this_.chexingObj.brand : "", //品牌
            models : this_.chexingObj.models != undefined ? this_.chexingObj.models : "", //车型
            series : this_.chexingObj.series != undefined ? this_.chexingObj.series : "",  //车系
            newFactory : this_.chexingObj.newFactory != undefined ? this_.chexingObj.newFactory : "",  //厂商
            displacement : this_.chexingObj.displacement != undefined ? this_.chexingObj.displacement : "",  //排量
            chassisCode : this_.chexingObj.chassisCode != undefined ? this_.chexingObj.chassisCode : "", //底盘号
            year : this_.chexingObj.year != undefined ? this_.chexingObj.year : "",  //年份
            powerKw : this_.chexingObj.powerKw != undefined ? this_.chexingObj.powerKw : "",  //功率
            categoryName : this_.categoryName != undefined ? this_.categoryName : ""  //分类品类
          },
          success : function(res){
            console.log(res);
            if(res.State){
              if(res.centent.plist != ""){
                let result = JSON.parse(res.centent.plist);
                this_.getPorductPics(result);
              }else{
                this_.showEmpty = !this_.showEmpty;
              }
            }
            this_.bus.$emit('loading', false);
          }
        })
      },
      //按OE码查询产品
      byOemNo(){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url : this_.$apiUrl.api.ProductByOemNo,
          params :{
            oemNo : this_.keyWords,
            categoryName : this_.categoryName
          },
          success : function(res){
            console.log(res);
            if(res.State){
              if(res.centent.plist != ""){
                let result = JSON.parse(res.centent.plist);
                this_.getPorductPics(result);
              }else{
                this_.showEmpty = !this_.showEmpty;
              }
            }
            this_.bus.$emit('loading', false);
          }
        })
      },
      //按产品编号查询产品
      byProductNo(){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url : this_.$apiUrl.api.ProductsByProductNo,
          params :{
            productNo : this_.keyWords,
            categoryName : this_.categoryName
          },
          success : function(res){
            console.log(res);
            if(res.State){
             if(res.centent.plist != ""){
               let result = JSON.parse(res.centent.plist);
               this_.getPorductPics(result);
             }else{
               this_.showEmpty = !this_.showEmpty;
             }
            }
            this_.bus.$emit('loading', false);
          }
        })
      },
      //获取产品缩略图
      getPorductPics(res){
        let this_ = this;
        let api = "";
        let a = this_.$route.query.mb001.split(''); //[1,2];//
        res.forEach(item => {
          let str = item.prod[5].split('');
          if(item.prod[1] == '离合器三件套' && sessionStorage.getItem('brandType') == 4){//宏途
            str[0] = 1; str[1] = 2; str[2] = 8; str[3] = 8;
            item.prod[1] = "离合器套装";
          }else if(item.prod[1] == '离合器三件套' && sessionStorage.getItem('brandType') == 3){//江陵
            str[0] = 1; str[1] = 3; str[2] = 3; str[3] = 0;
            item.prod[1] = "离合器套装";
          }else{
            str[0] = a[0];
            str[1] = a[1];
          }
          item.prod[5] = str.join('');
        })
        let eprcodes = res.map(item => item.prod[5]).join(',')
        this_.proList = res;
        //是否存在用户信息
        console.log("用户信息");
        console.log(JSON.parse(sessionStorage.getItem("userinfo")));
        let params_data = {};
        if(this_.$utils.check.isEmpty(sessionStorage.getItem("userinfo"))){
          params_data = {
            mb001 : eprcodes,
            ma017 : "",
            ma075 : "",
            c_id : "",
            dpt : "",
            c_ma001 : ""
          };
          //api = this_.$apiUrl.api.ProductDetails+"?mb001="+eprcodes+"&ma017=&ma075=&c_id=&dpt=&c_ma001=";
        }else{
          this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
          if(this_.userInfo.dataset[0].mr003.indexOf('弘途耐用') > -1 || this_.userInfo.dataset[0].mr003.indexOf('江陵耐用') > -1){
              params_data = {
                mb001 : eprcodes,
                ma017 : this_.userInfo.dataset[0].ma017,
                ma075 : this_.userInfo.dataset[0].ma075,
                c_id : this_.userInfo.dataset[0].c_id,
                dpt : this_.userInfo.dataset[0].dpt,
                c_ma001 : this_.userInfo.dataset[0].ma001
              };
              //api = this_.$apiUrl.api.ProductDetails+"?mb001="+eprcodes+"&ma017="+this_.userInfo.dataset[0].ma017+"&ma075="+this_.userInfo.dataset[0].ma075+"&c_id="+this_.userInfo.dataset[0].c_id+"&dpt="+this_.userInfo.dataset[0].dpt+"&c_ma001="+this_.userInfo.dataset[0].ma001;
              this_.isCart = !this_.isCart;
          }else{
            params_data = {
              mb001 : eprcodes,
              ma017 : "",
              ma075 : "",
              c_id : "",
              dpt : "",
              c_ma001 : ""
            };
            //api = this_.$apiUrl.api.ProductDetails+"?mb001="+eprcodes+"&ma017=&ma075=&c_id=&dpt=&c_ma001=";
          }
        }
        this_.$api.post({
          url: this_.$apiUrl.api.ProductDetails,
          params: params_data,
          success: function (data) {
            console.log("---------产品缩略图-----------");
            console.log(data);
            if(data.State){
              let infos = data.centent;
              for(let i = 0; i < this_.proList.length; i++){
                for(let m = 0; m < infos.length; m++){
                  if(infos[m].mb001 == this_.proList[i].prod[5]){
                    this_.$set(this_.proList[i], 'titlepicurl', infos[m].picurl);
                    this_.$set(this_.proList[i], 'params', infos[m].data);
                  }
                }
              }
            }
          }
        });
        // this_.$api.get({
        //   url: api,
        //   params: {},
        //   success: function (data) {
        //     //console.log("---------产品缩略图-----------");
        //     //console.log(data);
        //     if(data.State){
        //       let infos = data.centent;
        //       for(let i = 0; i < this_.proList.length; i++){
        //         for(let m = 0; m < infos.length; m++){
        //           if(infos[m].mb001 == this_.proList[i].prod[5]){
        //             this_.$set(this_.proList[i], 'titlepicurl', infos[m].picurl);
        //             this_.$set(this_.proList[i], 'params', infos[m].data);
        //           }
        //         }
        //       }
        //     }
        //   }
        // });
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
          let imgcode = dataUrl.split(',')[1];
          this_.option.img = dataUrl;
          this_.getVinCode(imgcode,1);
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
        let reader = new FileReader();
        let img1 = event.target.files[0];
        let type = img1.type;//文件的类型，判断是否是图片
        let size = img1.size;//文件的大小，判断图片的大小

        if(size > 3145728){
            alert('请选择3M以内的图片！');
            return false;
        }
        var render = new FileReader();
        render.readAsDataURL(img1);
        render.onload = (e) => {
            var imgcode = e.target.result.split(',')[1];
            this_.option.img = e.target.result;
            //console.log(imgcode);
            this_.getVinCode(imgcode,1);
        }
      },
      //上传图片获取VINCode
      getVinCode(imgcode,type){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url: this_.$apiUrl.api.VinOCR,
          params: imgcode,
          success: function (data) {
            console.log(data);
            if(data.State){
              this_.keyWords = data.centent;
              if(type == 1){
                this_.isMask = !this_.isMask;
              }
              this_.bus.$emit('loading', false);
            }else{
              this_.bus.$emit('tipShow', data.centent);
            }
          }
        });
      },
      //关闭弹层
      closeDialog(){
        this.isMask = !this.isMask;
      },
      //放大/缩小
      changeScale(num) {
        console.log(this.option.img)
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      //坐旋转
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      //右旋转
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      //获取截图的base64 数据
      getCutImg(){
        let this_ = this;
        this.$refs.cropper.getCropData((data) => {
          let imgcode = data.split(',')[1];
          this_.getVinCode(imgcode,2);
        })
      },
      imgLoad (msg) {
        // console.log('imgLoad')
        // console.log(msg)
      },
      //查询
      search(){
        if(this.keyWords != ""){
          if(this.tabCurrent == 0){
            this.proList = [];
            this.closeDialog();
            this.vinCodePros();
          }
          else if(this.tabCurrent == 2){
            this.proList = [];
            this.byOemNo();
          }else if(this.tabCurrent == 4){
            if(this.keyWords.length > 3){
              this.proList = [];
              this.byProductNo();
            }
          }else if(this.tabCurrent == 3){ //发动机
            this.proList = [];
            this.carsPros();
            //this.$router.push({path:'/proSearch/lhqList', query: {words:this.keyWords,categoryName:this.categoryName,mb001:this.$route.query.mb001}});
          }
        }else{
          this.bus.$emit('tipShow', "请输入查询条件");
        }
      },
      //选择车系
      barandList(){
        //console.log("mb001---->:"+this.$route.query.mb001);
        this.$router.push({path:'/proSearch/dhxqList', query:{title:this.$route.title,mb001:this.$route.query.mb001}});
      },
      //tab查询分类
      changeTab(e){
        this.tabCurrent = e;
        this.keyWords = "";
        this.showModelInfoByEngineModel = false;
        this.showModelInfoByVinCode = false;
      },
      //产品详情
      detail(list){
        console.log(list);
        this.$router.push({path:'/proSearch/detail', query:{obj:list.params,mb001:list.prod[5],title:this.$route.query.title,productId:list.prod[0]}});
      }
    }
  }
</script>
<style scoped>
  @import "../../assets/css/products.css";
  .proSearch_banner,.proSearch_banner>img{
    height: 17rem;
  }
  .imgwh{
    width: 10rem;
    height: 10rem;
    margin-right: 1rem;
  }
  .list-item span{
    margin: 0 0.625rem 0.625rem 0;
    word-break: keep-all;
    display: inline-block;
  }
  .fixed-btn{
    position: fixed;
    right: 4%;
    bottom: 2%;
    background: #EEEEEE;
    box-shadow: 0px 0px 21px 0px rgba(228,228,228,0.71);
    padding: 0.5rem;
    border-radius: 2rem;
  }
</style>
