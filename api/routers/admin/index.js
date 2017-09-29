const Router = require('lib/router/router')
const { admin } = require('api/middlewares')

module.exports = new Router({
  routes: require('es6-requireindex')(__dirname, { recursive: false }),
  prefix: '/admin',
  middlewares: [admin]
})
