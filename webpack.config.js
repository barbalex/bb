'use strict'

var getConfig = require('hjs-webpack')

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production'
})

config.module.loaders.push(
  // bootstraps font-awesome files need this to load in webpack
  // the url-loader uses DataUrls.
  // the file-loader emits files.
  { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
  { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
)

module.exports = config
