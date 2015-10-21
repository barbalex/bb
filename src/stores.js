'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'

export default (Actions) => {
  app.pageDocStore = Reflux.createStore({

    listenables: Actions,

    onGetPage (id) {
      app.db.get(id, { include_docs: true })
        .then((doc) => this.trigger(doc))
        .catch((error) => console.log('Error fetching page ' + id + ':', error))
    },

    onSaveArticle (article) {


      app.db.put(pageDoc)
        .then((resp) => {
          // resp.rev is new rev
          pageDoc._rev = rev
          this.trigger(pageDoc)
        })
        .catch((error) => console.error('savePageDocStore, onSavePageDoc:', error))
    }
  })

  app.requestSaveCkeditorStore = Reflux.createStore({

    listenables: Actions,

    onRequestSaveCkeditor () {
      this.trigger(true)
    }
  })
}
