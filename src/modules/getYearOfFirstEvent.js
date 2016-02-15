'use strict'

import app from 'ampersand-app'
import { map, min, max } from 'lodash'
import sortEvents from './sortEvents.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: `events_0000`,
      endkey: `events_9999_\uffff`,
      descending: false,
      limit: 1
    }
    app.db.allDocs(options)
      .then((result) => {
        let events = map(result.rows, 'doc')
        console.log('getYearOfFirstEvent.js, result', result)
        resolve(result)
      })
      .catch((error) => reject('Error fetching events:', error))
  })
}
