'use strict'

import app from 'ampersand-app'
import { pluck } from 'lodash'
import sortEvents from './sortEvents.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'events_',
      endkey: 'events_\uffff'
    }
    app.db.allDocs(options)
      .then((result) => {
        let events = pluck(result.rows, 'doc')
        events = sortEvents(events)
        resolve(events)
      })
      .catch((error) => reject('Error fetching events:', error))
  })
}
