const config = require('../../config')

const path = require('path')
const webpack = require('webpack')

console.log('=>', path.resolve('../dist'))
module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    '../frontend/index.js'
  ],
  output: {
    path: path.resolve('./app/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(config.env),
      'API_HOST': JSON.stringify(config.server.apiHost)
    })
  ],
  resolve: {
    alias: {
      '~core': path.resolve('./app/frontend/core')
    }
  }
}
