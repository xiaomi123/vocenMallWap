<template>
  <div class="proSearch_container" style="position: initial;">
    <div class="proSearch_banner" ref="headCont">
     <img :src="categoryBanner">
    </div>

    <!--查询录入框内容开始-->


    <div class="lhq_header" ref="sysLeft">
      <div class="clearfix tag-item ub-pra">
        <!-- <van-icon name="bulb-o" size="2em" class="icon" color="#0066CC" id="vin" /> -->
        <van-icon name="bulb-o" size="2em" class="icon" color="#CCCCCC" id="vin" />
        <p id="input1">
          <input type="text" placeholder="请输入VIN码" v-model="keyWords" />
          <input id="upload_file" type="file"  accept="image/*" @change="fileChange($event)" multiple style="display: none">
          <input id="camera_file" type="file"  accept="image/*" capture="camera" @change="camera($event)" multiple style="display: none">
          <img class="icon-scanner" src="../../assets/images/common/scanner.png" @click="show = true" />
          <span @click="searchByVin()">查询</span>
        </p>
        <label style="color: #666666;">VIN码：如LFV3B28R1C3080426</label>
      </div>
      <div  class="clearfix tag-item ub-pra">
        <van-icon name="bulb-o" size="2em" class="icon" color="#CCCCCC" id="attr" />
        <p id="input2">
          <input type="text" :placeholder="placeholderTxt" v-model="attrKey" />
          <span @click="search()">查询</span>
        </p>
      </div>
      <div style="background: #eeeeee;padding: 1rem;">
        <template v-for="(item,index) in cateList" >
          <van-tag class="umar-r" round :size="item.size" :color="item.color" :text-color="item.txtColor" @click="tapTag(item,index)">{{item.name}}</van-tag>
        </template>
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
    <!--主要内容开始-->
    <div class="proSearch_main">
      <template v-if="tabCurrent == 0">
        <div class="list-item ub ub-ver ub-pra" v-for="(list,index) in proList">
          <div class="ub">
           <template v-if="list.prod[5].indexOf('开发中') == -1">
             <div class="ub ub-pra img-box" @click="imgPreview(list.titlepicurl)">
               <img :src="imgUrl+list.titlepicurl" class="ub ub-img1 imgwh" />
               <img src="../../assets/images/lhq/big.png" class="icon-big" />
             </div>
           </template>
            <div class="ub ub-f1" @click="detail(list)">
              <div class="ub ub-f1 ub-ver">
                <div class="ub pro-title">{{list.prod[4]}}</div>
                <div class="ub umar-t" v-if="list.prod[1].indexOf('点火线圈') > -1">品名：<em class="sc-text">{{list.prod[1].substr(0,4)}}</em>&nbsp;&nbsp;品号：<em class="sc-text">{{list.prod[5]}}</em></div>
                <div class="ub umar-t" v-else>品名：<em class="sc-text">{{list.prod[1]}}</em>&nbsp;&nbsp;品号：<em class="sc-text">{{list.prod[5]}}</em></div>
              </div>
            </div>
            <div class="ub ub-pc ub-ac" @click="detail(list)">
              <span class="erpcode-box">
              {{list.prod[5].substring(list.prod[5].length - 3)}}
              </span>
            </div>
          </div>
          <div class="ub ub-ver umar-t" v-if="list.prod[1].indexOf('离合器') > -1" @click="detail(list)">
            <div class="ub">直径：<em class="sc-text">{{list.customFields[0]}}</em>&nbsp;齿数：<em class="sc-text">{{list.customFields[1]}}</em></div>
            <div class="ub">分离轴承：<em class="sc-text">{{list.customFields[2]}}</em></div>
          </div>
          <div class="ub umar-t" v-if="list.prod[1] == '前氧传感器'" @click="detail(list)">总长度：<em class="sc-text">{{list.spec[0]}}</em></div>
          <div class="ub umar-t" v-else-if="list.prod[1] == '后氧传感器'" @click="detail(list)">总长度：<em class="sc-text">{{list.spec[4]}}</em></div>
          <div class="ub ub-ac" style="margin-top: 1rem;">
            <div class="ub ub-ac ub-f1" v-if="isCart">
              <div class="ub ub-ver" @click="detail(list)">
                <div class="ub ub-f1 text-red" v-show="list.prod[5].indexOf('开发中') <= -1">
                  <em style="font-size: 1rem;">￥</em>
                  <em style="font-size: 1.4rem;">{{parseInt(list.params.price)}}</em>
                </div>
                <div class="ub" v-if="buyRecord.length != 0">
                  <template v-for="(item,index) in buyRecord">
                    <div class="buy-text" v-if="list.prod[5] == item.th004">{{item.date}}购买了{{item.qty}}个</div>
                  </template>
                </div>
              </div>
              <div class="ub ub-pe ub-ac cart-box">
                <cart-view :cartList="list.params" :num="0" :name="0" class="cart-width"></cart-view>
              </div>
            </div>
            <div class="ub text-primary ub-pe" @click="detail(list)">详情&nbsp;&nbsp;</div>
          </div>
          <div class="list-item-mask" v-show="list.prod[5].indexOf('开发中') > -1"></div>
        </div>
      </template>
      <template v-else-if="tabCurrent == 1">
        <div class="list-item ub ub-ver ub-pra" v-for="(item,index) in searchList">
          <div class="ub ub-ver ub-pra" @click="detail_1(item)">
            <div class="ub ub-f1">
              <template v-show="item.mb001.indexOf('开发中') == -1">
                <div class="ub ub-pra img-box" @click="imgPreview(item.titlepicurl)"  @click.stop>
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh" />
                  <img src="../../assets/images/lhq/big.png" class="icon-big" />
                </div>
              </template>
              <div  class="ub ub-ver ub-f1">
                <div class="ub pro-title" v-if="item.dtype.indexOf('离合器') > -1">{{item.models}}</div>
                <div class="ub pro-title" v-if="item.dtype.indexOf('点火线圈') > -1">{{item.series}}{{item.models}}&nbsp;{{item.displacement}}</div>
                <div class="ub pro-title" v-if="item.dtype.indexOf('氧传感') > -1">{{item.series}}{{item.models}}{{item.style}}</div>
                <div class="ub umar-t" v-if="item.dtype.indexOf('氧传感') > -1">品名：<em class="sc-text">氧传感器</em>&nbsp;&nbsp;品号：<em class="sc-text">{{item.mb001}}</em></div>
                <div class="ub umar-t" v-else-if="item.dtype.indexOf('离合器') > -1">品名：<em class="sc-text">离合器套装</em>&nbsp;&nbsp;品号：<em class="sc-text">{{item.mb001}}</em></div>
                <div class="ub umar-t" v-else>品名：<em class="sc-text">{{item.dtype}}</em>&nbsp;&nbsp;品号：<em class="sc-text">{{item.mb001}}</em></div>
              </div>
              <div class="ub ub-pc ub-ac">
                <span class="erpcode-box">
                {{item.mb001.substring(item.mb001.length - 3)}}
                </span>
              </div>
            </div>
          </div>
          <div class="ub ub-ver" v-if="item.dtype.indexOf('离合器') > -1" @click="detail_1(item)">
            <div class="ub umar-t">
              <em>发动机：<em class="sc-text">{{item.parm1}}</em></em>&nbsp;&nbsp;
              <em>{{item.parm2}}</em>&nbsp;&nbsp;
            </div>
            <div class="ub umar-t">分离轴承：<em class="sc-text">{{item.style}}</em></div>
            <div class="ub umar-t">规格：<em class="sc-text">{{item.pspec}}</em></div>
          </div>
          <div class="ub ub-ver" v-if="item.dtype.indexOf('点火线圈') > -1" @click="detail_1(item)">
            <div class="umar-t">
              发动机：<em class="sc-text">{{item.enginemodel}}</em>&nbsp;&nbsp;
            </div>
            <div class="umar-t" style="word-break: break-all;">OEM：<em class="sc-text">{{item.oem}}</em></div>
            <div class="ub umar-t">规格：<em class="sc-text">{{item.pspec}}</em></div>
          </div>
          <div class="ub ub-ver" v-if="item.dtype.indexOf('氧传感') > -1" @click="detail_1(item)">
            <div class="umar-t">
              <span>发动机：<em class="sc-text">{{item.enginemodel}}</em></span>&nbsp;&nbsp;
              <span>总长度：<em class="sc-text">{{item.linelength}}</em></span>&nbsp;&nbsp;
            </div>
            <div class="umar-t" style="word-break: break-all;">OEM：<em class="sc-text">{{item.oem}}</em></div>
            <div class="umar-t">规格：<em class="sc-text">{{item.name}}</em></div>
          </div>
          <div class="ub ub-ac" style="margin-top: 1rem;" @click="detail_1(item)">
            <div class="ub">
              <div class="ub text-red" v-if="!(JSON.stringify(userInfo) === '{}')">
                <template v-if="item.mb001.indexOf('开发中') <= -1">
                  <em style="font-size: 1rem;">￥</em>
                  <em style="font-size: 1.4rem;">{{parseInt(item.price)}}</em>
                </template>
              </div>
             <!-- <template v-for="(list,index) in buyRecord"> -->
                <div class="ub buy-text" style="margin-left: 1rem;" :name="item.mb001"></div>
              <!-- </template -->
            </div>
            <div class="ub ub-f1 ub-pe text-primary">详情购买</div>
          </div>
          <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1"></div>
        </div>
      </template>
      <div v-show="showEmpty" style="text-align: center;">{{showEmptyText}}</div>
    </div>
    <!--主要内容结束-->

    <!-- 购物车-->
    <router-link :to="{path: '/proSearch/cart'}">
      <div class="fixed-btn"><van-icon name="cart-o" :badge="cartTotal" size="30" color="#ff0000" /></div>
    </router-link>

    <!-- 遮罩层-->
    <!-- <van-overlay :show="isMask" @click="isMask = false"> -->
      <!-- <div class="dialog" v-if="isMask">
          <header class="dialog-nav">
            <em class="iconfont" @click="closeDialog()">&#xe601;</em>
            <h1 class="dialog-title">VIN码识别</h1>
          </header>
          <div class="dialog-content">
            <crop
                style="width:100%;height: 16rem;"
                v-model="option.crop"
                :defaultImgUrl="option.img"
                :angle="15"
                :color=option.color
                :shape=option.shape
                @imgLoaded="imgLoaded"
                :revokeBtn="true"
                :penBtn="true"
                :rotation="option.rotation"
              >
              </crop>
            <div class="resize-desc">识别错了？请重新调整图片位置，然后<van-button class="button" type="warning" size="small" @click="getCutImg()">开始识别</van-button></div>
            <div class="dialog-grid">
              <div style="color: red;text-align: center;margin-bottom: 1rem;">请核查识别结果与图片数据是否一致</div>
              <input class="input-view" type="text" maxlength="17" v-model="keyWords" placeholder="请输入VIN码" />
              <van-button class="dialog-btn" type="danger" size="small" block @click="searchByVin1()">查看解码消息</van-button>
            </div>
          </div>
      </div> -->
    <!-- </van-overlay> -->

  </div>
