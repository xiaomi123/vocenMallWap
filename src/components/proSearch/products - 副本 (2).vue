<template>
  <div class="proSearch_container" style="position: initial;">
    <div class="proSearch_banner" ref="headCont">
     <img :src="categoryBanner">
    </div>

    <!--查询录入框内容开始-->


    <div class="lhq_header" ref="sysLeft">
      <div class="clearfix tag-item ub-pra">
        <van-icon name="bulb-o" size="2em" class="icon" color="#0066CC" id="vin" />
        <p>
          <input type="text" placeholder="请输入VIN码" v-model="keyWords" />
          <input id="upload_file" type="file"  accept="image/*" @change="fileChange($event)" multiple style="display: none">
          <input id="camera_file" type="file"  accept="image/*" capture="camera" @change="camera($event)" multiple style="display: none">
          <img class="icon-scanner" src="../../assets/images/common/scanner.png" @click="show = true" />
          <span @click="searchByVin()">查询</span>
        </p>
        <label style="color: #666666;">请输入17位车架号或上传清晰图片（前风挡VIN/铭牌/行驶证等）</label>
      </div>
      <div  class="clearfix tag-item ub-pra">
        <van-icon name="bulb-o" size="2em" class="icon" color="#CCCCCC" id="attr" />
        <p>
          <input type="text" :placeholder="placeholderTxt" v-model="attrKey" />
          <span @click="search()">查询</span>
        </p>
      </div>
      <div>
        <template v-for="(item,index) in cateList" >
          <van-tag class="umar-r" round :size="item.size" :color="item.color" @click="tapTag(item,index)">{{item.name}}</van-tag>
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
        <div class="list-item ub ub-ver ub-pra" v-for="(list,index) in dataPage">
          <div class="ub ub-pra">
           <template v-if="list.prod[5].indexOf('开发中') == -1">
             <img :src="imgUrl+list.titlepicurl" class="ub ub-img1 imgwh" />
             <div class="img-mask" @click="imgPreview(list.titlepicurl)">查看</div>
           </template>
            <div class="ub ub-f1" @click="detail(list)">
              <div class="ub ub-f1 ub-ver">
                <div class="ub pro-title">{{list.prod[4]}}{{list.prod[1]}}</div>
                <div class="ub">品号：{{list.prod[5]}}</div>
              </div>
            </div>
            <div class="ub ub-pc ub-ac">
              <span class="erpcode-box">
              {{list.prod[5].substring(list.prod[5].length - 3)}}
              </span>
            </div>
          </div>
          <div class="ub ub-ver" v-if="list.prod[1].indexOf('离合器') > -1">
            <div class="ub">直径：{{list.customFields[0]}}&nbsp;齿数：{{list.customFields[1]}}</div>
            <div class="ub">分离轴承：{{list.customFields[2]}}</div>
          </div>
          <div class="ub" v-if="list.prod[1].indexOf('氧传感') > -1">总长度：{{list.spec[0]}}</div>
          <div class="ub ub-ac" v-if="isCart">
            <div class="ub ub-f1 text-red">价格：{{list.params.price}}</div>
            <div class="ub ub-pe ub-ac">
              <em class="ub text-primary" @click="detail(list)">详情&nbsp;&nbsp;</em>
              <cart-view :cartList="list.params" :num="0" :name="0" class="cart-width"></cart-view>
            </div>
          </div>
          <div v-if="buyRecord.length != 0">
            <template v-for="(item,index) in buyRecord">
              <div class="text-primary" v-if="list.prod[5] == item.th004">{{item.date}}购买了{{item.qty}}个</div>
            </template>
          </div>
          <div class="list-item-mask" v-show="list.prod[5].indexOf('开发中') > -1"></div>
        </div>
      </template>
      <template v-else-if="tabCurrent == 1">
        <div v-if="zonghe.dataset.length > 0">
          <!-- <div class="title ub ub-ac" @click="flod(1)"><span class="ub ub-f1">离合器套装</span><van-icon name="arrow" class="ub" /></div> -->
          <div class="list-item ub ub-ver" v-for="(item,index) in zonghe.dataset">
            <div class="ub ub-ver ub-pra" @click="detail_1(item)">
              <div class="ub ub-f1">
                <template v-if="item.mb001.indexOf('开发中') == -1">
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh1" />
                  <div class="img-mask" @click="imgPreview(item.titlepicurl)" @click.stop>查看</div>
                </template>
                <div  class="ub ub-ver ub-f1">
                  <div class="ub pro-title">{{item.车型}}</div>
                  <div class="ub">品号：{{item.mb001}}</div>
                </div>
                <div class="ub ub-pc ub-ac">
                  <span class="erpcode-box">
                  {{item.mb001.substring(item.mb001.length - 3)}}
                  </span>
                </div>
              </div>
              <div class="ub">
                <em>发动机：{{item.参数一}}</em>&nbsp;&nbsp;
                <em>{{item.参数二}}</em>&nbsp;&nbsp;
                <em class="text-primary">价格：{{item.价格}}</em>
              </div>
              <div class="ub">分离轴承：{{item.轴承型号}}</div>
              <div class="ub">规格：{{item.产品规格}}</div>
              <template v-for="(list,index) in buyRecord">
                <div class="text-red" v-if="item.mb001 == list.th004">{{list.date}}购买了{{list.qty}}个</div>
              </template>
              <em class="ub ub-pe text-primary" @click="detail_1(item)">详情购买</em>
              <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1" @click.stop></div>
            </div>
          </div>
        </div>
        <div v-if="zonghe.dataset1.length > 0">
          <div class="list-item ub ub-ver" v-for="(item,index) in zonghe.dataset1">
            <div class="ub ub-ver ub-pra" @click="detail_1(item)">
              <div class="ub ub-f1">
                <template v-if="item.mb001.indexOf('开发中') == -1">
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh1" />
                  <div class="img-mask" @click="imgPreview(item.titlepicurl)" @click.stop>查看</div>
                </template>
                <div class="ub ub-f1">
                  <div class="ub pro-title" style="margin-bottom: 0.5rem;">{{item.车系}}{{item.车型}}&nbsp;{{item.排量}}</div>
                </div>
                <div class="ub ub-pc ub-ac">
                  <span class="erpcode-box">
                  {{item.mb001.substring(item.mb001.length - 3)}}
                  </span>
                </div>
              </div>
              <div>
                <em>品号：{{item.mb001}}</em>&nbsp;&nbsp;
                <em>发动机：{{item.发动机型号}}</em>&nbsp;&nbsp;
                <em class="text-primary">价格：{{item.价格}}</em>
              </div>
              <div class="" style="word-break: break-all;">OEM：{{item.oem}}</div>
              <div class="ub">规格：{{item.规格}}</div>
              <template v-for="(list,index) in buyRecord">
                <div class="text-red" v-if="item.mb001 == list.th004">{{list.date}}购买了{{list.qty}}个</div>
              </template>
              <em class="ub ub-pe text-primary" @click="detail_1(item)">详情购买</em>
              <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1" @click.stop></div>
            </div>
          </div>
        </div>
        <div v-if="zonghe.dataset2.length > 0">
          <div class="list-item ub ub-ver" v-for="(item,index) in zonghe.dataset2">
            <div class="ub ub-ver ub-pra" @click="detail_1(item)">
              <div class="ub ub-f1">
                <template v-if="item.mb001.indexOf('开发中') == -1">
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh1" />
                  <div class="img-mask" @click="imgPreview(item.titlepicurl)" @click.stop>查看</div>
                </template>
                <div class="ub ub-f1">
                  <div class="ub pro-title" style="margin-bottom: 0.5rem;">{{item.适用车型}}{{item.类型}}</div>
                </div>
                <div class="ub ub-pc ub-ac">
                  <span class="erpcode-box">{{item.产品编号}}</span>
                </div>
              </div>
              <div>
                <em>品号：{{item.mb001}}</em>&nbsp;&nbsp;
                <em>发动机：{{item.发动机型号}}</em>&nbsp;&nbsp;
                <em>总长度：{{item.线长}}</em>&nbsp;&nbsp;
                <em class="text-primary">价格：{{item.价格}}</em>&nbsp;&nbsp;
              </div>
              <div class="" style="word-break: break-all;">OEM：{{item.oem}}</div>
              <div class="">规格：{{item.名称}}</div>
              <template v-for="(list,index) in buyRecord">
                <div class="text-red" v-if="item.mb001 == list.th004">{{list.date}}购买了{{list.qty}}个</div>
              </template>
              <em class="ub ub-pe text-primary" @click="detail_1(item)">详情购买</em>
              <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1" @click.stop></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="tabCurrent == 2">
        <div class="list-item ub ub-ver ub-pra" v-for="(item,index) in dataPage">
          <template v-if="categoryName.indexOf('离合器') > -1">
            <div class="ub ub-ver ub-pra" @click="detail_1(item)">
              <div class="ub ub-f1">
                <template v-show="item.mb001.indexOf('开发中') == -1">
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh1" />
                  <div class="img-mask" @click="imgPreview(item.titlepicurl)"  @click.stop>查看</div>
                </template>
                <div  class="ub ub-ver ub-f1">
                  <div class="ub pro-title">{{item.车型}}</div>
                  <div class="ub">品号：{{item.mb001}}</div>
                </div>
                <div class="ub ub-pc ub-ac">
                  <span class="erpcode-box">
                  {{item.mb001.substring(item.mb001.length - 3)}}
                  </span>
                </div>
              </div>
            </div>
            <div class="ub">
              <em>发动机：{{item.参数一}}</em>&nbsp;&nbsp;
              <em>{{item.参数二}}</em>&nbsp;&nbsp;
              <em class="text-primary">价格：{{item.价格}}</em>
            </div>
            <div class="ub">分离轴承：{{item.轴承型号}}</div>
            <div class="ub">规格：{{item.产品规格}}</div>
            <template v-for="(list,index) in buyRecord">
              <div class="text-red" v-if="item.mb001 == list.th004">{{list.date}}购买了{{list.qty}}个</div>
            </template>
            <em class="ub ub-pe text-primary" @click="detail_1(item)">详情购买</em>
            <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1"></div>
          </template>
          <template v-if="categoryName.indexOf('点火线圈') > -1">
            <div class="ub ub-ver ub-pra" @click="detail_1(item)">
              <div class="ub">
                <template v-show="item.mb001.indexOf('开发中') == -1">
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh1" />
                <div class="img-mask" @click="imgPreview(item.titlepicurl)" @click.stop>查看</div>
                </template>
                <div class="ub ub-f1 ub-ver">
                  <div class="ub pro-title" style="margin-bottom: 0.5rem;">{{item.车系}}{{item.车型}}&nbsp;{{item.排量}}</div>
                </div>
                <div class="ub ub-pc ub-ac">
                  <span class="erpcode-box">
                  {{item.mb001.substring(item.mb001.length - 3)}}
                  </span>
                </div>
              </div>
              <div>
                <em>品号：{{item.mb001}}</em>&nbsp;&nbsp;
                <em>发动机：{{item.发动机型号}}</em>&nbsp;&nbsp;
                <em class="text-primary">价格：{{item.价格}}</em>
              </div>
              <div class="" style="word-break: break-all;margin-top: 0.5rem;">OEM：{{item.oem}}</div>
              <div class="ub">规格：{{item.规格}}</div>
              <template v-for="(list,index) in buyRecord">
                <div class="text-red" v-if="item.mb001 == list.th004">{{list.date}}购买了{{list.qty}}个</div>
              </template>
              <em class="ub ub-pe text-primary" @click="detail_1(item)">详情购买</em>
              <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1"></div>
            </div>
          </template>
          <template v-if="categoryName.indexOf('氧传感') > -1">
            <div class="ub ub-ver ub-pra" @click="detail_1(item)">
              <div class="ub">
                <template v-show="item.mb001.indexOf('开发中') == -1">
                  <img :src="imgUrl + item.titlepicurl" class="ub ub-img1 imgwh1" />
                <div class="img-mask" @click="imgPreview(item.titlepicurl)" @click.stop>查看</div>
                </template>
                <div class="ub ub-f1 ub-ver">
                  <div class="ub pro-title" style="margin-bottom: 0.5rem;">{{item.适用车型}}{{item.类型}}</div>
                  <div class="ub">品号：{{item.mb001}}</div>
                </div>
                <div class="ub ub-pc ub-ac">
                  <span class="erpcode-box">{{item.产品编号}}</span>
                </div>
              </div>
              <div>
                <em>发动机：{{item.发动机型号}}</em>&nbsp;&nbsp;
                <em>总长度：{{item.线长}}</em>&nbsp;&nbsp;
                <em class="text-primary">价格：{{item.价格}}</em>
              </div>
              <div class="" style="word-break: break-all;margin-top: 0.5rem;">OEM：{{item.oem}}</div>
              <div class="">规格：{{item.名称}}</div>
              <template v-for="(list,index) in buyRecord">
                <div class="text-primary" v-if="item.mb001 == list.th004">{{list.date}}购买了{{list.qty}}个</div>
              </template>
              <em class="ub ub-pe text-primary" @click="detail_1(item)">详情购买</em>
              <div class="list-item-mask" v-show="item.mb001.indexOf('开发中') > -1"></div>
            </div>
          </template>
        </div>
      </template>
      <div v-show="showEmpty" style="text-align: center;">暂无适配产品信息</div>
    </div>
    <!--主要内容结束-->

    <!-- 购物车-->
    <router-link :to="{path: '/proSearch/cart'}">
      <div class="fixed-btn"><van-icon name="cart-o" :badge="cartTotal" size="30" color="#ff0000" /></div>
    </router-link>

    <!-- 遮罩层-->
    <!-- <van-overlay :show="isMask" @click="isMask = false"> -->
      <div class="dialog" v-if="isMask">
          <header class="dialog-nav">
            <em class="iconfont" @click="closeDialog()">&#xe601;</em>
            <h1 class="dialog-title">VIN码识别</h1>
          </header>
          <div class="dialog-content">
            <crop
                style="width:100%;height: 24rem;"
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
            <!-- <div style="font-size: 1.4rem;">识别错了？请重新调整图片位置，然后<van-button type="warning" size="small" @click="getCutImg()" style="margin-left: 1.5rem;border-radius: 0.5rem;">开始识别</van-button></div> -->
            <div class="resize-desc">识别错了？请重新调整图片位置，然后<van-button class="button" type="warning" size="small" @click="getCutImg()">开始识别</van-button></div>
            <div class="dialog-grid">
              <div style="color: red;text-align: center;margin-bottom: 1rem;">请核查识别结果与图片数据是否一致</div>
              <van-password-input
                :value="keyWords"
                :mask="false"
                length="17"
              />
              <van-button class="dialog-btn" type="danger" size="small" block @click="searchByVin1()">查看解码消息</van-button>
            </div>
          </div>
      </div>
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
          {name:"全部",color:"#969799",size:"large",desc:""},
          {name:"离合器套装",color:"#969799",size:"large",desc:"离合器三件套"},
          {name:"氧传感器",color:"#969799",size:"large",desc:"前氧传感器,后氧传感器"},
          {name:"点火线圈",color:"#969799",size:"large",desc:"点火线圈"},
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
        placeholderTxt : "车型/发动机型号/OE号/编码",
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
        source : 0 //数据来源
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        this_.imgUrl = Consts.apiConfig.imgPath;
        document.title = this_.$route.query.title;
        this_.tabCurrent = this_.$route.query.type;

        this_.categoryName = this_.$route.query.categoryName;
        this_.chexingObj = this_.$route.query.obj != undefined ? this_.$route.query.obj : "";
        this_.showNavImg();
        this_.cateList.forEach((item,index) => {
          if(item.desc == this_.categoryName){
            item.color = "#0066CC";
          }
        })
        if(this_.tabCurrent == 0){ //vin码
          this_.keyWords = this_.$route.query.words;
          this_.vinCodePros();
        }else if(this_.tabCurrent == 1){ //综合查询
          this_.attrKey = this_.$route.query.words;
          this_.attrSearch();
        }else if(this_.tabCurrent == 2){ //品类查询
          this_.attrKey = this_.$route.query.words;
          this_.showPlaceHolderText();
          this_.carsPros();
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
          if(scrollTop+windowHeight==scrollHeight){
            //写后台加载数据的函数
            console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
            if(this_.tabCurrent == 0){
              for(let i=0;i<this_.pages;i++){
                if(this_.dataPage.length<this_.proList.length){
                  //console.log(this_.proList)
                  this_.dataPage.push(this_.proList[this_.dataPage.length]);
                }
              }
            }else if(this_.tabCurrent == 2){
              if(this.categoryName.indexOf('离合器') > -1){
                for(let i=0;i<this_.pages;i++){
                  if(this_.dataPage.length<this_.searchList.length){
                    //console.log(this_.proList)
                    this_.dataPage.push(this_.searchList[this_.dataPage.length]);
                  }
                }
              }else if(categoryName.indexOf('点火线圈') > -1){
                for(let i=0;i<this_.pages;i++){
                  if(this_.dataPage.length<this_.searchList.length){
                    //console.log(this_.proList)
                    this_.dataPage.push(this_.searchList[this_.dataPage.length]);
                  }
                }
              }else if(categoryName.indexOf('氧传感') > -1){
                for(let i=0;i<this_.pages;i++){
                  if(this_.dataPage.length<this_.searchList.length){
                    //console.log(this_.proList)
                    this_.dataPage.push(this_.searchList[this_.dataPage.length]);
                  }
                }
              }
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
        console.log(this_.categoryName+";vincode查询");
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url: this_.$apiUrl.api.VinCode+'?vincode=' + this_.keyWords + "&categoryName="+this_.categoryName + '&platfrom=PTYW',
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
                this_.showEmpty = true;
              }
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
        this_.bus.$emit('loading', true);
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
            categoryName : this_.categoryName != undefined ? this_.categoryName : ""  //分类品类
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
                this_.showEmpty = true;
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
        this_.dataPage = this_.proList.slice(0,this_.pages);

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
          }
        }
        this_.$api.post({
          url: this_.$apiUrl.api.ProductDetails,
          params: params_data,
          success: function (data) {
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
      },
      //按属性查询
      search(){
        if(this.attrKey != ""){
          if(this.attrKey.length >= 2){
            if(this.categoryName != ""){
              this.checkedInput(1);
              this.searchList = [];
              this.dataPage = [];
              if(this.categoryName.indexOf('离合器') > -1){
                this.getLiheqi();
              }else if(this.categoryName.indexOf('点火线圈') > -1){
                this.getDhxq();
              }else if(this.categoryName.indexOf('氧传感') > -1){
                this.getYchuan();
              }
            }else{
              this.checkedInput(1);
              this.zonghe = [];
              this.dataPage = [];
              this.attrSearch();
            }
          }else{
            this.bus.$emit('tipShow', "至少输入2位");
          }
        }else{
          this.bus.$emit('tipShow', "请输入查询条件");
        }
      },
      //属性-综合查询
      attrSearch(){
        console.log("综合查询");
        let this_ = this;
        this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this_.bus.$emit('loading', true)
        this_.$api.get({
          url: this_.$apiUrl.api.Multiple + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.attrKey + '&type=&car=&brand=' + this_.userInfo.dataset[0].mr003 + '&openid='+sessionStorage.getItem('openid'),
          params: {},
          success: function (data) {
            console.log("-------综合查询---------");
            console.log(data);
            this_.tabCurrent = 1;
            this_.searchList = data;
            //this_.zonghe = data;
            //this_.dataPage = [];
            //this_.dataPage = data.dataset.slice(0,this_.pages);
            let eprcodes = data.dataset.map(item => item.mb001).join(',');
            this_.getBuyRecord(eprcodes);
            this_.showEmpty = false;
          	this_.bus.$emit('loading', false);
          }
        });
      },
      //属性-离合器
      getLiheqi(){
        let this_ = this;
        console.log("离合器查询");
        this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this_.bus.$emit('loading', true)
        this_.$api.get({
          url: this_.$apiUrl.api.GetLiheqi + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.attrKey + '&type=&car=&brand=' + this_.userInfo.dataset[0].mr003 + '&openid='+sessionStorage.getItem('openid'),
          params: {},
          success: function (data) {
            console.log(data);
            this_.tabCurrent = 2;
            if(data.length != 0){
              this_.searchList = data;
              this_.dataPage = this_.searchList.slice(0,this_.pages);
              this_.getAttrMb001(data);
            }
          	this_.bus.$emit('loading', false);
          }
        });
      },
      //属性-点火线圈
      getDhxq(){
        let this_ = this;
        console.log("点火线圈查询");
        this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this_.bus.$emit('loading', true);
        this_.$api.get({
          url: this_.$apiUrl.api.GetDhxq + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.attrKey + '&type=&car=&brand=' + this_.userInfo.dataset[0].mr003 + '&openid='+sessionStorage.getItem('openid'),
          params: {},
          success: function (data) {
            console.log(data);
            this_.tabCurrent = 2;
            if(data.length != 0){
              this_.searchList = data;
              this_.dataPage = this_.searchList.slice(0,this_.pages);
              this_.getAttrMb001(data);
            }
          	this_.bus.$emit('loading', false);

          }
        });
      },
      //属性-氧传感
      getYchuan(){
        let this_ = this;
        console.log("氧传感查询");
        this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this_.bus.$emit('loading', true);
        this_.$api.get({
          url: this_.$apiUrl.api.GetYchuan + '?mb001=' + this_.$route.query.mb001 + '&tag=' + this_.attrKey + '&type=&car=&brand=' + this_.userInfo.dataset[0].mr003 + '&openid='+sessionStorage.getItem('openid'),
          params: {},
          success: function (data) {
            console.log(data);
            this_.tabCurrent = 2;
            if(data.length != 0){
              this_.searchList = data;
              this_.dataPage = this_.searchList.slice(0,this_.pages);
              this_.getAttrMb001(data);
            }
          	this_.bus.$emit('loading', false);

          }
        });
      },
      //属性购买记录
      getAttrMb001(res){
        let eprcodes = res.map(item => item.mb001).join(',');
        this.getBuyRecord(eprcodes,2);
      },
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
        this_.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url: this_.$apiUrl.api.RecentSale,
          params: {
            dpt : 'PTYW',
            mb001 : mb001s,
            ma001 : this_.userInfo.dataset[0].ma001
          },
          success: function (data) {
            //console.log("购买记录");
            console.log(data);
            if(data.length != 0){
              this_.buyRecord = data;
            }
          	this_.bus.$emit('loading', false);
          }
        });
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

        if(size > 5242880){
            alert('请选择5M以内的图片！');
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
          params: {
            imgcode : imgcode,
            openid : sessionStorage.getItem('openid'),
			platfrom : 'PTYW'
          },
          success: function (data) {
            console.log(data);
            if(data.State){
              this_.keyWords = data.centent;
              if(type == 1){
                this_.isMask = !this_.isMask;
              }
            }else{
              this_.bus.$emit('tipShow', data.centent);
            }
            this_.bus.$emit('loading', false);
          }
        });
      },
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
        if(this.keyWords != ""){
          this.checkedInput(0);
          this.proList = [];
          this.vinCodePros();
        }else{
          this.bus.$emit('tipShow', "请输入查询条件");
        }

      },
      searchByVin1(){
        this.checkedInput(0);
        this.closeDialog();
        this.proList = [];
        this.vinCodePros();
      },
      //查询来源
      checkedInput(e){
        this.source = e;
        if(e == 0){
          document.getElementById('vin').style.color = "#0066CC";
          document.getElementById('attr').style.color = "#CCCCCC";
        }else if(e == 1){
          document.getElementById('attr').style.color = "#0066CC";
          document.getElementById('vin').style.color = "#CCCCCC";
        }

      },
      //产品详情
      detail(list){
        this.$router.push({path:'/proSearch/detail', query:{obj:list.params,mb001:list.prod[5],title:this.$route.query.title}});
      },
      //属性-详情
      detail_1(list){
        this.$router.push({path:'/proSearch/detail', query:{obj:"",mb001:list.mb001,title:this.$route.query.title}});
      },
      //搜索框placeholderText
      showPlaceHolderText(){
        if(this.categoryName.indexOf('离合器') > -1){
          this.placeholderTxt = "车型/发动机型号/编码";
        }else{
          this.placeholderTxt = "车型/发动机型号/OE号/编码";
        }
      },
      //品类查询
      tapTag(e,index){
        for(let i = 0; i < this.cateList.length; i++){
          if(i == index){
            this.cateList[i].color = "#0066CC";
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
              this.zonghe = [];
              this.dataPage = [];
              if(index == 0){
                this.attrSearch();
              }else if(index == 1){
                this.getLiheqi();
              }else if(index == 2){
                this.getYchuan();
              }else if(index == 3){
                this.getDhxq();
              }
              //this.dataPage = [];
            }
          }else{
            this.cateList[i].color = "#969799";
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
  .imgwh{
   /* width: 10rem;
    height: 10rem; */
    width: 5rem;
    height: 5rem;
    margin-right: 1rem;
  }
  .imgwh1{
    /* width: 7rem;
    height: 7rem; */
    width: 5rem;
    height: 5rem;
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
