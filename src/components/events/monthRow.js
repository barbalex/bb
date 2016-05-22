'use strict'

import React from 'react'
import moment from 'moment'

const MonthRow = ({ dateRowObject: dRO }) => {
  const year = parseInt(moment(dRO.date).format('YYYY'), 0)
  const month = moment(dRO.date).format('MMMM')
  const text = `${month} ${year}`
  const className = month === 'December' ? `monthRow yearRow ${year}` : 'monthRow'

  return (
    <tr className={className}>
      <td colSpan='3'>
        {text}
      </td>
    </tr>
  )
}

MonthRow.displayName = 'MonthRow'

MonthRow.propTypes = {
  dateRowObject: React.PropTypes.object
}

export default MonthRow
