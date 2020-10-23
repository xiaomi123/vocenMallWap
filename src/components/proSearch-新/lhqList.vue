<template>
  <div class="lhq_container">
  	<!--主要内容开始-->
  	<div class="dhxq_main">
      <div class="list-item" v-for="(item,index) in list">
        <van-cell-group>
          <van-cell title="厂商" :value="item.newFactory" />
          <van-cell title="车型" :value="item.models" />
          <van-cell title="排量" :value="item.displacement" />
          <van-cell title="底盘" :value="item.chassisCode" />
          <van-cell title="发动机" :value="item.engineModel" />
          <van-cell title="年份" :value="'['+item.producedYear+'-'+item.idlingYear+']'" />
          <van-cell title="功率" :value="item.powerKw" />
        </van-cell-group>
        <van-button type="primary" block size="small" @click="detail(item)">查看产品</van-button>
      </div>
  	</div>
  	<!--主要内容结束-->
  	<span class="lhq_back" @click="toBack()">返回</span>
  </div>
</template>

<script>
export default {
  name: 'LhqSearch',
  data () {
    return {
    	keyWord:'',
      list : [],
      hongtu:true,
      jiangling:true
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      document.title = this_.$route.query.title;
      this_.keyWord = this_.$route.query.words;
      if(document.title.indexOf('江陵') > -1){
        this_.hongtu = !this_.hongtu;
      }else if(document.title.indexOf('沃森') > -1){
        this_.jiangling = !this_.jiangling;
      }

      this_.init();

    });
  },
  methods:{
    init(){
      let this_ = this;
      this_.bus.$emit('loading', true);
      this_.$api.post({
        url: this_.$apiUrl.api.VehiclePropertyByengineModel,
        params: {
          engineModel : this_.keyWord
        },
        success: function (data) {
          console.log(data.centent.data.data);
          if(data.State){
            this_.list = data.centent.data.data;
          }
          this_.bus.$emit('loading', false);
        }
      });
    },
    detail(e){
      this.$router.push({path:'/proSearch/products', query: {words:e.engineModel,obj:e,type:4,categoryName:"",mb001:this.$route.query.mb001}});
    },
  	//点击返回箭头
  	toBack(){
  		this.$router.go(-1);
  	},

  }
}
</script>
<style scoped>
	.lhq_container{
		width:100%;
		padding-bottom:5rem;

	}
  .list-item{
    margin: 0.5rem 0.5rem 1rem 0.5rem;
  }

  .lhq_back{
  	position: fixed;
  	bottom:0;
  	left:0;
  	width:100%;
  	height:4rem;
  	line-height: 4rem;
  	font-size:1.5rem;
  	color:#fff;
  	text-align: center;
  	background-color:#0066CC;
  }
</style>
