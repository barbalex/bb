'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import couchUrl from './modules/getCouchUrl.js'
import 'expose?$!expose?jQuery!jquery'
// make webpack import styles
import './styles/main.styl'
import 'bootstrap-webpack'
//import 'tinymce'

// function requireAll(r) { r.keys().forEach(r) }
// requireAll(require.context('./libs/', true, /.*/))
// import 'script!./tinymce/tinymce.min.js'

/**
 * expose 'app' to the browser console
 * this is handy to call actions and stores in the browser console
 */
window.app = app
/**
 * enable pouch inspector in chrome
 * (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
 */
window.PouchDB = PouchDB

/**
 * ampersand-app is extended with app methods (=singleton)
 * modules that need an app method import ampersand-app instead of using a global
 */
app.extend({
  init () {
    this.Actions = actions()
    stores(this.Actions)
    Promise.all([
      this.db = new PouchDB(couchUrl())
    ])
    .then(() => {
      this.router = new Router()
      this.router.history.start()
    })
    .catch((error) => console.error('error:', error))
  }
})

/**
 * o.k., everything necessary is prepared
 * now lauch the app
 */
app.init()
