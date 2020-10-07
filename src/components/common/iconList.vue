<template>
<!--收藏夹内容开始-->
<div class="toCollect_contain">
	<div class="com_icon">
		<i class="com_collect iconfont" @click="toCollect()" v-show="!isCollect">&#xe68e;</i>
		<i class="com_collect iconfont" @click="cancleColl()" v-show="isCollect">&#xe60c;</i>
		<i class="icon_active iconfont" v-show="isAcitive">&#xe726;</i>
	</div>
</div>
<!--收藏夹内容结束-->
</template>

<script>
export default {
  name: '',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	isCollect:false,
    	isAcitive:false
    }
  },
  props:[
    "collItem",
    "num",
    "name"
  ],
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      //是否有降价
      if(this_.userInfo.dataset[0].dpt.search("配件二部") != -1){
		  	if(this_.$utils.check.isEmpty(this_.collItem.activity) && !this_.$utils.check.isEmpty(this_.collItem.backprice) && this_.collItem.backprice !=0){
		  		this_.isAcitive = true;
		  	}
		  }
      //是否有活动
      if(!this_.$utils.check.isEmpty(this_.collItem.activity) && this_.collItem.activity != '0'){
      	this_.isAcitive = true;
      }
  		this_.isCollect = this_.$utils.check.isEmpty(this_.collItem.f_id)?false:true;
    });
  },
  methods: {
  	toCollect:function(){
  		let this_ = this;
  		this_.$api.post({
        url: this_.$apiUrl.api.AddFavorite,
        params: {
        	"c_id":this_.userInfo.dataset[0].c_id,
					"dpt":this_.userInfo.dataset[0].dpt,
					"c_ma001":this_.userInfo.dataset[0].ma001,
					"c_ma002":this_.userInfo.dataset[0].ma002,
					"i_ma001":this_.num,
					"i_ma002":this_.name,
					"i_mb001":this_.collItem.mb001,
					"i_mb002":this_.collItem.mb002,
					"i_mb003":this_.collItem.mb003,
					"i_mb004":this_.collItem.mb004,
					"oem":this_.collItem.oem
        },
        success: function (data) {
        	if(data.State){
        		this_.isCollect = true;
        		this_.collItem.f_id = data.centent;
        		this_.bus.$emit('tipOk', "已收藏！");
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
        	}
        	
        }
      });
  	},
  	cancleColl:function(){
  		let this_ = this;
  		this_.$api.post({
        url: this_.$apiUrl.api.DelFavorite,
        params: [{"f_id":this_.collItem.f_id}],
        success: function (data) {
        	if(data.State){
        		this_.isCollect = false;
        		this_.collItem.f_id = '';
        		this_.bus.$emit('tipOk', "已取消！");
        	}else{
        		this_.bus.$emit('tipShow', data.Message);
        	}
        	
        }
      });
  	},
  	
  }
}
</script>
