<template>
  <div class="dialog">
    <header class="dialog-nav">
      <em class="iconfont" @click="back()">&#xe601;</em>
      <h1 class="dialog-title">VIN码识别</h1>
    </header>
    <div class="dialog-content">
      <crop
          style="width:100%;height: 26rem;"
          v-model="crop"
          :position="option"
          :defaultImgUrl="img"
          :angle="15"
          :color=color
          :shape=shape
          @imgLoaded="imgLoaded"
          :revokeBtn="true"
          :penBtn="true"
          :rotation="rotation"
        >
        </crop>
      <div class="resize-desc">识别错了？请调整图片位置或圈定VIN码，然后<van-button class="button" type="warning" size="small" @click="getImageData">重新识别</van-button></div>
      <div class="dialog-grid">
        <div style="color: red;text-align: center;margin-bottom: 1rem;font-size: 0.875rem;">{{tipText}}</div>
        <input class="input-view" type="text" maxlength="17" v-model="code" placeholder="请输入VIN码" />
        <van-button class="dialog-btn" type="danger" size="small" block @click="jiema()">查看解码消息</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { crop } from "vue-cropblg"

  export default {
    components: {
      crop
    },
    name: '',
    data() {
      return {
        img : "http://img.zcool.cn/community/01bc0f59c9a9b0a8012053f85f066c.jpg",
        option: [50, 50, 20, 0],
        color:'#f14864',
        crop:{},
        imageData: null,
        shape: 'rect',
        rotation: 0,
        code : "",
        tipText : "请核查识别结果与图片数据是否一致"
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        document.title = sessionStorage.getItem('pageTitle');
        this.getVinCode();
      });
    },
    created: function(){
        let this_ = this;
        this_.img = sessionStorage.getItem('vinImg');
        this_.imageData = sessionStorage.getItem('vinImg');
    },
    methods: {
      imgLoaded(){
        console.log('图片加载完成~')
      },
      getVinCode(){
        let this_ = this;
        this_.bus.$emit('loading', true);
        this_.$api.post({
          url: this_.$apiUrl.api.VinOCR,
          params: {
            imgcode : this_.imageData.split(',')[1],
            openid : sessionStorage.getItem('openid'),
			platfrom : 'PTYW'
          },
          success: function (data) {
            console.log(data);
            if(data.State){
              this_.code = data.centent;
            }else{
              //this_.bus.$emit('tipShow', data.centent);
              this_.tipText = "请重新识别或者手工输入";
              this_.code = "";
            }
            this_.bus.$emit('loading', false);
          }
        });
      },
      //查看解码
      jiema(){
        if(this.code != ""){
          sessionStorage.setItem('vincode',this.code);
          this.back();
        }else{
          this.bus.$emit('tipShow', '请输入VIN码');
        }

      },
      getImageData() {
         this.crop.getImage('Base64', 'image/jpg', 2).then(imageData => {
           if (Object.prototype.toString.call(imageData) === '[object Blob]') {
                imageData =  window.URL.createObjectURL(imageData)
            }
            this.imageData = imageData;
            this.getVinCode();
         })
      },
      back(){
        this.$router.go(-1)// 返回
      },
    }
  }
</script>
<style scoped>
  @import "../../assets/css/lhqSearch.css";
.dialog{
  background-color: #FFFFFF;
  position:inherit;
  height: 100%;
}
</style>
