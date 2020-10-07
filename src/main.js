// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Utils from '@/util/util.js'
import Api from '@/api/index.js'
import ApiUrl from '@/api/api.js'
import proLeft from '@/components/common/proLeft'
import cartNum from '@/components/common/cartNum'
import IconList from '@/components/common/iconList'
import DptList from '@/components/common/dptList'
import footer from '@/components/common/footer'
import sfooter from '@/components/common/footer1'
import md5 from 'js-md5'
import Vant from 'vant'
import 'vant/lib/index.css'


Vue.config.productionTip = false

Vue.prototype.$utils = Utils
Vue.prototype.$api = Api
Vue.prototype.$apiUrl = ApiUrl
Vue.prototype.$md5 = md5
Vue.component("cart-view", cartNum); //购物车组件
Vue.component("proLeft-view", proLeft); //产品列表左侧组件
Vue.component("iconList-view", IconList); //收藏夹icon组件
Vue.component("dptList-view", DptList); //品牌切换组件
Vue.component("footer-view", footer); //footer组件
Vue.component("sfooter-view", sfooter); //footer组件
Vue.prototype.bus = new Vue;
Vue.use(Vant);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
