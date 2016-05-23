'use strict'

import React from 'react'
import moment from 'moment'
import Event from './event.js'

const mapEventComponents = (events, onRemoveEvent, email) =>
  events.map((ev, key) =>
    <Event
      key={key}
      event={ev}
      email={email}
      onRemoveEvent={onRemoveEvent}
    />
  )

const MonthlyStatisticsRow = ({ dateRowObject: dRO, onRemoveEvent, email }) => {
  const migrationEvents = mapEventComponents(dRO.migrationEvents, onRemoveEvent, email)
  const politicsEvents = mapEventComponents(dRO.politicsEvents, onRemoveEvent, email)

  if (migrationEvents.length > 0 || politicsEvents.length > 0) {
    return (
      <tr className='monthlyStatisticsRow'>
        <td
          className='day'>
          <p>
          </p>
        </td>
        <td
          className='migration'>
          <ul>
            {migrationEvents}
          </ul>
        </td>
        <td
          className='politics'>
          <ul>
            {politicsEvents}
          </ul>
        </td>
      </tr>
    )
  }
  return null
}

MonthlyStatisticsRow.displayName = 'MonthlyStatisticsRow'

MonthlyStatisticsRow.propTypes = {
  dateRowObject: React.PropTypes.object,
  onRemoveEvent: React.PropTypes.func,
  email: React.PropTypes.string
}

export default MonthlyStatisticsRow
