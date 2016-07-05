import React from 'react'
import moment from 'moment'
import ReactList from 'react-list'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import MonthlyStatisticsRow from './monthlyStatisticsRow.js'
import getDaterowObjectsSinceOldestEvent from '../../modules/getDaterowObjectsSinceOldestEvent.js'

const DateRows = ({
  events,
  email,
  activeEventYears,
  onRemoveEvent
}) => {
  const dateRowObjects = getDaterowObjectsSinceOldestEvent(events, activeEventYears)
  const dateRows = []
  if (dateRowObjects.length > 0) {
    dateRowObjects.forEach((dRO, index) => {
      const day = moment(dRO.date).format('D')
      const endOfMonth = moment(dRO.date).endOf('month').format('DD')
      const dROForDateRow = {
        date: dRO.date,
        migrationEvents: dRO.migrationEvents.filter((event) =>
          !event.tags || !event.tags.includes('monthlyStatistics')
        ),
        politicsEvents: dRO.politicsEvents.filter((event) =>
          !event.tags || !event.tags.includes('monthlyStatistics')
        )
      }
      const dROForMonthlyStatsRow = {
        date: dRO.date,
        migrationEvents: dRO.migrationEvents.filter((event) =>
          event.tags && event.tags.includes('monthlyStatistics')
        ),
        politicsEvents: dRO.politicsEvents.filter((event) =>
          event.tags && event.tags.includes('monthlyStatistics')
        )
      }
      const dROForMonthlyStatsHasEvents = (
        dROForMonthlyStatsRow.migrationEvents.length > 0 ||
        dROForMonthlyStatsRow.politicsEvents.length > 0
      )
      const needsMonthRow = (
        day === endOfMonth ||
        index === 0
      )
      const needsMonthlyStatisticsRow = (
        day === endOfMonth &&
        dROForMonthlyStatsHasEvents
      )
      if (needsMonthRow) {
        dateRows.push(
          <MonthRow
            key={`${index}monthRow`}
            dateRowObject={dRO}
          />
        )
      }
      if (needsMonthlyStatisticsRow) {
        dateRows.push(
          <MonthlyStatisticsRow
            key={`${index}monthlyStatisticsRow`}
            dateRowObject={dROForMonthlyStatsRow}
            email={email}
            onRemoveEvent={onRemoveEvent}
          />
        )
      }
      dateRows.push(
        <DateRow
          key={index}
          dateRowObject={dROForDateRow}
          email={email}
          onRemoveEvent={onRemoveEvent}
        />
      )
    })
    const renderDateRow = (index, key) => dateRows[index]
    return (
      <div>
        <ReactList
          itemRenderer={renderDateRow}
          length={dateRows.length}
          type="variable"
        />
      </div>
    )
  }
  return (
    <div className="eventsTable-body-row">
      <div className="eventsTable-body-cell">
        <p>Loading events...</p>
      </div>
    </div>
  )
}

DateRows.displayName = 'DateRows'

DateRows.propTypes = {
  events: React.PropTypes.array,
  email: React.PropTypes.string,
  activeEventYears: React.PropTypes.array,
  onRemoveEvent: React.PropTypes.func,
}

export default DateRows
