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
    const routes = []
    _.forEach(this.routes, (item, name) => {
      item.name = name

      if (item._isRoute) {
        routes.push(item)
      } else if (item._isRouter) {
        _.forEach(item.routes, (route, name) => {
          routes.push(merge(item, route))
        })
      }
    })

    this._routes = _.sortBy(routes, route => route.priority * -1)
  }

  add (app) {
    log(`Router => ${this.prefix} ${this._routes.length}`)

    _.forEach(this._routes, (item, name) => {
      item = merge(this, item)
      log(`Adding route => [${item.method}]${item.path}`)

      item.add(app)
    })
  }
}

module.exports = Router
