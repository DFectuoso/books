const Router = require('lib/router/router')
const { admin } = require('api/middlewares')
const config = require('config')
const { env } = config

module.exports = new Router({
  routes: require('es6-requireindex')(__dirname, { recursive: false }),
  prefix: '/admin',
  middlewares: env === 'test' ? [] : [admin]
})
