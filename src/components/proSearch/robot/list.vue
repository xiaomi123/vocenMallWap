<template>
  <div class="proSearch_container">
    <div class="vincode-title">车架号：{{keyWords}}</div>
    <!-- 根据vincode显示车型信息 -->
    <div class="ub ub-ac models-box" v-if="showModelInfoByVinCode">
      <div class="ub ub-ver ub-f1">
        <div style="margin-bottom: 0.5rem;">{{modelsInfo.Manufacturers}}&nbsp;&nbsp;{{modelsInfo.Brand}}&nbsp;&nbsp;{{modelsInfo.Models}}&nbsp;&nbsp;{{modelsInfo.ChassisCode}}</div>
        <div>{{modelsInfo.ProducedYear}}&nbsp;&nbsp;[{{modelsInfo.ListingYear}}-{{modelsInfo.IdlingYear}}]&nbsp;&nbsp;
        {{modelsInfo.Displacement}}{{modelsInfo.Induction == '自然吸气' ? 'L' : 'T'}}&nbsp;&nbsp;{{modelsInfo.EngineModel}}&nbsp;&nbsp;{{modelsInfo.GearNumber}}{{modelsInfo.TransmissionType == '手动' ? 'MT' : 'AT'}}</div>
      </div>
      <div class="ub ub-ac" v-show="changeModelIcon" @click="showModels = true" style="color:red">切换车型<van-icon class="ub" name="arrow-down" size="1.5rem" style="margin-left: 0.5rem;color:red" /></div>
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
    <!-- 品类-->
    <div class="cate-box">
      <div>
        <template v-for="(item,index) in cateList" >
          <van-tag class="umar-r" style="margin-bottom: 1rem;" round :size="item.size" :color="item.color" :text-color="item.txtColor" @click="tapTag(item,index)">{{item.name}}</van-tag>
        </template>
      </div>
    </div>
    <!--产品列表-->
    <template v-if="proList.length != 0">
      <div class="list-item ub ub-ver ub-pra" v-for="(list,index) in proList">
        <div class="ub">
         <template v-if="list.prod[5].indexOf('开发中') == -1">
           <div class="ub ub-pra img-box" @click="imgPreview(list.titlepicurl)">
             <img :src="imgUrl+list.titlepicurl" class="ub ub-img1 imgwh" />
             <img src="../../../assets/images/lhq/big.png" class="icon-big" />
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
        <div class="ub text-primary ub-pe" @click="detail(list)">详情&nbsp;&nbsp;</div>
        <div class="list-item-mask" v-show="list.prod[5].indexOf('开发中') > -1"></div>
      </div>
    </template>
    <div v-else style="text-align: center;background-color: #EEEEEE; padding-top: 2rem;">{{showEmptyText}}</div>
    <!--主要内容结束-->

  </div>
</template>

