'use strict'

import moment from 'moment'
import getDateFromEventId from './getDateFromEventId.js'

export default (events, activeYear) => {
  const oldestEvent = events[events.length - 1]
  if (oldestEvent) {
    const oldestDate = getDateFromEventId(oldestEvent._id)
    let daterowObjects = []
    const activeYearIsCurrentYear = parseInt(moment().format('YYYY'), 0) === activeYear
    let date = activeYearIsCurrentYear ? moment() : moment(`31.12.${activeYear}`, 'DD.MM.YYYY')
    while (date >= oldestDate) {
      const year = moment(date).format('YYYY')
      const month = moment(date).format('MM')
      const day = moment(date).format('DD')
      const migrationEvents = events.filter((event) =>
        event._id.startsWith(`events_${year}_${month}_${day}`) && event.eventType === 'migration'
      )
      const politicsEvents = events.filter((event) =>
        event._id.startsWith(`events_${year}_${month}_${day}`) && event.eventType === 'politics'
      )
      const daterowObject = { date, migrationEvents, politicsEvents }
      daterowObjects.push(daterowObject)
      date = moment(date).subtract(1, 'days')
    }
    return daterowObjects
  }
  return []
}
