<template>
  <div class="com_container">
  	<!--说明弹层内容开始-->
  	 <div class="batchIn_dialog" v-show="isBatch">
  	 	<div class="batchIn_dialog_main">
  	 		<h2>产品批量导入注意事项<router-link :to="{path: '/index'}" class="iconfont">&#xe60f;</router-link></h2>
				<h3><em>*</em>扩展名必须是.xls或.xlsx文件</h3>
				<p>导入表格第一列为OEM或者品号，第二列为产品数量，其他列无要求。<a :href="excelSrc" download class="batchIn_tem">下载模板</a></p>
				<h3><em>*</em>OEM格式可以为</h3>
				<p>(ws为举例其他字符也可长度不限，其他格式无法解析。数量必须是正整数，否则导入数量为零。)</p>
				<table class="batchIn_table01">
					<tr>
						<td>5810138A90<i class="iconfont">&#xe603;</i></td>
					</tr>
					<tr>
						<td>58101-38A90<i class="iconfont">&#xe603;</i></td>
					</tr>
					<tr>
						<td>5810138a90ws<i class="iconfont">&#xe603;</i></td>
					</tr>
					<tr>
						<td>58101-38a90ws<i class="iconfont">&#xe603;</i></td>
					</tr>
					<tr>
						<td>58101-38a90-ws<i class="iconfont">&#xe603;</i></td>
					</tr>
				</table>
				<h3><em>*</em>导入表格第一行应为表头，表头名称无要求。</h3>
				<p>(如果第一行为产品OEM和数量。导入后会缺失第一行产品，从第二行产品导入。)</p>
				<div class="batchIn_table02">
					<label>第一行</label>
					<table>
						<tr>
							<th>产品OEM</th>
							<th>数量</th>
						</tr>
						<tr>
							<td>58101-38A90</td>
							<td>352</td>
						</tr>
						<tr>
							<td>58101-38A90</td>
							<td>210</td>
						</tr>
					</table>
					<i class="iconfont">&#xe603;</i>
				</div>
				<div class="batchIn_table02">
					<label>第一行</label>
					<table>
						<tr>
							<th>58101-38A90</th>
							<th>352</th>
						</tr>
						<tr>
							<td>58101-38A90</td>
							<td>352</td>
						</tr>
						<tr>
							<td>58101-38A90</td>
							<td>210</td>
						</tr>
					</table>
					<i class="iconfont">&#xe645;</i>
				</div>
				<h3><em>*</em>导入完成后注意事项。</h3>
				<p>导入完成后，相同oem可能对应多个本公司产品，还需您确认后加入购物车。</p>
				<div class="batchIn_dialog_btn">
					<p>
						<input type="file" ref="upFile" @change="toUpFile()" />
						<input type="button" value="上传文件" />
					</p>
				</div>
				
  	 	</div>
  	</div>
  	<!--说明弹层内容结束-->
  	<div class="batchIn_main">
  		<!--未匹配产品和全部tab切换内容开始-->
			<ul class="batchPro_tab clearfix">
				<li v-for="(item,index) in batchTab" :class="{active:index==batchIndex}" @click="batchTo(index)">{{item}}</li>
			</ul>
			<!--未匹配产品和全部tab切换内容结束-->
			
			<!--批量导入产品列表内容开始-->
  		<ul class="product_list cart_list">
  	  	<li v-for="(item,index) in batchList" @click="isActive(index,batchList)" :class="item.isclick=='1'?'active':''">
  	  		<span class="cart_check">
  	  			<i class="iconfont no">&#xe6c3;</i>
  	  			<i class="iconfont yes">&#xe6c2;</i>
  	  		</span>
  	  		<div class="product_left">
  	  			{{item.s_i_mb002}}
  	  			<em>{{item.s_oem}}</em><br />
  	  			<i>{{item.s_i_mb003}}</i><br />
  	  			<span>
  	  				<em :class="{oldPrice:item.tj}">￥{{item.price}}</em>
  	  				{{item.tj?'特价￥':''}}
  	  				{{item.tj?item.aprice:''}}
  	  				{{item.i_type_no=='2'?'限时秒杀':''}}
  	  				{{item.i_type_no=='3'?'满减':''}}
  	  			</span>
  	  			<span>{{item.s_state}}</span>
  	  		</div>
  	  		<div class="product_right">
  	  			<iconList-view :collItem="item" :num="item.s_i_ma001" :name="item.s_i_ma002"></iconList-view>
  	  			<input v-if="item.s_state == '未匹配到产品'" type="text" v-model="item.s_qty" class="cartNo" readonly="readonly" />
  	  			<cart-view v-else :cartList="item" :num="item.s_i_ma001" :name="item.s_i_ma002"></cart-view>
  	  		</div>
  	  	</li>
  	  </ul>
  	  <p v-show="batchList.length == 0 && isLoad" class="com_noData">暂无数据</p>
  	  <!--批量导入产品列表内容开始-->
  	</div>
  	<div class="batch_btn">
  		<span>删除</span>
  		<span>添加购物车</span>
  	</div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
    	userInfo:JSON.parse(sessionStorage.getItem("userinfo")),
    	isBatch:true,
    	batchAll:[],
    	batchNo:[],
    	batchList:[],//批量导入数据
    	batchTab:['未匹配产品','全部'],
    	batchIndex:0,
    	isLoad:false,
    	excelSrc:'../assets/images/example.xlsx',
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let this_ = this;
    })
  },
  methods:{
  	//批量导入产品弹层tab
  	batchTo:function(index){
  		let this_ = this;
  		this_.batchIndex = index;
  		this_.isLoad = true;
  		if(index == 0){
  			this_.batchList = this_.batchNo;
  		}else if(index == 1){
  			this_.batchList = this_.batchAll;
  		}
  		
  	},
  	
  	//上传文件
  	toUpFile:function(){
  		let this_ = this;
  		console.log(this_.$refs.upFile.files[0]);
  		let file01 = this_.$refs.upFile.files[0];
	    let extIndex = file01.name.split(".").length-1;
	    let ext = file01.name.split(".")[extIndex];
	    if( ext.toLowerCase()=='xls' || ext.toLowerCase()=='xlsx' ){
	    	//upLoadFile($("#upFile")[0].files[0]);
	    	
	    	var formData = new FormData();
        formData.append('file', this_.$refs.upFile.files[0]);
        this_.$api.post({
	        url: this_.$apiUrl.api.ImportPro + '?c_id='+ this_.userInfo.dataset[0].c_id +'&c_ma001=' + this_.userInfo.dataset[0].ma001 +'&c_ma002='+ this_.userInfo.dataset[0].ma002 + '&dpt=' + this_.userInfo.dataset[0].dpt + '&ma017=' + this_.userInfo.dataset[0].ma017 + '&kf=' + this_.userInfo.dataset[0].kf  + '&ma075=' + this_.userInfo.dataset[0].ma075,
	        params: formData,
	        type:'file',
	        success: function (data) {
	        	this_.bus.$emit('loading', false);
	        	for(var i=0;i<data.length;i++){
	        		//显示价格
						  data[i].tj = false;
					    if(data[i].i_type_no == '1' || data[i].i_type_no == '4'){
						  	//特价
						  	data[i].tj = true;
						  	//有最大限购
						  	if(!this_.$utils.check.isEmpty(data[i].i_quota_qty)){
						  		//购买量和最大限购
						  		if(parseInt(data[i].orderqty) >= parseInt(data[i].i_quota_qty)){
						  			data[i].tj = false;
						  		}
						  	}
						  }
					    
					    var mb002New = data[i].s_i_mb002;
						  if(mb002New.indexOf('(') != -1){
					    	mb002New = data[i].s_i_mb002.split("(")[0] + data[i].s_i_mb002.split("(")[1].split(")")[1];
					    }
	        		data[i].mb002New = mb002New;
						  var mb003New = data[i].mb003;
						  if(mb003New.indexOf(data[i].oem) != -1){
						  	/*mb003New = data[i].mb003.split(data[i].oem)[0];
						  	if(mb003New.charAt(mb003New.length-1) == '/' || mb003New.charAt(mb003New.length-1) == '-' || mb003New.charAt(mb003New.length-1) == '(' || mb003New.charAt(mb003New.length-1) == '（'){
						  		mb003New = mb003New.substr(0,mb003New.length-1);
						  	}*/
						  	mb003New = mb003New.replace(data[i].oem,"");
						  	if(mb003New.charAt(mb003New.length-1) == '/' || mb003New.charAt(mb003New.length-1) == '-'){
						  		mb003New = mb003New.substr(0,mb003New.length-1);
						  	}
						  	if(mb003New.indexOf('()') != -1){
						  		mb003New = mb003New.replace('()',"");
						  	}
						  	if(mb003New.indexOf('（）') != -1){
						  		mb003New = mb003New.replace('（）',"");
						  	}
						  	
						  }
						  data[i].mb003New = mb003New;
	        		
	        		data[i].mb001 = data[i].s_i_mb001;
	        		data[i].mb002 = data[i].s_i_mb002;
	        		data[i].mb003 = data[i].s_i_mb003;
	        		data[i].mb004 = data[i].s_i_mb004;
	        		data[i].qty = data[i].s_qty;
	        		data[i].price = data[i].s_price;
	        		data[i].oem = data[i].s_oem;
	        		
	        		if(data[i].isclick == '0'){
	        			this_.batchNo.push(data[i])
	        		}
	        	}
	        	this_.batchAll = data;
	        	this_.batchList = this_.batchNo;
	        	this_.isBatch = false;
	        }
	      });
	     
	    	
	    }else{
	    	this_.bus.$emit('tipShow', "EXCEL文件扩展名必须是.xls.xlsx文件!");
	    }
  	},
  }
}
</script>
