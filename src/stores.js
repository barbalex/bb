'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import getPathFromDoc from './modules/getPathFromDoc.js'
import getCommentaries from './modules/getCommentaries.js'
import getMonthlyEvents from './modules/getMonthlyEvents.js'
import _ from 'lodash'

export default (Actions) => {
  app.docStore = Reflux.createStore({

    listenables: Actions,

    doc: null,

    onGetDoc (id) {
      if (!this.doc || (this.doc._id && this.doc._id !== id)) {
        app.db.get(id, { include_docs: true })
          .then((doc) => {
            this.doc = doc
            const path = getPathFromDoc(doc)
            app.router.navigate('/' + path)
            this.trigger(doc)
          })
          .catch((error) => console.error('Error fetching page ' + id + ':', error))
      }
    },

    onSaveDoc (doc) {
      app.db.put(doc)
        .then((resp) => {
          // resp.rev is new rev
          doc._rev = resp.rev
          this.trigger(doc)
        })
        .catch((error) => console.error('docStore, onSaveDoc:', error))
    }
  })

  app.commentariesStore = Reflux.createStore({

    listenables: Actions,

    onGetCommentaries () {
      getCommentaries()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => console.error(error))
    }
  })

  app.monthlyEventsStore = Reflux.createStore({

    listenables: Actions,

    onGetMonthlyEvents () {
      getMonthlyEvents()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => console.error(error))
    }
  })

  app.loginStore = Reflux.createStore({
    /*
     * contains email of logged in user
     * well, it is saved in pouch as local doc _local/login
     * and contains "logIn" bool which states if user needs to log in
     * app.js sets default _local/login if not exists on app start
     */
    listenables: Actions,

    getLogin () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/login', { include_docs: true })
          .then((doc) => resolve(doc))
          .catch((error) =>
            reject('loginStore: error getting login from localDb: ' + error)
          )
      })
    },

    onLogin (email) {
      // change email only if it was passed
      const changeEmail = email !== undefined
      app.localDb.get('_local/login', { include_docs: true })
        .then((doc) => {
          if ((changeEmail && doc.email !== email) || !email) {
            doc.logIn = logIn
            if (changeEmail) {
              doc.email = email
            } else {
              email = doc.email
            }
            this.trigger(email)
            return app.localDb.put(doc)
          }
        })
        .catch((error) =>
          app.Actions.showError({title: 'loginStore: error logging in:', msg: error})
        )
    }
  })
}
