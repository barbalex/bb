'use strict'

import app from 'ampersand-app'
import { map } from 'lodash'
import sortEvents from './sortEvents.js'

export default (year) => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: year ? `events_${year}` : 'events_',
      endkey: year ? `events_${year}_\uffff` : `events_\uffff`
    }
    app.db.allDocs(options)
      .then((result) => {
        let events = map(result.rows, 'doc')
        events = sortEvents(events)
        resolve(events)
      })
      .catch((error) => reject('Error fetching events:', error))
  })
}
