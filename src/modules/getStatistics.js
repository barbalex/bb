'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import sortStatistics from './sortStatistics.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'statistics_',
      endkey: 'statistics_\uffff'
    }
    app.db.allDocs(options)
      .then((result) => {
        let statistics = _.pluck(result.rows, 'doc')
        statistics = sortStatistics(statistics)
        resolve(statistics)
      })
      .catch((error) => reject('Error fetching statistics:', error))
  })
}
