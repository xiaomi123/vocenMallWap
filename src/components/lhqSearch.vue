<template>
  <div class="proSearch_container">
    <div class="login-btn" v-show="isLogin">
      <router-link :to="{path:'/wxlogin', query:{target:'search',openid:this.$route.query.openid,type:this.$route.query.type}}" style="color: #0057ED;">立即登录>></router-link>
    </div>
    <div class="login-btn" v-show="isOut">
      <a href="javascript:void(0)" style="color: #0057ED;" @click="logOut()">退出登陆&gt;&gt;</a>
    </div>

    <div class="text-info" v-show="showText">
      <span class="text">{{showTextDesc}}</span>
    </div>
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
            <!-- <img class="icon-scanner" src="../assets/images/common/scanner.png" @click="show = true" /> -->
            <img class="icon-scanner" src="../assets/images/common/scanner.png" @click="btnShow()" />
            <span @click="winProduct(0)">查询</span>
          </p>
          <label style="color: #666666;">VIN码：如LFV3B28R1C3080426</label>
      </div>
      <div class="clearfix tag-item">
        <p>
          <input type="text" placeholder="车型/发动机型号/OE号/后三位编码" v-model="attrKey" />
          <span @click="winProduct(1)">查询</span>
        </p>
      </div>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"></van-action-sheet>
    <!--查询录入框内容结束-->

    <!--主要内容开始-->
    <div class="proSearch_main">
      <h2 class="clearfix"><i class="iconfont">&#xe619;</i>耐用品系列<span>点击下方图标按品类查询<i class="iconfont">&#xe7d3;</i></span></h2>
      <ul class="proSearch_list clearfix" v-if="isShow">
        <li class='lhq' @click="openWin(0)"><div>离合器套装</div></li>
        <li class='ycg' @click="openWin(2)"><div>氧传感器</div></li>
        <li class='dhxq' @click="openWin(1)"><div>点火线圈</div></li>
        <li class='qyb'>
          <p>燃油泵总成<br>正在开发中...</p>
          <router-link to="/proSearch/lhqList">燃油泵总成</router-link>
        </li>
        <li class='shuibeng'>
          <p>水泵<br>正在开发中...</p>
          <router-link to="/proSearch/lhqList">水泵</router-link>
        </li>
        <li class='chouzheng'>
          <p>轴承<br>正在开发中...</p>
          <router-link to="/proSearch/lhqList">轴承</router-link>
        </li>
      </ul>
      <p class="proSearch_tip">
        <i class="iconfont">&#xe604;</i></br>
        更多产品开发中......
      </p>
    </div>
    <!--主要内容结束-->

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
            <div class="resize-desc">识别错了？请重新调整图片位置，然后<van-button class="button" type="warning" size="small" @click="getCutImg">开始识别</van-button></div>
            <div class="dialog-grid">
              <div style="color: red;text-align: center;margin-bottom: 1rem;font-size: 0.875rem;">请核查识别结果与图片数据是否一致</div>
              <input class="input-view" type="text" maxlength="17" v-model="keyWords" placeholder="请输入VIN码" />
              <van-button class="dialog-btn" type="danger" size="small" block @click="jiema()">查看解码消息</van-button>
            </div>
          </div>
      </div> -->
    <!-- </van-overlay> -->
    <!--底部footer内容开始-->
  	<sfooter-view v-if="isShowFooter"></sfooter-view>
  	<!--底部footer内容结束-->
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
        //isMask : false,
        //showKeyboard: true,
        // option:{
        //   img : "https://img.zcool.cn/community/01bc0f59c9a9b0a8012053f85f066c.jpg",
        //   zuobiao: [50, 50, 20, 0],
        //   color:'#f14864',
        //   crop:{},
        //   shape: 'rect', //截图形状
        //   rotation: 0
        // },
        keyWords : "",
        attrKey : "",
        isLogin : false, //登录按钮
        showText : false ,//提示信息
        showTextDesc : "" ,//提示信息描述
        cateListText : [], //产品分类
        isShowFooter : false,
        mb001 : "",
        isShow : false,
        isOut:false,//退出按钮
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        let this_ = this;
        //document.title = this_.$route.query.title;
        if(!this_.$utils.check.isEmpty(this_.$route.query.type)){
          sessionStorage.setItem('brandType',this_.$route.query.type);
          if(this_.$route.query.type == '3'){
            sessionStorage.setItem('pageTitle',"江陵耐用查询系统");
            document.title = "江陵耐用查询系统";
          }else if(this_.$route.query.type == '4'){
            sessionStorage.setItem('pageTitle',"弘途耐用查询系统");
            document.title = "弘途耐用查询系统";
          }
        }else{
          document.title = sessionStorage.getItem('pageTitle');
        }

        this_.loadSwiper();
        sessionStorage.removeItem('history');
        if(sessionStorage.getItem('epcrode') != null){
          this_.mb001 = sessionStorage.getItem('epcrode');
        }else{
          this_.mb001 = this_.$route.query.mb001;
          sessionStorage.setItem('epcrode',this_.$route.query.mb001);
        }

        this_.auth(); //获取用户信息
        this_.category(); //产品分类

        if(!this_.$utils.check.isEmpty(sessionStorage.getItem('vincode'))){
          this.keyWords = sessionStorage.getItem('vincode');
          sessionStorage.removeItem('vincode');
          this.$router.push({path:'/proSearch/products', query: {words:this_.keyWords,type:0,categoryName:"",mb001:this_.mb001}});
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
      auth(){
        let this_ = this;
        if (this_.$utils.check.isEmpty(sessionStorage.getItem("token"))) {
          if(this_.$utils.check.isEmpty(this_.$route.query.openid)){
            //this_.bus.$emit('tipShow', "未获取到用户信息");
            this_.isLogin = true;
            this_.isShowFooter = false;

            this_.showTextDesc = "本系统为专业查询系统，为授权客户提供专属服务。您当前为游客身份，需登陆后方可查询";
            this_.showText = true;
            //this.$router.push({path:'/wxlogin', query: {target:'search',openid:this.$route.query.openid,type:this.$route.query.type}});

          }else{
            sessionStorage.setItem('openid',this_.$route.query.openid);
            this_.weChartLogin();
          }
        }else{
          //已登陆

          //判断是否含有弘途和江陵品牌
          if(this_.$utils.check.isEmpty(sessionStorage.getItem("userinfo"))){
            this_.showTextDesc = "您已登录，但未代理该品牌。如需更多查询，请与您的专属客服联系。";
            if(sessionStorage.getItem('brandType') == 3){
              this_.showTextDesc = "您已登录，但未代理耐用件。如需更多查询，请与您的专属客服联系。";
            }
            this_.showText = true;
            this_.isShowFooter = true;
            this_.isOut = true;
          }else{
            let userdata = JSON.parse(sessionStorage.getItem("userinfo"));
            this_.showText = true;
            if(sessionStorage.getItem('brandType') == 3){
              this_.showTextDesc = "欢迎江陵耐用品牌授权代理商“"+ userdata.dataset[0].ma002 +"”查询下单！";
            }else if(sessionStorage.getItem('brandType') == 4){
              this_.showTextDesc = "欢迎弘途品牌授权代理商“"+ userdata.dataset[0].ma002 +"”查询下单！";
            }

          }

          this_.isShowFooter = !this_.isShowFooter;
        }
        // if(this_.$utils.check.isEmpty(sessionStorage.getItem("token"))){
        //   if (this_.$utils.check.isEmpty(this_.$route.query.openid)) {
        //     this_.bus.$emit('tipShow', "未获取到用户信息");
        //   }else{
        //     this_.weChartLogin();
        //   }
        // }

      },
      loadSwiper(){
        let this_ = this;
        if(sessionStorage.getItem('brandType') == 3){
          this_.swiperList = [{
            id: '002',
            imgUrl: require("../assets/images/lhq/img_proSearch_banner01.jpg")
          },{
            id: '003',
            imgUrl: require("../assets/images/lhq/img_proSearch_banner02.jpg")
          },{
            id: '004',
            imgUrl: require("../assets/images/lhq/img_proSearch_banner03.jpg")
          }]
        }else if(sessionStorage.getItem('brandType') == 4){
          this_.swiperList = [{
            id: '002',
            imgUrl: require("../assets/images/lhq/h_img_proSearch_banner01.jpg")
          },{
            id: '003',
            imgUrl: require("../assets/images/lhq/h_img_proSearch_banner02.jpg")
          },{
            id: '004',
            imgUrl: require("../assets/images/lhq/h_img_proSearch_banner03.jpg")
          }]
        }
      },
      category(){
        let this_ = this;
        console.log("1111111111")
        this_.$api.post({
          url : this_.$apiUrl.api.ProductCategoryByUsr,
          params :{},
          success : function(res){
            console.log(res);
            if(res.code == 200){
              let a = res.data[2].categoryName+","+res.data[3].categoryName;
              this_.cateListText = [res.data[4].categoryName,res.data[1].categoryName,a];
              this_.isShow = true;
            }
          }
        })
      },
      //微信登录
      weChartLogin: function() {
        let this_ = this;
        this_.$api.get({
          url: this_.$apiUrl.api.WeChatLogin + '?openid=' + this_.$route.query.openid + '&type=' + this_.$route.query.type,
          params: {},
          success: function(data) {
            console.log(data);
            this_.isShowFooter = !this_.isShowFooter;
            if (data.State) {
              let dataset2 = data.centent.userinfo.dataset2;
              sessionStorage.setItem("token", data.centent.Token); //存入token
              let userdata = {
                dataset: data.centent.userinfo.dataset,
                dataset1: data.centent.userinfo.dataset,
                //dataset1: (data.centent.userinfo.dataset1).concat(dataset2)
              };
              //判断品牌是否存在
              dataset2.forEach((item,index) => {
                if(this_.$route.query.type == 4){
                  if(item.mr003 == "弘途耐用"){
                    userdata.dataset[0].dpt = item.dpt;
                    userdata.dataset[0].kf = item.kf;
                    userdata.dataset[0].ma001 = item.ma001;
                    userdata.dataset[0].ma002 = item.ma002;
                    userdata.dataset[0].ma007 = item.ma007;
                    userdata.dataset[0].ma015 = item.ma015;
                    userdata.dataset[0].ma016 = item.ma016;
                    userdata.dataset[0].ma017 = item.ma017;
                    userdata.dataset[0].ma027 = item.ma027;
                    userdata.dataset[0].ma075 = item.ma075;
                    userdata.dataset[0].ma085 = item.ma085;
                    userdata.dataset[0].mr003 = item.mr003;
                    userdata.dataset[0].yw = item.yw;

                  }
                }else if(this_.$route.query.type == 3){
                  if(item.mr003 == "江陵耐用"){
                    userdata.dataset[0].dpt = item.dpt;
                    userdata.dataset[0].kf = item.kf;
                    userdata.dataset[0].ma001 = item.ma001;
                    userdata.dataset[0].ma002 = item.ma002;
                    userdata.dataset[0].ma007 = item.ma007;
                    userdata.dataset[0].ma015 = item.ma015;
                    userdata.dataset[0].ma016 = item.ma016;
                    userdata.dataset[0].ma017 = item.ma017;
                    userdata.dataset[0].ma027 = item.ma027;
                    userdata.dataset[0].ma075 = item.ma075;
                    userdata.dataset[0].ma085 = item.ma085;
                    userdata.dataset[0].mr003 = item.mr003;
                    userdata.dataset[0].yw = item.yw;
                  }
                }
              });
              if(userdata.dataset[0].mr003.indexOf('弘途耐用') > -1 || userdata.dataset[0].mr003.indexOf('江陵耐用') > -1){

                sessionStorage.setItem("userinfo", JSON.stringify(userdata)); //存入userinfo
                this_.showText = true;
                if(this_.$route.query.type == 3){
                  this_.showTextDesc = "欢迎江陵耐用品牌授权代理商“"+ userdata.dataset[0].ma002 +"”查询下单！";
                }else if(this_.$route.query.type == 4){
                  this_.showTextDesc = "欢迎弘途品牌授权代理商“"+ userdata.dataset[0].ma002 +"”查询下单！";
                }

              }else{
                this_.showTextDesc = "您已登录，但未代理该品牌。如需更多查询，请与您的专属客服联系。";
                if(this_.$route.query.type == 3){
                  this_.showTextDesc = "您已登录，但未代理耐用件。如需更多查询，请与您的专属客服联系。";
                }
                this_.showText = true;
              }
            } else{
              this_.isLogin = true;
              this_.isShowFooter = false;

              this_.showTextDesc = "本系统为专业查询系统，为授权客户提供专属服务。您当前为游客身份，需登陆后方可查询";
              this_.showText = true;
              //this.$router.push({path:'/wxlogin', query: {target:'search',openid:this.$route.query.openid,type:this.$route.query.type}});

            }
          }
        });
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
            //this_.option.img = e.target.result;
            //this_.getVinCode(imgcode,1);
            sessionStorage.setItem('vinImg',e.target.result);
            this_.$router.push({path:'/proSearch/products1'});
            //this.$router.push({path:'/proSearch/products1', query: {img:e.target.result}});
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
      // closeDialog(){
      //   this.isMask = !this.isMask;
      // },
      // imgLoaded(){
      //     console.log('图片加载完成~');
      // },
      //重新识别
      // getCutImg(){
      //   this.option.crop.getImage('Base64', 'image/jpg', 2).then(imageData => {
      //     if (Object.prototype.toString.call(imageData) === '[object Blob]') {
      //          imageData =  window.URL.createObjectURL(imageData)
      //      }
      //      console.log("剪裁");
      //      console.log(imageData);
      //   })
      // },
      //查询
      winProduct(e){
        if(this.isLogin){
          //this.bus.$emit('tipShow', "请先登陆后，再进行查询");
          this.$router.push({path:'/wxlogin', query: {target:'search',openid:this.$route.query.openid,type:this.$route.query.type}});
          return false;
        }
        if(e == 0 && this.keyWords != ""){
          this.$router.push({path:'/proSearch/products', query: {words:this.keyWords,type:e,categoryName:"",mb001:this.mb001}});
        }else if(e == 1 && this.attrKey != ""){
          if(this.attrKey.length >= 2){
            this.$router.push({path:'/proSearch/products', query: {words:this.attrKey,type:e,categoryName:"",mb001:this.mb001}});
            // this.$router.push({path:'/proSearch/products1', query: {words:this.attrKey,type:e,categoryName:"",mb001:this.mb001}});
          }else{
            this.bus.$emit('tipShow', "至少输入2位");
          }
        }else{
          this.bus.$emit('tipShow', "请输入查询条件");
        }
      },
      //查看解码
      // jiema(){
      //   this.$router.push({path:'/proSearch/products', query: {words:this.keyWords,type:0,categoryName:"",mb001:this.mb001}});
      // },
      //点击产品类别
      openWin(e){
        if(this.isLogin){
          //this.bus.$emit('tipShow', "请先登陆后，再进行查询");
          this.$router.push({path:'/wxlogin', query: {target:'search',openid:this.$route.query.openid,type:this.$route.query.type}});
          return false;
        }
        this.$router.push({path:'/proSearch/products', query: {words:"",type:0,categoryName:this.cateListText[e],mb001:this.mb001}});
        // this.$router.push({path:'/proSearch/products', query: {words:"",type:2,categoryName:this.cateListText[e],mb001:this.mb001}});
      },
      //vin点击小摄像头事件
      btnShow(){
        if(this.isLogin){
          //this.bus.$emit('tipShow', "请先登陆后，再进行查询");
          this.$router.push({path:'/wxlogin', query: {target:'search',openid:this.$route.query.openid,type:this.$route.query.type}});
          return false;
        }
        this.show = true;
      },
      //退出登陆
      logOut(){
        let this_ = this;
        this_.$api.get({
          url: this_.$apiUrl.api.LoginOut + '?openid=' + sessionStorage.getItem('openid'),
          params: {},
          success: function (data) {
            if(data.State){
              //清空
              sessionStorage.setItem("token", ""); //清空token
              sessionStorage.setItem("userinfo", ""); //清空userinfo
              let brandType = 3;
              if(!this_.$utils.check.isEmpty(sessionStorage.getItem('brandType'))){
                brandType = sessionStorage.getItem('brandType')
              }
              this_.$router.push('/wxlogin?target=search&openid='+ sessionStorage.getItem('openid') +'&type='+brandType);
            }
        
          }
        });
      }
    }
  }
</script>
<style scoped>
  @import "../assets/css/lhqSearch.css";
  .text-info .text{
    font-size:1.3rem;
    color:#cb5f37;
  }
</style>
