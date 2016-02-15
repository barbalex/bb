'use strict'

import moment from 'moment'
import getYearOfFirstEvent from './getYearOfFirstEvent.js'

export default (events) => {
  if (events && events.length > 0) {
    getYearOfFirstEvent()
      .then((result) => {
        const oldestYear = 2015
        // const oldestYear = app.eventsStore.getYearOfFirstEvent()
        // console.log('getYearsFromEvents, oldestYear', oldestYear)
        const thisYear = parseInt(moment().format('YYYY'), 0)
        // create array of years between this and oldest
        const years = []
        let year = thisYear
        while (year >= oldestYear) {
          years.push(year)
          year--
        }
        return years
      })
      .catch((error) => {
        console.log('getYearsFromEvents, error getting year of first event:', error)
        return []
      })
  }
  return []
}