<script>
  import Consts from '../../../api/const.js'
  import { ImagePreview } from 'vant'
  export default {
    name: 'index',
    data() {
      return {
        cateList : [
          {name:"全部",color:"#ffffff",txtColor:"#858585",size:"large",desc:""},
          {name:"离合器套装",color:"#ffffff",txtColor:"#858585",size:"large",desc:"离合器三件套"},
          {name:"氧传感器",color:"#ffffff",txtColor:"#858585",size:"large",desc:"前氧传感器,后氧传感器"},
          {name:"点火线圈",color:"#ffffff",txtColor:"#858585",size:"large",desc:"点火线圈"},
          {name:"燃油泵总成",color:"#ffffff",txtColor:"#858585",size:"large",desc:"燃油泵"},
        ],
        keyWords : "",
        categoryName : "" ,//分类
        imgUrl : '',
        proList : [], //产品列表
        chexingObj : "", //车型查询参数
        showEmptyText : '暂无适配产品信息',
        modelsInfo : {},
        modelsInfoList : [], //车型列表
        showModels : false,
        changeModelIcon : false,
        showModelInfoByVinCode : false,
        pages:20,
        p : 1,
        pageRows : 20,
        history : [] //历史记录
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        this_.imgUrl = Consts.apiConfig.imgPath;
        // if(!this_.$utils.check.isEmpty(sessionStorage.getItem('history'))){
        //   this_.history = JSON.parse(sessionStorage.getItem('history'));
        //   sessionStorage.clear();
        //   document.title = this_.history[1] == 4 ? '弘途耐用' : '江陵耐用';
        //   this_.keyWords = this_.history[0];
        //   this_.categoryName = this_.history[2];
        //   this_.modelsInfo = this_.history[3];
        //   this_.modelsInfoList = this_.history[4];
        //   if(this_.modelsInfoList.length > 1){
        //     this_.changeModelIcon = true;
        //   }else{
        //     this_.changeModelIcon = false;
        //   }
        //   this_.showModelInfoByVinCode = true;
        //   this_.getProductByModels();
        // }else{
        //   document.title = this_.$route.query.type == 4 ? '弘途耐用' : '江陵耐用';
        //   this_.keyWords = this_.$route.query.vin;
        //   this_.history.push(this_.keyWords,this_.$route.query.type,this_.categoryName);
        //   this_.getModels(); //获取车型
        //   // this_.keyWords = data.Additional.Vin;//"LVTDH12A7AB091147";
        // }

        //关联tab切换
        this_.cateList.forEach((item,index) => {
          if(item.desc == this_.categoryName){
            item.color = "#0066CC";
            item.txtColor = "#ffffff";
          }
        })
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
            this_.p++;
            this_.getProductByModels();  //vin码
          }
        }
      });
    },
    watch:{
      '$route' (to,from){
        if(this.$route.path == '/proSearch/robot/detail'){
          this.routerAlive = true;
        }else{
          this.routerAlive = false;
        }
      }
    },
    activated(){
      if(!this.$route.meta.isUseCache){
        document.title = this.$route.query.type == 4 ? '弘途耐用' : '江陵耐用';
        this.keyWords = this.$route.query.vin;
        this.getModels(); //获取车型
      }
    },
    methods: {
      //获取车型
      getModels(){
        let this_ = this;
        this_.$api.post({
          url: this_.$apiUrl.api.VinCode+'?vincode=' + this_.keyWords + "&categoryName=&pageindex="+this_.p+"&pagesize="+this_.pageRows,
          params: {},
          success: function (data) {
            console.log(data.centent.tmparr);
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
              this_.getProductByModels();
            }else{
              this_.bus.$emit('tipShow', data.Message);
            }
          }
        });
      },
      //获取产品缩略图
      getPorductPics(res){
        let this_ = this;
        let a = this_.$route.query.mb001.split(''); //[1,2];//

        res.forEach(item => {
          let str = item.prod[5].split('');
          if(item.prod[1] == '离合器三件套' && this_.$route.query.type == 4){//宏途
            str[0] = 1; str[1] = 2; str[2] = 8; str[3] = 8;
            item.prod[1] = "离合器套装";
          }else if(item.prod[1] == '离合器三件套' && this_.$route.query.type == 3){//江陵
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
        this_.$api.post({
          url: this_.$apiUrl.api.ProductDetails,
          params: {
            mb001 : eprcodes,
            ma017 : "",
            ma075 : "",
            c_id : "",
            dpt : "",
            c_ma001 : ""
          },
          success: function (data) {
            console.log('--------------缩略图--------------------');
            //console.log(data);
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
      //产品详情
      detail(list){
        //console.log(this.modelsInfo);
        this.history.push(this.modelsInfo);
        this.history.push(this.modelsInfoList);
        //console.log(this.history);
        sessionStorage.setItem('history',JSON.stringify(this.history));
        this.$router.push({path:'/proSearch/robot/detail', query:{mb001:list.prod[5],type:this.$route.query.type}});

      },

      //品类查询
      tapTag(e,index){
        this.p = 1;
        this.proList = [];
        for(let i = 0; i < this.cateList.length; i++){
          if(i == index){
            this.cateList[i].color = "#0066CC";
            this.cateList[i].txtColor = "#ffffff";
            this.categoryName = this.cateList[i].desc;
            this.history[2] = this.cateList[i].desc;
            this.getProductByModels();
          }else{
            this.cateList[i].color = "#ffffff";
            this.cateList[i].txtColor = "#858585";
          }
        }

      },
      //预览图片
      imgPreview(e){
        ImagePreview([''+this.imgUrl + e+'']);
      },
      //选择车型
      changeModels(item){
        this.modelsInfo = item;
        this.showModels = false;
        this.p = 1;
        this.proList = [];
        this.history[3] = this.modelsInfo;
        this.getProductByModels();
      },
      //根据车型查询对应的产品
      getProductByModels(){
        let this_ = this;
        //console.log(this_.modelsInfo.LevelId);
        if(this_.p == 1){this_.bus.$emit('loading', true);}
        this_.$api.get({
          url: this_.$apiUrl.api.GetProductsByLevelId+'?levelId=' + this_.modelsInfo.LevelId + '&categoryName='+this_.categoryName+'&pageindex='+this_.p+'&pagesize='+this_.pageRows,
          params: {},
          success: function (data) {
            console.log('产品列表');
            console.log(data);
            if(data.State){
              if(data.centent != "" && data.centent != null){
                let result = JSON.parse(data.centent);
                //console.log(result);
                this_.getPorductPics(result);
              }
            }else{
              this_.bus.$emit('tipShow', data.Message);
            }
            this_.bus.$emit('loading', false);
          }
        });
      },
    }
  }
</script>
<style scoped>
  @import "../../../assets/css/robot.css";
</style>
