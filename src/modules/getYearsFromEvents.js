'use strict'

import moment from 'moment'

export default (events) => {
  const oldestEvent = events[events.length - 1]
  if (oldestEvent) {
    const oldestYear = 2015
    const thisYear = parseInt(moment().format('YYYY'), 0)
    // create array of years between this and oldest
    const years = []
    let year = thisYear
    while (year >= oldestYear) {
      years.push(year)
      year--
    }
    return years
  }
  return []
}
