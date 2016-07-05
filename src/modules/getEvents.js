import app from 'ampersand-app'
import { map, min, max } from 'lodash'
import sortEvents from './sortEvents.js'

export default (years) =>
  new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: `events_${min(years)}`,
      endkey: `events_${max(years)}_\uffff`
    }
    app.db.allDocs(options)
      .then((result) => {
        let events = map(result.rows, 'doc')
        events = sortEvents(events)
        resolve(events)
      })
      .catch((error) =>
        reject('Error fetching events:', error)
      )
  })
