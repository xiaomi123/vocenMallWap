import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'//登陆页
import Index from '@/components/index'//首页
import ProList from '@/components/product'//产品列表
import SearchList from '@/components/searchList'//查询
import ProDetail from '@/components/proDetail'//产品详情
import Cart from '@/components/cart'//购物车
import Collect from '@/components/collect'//我的收藏
import BatchIn from '@/components/batchIn'//批量导入（暂时没用到）
import UserIndex from '@/components/userCenter/index'
import UserInfo from '@/components/userCenter/userInfo'//个人中心
import EditInfo from '@/components/userCenter/editInfo'//我的资料
import MyIntegral from '@/components/userCenter/myIntegral'//我的积分
import Order from '@/components/userCenter/order'//订单查询
import OrderDetail from '@/components/userCenter/orderDetail'//订单详情
import EnterDetail from '@/components/userCenter/enterDetail'//订单详情
import ActivityIndex from '@/components/activity/index'//活动首页
import SpecialPrice from '@/components/activity/specialPrice'//特价
import FullReduce from '@/components/activity/fullReduce'//满减
import Seckill from '@/components/activity/seckill'//秒杀
import BuyHistory from '@/components/buyHistory'//购买历史
import Shortage from '@/components/shortage'//缺货提醒
import News from '@/components/news'//缺货提醒

import LhqSearch from '@/components/lhqSearch'//离合器查询
import LhqList from '@/components/proSearch/lhqList'//离合器查询
import DhxqList from '@/components/proSearch/dhxqList'//点火线圈查询
import YcgqList from '@/components/proSearch/ycgqList'//氧传感器查询
import SproList from '@/components/proSearch/products'//VIN码查询产品
import ModelList from '@/components/proSearch/modelList'//车型列表
import ProductDetail from '@/components/proSearch/detail'//详情
import SCart from '@/components/proSearch/cart'//购物车
import SUserIndex from '@/components/proSearch/userCenter/index'
import SUserInfo from '@/components/proSearch/userCenter/userInfo'//个人中心
import SEditInfo from '@/components/proSearch/userCenter/editInfo'//我的资料
import SMyIntegral from '@/components/proSearch/userCenter/myIntegral'//我的积分
import SEnterDetail from '@/components/proSearch/userCenter/enterDetail'//订单详情
import SOrder from '@/components/proSearch/userCenter/order'//订单查询
import SOrderDetail from '@/components/proSearch/userCenter/orderDetail'//订单详情

import LhqHome from '@/components/lhqhome'//离合器查询--旧版本（无用）

import Wxlogin from '@/components/wxlogin'//微信公众号登陆页面

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
    	path: '/index',
      name: 'index',
      component: Index
    },
    {
    	path: '/product',
      name: 'product',
      component: ProList
    },
    {
    	path: '/searchList',
      name: 'searchList',
      component: SearchList
    },
    {
    	path: '/proDetail',
      name: 'proDetail',
      component: ProDetail
    },
    {
    	path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
    	path: '/collect',
      name: 'collect',
      component: Collect
    },
    {
    	path: '/batchIn',
      name: 'batchIn',
      component: BatchIn
    },
    {
    	path: '/userCenter/index',
      name: 'userIndex',
      component: UserIndex
    },
    {
    	path: '/userCenter/userInfo',
      name: 'userInfo',
      component: UserInfo
    },{
    	path: '/userCenter/editInfo',
      name: 'editInfo',
      component: EditInfo
    },{
    	path: '/userCenter/myIntegral',
      name: 'myIntegral',
      component: MyIntegral
    },{
    	path: '/userCenter/order',
      name: 'order',
      component: Order
    },{
    	path: '/userCenter/orderDetail',
      name: 'orderDetail',
      component: OrderDetail
    },{
    	path: '/userCenter/enterDetail',
      name: 'enterDetail',
      component: EnterDetail
    },{
    	path: '/activity/index',
      name: 'activityIndex',
      component: ActivityIndex
    },{
    	path: '/activity/specialPrice',
      name: 'specialPrice',
      component: SpecialPrice
    },{
    	path: '/activity/fullReduce',
      name: 'fullReduce',
      component: FullReduce
    },{
    	path: '/activity/seckill',
      name: 'seckill',
      component: Seckill
    },{
    	path: '/buyHistory',
      name: 'buyHistory',
      component: BuyHistory
    },{
    	path: '/shortage',
      name: 'shortage',
      component: Shortage
    },{
    	path: '/news',
      name: 'news',
      component: News
    },{
    	path: '/lhqSearch',
      name: 'lhqSearch',
      component: LhqSearch,
    },{
    	path: '/proSearch/lhqList',
      name: 'lhqList',
      component: LhqList,
    },{
    	path: '/proSearch/dhxqList',
      name: 'dhxqList',
      component: DhxqList,
    },{
    	path: '/proSearch/ycgqList',
      name: 'dycgqList',
      component: YcgqList,
    },{
		path : '/proSearch/products',
		name : 'sproduct',
		component : SproList
	},{
    path : '/proSearch/modelList',
    name : 'modelList',
    component : ModelList
  },{
    path : '/proSearch/detail',
    name : 'productDetail',
    component : ProductDetail
  },{
    path : '/proSearch/cart',
    name : 'SCart',
    component : SCart
  },{
    path : '/proSearch/userCenter/index',
    name : 'sUserIndex',
    component : SUserIndex
  },{
    path : '/proSearch/userCenter/userInfo',
    name : 'sUserInfo',
    component : SUserInfo
  },{
    path : '/proSearch/userCenter/editInfo',
    name : 'sEditInfo',
    component : SEditInfo
  },{
    path : '/proSearch/userCenter/myIntegral',
    name : 'sMyIntegral',
    component : SMyIntegral
  },{
    path : '/proSearch/userCenter/enterDetail',
    name : 'sEnterDetail',
    component : SEnterDetail
  },{
    path : '/proSearch/userCenter/order',
    name : 'sOrder',
    component : SOrder
  },{
    path : '/proSearch/userCenter/orderDetail',
    name : 'sOrderDetail',
    component : SOrderDetail
  },{
    	path: '/wxlogin',
      name: 'wxlogin',
      component: Wxlogin,
    }

  ]
})

//路由拦截token验证
router.beforeEach((to, from, next) => {
	let token = sessionStorage.getItem('token');
	if(to.path == '/lhqSearch'){
  	document.title = '';
  }else{
  	document.title = '订单系统';
  }
	if(to.path == '/'){
		next();
	}else{
		// if ((token == 'null' ||token == null || token == '' ) && (to.path != '/lhqSearch') && (to.path != '/proSearch/lhqList') && (to.path != '/proSearch/dhxqList') && (to.path != '/proSearch/ycgqList') && (to.path != '/proSearch/products') && (to.path != '/wxlogin')) {
    //console.log(to.path.indexOf('Search'));
    if ((token == 'null' ||token == null || token == '' ) && (to.path != '/wxlogin') && (to.path.indexOf('Search') < -1)) {
      next('/');
    } else {
      next();
    }
	}
});

export default router;
