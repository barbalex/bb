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

const DateRow = ({ dateRowObject: dRO, onRemoveEvent, email }) => {
  const day = moment(dRO.date).format('D')
  const migrationEvents = mapEventComponents(dRO.migrationEvents, onRemoveEvent, email)
  const politicsEvents = mapEventComponents(dRO.politicsEvents, onRemoveEvent, email)
  const dayClassName = (
    migrationEvents.length > 0 || politicsEvents.length > 0 ?
    'day dayWithEvents' :
    'day'
  )

  return (
    <tr>
      <td
        className={dayClassName}>
        <p>
          {day}
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

DateRow.displayName = 'DateRow'

DateRow.propTypes = {
  dateRowObject: React.PropTypes.object,
  onRemoveEvent: React.PropTypes.func,
  email: React.PropTypes.string
}

export default DateRow
