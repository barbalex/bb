'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'actors_',
      endkey: 'actors_\uffff'
    }
    app.db.allDocs(options)
      .then((docs) => resolve(docs))
      .catch((error) => reject('Error fetching actors:', error))
  })
}
