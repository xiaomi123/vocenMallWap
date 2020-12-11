'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL:'"http://10.0.2.188:8002"'
  //BASE_URL:'"http://120.76.144.84:8088"'

})
