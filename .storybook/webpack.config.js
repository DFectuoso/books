// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to 'React Create App'. This only has babel loader to load JavaScript.
const webpack = require('webpack')
const path = require('path')

const config = require('../config')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(config.env),
      'PREFIX': JSON.stringify(config.server.adminPrefix),
      'API_HOST': JSON.stringify(config.server.apiHost),
      'EMAIL_SEND': JSON.stringify(config.mailer.active)
    })
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss)/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      '~base': path.resolve('./lib/frontend/'),
      '~core': path.resolve('./admin/frontend/core'),
      '~components': path.resolve('./admin/frontend/components')
    }
  }
}
