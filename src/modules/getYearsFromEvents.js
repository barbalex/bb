'use strict'

import moment from 'moment'
import getYearOfFirstEvent from './getYearOfFirstEvent.js'

export default (events) => {
  return new Promise((resolve, reject) => {
    if (events && events.length > 0) {
      getYearOfFirstEvent()
        .then((oldestYear) => {
          const thisYear = parseInt(moment().format('YYYY'), 0)
          // create array of years between this and oldest
          const years = []
          let year = thisYear
          while (year >= oldestYear) {
            years.push(year)
            year--
          }
          console.log('getYearsFromEvents, years', years)
          resolve(years)
        })
        .catch((error) => {
          console.log('getYearsFromEvents, error getting year of first event:', error)
          resolve([])
        })
    } else {
      resolve([])
    }
  })
}
