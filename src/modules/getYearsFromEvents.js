'use strict'

import moment from 'moment'
import getDateFromEventId from './getDateFromEventId.js'

export default (events) => {
  const oldestEvent = events[events.length - 1]
  if (oldestEvent) {
    const oldestDate = getDateFromEventId(oldestEvent._id)
    const oldestYear = moment(oldestDate).format('YYYY')
    const date = moment()
    const thisYear = moment(date).format('YYYY')
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
