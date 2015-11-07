'use strict'

import React from 'react'
import moment from 'moment'
import Event from './event.js'

export default React.createClass({
  displayName: 'DateRow',

  propTypes: {
    dateRowObject: React.PropTypes.object,
    index: React.PropTypes.number
  },

  render () {
    const { dateRowObject: dRO, index } = this.props
    const day = moment(dRO.date).format('D')
    const endOfMonth = moment(dRO.date).endOf('month').format('DD')
    const yearText = (day === endOfMonth || index === 0) ? moment(dRO.date).format('YYYY') : ''
    const monthText = (day === endOfMonth || index === 0) ? moment(dRO.date).format('MMMM') : ''

    const migrationEvents = dRO.migrationEvents.map((ev, key) => <Event key={key} event={ev} />)
    const politicsEvents = dRO.politicsEvents.map((ev, key) => <Event key={key} event={ev} />)

    return (
      <tr>
        <td className='day'>{day}</td>
        <td className='migration'>{migrationEvents}</td>
        <td className='politics'>{politicsEvents}</td>
      </tr>
    )
  }
})
