const _ = require('lodash')
const debug = require('debug')

const log = debug('api')

const merge = function (router, route) {
  if (router.prefix) {
    route.path = router.prefix + route.path
  }

  if (router.middlewares) {
    route.middlewares = route.middlewares.concat(router.middlewares)
  }

  return route
}

const Router = class {
  constructor (options) {
    this._isRouter = true
    this.options = options || {}

    this.prefix = this.options.prefix
    this.routes = this.options.routes
    this.middlewares = this.options.middlewares

    this._routes = []
    this.setRoutes()
  }

  setRoutes () {
    _.forEach(this.routes, (item, name) => {
      if (item._isRoute) {
        this._routes.push(item)
      } else if (item._isRouter) {
        _.forEach(item.routes, (route, name) => {
          this._routes.push(merge(item, route))
        })
      }
    })
  }

  add (app) {
    log('Router =>', this.prefix, this._routes.length)

    _.forEach(this._routes, (item, name) => {
      item = merge(this, item)
      log('Adding route =>', item.path)

      item.add(app)
    })
  }
}

module.exports = Router
