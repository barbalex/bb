'use strict'

var getConfig = require('hjs-webpack')
var indexTemplate = require('./src/indexTemplate.js')

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production',
  // the excluded files are not cleared
  // and not hashed as would be if webpack imports them
  clearBeforeBuild: '!(ckeditor|images|favicon.ico)',
  html: function (context) {
    return {
      'index.html': indexTemplate()
    }
  }
  // this only works on mac
  // hostname: 'alex.local'
})

config.module.loaders.push(
  // bootstraps font-awesome files need this to load in webpack
  // the url-loader uses DataUrls.
  // the file-loader emits files.
  {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
  {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
  {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
  {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'}
)

module.exports = config
