'use strict'

const getConfig = require('hjs-webpack')
const indexTemplate = require('./src/indexTemplate.js')

const config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production',
  // the excluded files are not cleared
  // and not hashed as would be if webpack imports them
  clearBeforeBuild: '!(tinymce|favicons|images)',
  html() {
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

config.resolve.alias = {
  tinymce: 'tinymce/tinymce.js'
}

module.exports = config
