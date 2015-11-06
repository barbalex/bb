'use strict'

import moment from 'moment'
import getDateFromEventId from './getDateFromEventId.js'

export default (events) => {
  const oldestEvent = events[events.length - 1]
  const oldestDateObject = getDateFromEventId(oldestEvent._id)
  const oldestDate = moment(`${oldestDateObject.year}.${oldestDateObject.month}.${oldestDateObject.day}`, 'YYYY.MM.DD')
  let dates = []
  // for all dates between oldest and now
  // create row objects with: year, month, day, events
  for (date = oldestDate; date.add(1, 'days'); date > moment()) {
    console.log(moment(date).format('YYYY.MM.DD'))
  }
}
