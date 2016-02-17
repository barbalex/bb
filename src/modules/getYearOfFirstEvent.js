'use strict'

import app from 'ampersand-app'
import getYearFromEventId from './getYearFromEventId.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: false,
      startkey: `events_0000`,
      endkey: `events_9999_\uffff`,
      descending: false,
      limit: 1
    }
    app.db.allDocs(options)
      .then((result) => {
        const id = result.rows[0].id
        const year = getYearFromEventId(id)
        resolve(year)
      })
      .catch((error) => reject('Error fetching events:', error))
  })
}
