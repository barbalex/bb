'use strict'

import app from 'ampersand-app'
import { pluck } from 'lodash'
import sortPublications from './sortPublications.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'publications_',
      endkey: 'publications_\uffff'
    }
    app.db.allDocs(options)
      .then((result) => {
        let publications = pluck(result.rows, 'doc')
        publications = sortPublications(publications)
        resolve(publications)
      })
      .catch((error) => reject('Error fetching publications:', error))
  })
}
