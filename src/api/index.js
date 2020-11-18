import qs from 'qs'
import Consts from './const.js'
import utils from '@/util/util.js'
import router from './../router/index.js'

import Vue from 'vue'
var bus_ = new Vue();

export default {
  get: function(options) {
    options.method = 'GET'
    return apiAxios(options)
  },
  post: function(options) {
    options.method = 'POST'
    return apiAxios(options)
  },
  put: function(options) {
    options.method = 'PUT'
    return apiAxios(options)
  },
  delete: function(options) {
    options.method = 'DELETE'
    return apiAxios(options)
  }
}
const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(config => {
  //解析token
  if (!utils.check.isEmpty(sessionStorage.getItem("token"))) {
    const access_token = sessionStorage.getItem("token"); // 本地保存(cookie/local Storage/session 等)的`token`或者`vuex`中保存的`token`
    config.headers.Authorization = "Basic " + access_token;
  }
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(config => {
  return config
}, err => {
  return Promise.reject(err)
});

function apiAxios(options) {
  /*console.log("askldkflllllllllllll");
  console.log(options)*/
  let method = options.method
  let url = options.url
  let params = options.params
  let baseUrl = process.env.BASE_URL
  let timeout = Consts.apiConfig.timeout
  let withCredentials = Consts.apiConfig.withCredentials
  let contentType = Consts.apiConfig.contentType
  // 参数转换
  /*let postParams = params
  if (contentType === 'form') {
    if (method === 'POST' || method === 'PUT') {
      postParams = qs.stringify(params)
    }
  }*/
  if (options.beforeSend) {
    options.beforeSend()
  }
  //console.log("wwwwwwwwwwwwwwwwwwww");
  //console.log(options.type);
  let postOther = null;

  if (options.type == 'file') {
    postOther = postOther;
  }

  axios({
    method: method,
    url: method === 'GET' ? encodeURI(url) : url,
    data: (method === 'POST' && options.type != 'file') || method === 'PUT' ? qs.stringify({
      '': JSON.stringify(params)
    }) : postOther,
    params: method === 'GET' || method === 'DELETE' ? qs.stringify({
      '': JSON.stringify(params)
    }) : null,
    baseURL: baseUrl,
    withCredentials: withCredentials,
    timeout: timeout,

  }).then(res => {
    bus_.$emit('loading', false);
    let resData = res.data

    if (options.success) {
      options.success(resData)
    }

    if (options.compleled) {
      options.compleled()
    }
  }).catch(err => {
    bus_.$emit('loading', false);
    let res = err.response
    console.log(err)
    if (res) {
      if (res.status === Consts.httpCode.code_400) {} else if (res.status === Consts.httpCode.code_401) {
        router.replace({
          path: '/'
        }); //跳转登陆页
      } else if (res.status === Consts.httpCode.code_402) {} else if (res.status === Consts.httpCode.code_403) {} else if (
        res.status === Consts.httpCode.code_500) {}
    }

    if (options.error) {
      options.error(res)
    }
    //alert('连接服务器失败')
  })
}
