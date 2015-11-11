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

  render () {
    const { dateRowObject: dRO, onRemoveEvent, email } = this.props
    const day = moment(dRO.date).format('D')
    const dayClassName = dRO.migrationEvents.length > 0 || dRO.politicsEvents.length > 0 ? 'day dayWithEvents' : 'day'

    const migrationEvents = dRO.migrationEvents.map((ev, key) => <Event key={key} event={ev} email={email} onRemoveEvent={onRemoveEvent} />)
    const politicsEvents = dRO.politicsEvents.map((ev, key) => <Event key={key} event={ev} email={email} onRemoveEvent={onRemoveEvent} />)

    return (
      <tr>
        <td className={dayClassName}><p>{day}</p></td>
        <td className='migration'><ul>{migrationEvents}</ul></td>
        <td className='politics'><ul>{politicsEvents}</ul></td>
      </tr>
    )
  }
})
