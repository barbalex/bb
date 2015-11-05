'use strict'

import _ from 'lodash'
import sortEvents from './sortEvents.js'

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
        let events = _.pluck(result.rows, 'doc')
        events = sortEvents(events)
        resolve(events)
      })
      .catch((error) => reject('Error fetching events:', error))
  })
}
