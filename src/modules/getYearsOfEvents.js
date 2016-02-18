'use strict'

import moment from 'moment'
import getYearOfFirstEvent from './getYearOfFirstEvent.js'

export default () => {
  return new Promise((resolve, reject) => {
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
        resolve(years)
      })
      .catch((error) => {
        console.log('getYearsOfEvents, error getting year of first event:', error)
        resolve([])
      })
  })
}
