const requireindex = require('es6-requireindex')
const path = require('path')
const _ = require('lodash')

const routers = requireindex(path.join(__dirname, 'routers'), { recursive: false })

module.exports = function (app) {
  _.forEach(routers, (router, name) => {
    router.prefix = `/api${router.prefix}`
    router.add(app)
  })
}
