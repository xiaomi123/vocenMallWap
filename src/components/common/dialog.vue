<template>
<!--公共提示弹层开始-->
<div class="com_dialog" v-if="isShow">
	<div class="com_diaMain">
		<h2>{{title}}</h2>
		<p>{{content}}</p>
		<span class="com_diaBtnOne" v-if="btn==1">确定</span>
		<ul class="com_diaBtn clearfix" v-if="btn==2">
			<li @click="diaClose">取消</li>
			<li @click="diaOk">确定</li>
		</ul>
	</div>
</div>
<!--公共提示弹层结束-->
</template>

<script>
export default {
  name: '',
  data () {
    return {
    	title:'',
      content:'',
      isShow:false,
      btn:1,
      s_c_id:'',
      s_id:'',
      curIndex:''
    }
  },
  created() {
    var this_ = this;
    this.bus.$on('ShowConfirm', function(data) {
    	this_.isShow = true;
    	this_.btn = data.btn;
    	this_.title = data.title;
    	this_.content = data.content;
      this_.curIndex = data.curIndex;
    	this_.s_c_id = data.s_c_id;
    	this_.s_id = data.s_id;
    });
  },

  methods: {
  	diaClose:function(){
  		var this_ = this;
  		this_.isShow = false;
  	},
  	//目前只有确认收货用到，----待优化
  	diaOk:function(){
  		var this_ = this;
  		this_.isShow = false;
  		this_.bus.$emit('confirmOk',{s_c_id:this_.s_c_id,s_id:this_.s_id,curIndex:this_.curIndex});
  	},
  }
}
</script>
