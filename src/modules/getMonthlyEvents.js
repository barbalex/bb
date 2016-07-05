import app from 'ampersand-app'
import { map } from 'lodash'
import sortMonthlyEvents from './sortMonthlyEvents.js'

const options = {
  include_docs: true,
  startkey: 'monthlyEvents_',
  endkey: 'monthlyEvents_\uffff'
}

export default () =>
  new Promise((resolve, reject) =>
    app.db.allDocs(options)
      .then((result) => {
        let monthlyEvents = map(result.rows, 'doc')
        monthlyEvents = sortMonthlyEvents(monthlyEvents)
        resolve(monthlyEvents)
      })
      .catch((error) =>
        reject('Error fetching monthly events:', error)
      )
  )
