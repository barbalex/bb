'use strict'

import React from 'react'
import moment from 'moment'

export default React.createClass({
  displayName: 'MonthRow',

  propTypes: {
    dateRowObject: React.PropTypes.object
  },

  render () {
    const { dateRowObject: dRO } = this.props
    const year = moment(dRO.date).format('YYYY')
    const month = moment(dRO.date).format('MMMM')
    const text = `${month} ${year}`

    return (
      <tr className='monthRow'>
        <td colSpan='3'>
          {text}
        </td>
      </tr>
    )
  }
})
