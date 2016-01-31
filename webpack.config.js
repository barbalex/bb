'use strict'

var getConfig = require('hjs-webpack')
var indexTemplate = require('./src/indexTemplate.js')
var NpmInstallPlugin = require('npm-install-webpack-plugin')

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production',
  // the excluded files are not cleared
  // and not hashed as would be if webpack imports them
  clearBeforeBuild: '!(tinymce|favicons|images)',
  html: function (context) {
    return {
      'index.html': indexTemplate()
    }
  }
// this only works on mac
// hostname: 'alex-mac.local'
})

config.module.loaders.push(
  {
    test: /tinymce\/tinymce\.js/,
    loader: 'imports?document=>window.document,this=>window!exports?window.tinymce'
  },
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel'
  }
)

config.plugins.push(new NpmInstallPlugin({ save: true }))

config.resolve.alias = {
  tinymce: 'tinymce/tinymce.js'
}

module.exports = config
