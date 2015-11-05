'use strict'

import _ from 'lodash'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'events_',
      endkey: 'vents_\uffff'
    }
    app.db.allDocs(options)
      .then((result) => {
        const docs = _.pluck(result.rows, 'doc')
        resolve(docs)
      })
      .catch((error) => reject('Error fetching events:', error))
  })
}
