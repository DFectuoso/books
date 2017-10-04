const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('config')
const expressNunjucks = require('express-nunjucks')

const webpackConfig = require('./webpack/dev.config')

const app = express()
app.set('views', path.resolve('./admin/views'))

expressNunjucks(app, {
  noCache: false
})

if (config.server.adminPrefix) {
  app.use(config.server.adminPrefix + '/public', express.static('admin/public'))
} else {
  app.use('/public', express.static('admin/public'))
}

if (config.env === 'development') {
  console.log('Starting server in development with webpack hot reload')

  const compiler = webpack(webpackConfig)
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
} else {
  console.log(`Starting server in ${config.env} with static assets`)
  if (config.server.adminPrefix) {
    app.use(config.server.adminPrefix + '/assets', express.static('admin/dist'))
  } else {
    app.use('/assets', express.static('admin/dist'))
  }
}

if (config.server.adminPrefix) {
  app.get('/', function (req, res) {
    res.redirect(config.server.adminPrefix)
  })
}

app.get('*', function (req, res) {
  res.render('index', {
    env: config.env,
    prefix: config.server.adminPrefix
  })
})

module.exports = app
