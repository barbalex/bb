'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import sortSources from './sortSources.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'sources_',
      endkey: 'sources_\uffff'
    }
    app.db.allDocs(options)
      .then((result) => {
        let sources = _.pluck(result.rows, 'doc')
        sources = sortSources(sources)
        resolve(sources)
      })
      .catch((error) => reject('Error fetching sources:', error))
  })
}
