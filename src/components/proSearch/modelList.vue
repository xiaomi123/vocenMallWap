<template>
  <div class="lhq_container">

   <van-dropdown-menu>
      <van-dropdown-item v-model="value" :options="displacements" :title="'排量：'+value+'L'" @change="filter" />
    </van-dropdown-menu>

  	<!--主要内容开始-->
  	<div class="dhxq_main">
      <van-collapse v-model="activeNames">
        <template v-for="(item,index) in list">
          <van-collapse-item :title="item.title" :name="index+1">
            <div class="ub ub-ver list-item" v-for="(sub,key) in item.option" @click="detail(sub)">
              <div class="title">
                <em style="color: #000000;">[{{sub.newFactory}}]</em>&nbsp;{{sub.series}}&nbsp;&nbsp;{{sub.year}}&nbsp;&nbsp;&nbsp;&nbsp;{{sub.displacement}}L&nbsp;&nbsp;{{sub.engineModel}}
              </div>
            </div>
          </van-collapse-item>
        </template>
      </van-collapse>
  	</div>
  	<!--主要内容结束-->
  	<span class="lhq_back" @click="toBack()">返回</span>
  </div>
</template>

<script>
export default {
  name: 'modelList',
  data () {
    return {
      activeNames: ['1'],
    	keyWord:'',
    	isLoad:false,
      list : [],
      value : '1.2',
      displacements : [], //排量
      currentPL : ""
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      document.title = this_.$route.query.title;
      this_.keyWord = this_.$route.query.words;
      this.getList();
    });
  },
  methods:{
    getList(){
      let this_ = this;
      //console.log(this_.keyWord);
      this_.bus.$emit('loading', true);
      this_.$api.post({
        url: this_.$apiUrl.api.ProductCategoryByVehicle,
        params: {
          brand : this_.keyWord,
          displacement : this_.currentPL
        },
        success: function (data) {
          console.log(data);
          if(data.State){
            let result =  data.centent.data.data;
            const set = new Set();
            //result.forEach(item => set.add(item.newFactory));
            result.forEach(item => set.add(item.series));
            let displacement_list = result.map(item => item.displacement);
            displacement_list = [... new Set(displacement_list)];
            displacement_list.forEach((item,index) => {
              let obj = {text:item, value:item};
              this_.displacements.push(obj);
            })
            let newData = Array.from({length : set.size}, () => []);
            result.forEach(item => {
            	//let index = [...set].indexOf(item.newFactory);
              let index = [...set].indexOf(item.series);
            	newData[index].push(item);
            })
            for(let i = 0; i < newData.length; i++){
              let obj = {
              	title : "",
              	option : []
              };
              for(let m = 0; m < newData[i].length; m++){
                // obj.title = newData[i][m].newFactory;
                obj.title = newData[i][m].series;
                obj.option.push(newData[i][m]);
              }
              this_.list.push(obj)
            }

          }
         this_.bus.$emit('loading', false);
        }
      });
    },
  	//点击车系
  	detail(item){
  		let this_ = this;
      this.$router.push({path:'/proSearch/products', query: {words:this_.keyWord,obj:item,type:1,categoryName:"",mb001:this_.$route.query.mb001}});
  	},
  	//点击返回箭头
  	toBack(){
  		this.$router.go(-1);
  	},
    //选择排量
    filter(e){
      console.log(e);
      this.currentPL = e;
      this.list = [];
      this.getList();
    },

  }
}
</script>
<style scoped>
	.lhq_container{
		width:100%;
		/* padding-top:7.5rem; */
		padding-bottom:5rem;
		/* background-color:#fff; */
	}
  .dhxq_main{
    margin-top: 1rem;
  }
  .list-item{
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #EEEEEE;
  }
  .title{
    font-size: 1.5rem;
    font-weight: bold;

  }
  .desc{
    color: #888888;
    margin-top: 0.625rem;
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
  .van-cell{
    background-color: #eee !important;
  }
</style>