</template>

<script>
  import Consts from '../../api/const.js'
  import {Swiper,SwiperSlide } from 'vue-awesome-swiper'
  import { crop } from "vue-cropblg"
  import { ImagePreview } from 'vant'
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
        cateList : [
          {name:"全部",color:"#ffffff",txtColor:"#858585",size:"large",desc:""},
          {name:"离合器套装",color:"#ffffff",txtColor:"#858585",size:"large",desc:"离合器三件套"},
          {name:"氧传感器",color:"#ffffff",txtColor:"#858585",size:"large",desc:"前氧传感器,后氧传感器"},
          {name:"点火线圈",color:"#ffffff",txtColor:"#858585",size:"large",desc:"点火线圈"},
        ],
        /*actionsheet*/
        show: false,
        actions: [{
          name: '拍照VIN'
        }, {
          name: '上传VIN图片'
        }],
        isMask : false,
        option:{
          img : "https://img.zcool.cn/community/01bc0f59c9a9b0a8012053f85f066c.jpg",
          zuobiao: [50, 50, 20, 0],
          color:'#f14864',
          crop:{},
          shape: 'rect', //截图形状
          rotation: 0
        },
        tabCurrent : 0,
        keyWords : "",
        attrKey : "",
        placeholderTxt : "车型/发动机型号/OE号/后三位编码",
        categoryName : "" ,//分类
        categoryBanner : "", //品类导航图
        imgUrl : '',
        proList : [], //产品列表
        searchList : [], //按属性搜索产品列表
        zonghe : [], //按属性综合查询
        chexingObj : "", //车型查询参数
        userInfo:{}, //用户信息
        isCart : false, //是否显示购物车
        showEmpty : false, //没有产品
        showEmptyText : '暂无适配产品信息',
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
        cartTotal : 0, //购物车数量
        buyRecord :[], //购买记录
        dataPage:[],//分页展示数据
        pages:20,
        p : 1,
        pageRows : 20,
        source : 0 //数据来源
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        this_.imgUrl = Consts.apiConfig.imgPath;
        document.title = sessionStorage.getItem('pageTitle');
        this_.chexingObj = this_.$route.query.obj != undefined ? this_.$route.query.obj : "";

        if(!this_.$utils.check.isEmpty(sessionStorage.getItem("userinfo"))){
          this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        }
        if(this_.$utils.check.isEmpty(sessionStorage.getItem('history'))){
          this_.tabCurrent = this_.$route.query.type;
          this_.categoryName = this_.$route.query.categoryName;
          if(this_.tabCurrent == 0){
            this_.highLight('vin');
            this_.keyWords = this_.$route.query.words;
          }else if(this_.tabCurrent == 1){
            this_.highLight('attr');
            this_.attrKey = this_.$route.query.words;
            this_.source = 1;
          }
          this_.showNavImg();
        }else{
          let obj = JSON.parse(sessionStorage.getItem('history'));
          this_.source = obj.source;
          this_.tabCurrent = obj.source;
          this_.categoryName = obj.categoryName;
          if(this_.source == 0){
            this_.highLight('vin');
            this_.keyWords = obj.words;
          }else if(this_.source == 1){
            this_.highLight('attr');
            this_.attrKey = obj.words;
          }
          this_.showNavImg();
        }
        //关联tab切换
        this_.cateList.forEach((item,index) => {
          if(item.desc == this_.categoryName){
            item.color = "#0066CC";
            item.txtColor = "#ffffff";
          }
        })

        if(this_.tabCurrent == 0){
          console.log("vincode:"+sessionStorage.getItem('vincode'));
          if(!this_.$utils.check.isEmpty(sessionStorage.getItem('vincode'))){
            this_.checkedInput(0);
            this_.keyWords = sessionStorage.getItem('vincode');
            sessionStorage.removeItem('vincode');
            this_.p = 1;
            this_.proList = [];
            this_.buyRecord = [];
            this_.vinCodePros();
          }else{
            if(this_.keyWords != ""){
              this_.vinCodePros();
            }else{
              this_.showPlaceHolderText();
              this_.carsPros();  //品类查询
            }
          }
          // if(this_.keyWords != ""){
          //   if(!this_.$utils.check.isEmpty(sessionStorage.getItem('vincode'))){
          //     this_.checkedInput(0);
          //     this_.keyWords = sessionStorage.getItem('vincode');
          //     sessionStorage.removeItem('vincode');
          //     this_.p = 1;
          //     this_.proList = [];
          //     this_.buyRecord = [];
          //   }
          //   this_.vinCodePros();  //vin码
          // }else{
          //   this_.showPlaceHolderText();
          //   this_.carsPros();  //品类查询
          // }
        }else if(this_.tabCurrent == 1){ //综合查询
          this_.attrSearch();
        }

        window.addEventListener('scroll',this_.handleScroll,true);

        //判断滚动条到底部分页加载
        window.onscroll = function(){
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
          //变量windowHeight是可视区的高度
          var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          //变量scrollHeight是滚动条的总高度
          var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
          //滚动条到底部的条件
          let totalHeight = scrollTop+windowHeight+100
          if(totalHeight > scrollHeight){
            //写后台加载数据的函数
            if(this_.tabCurrent == 0){
              this_.p++;
              if(this_.keyWords != ""){
                this_.vinCodePros();  //vin码
              }else{
                this_.carsPros();  //品类查询
              }
            }else if(this_.tabCurrent == 1){
              this_.p++;
              this_.attrSearch();
            }
          }
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
    destroyed: function(){
    	let this_ = this;
      window.removeEventListener('scroll', this_.handleScroll,true)
    },
    methods: {
      lhqSearch: function() {
        let this_ = this;
      },
      //滚动监听
      handleScroll:function(){
      	let this_ = this;
      	let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      	let offTop = this_.$refs.sysLeft.offsetTop;
      	let h = document.documentElement.clientHeight || document.body.clientHeight;
      	if(scrollTop > offTop){
      		this_.$refs.sysLeft.style.position = 'fixed';
      		this_.$refs.sysLeft.style.top = '0px';
      		this_.$refs.sysLeft.style.left = '0px';
      		this_.$refs.sysLeft.style.width = '100%';
      		this_.$refs.sysLeft.style.overflowY = 'auto';
          this_.$refs.sysLeft.style.zIndex = '9';
      	}else{
      		this_.$refs.sysLeft.style.position = 'initial';
      		this_.$refs.sysLeft.style.top = '0px';
      		this_.$refs.sysLeft.style.left = '0px';
      		this_.$refs.sysLeft.style.width = '100%';
      		this_.$refs.sysLeft.style.overflowY = 'initial';
          this_.$refs.sysLeft.style.zIndex = 'auto';
      	}

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
        //console.log('this_.keyWords------------>:'+this_.keyWords);
        if(this_.p == 1){this_.bus.$emit('loading', true);}
        this_.$api.post({
          url: this_.$apiUrl.api.VinCode+'?vincode=' + this_.keyWords + "&categoryName="+this_.categoryName+"&pageindex="+this_.p+"&pagesize="+this_.pageRows,
          params: {},
          success: function (data) {
            console.log(data);
            if(data.State){
              this_.tabCurrent = 0;
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
              this_.showModelInfoByVinCode = true;
              this_.dataPage = [];
              if(data.centent.plist != "" && data.centent.plist != null){
                let result = JSON.parse(data.centent.plist);
                this_.getMb001s(result);
                this_.getPorductPics(result);
                this_.showEmpty = false;
              }else{
                if(this_.p > 1){
                  this_.showEmpty = false;
                }else{
                  this_.showEmpty = true;
                }
              }
            }else{
              this_.bus.$emit('tipShow', data.Message);
            }
            this_.bus.$emit('loading', false);
          }
        });
      },
      //按品类查询
      carsPros(){
        let this_ = this;
        console.log(this_.categoryName+";品类查询");
        this_.tabCurrent = 0;
        if(this_.p == 1){this_.bus.$emit('loading', true);}
        this_.$api.post({
          url : this_.$apiUrl.api.ProductByVehicle,
          params :{
            openid : sessionStorage.getItem('openid'),
            engineModel : "", //发动机型号
            brand : this_.chexingObj.brand != undefined ? this_.chexingObj.brand : "", //品牌
            models : this_.chexingObj.models != undefined ? this_.chexingObj.models : "", //车型
            series : this_.chexingObj.series != undefined ? this_.chexingObj.series : "",  //车系
            newFactory : this_.chexingObj.newFactory != undefined ? this_.chexingObj.newFactory : "",  //厂商
            displacement : this_.chexingObj.displacement != undefined ? this_.chexingObj.displacement : "",  //排量
            chassisCode : this_.chexingObj.chassisCode != undefined ? this_.chexingObj.chassisCode : "", //底盘号
            year : this_.chexingObj.year != undefined ? this_.chexingObj.year : "",  //年份
            powerKw : this_.chexingObj.powerKw != undefined ? this_.chexingObj.powerKw : "",  //功率
            categoryName : this_.categoryName != undefined ? this_.categoryName : "",  //分类品类
            pageindex : this_.p,
            pagesize : this_.pageRows
          },
          success : function(res){
            console.log(JSON.parse(res.centent.plist));
            if(res.State){
              this_.dataPage = [];
              if(res.centent.plist != ""){
                let result = JSON.parse(res.centent.plist);
                this_.getMb001s(result);
                this_.getPorductPics(result);
                this_.showEmpty = false;
              }else{
                if(this_.p > 1){
                  this_.showEmpty = false;
                }else{
                  this_.showEmpty = true;
                }
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
        let eprcodes = res.map(item => item.prod[5]).join(',');
        if(this_.p > 1){
          this_.proList = this_.proList.concat(res);
        }else{
          this_.proList = res;
        }
        // this_.proList = res;
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
        }else{
          if(this_.userInfo.dataset[0].mr003.indexOf('弘途耐用') > -1 || this_.userInfo.dataset[0].mr003.indexOf('江陵耐用') > -1){
              params_data = {
                mb001 : eprcodes,
                ma017 : this_.userInfo.dataset[0].ma017,
                ma075 : this_.userInfo.dataset[0].ma075,
                c_id : this_.userInfo.dataset[0].c_id,
                dpt : this_.userInfo.dataset[0].dpt,
                c_ma001 : this_.userInfo.dataset[0].ma001
              };
              this_.isCart = true;
          }else{
            params_data = {
              mb001 : eprcodes,
              ma017 : "",
              ma075 : "",
              c_id : "",
              dpt : "",
              c_ma001 : ""
            };
          }
        }
        this_.$api.post({
          url: this_.$apiUrl.api.ProductDetails,
          params: params_data,
          success: function (data) {
            //console.log('--------------缩略图--------------------');
            console.log(data);
            if(data.State){
              let infos = data.centent;
              for(let i = 0; i < res.length; i++){
                for(let m = 0; m < infos.length; m++){
                  if(infos[m].mb001 == res[i].prod[5]){
                    this_.$set(res[i], 'titlepicurl', infos[m].picurl);
                    this_.$set(res[i], 'params', infos[m].data);
                  }
                }
              }
            }
          }
        });
      },
      //按属性查询
      search(){
        if(this.attrKey != ""){
          if(this.attrKey.length >= 2){
            this.showModelInfoByVinCode = false;
            this.checkedInput(1);
            this.p = 1;
            this.searchList = [];
            this.buyRecord = [];
            this.tabCurrent = 1;
            this.attrSearch();
          }else{
            this.bus.$emit('tipShow', "至少输入2位");
          }
        }else{
          this.bus.$emit('tipShow', "请输入查询条件");
        }
      },
      //属性-综合查询
      attrSearch(){
        console.log();
        let this_ = this;
        let mr003 = "";
        if(this_.userInfo.mr003 == undefined){
          if(sessionStorage.getItem('brandType') == '3'){
            mr003 = "江陵耐用";
          }else if(sessionStorage.getItem('brandType') == '4'){
            mr003 = "弘途耐用";
          }
        }else{
          mr003 = this_.userInfo.dataset[0].mr003;
        }
       if(this_.p == 1){ this_.bus.$emit('loading', true);}
        this_.$api.get({
          url: this_.$apiUrl.api.GetProdctList + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.attrKey + '&type=&car=&brand=' + mr003 + '&openid='+sessionStorage.getItem('openid') + '&categoryName=' + this_.categoryName + '&pageindex=' + this.p + '&pagesize=' + this_.pageRows,
          params: {},
          success: function (data) {
            console.log(data);
            this_.tabCurrent = 1;
            if(data.length != 0){
              if(this_.p > 1){
                this_.searchList = this_.searchList.concat(data);
              }else{
                this_.searchList = data;
              }
              let eprcodes = data.map(item => item.mb001).join(',');
              this_.getBuyRecord(eprcodes);
              this_.showEmpty = false;
            }else{
              if(this_.p > 1){
                this_.showEmpty = false;
              }else{
                this_.showEmpty = true;
              }
            }
          	this_.bus.$emit('loading', false);
          }
        });
      },
      //属性购买记录
      // getAttrMb001(res){
      //   let eprcodes = res.map(item => item.mb001).join(',');
      //   this.getBuyRecord(eprcodes,2);
      // },
      //获取vincode查询数据的品号
      getMb001s(res){
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
        let eprcodes = res.map(item => item.prod[5]).join(',');
        this_.getBuyRecord(eprcodes,1);
      },
      //最近购买记录列表
      getBuyRecord(mb001s,type){
        let this_ = this;
        if(this_.userInfo.dataset != undefined){
          this_.bus.$emit('loading', true);
          this_.$api.post({
            url: this_.$apiUrl.api.RecentSale,
            params: {
              dpt : 'PTYW',
              mb001 : mb001s,
              ma001 : this_.userInfo.dataset[0].ma001
            },
            success: function (data) {
              console.log("-----购买记录-----:");
              console.log(data);
              if(data.length != 0){
                if(this_.tabCurrent == 1){ //自有数据源
                  data.forEach((item,index) => {
                    document.getElementsByName(item.th004).forEach((list,key) => {
                      list.innerHTML = item.date +'购买了'+ item.qty + '个';
                    })
                  })
                }else{
                  if(this_.p > 1){
                    this_.buyRecord = this_.buyRecord.concat(data);
                  }else{
                    this_.buyRecord = data;
                  }
                  console.log(this_.buyRecord);
                }
              }
            	this_.bus.$emit('loading', false);
            }
          });
        }
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
          //let imgcode = dataUrl.split(',')[1];
          //this_.option.img = dataUrl;
          //this_.getVinCode(imgcode,1);
          sessionStorage.setItem('vinImg',dataUrl);
          this_.$router.push({path:'/proSearch/products1'});
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

        if(size > 5242880){
            alert('请选择5M以内的图片！');
            return false;
        }
        var render = new FileReader();
        render.readAsDataURL(img1);
        render.onload = (e) => {
            //var imgcode = e.target.result.split(',')[1];
            // this_.option.img = e.target.result;
            // this_.getVinCode(imgcode,1);
            sessionStorage.setItem('vinImg',e.target.result);
            this_.$router.push({path:'/proSearch/products1'});
        }
      },
      //上传图片获取VINCode
      // getVinCode(imgcode,type){
      //   let this_ = this;
      //   this_.bus.$emit('loading', true);
      //   this_.$api.post({
      //     url: this_.$apiUrl.api.VinOCR,
      //     params: {
      //       imgcode : imgcode,
      //       openid : sessionStorage.getItem('openid')
      //     },
      //     success: function (data) {
      //       console.log(data);
      //       if(data.State){
      //         this_.keyWords = data.centent;
      //         if(type == 1){
      //           this_.isMask = !this_.isMask;
      //         }
      //       }else{
      //         this_.bus.$emit('tipShow', data.centent);
      //       }
      //       this_.bus.$emit('loading', false);
      //     }
      //   });
      // },
      //关闭弹层
      closeDialog(){
        this.isMask = !this.isMask;
      },
      imgLoaded(){
          console.log('图片加载完成~');
      },
      //重新识别VIN图片
      getCutImg(){
        this.getVinCode(this.option.img,2);
      },
      //vincode查询
      searchByVin(){
        this.checkedInput(0);
        this.p = 1;
        this.proList = [];
        this.buyRecord = [];
        if(this.keyWords != ""){
          this.vinCodePros();
        }else{
          this.carsPros();
        }

      },
      searchByVin1(){
        this.checkedInput(0);
        this.closeDialog();
        this.p = 1;
        this.proList = [];
        this.buyRecord = [];
        this.vinCodePros();
      },
      //查询来源
      checkedInput(e){
        this.source = e;
        if(e == 0){
          this.highLight('vin');
        }else if(e == 1){
          this.highLight('attr');
        }
      },
      highLight(e){
        if(e == "vin"){
          document.getElementById('vin').style.color = "#0066CC";
          document.getElementById('input1').setAttribute("style","border: 1px solid #0066CC;-webkit-box-shadow:inset 0 1px 1px rgba(0, 102, 204, .075);box-shadow:inset 0 1px 1px rgba(0, 102, 204, .075);");
          document.getElementById('attr').style.color = "#CCCCCC";
          document.getElementById('input2').setAttribute("style","border: 1px solid #CCCCCC;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);");
        }else if(e == 'attr'){
          document.getElementById('attr').style.color = "#0066CC";
          document.getElementById('input2').setAttribute("style","border: 1px solid #0066CC;-webkit-box-shadow:inset 0 1px 1px rgba(0, 102, 204, .075);box-shadow:inset 0 1px 1px rgba(0, 102, 204, .075);");
          document.getElementById('vin').style.color = "#CCCCCC";
          document.getElementById('input1').setAttribute("style","border: 1px solid #CCCCCC;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);");
        }

      },
      //产品详情
      detail(list){
        let obj = {
          source : 0,
          words : this.keyWords,
          categoryName : this.categoryName
        };
        sessionStorage.setItem('history',JSON.stringify(obj));
        console.log('words:'+this.keyWords+";categoryName:"+this.categoryName);
        //this.$router.push({path:'/proSearch/detail', query:{obj:JSON.stringify(list.params),mb001:list.prod[5],title:this.$route.query.title}});
        
        sessionStorage.setItem('proObj',JSON.stringify(list.params));
        this.$router.push({path:'/proSearch/detail', query:{mb001:list.prod[5],title:this.$route.query.title}});

      },
      //属性-详情
      detail_1(list){
        let obj = {
          source : 1,
          words : this.attrKey,
          categoryName : this.categoryName
        };
        sessionStorage.setItem('history',JSON.stringify(obj));
        console.log('words:'+this.attrKey+";categoryName:"+this.categoryName);
        //this.$router.push({path:'/proSearch/detail', query:{obj:"",mb001:list.mb001,title:this.$route.query.title}});
        
        sessionStorage.setItem('proObj',"");
        this.$router.push({path:'/proSearch/detail', query:{mb001:list.mb001,title:this.$route.query.title}});

      },
      //从详情返回后记录参数

      //搜索框placeholderText
      showPlaceHolderText(){
        if(this.categoryName.indexOf('离合器') > -1){
          this.placeholderTxt = "车型/发动机型号/后三位编码";
        }else{
          this.placeholderTxt = "车型/发动机型号/OE号/后三位编码";
        }
      },
      //品类查询
      tapTag(e,index){
        this.p = 1;
        this.buyRecord = [];
        for(let i = 0; i < this.cateList.length; i++){
          if(i == index){
            this.cateList[i].color = "#0066CC";
            this.cateList[i].txtColor = "#ffffff";
            this.categoryName = this.cateList[i].desc;
            if(this.source == 0){
              this.proList = [];
              if(this.keyWords != ""){
                this.vinCodePros();
              }else{
                this.showPlaceHolderText();
                this.carsPros();
              }
            }else if(this.source == 1){
              this.searchList = [];
              //this.dataPage = [];
              this.attrSearch();
            }
          }else{
            this.cateList[i].color = "#ffffff";
            this.cateList[i].txtColor = "#858585";
          }
        }

      },
      //预览图片
      imgPreview(e){
        ImagePreview([''+this.imgUrl + e+'']);
      }
    }
  }
</script>
<style scoped>
  @import "../../assets/css/products.css";
  .proSearch_banner,.proSearch_banner>img{
    height: 17rem;
  }
  .img-box{
    width: 6rem;
    height: 6rem;
    margin-right: 1rem;
  }
  .imgwh{
   /* width: 10rem;
    height: 10rem; */
    width: 6rem;
    height: 6rem;

  }
  /* .imgwh1{
    width: 5rem;
    height: 5rem;
    margin-right: 1rem;
  } */
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
