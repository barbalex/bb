'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'sources_',
      endkey: 'sources_\uffff'
    }
    app.db.allDocs(options)
      .then((docs) => resolve(docs))
      .catch((error) => reject('Error fetching sources:', error))
  })
}
