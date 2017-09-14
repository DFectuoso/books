const { admin } = require('../../middlewares')

module.exports = {
  routes: require('es6-requireindex')(__dirname),
  prefix: '/admin/user',
  middlewares: [admin]
}
