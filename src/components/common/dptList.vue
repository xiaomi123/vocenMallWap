<template>
<!--品牌切换内容开始-->
<div class="dpt_contain">
	<div class="index_dpt">
		<span @click.stop="dptShow = !dptShow"><img :src="dptLogo" alt="" /></span>
		<em :class="dptShow?'iconfont dptBot tran':'iconfont dptBot'" @click.stop="dptShow = !dptShow">&#xe604;</em>
		<i v-show="dptShow"></i>
		<transition name="ul">
			<ul class="index_dpt_list" v-show="dptShow">
				<li v-for="(item,index) in userInfo.dataset1" :class="{active:index==dptIndex}" @click="dptSwitch(index)">{{item.mr003}}</li>
			</ul>
		</transition>
	</div>

</div>
<!--品牌切换内容结束-->
</template>

<script>
export default {
  name: '',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	dptIndex:0,//当前选中品牌
    	dptShow:false,//品牌选中弹层
    	dptLogo:'',
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
  		this_.init();//初始化
    });
  },
  created(){
  	let this_ = this;
  	//点击其他地方，品牌弹层隐藏
    　　document.addEventListener('click',(e)=>{
      this_.dptShow = false;
    　　});
  },
  methods: {
  	init:function(){
  		let this_ = this;
  		this_.curDpt();
  	},
  	//获取选中品牌品类
  	curDpt:function(){
  		let this_ = this;
  		for(var i=0;i<this_.userInfo.dataset1.length;i++){
        if(this_.userInfo.dataset1[i].mr003 == '江陵耐用'){
        	this_.userInfo.dataset1[i].dpt = '配件一部江陵-弘途';
        	sessionStorage.setItem("userinfo",JSON.stringify(this_.userInfo));
        }
  			if((this_.userInfo.dataset[0].ma015 == this_.userInfo.dataset1[i].ma015) && (this_.userInfo.dataset[0].ma017 == this_.userInfo.dataset1[i].ma017)){
  				this_.dptIndex = i;
  				this_.swithLogo(this_.userInfo.dataset1[i].ma017,this_.userInfo.dataset1[i].dpt);
  				this_.$emit('changetab',i);
  			}
        
  		}

  	},
  	//品牌切换
  	dptSwitch:function(index){
  		let this_ = this;
  		this_.dptShow = false;//品牌弹层
  		if(this_.dptIndex != index){
  			this_.dptIndex = index;//品牌index

	  		//logo切换
	  		let ma017 = this_.userInfo.dataset1[index].ma017;
	  		let dpt = this_.userInfo.dataset1[index].dpt;
				this_.swithLogo(ma017,dpt);

	  		if(this_.userInfo.dataset1[index].dpt.search("配件二部") != -1){
					this_.userInfo.dataset[0].c_dpt = '轿车';
				}else if(this_.userInfo.dataset1[index].dpt.search("配件一部") != -1 ){
					this_.userInfo.dataset[0].c_dpt = '微车';
				}
	  		this_.userInfo.dataset[0].dpt = this_.userInfo.dataset1[index].dpt;
				this_.userInfo.dataset[0].kf = this_.userInfo.dataset1[index].kf;
				this_.userInfo.dataset[0].ma001 = this_.userInfo.dataset1[index].ma001;
				this_.userInfo.dataset[0].ma002 = this_.userInfo.dataset1[index].ma002;
				this_.userInfo.dataset[0].ma006 = this_.userInfo.dataset1[index].ma006;
				this_.userInfo.dataset[0].ma007 = this_.userInfo.dataset1[index].ma007;
				this_.userInfo.dataset[0].ma015 = this_.userInfo.dataset1[index].ma015;
				this_.userInfo.dataset[0].ma016 = this_.userInfo.dataset1[index].ma016;
				this_.userInfo.dataset[0].ma017 = this_.userInfo.dataset1[index].ma017;
				this_.userInfo.dataset[0].ma027 = this_.userInfo.dataset1[index].ma027;
			  this_.userInfo.dataset[0].ma075 = this_.userInfo.dataset1[index].ma075;
				this_.userInfo.dataset[0].ma085 = this_.userInfo.dataset1[index].ma085;
				this_.userInfo.dataset[0].mr003 = this_.userInfo.dataset1[index].mr003;
				this_.userInfo.dataset[0].yw = this_.userInfo.dataset1[index].yw;
				sessionStorage.setItem("userinfo",JSON.stringify(this_.userInfo)); //存入修改用户名后userInfo
				this_.$emit('changetab',index);
  		}
  	},

  	//logo切换
  	swithLogo:function(ma017,dpt){
  		let this_ = this;
  		if(ma017 == '200'){
				//江陵
				this_.dptLogo = require('../../assets/images/logo/img_index_logoJl.png');
			}else if(ma017 == '201' || ma017 == '210'){
				//沃森
				if(dpt.search("丰田") != -1){
					this_.dptLogo = require('../../assets/images/logo/img_index_logoRxWs.png');
				}else{
					this_.dptLogo = require('../../assets/images/logo/img_index_logoWcWs.png');
				}

			}else if(ma017 == '211'){
				//韩系智选
				this_.dptLogo = require('../../assets/images/logo/img_index_logoHxZx.png');
			}else if(ma017 == '212'){
				//秀泰
				if(dpt.search("丰田") != -1){
					//日系秀泰
					this_.dptLogo = require('../../assets/images/logo/img_index_logoRxXt.png');
				}else{
					//韩系秀泰
					this_.dptLogo = require('../../assets/images/logo/img_index_logoHxXt.png');
				}

			}else if(ma017 == '213'){
				//韩系吉尔摩
				this_.dptLogo = require('../../assets/images/logo/img_index_logoHxJem.png');
			}else if(ma017 == '202'){
				//吉利沃森
				this_.dptLogo = require('../../assets/images/logo/img_index_logoJlWs.png');
			}else if(ma017 == '203'){
				//吉利吉尔摩
				this_.dptLogo = require('../../assets/images/logo/img_index_logoJlJem.png');
			}else if(ma017 == '204'){
				//微车弘涂
				this_.dptLogo = require('../../assets/images/logo/img_index_logoWcHt.png');
			}
  	},

  }
}
</script>
