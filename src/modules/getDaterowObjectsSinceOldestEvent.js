import moment from 'moment'
import { max } from 'lodash'
import getDateFromEventId from './getDateFromEventId.js'

export default (events, activeEventYears) => {
  const oldestEvent = events[events.length - 1]
  if (oldestEvent) {
    const oldestDate = getDateFromEventId(oldestEvent._id)
    const daterowObjects = []
    const activeYearIsCurrentYear = activeEventYears.includes(
      parseInt(moment().format('YYYY'), 0)
    )
    let date = (
      activeYearIsCurrentYear ?
      moment() :
      moment(`31.12.${max(activeEventYears)}`, 'DD.MM.YYYY')
    )
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
      // order
      migrationEvents.forEach((event) =>
        event.order = (event.order || 99)
      )
      migrationEvents.sort((a, b) =>
        a.order - b.order
      )
      politicsEvents.forEach((event) => {
        event.order = (event.order || 99)
      })
      politicsEvents.sort((a, b) =>
        a.order - b.order
      )
      const daterowObject = {
        date,
        migrationEvents,
        politicsEvents
      }
      daterowObjects.push(daterowObject)
      date = moment(date).subtract(1, 'days')
    }
    return daterowObjects
  }
  return []
}
