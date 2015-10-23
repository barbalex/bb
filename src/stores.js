'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import getPathFromDoc from './modules/getPathFromDoc.js'
import getCommentaries from './modules/getCommentaries.js'
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
}
