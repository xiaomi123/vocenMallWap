'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_URL:'"http://10.0.3.188:8002/api/"'
  BASE_URL:'"http://120.76.144.84:8088/api/"'

})
