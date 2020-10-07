<template>
  <div class="news_container">
  	<div class="news_main">
  		<h2 v-if="tabIndex==0&&newsList.length>0">有5条未读<span @click="">全部设置为已读</span></h2>
  		<ul class="news_tab clearfix">
  			<li v-for="(item,index) in newsTitle" :class="index == tabIndex ? 'active':''" @click="tabSwicth(index)"><span>{{item}}</span></li>
  		</ul>
  		<ul class="news_list">
  			<li v-for="list in newsList">
  				<p>{{list.m_content}}</p>
  				{{list.m_create_time}}&ensp;{{list.m_title}}
  			</li>
  		</ul>
  		<p  v-if="newsList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	</div>
  	<footer-view></footer-view>
  </div>
</template>

<script>
export default {
  name: 'news',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	newsTitle:['未读消息','已读消息'],
    	tabIndex:0,
    	newsList:[],
    	mIdArr:[],
    	isLoad:false,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
      this_.newsQuery(this_.tabIndex);
      
    })
  },
  methods:{
  	//tab切换
  	tabSwicth:function(index){
  		let this_ = this;
  		this_.tabIndex = index;
  		this_.newsQuery(index);
  	},
  	
  	//查询消息
  	newsQuery:function(type){
  		let this_ = this;
  		this_.bus.$emit('loading', true);
  		this_.$api.get({
        url: this_.$apiUrl.api.GetMessage + '?c_id=' + this_.userInfo.dataset[0].c_id + '&isRead=&isDel=0&pagesize=&pageindex=',
        params: {},
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.newsList = [];
        	for(var i=0;i<data.length;i++){
        		if(type == 0){
        			//未读消息
        			if(data[i].f_isread == 'False'){
        				this_.newsList.push(data[i]);
        				mIdArr.push({"m_id":data[i].m_id});
        			}
        		}else if(type == 1){
        			//已读消息
        			if(data[i].f_isread == 'True'){
        				this_.newsList.push(data[i]);
        			}
        		}
        	}
        	this_.isLoad = true;
        }
      });
      
  	},
  	
  	//全部设置为已读
  	setReadAll:function(){
  		let this_ = this;
  		this_.$api.post({
        url: this_.$apiUrl.api.MessageRead,
        params: this_.mIdArr,
        success: function (data) {
        	this_.bus.$emit('loading', false);
        	this_.bus.$emit('tipShow', '全部已阅读');
        }
      });
  	},
  	
  }
}
</script>
