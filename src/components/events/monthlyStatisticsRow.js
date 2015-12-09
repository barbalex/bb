'use strict'

import React from 'react'
import moment from 'moment'
import Event from './event.js'

export default React.createClass({
  displayName: 'DateRow',

  propTypes: {
    dateRowObject: React.PropTypes.object,
    onRemoveEvent: React.PropTypes.func,
    email: React.PropTypes.string
  },

  mapEventComponents (events) {
    const { onRemoveEvent, email } = this.props
    return events.map((ev, key) => (
      <Event
        key={key}
        event={ev}
        email={email}
        onRemoveEvent={onRemoveEvent} />
      )
    )
  },

  render () {
    const { dateRowObject: dRO } = this.props
    const migrationEvents = this.mapEventComponents(dRO.migrationEvents)
    const politicsEvents = this.mapEventComponents(dRO.politicsEvents)

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
})
