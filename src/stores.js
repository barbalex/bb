'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'

export default (Actions) => {
  app.pageStore = Reflux.createStore({

    listenables: Actions,

    onGetPage (id) {
      app.db.get(id, { include_docs: true })
        .then((doc) => this.trigger(doc))
        .catch((error) => console.log('Error fetching page ' + id + ':', error))
    }
  })
}
