'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'

export default (Actions) => {
  app.pageDocStore = Reflux.createStore({

    listenables: Actions,

    onGetDoc (id) {
      app.db.get(id, { include_docs: true })
        .then((doc) => this.trigger(doc))
        .catch((error) => console.log('Error fetching page ' + id + ':', error))
    },

    onSaveDoc (doc) {
      app.db.put(doc)
        .then((resp) => {
          // resp.rev is new rev
          doc._rev = resp.rev
          this.trigger(doc)
        })
        .catch((error) => console.error('pageDocStore, onSaveDoc:', error))
    }
  })

  app.pathStore = Reflux.createStore({

    listenables: Actions,

    path: '',

    onLoadPath (path) {
      this.path = path
      const docName = 'pages_' + path.replace(/\//g, '_')
      app.Actions.getDoc(docName)
      this.trigger(path)
      app.router.navigate('/' + path)
    }
  })
}
