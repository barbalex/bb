'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import Router from './router.js'
import pouchUrl from './modules/getCouchUrl.js'
// make webpack import styles
import './styles/main.styl'

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
    /**
     * pouchdb keeps setting a lot of listeners which makes browsers show warnings in the console
     * up the number of listeners to reduce the number of console warnings
     */
    PouchDB.setMaxListeners(80)
    this.DB = new PouchDB(pouchUrl())
      .then(() => {
        this.router = new Router()
        this.router.history.start()
      })
      .catch((error) => console.log('error:', error))
  }
})

/**
 * o.k., everything necessary is prepared
 * now lauch the app
 */
app.init()
