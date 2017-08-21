const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('config')

const app = express()

const webpackConfig = require('./webpack/dev.config')

const compiler = webpack(webpackConfig)

if (config.env === 'development') {
  console.log('Starting server in development with webpack hot reload')
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
  app.use('/assets', express.static('app/dist'))
}

app.get('*', function (req, res) {
  res.sendFile(path.resolve('./app/views/index.html'))
})

module.exports = app
