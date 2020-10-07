<template>
  <div class="proDetail_container">
  	<div class="proDetail_main">
  		<h2><i></i>{{proTitle}}</h2>
  		<span v-for="item in proImg"><img :src="item"/></span>
  	</div>
  </div>
</template>
<script>
export default {
  name: 'proDetail',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	proTitle:'',
    	proImg:[],
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.proTitle = this_.$route.query.mb002;
      let imgqty = this_.$route.query.imgqty;
      
      let mb001 = this_.$route.query.mb001;
      if(this_.userInfo.dataset[0].dpt.search("配件一部") != -1){
				//配件一部
				if(this_.userInfo.dataset[0].dpt.search("吉利") != -1){
					if(mb001.substring(0, 2) == '18'){
						mb001 = '16'+ mb001.substring(2);
					}
				}
			}else if(this_.userInfo.dataset[0].dpt.search("配件二部") != -1){
				//配件二部
				if(this_.userInfo.dataset[0].dpt.search("现代") != -1){
					if(mb001.substring(0, 2) != '50'){
						mb001 = '50'+ mb001.substring(2);
					}
				}else{
					if(mb001.substring(0, 2) != '41'){
						mb001 = '41'+ mb001.substring(2);
					}
				}
			}
      
      for(let i=1;i<=imgqty;i++){
      	let imgSrc = 'http://120.76.144.84:8089/ProImg/'+ this_.$route.query.ma001 + '/' + mb001 + '/' + mb001 +'-'+ i +'.jpg';
      	this_.proImg.push(imgSrc);
      }
    })
  },
  methods:{
  	
  }
}
</script>
