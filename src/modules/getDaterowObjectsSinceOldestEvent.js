'use strict'

import moment from 'moment'
import getDateFromEventId from './getDateFromEventId.js'

export default (events) => {
  const oldestEvent = events[events.length - 1]
  if (oldestEvent) {
    const oldestDateObject = getDateFromEventId(oldestEvent._id)
    const oldestDate = moment(`${oldestDateObject.year}.${oldestDateObject.month}.${oldestDateObject.day}`, 'YYYY.MM.DD')
    let daterowObjects = []
    let date = moment()
    while (date >= oldestDate) {
      // console.log('date', moment(date).format('YYYY.MM.DD'))
      const year = moment(date).format('YYYY')
      const month = moment(date).format('MM')
      const day = moment(date).format('DD')
      const migrationEvents = events.filter((event) => event._id.startsWith(`events_${year}_${month}_${day}`) && event.eventType === 'migration')
      const politicsEvents = events.filter((event) => event._id.startsWith(`events_${year}_${month}_${day}`) && event.eventType === 'politics')
      const daterowObject = { date, migrationEvents, politicsEvents }
      daterowObjects.push(daterowObject)
      date = moment(date).subtract(1, 'days')
    }
    return daterowObjects
  }
  return []
}
