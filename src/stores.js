'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import getPathFromDoc from './modules/getPathFromDoc.js'

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
          .catch((error) => console.log('Error fetching page ' + id + ':', error))
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
}
