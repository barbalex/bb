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

    const migrationEvents = dRO.migrationEvents.map((ev, key) => <Event key={key} event={ev} email={email} onRemoveEvent={onRemoveEvent} />)
    const politicsEvents = dRO.politicsEvents.map((ev, key) => <Event key={key} event={ev} email={email} onRemoveEvent={onRemoveEvent} />)

    return (
      <tr>
        <td className='day'>{day}</td>
        <td className='migration'>{migrationEvents}</td>
        <td className='politics'>{politicsEvents}</td>
      </tr>
    )
  }
})
