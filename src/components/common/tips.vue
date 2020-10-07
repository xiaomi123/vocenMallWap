<template>
<div class="com_tip">
	<!--公共提示弹层开始-->
	<p class="errorTop" v-if="isShow">
		<em class="iconfont">&#xe60e;</em>
		<label>{{msg}}</label>
	</p>
	
	<p class="okTop" v-if="okShow">
		<em class="iconfont">&#xe603;</em>
		<label>{{okMsg}}</label>
	</p>
	<!--公共提示弹层结束-->
</div>

</template>

<script>
export default {
  name: '',
  data () {
    return {
      msg:'',
      isShow:false,
      okMsg:'',
      okShow:false
    }
  },
  created() {
    var that = this;
    this.bus.$on('tipShow', function(data) {
      that.msg = data;
      that.isShow = true;
      setTimeout(function(){
				that.isShow = false;
			},1500);
    });
    this.bus.$on('tipOk', function(data) {
      that.okMsg = data;
      that.okShow = true;
      setTimeout(function(){
				that.okShow = false;
			},1500);
    });
  },

  methods: {
  	
  }
}
</script>
