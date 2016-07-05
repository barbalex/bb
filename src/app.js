'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
import pouchdbAuthentication from 'pouchdb-authentication'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import couchUrl from './modules/getCouchUrl.js'
import 'expose?$!expose?jQuery!jquery'
// need this polyfill to transform promise.all
// without it IE 11 and lower bark
import 'babel-polyfill'
// make webpack import styles
import './styles/main.styl'
import 'file?name=tinymce.css!./styles/tinymce.css'
import 'bootstrap-webpack'
// make webpack import server.js
import 'file?name=server.js!../server.js'

// some old browsers can't deal with ArrayBuffer
// pouchdb needs it
// give the users an explanation instead of an empty page
if (!window.ArrayBuffer) {
  window.alert(`blue-borders.ch nutzt moderne Technologien, welche von Ihrem Browser nicht unterstützt werden.

Bitte versuchen Sie es mit einer aktuellen Version von (zum Beispiel):
- Chrome
- Firefox
- Safari
- Internet Explorer (ab Version 10)
- Edge`)
}

/**
 * set up pouchdb plugins
 */
PouchDB.plugin(pouchdbUpsert)
PouchDB.plugin(pouchdbAuthentication)

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
  init() {
    this.Actions = actions()
    stores(this.Actions)
    Promise.all([
      this.db = new PouchDB(couchUrl())
    ])
    .then(() => {
      this.router = new Router()
      this.router.history.start()
    })
    .catch((error) =>
      app.Actions.showError({
        title: 'Fehler in app.js:',
        msg: error
      })
    )
  }
})

/**
 * o.k., everything necessary is prepared
 * now lauch the app
 */
app.init()
