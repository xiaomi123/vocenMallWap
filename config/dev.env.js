'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
<<<<<<< HEAD
  //BASE_URL:'"http://10.0.3.188:8002/api/"'
=======
  //BASE_URL:'"http://10.0.3.188:8002/api/"',
  //BASE_URL:'"http://localhost:56912/api/"',
>>>>>>> 24e75fb573496eccf7c7124013d93a82a1990b0b
  //BASE_URL: '"http://10.0.2.233:56912/api/"'
  BASE_URL:'"http://120.76.144.84:8088/api/"'

})
