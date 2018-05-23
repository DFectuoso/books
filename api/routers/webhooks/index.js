const Router = require('lib/router/router')

module.exports = new Router({
  routes: require('es6-requireindex')(__dirname, { recursive: false }),
  prefix: '/webhooks'
})
