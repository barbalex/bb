import React from 'react'
import moment from 'moment'

const MonthRow = ({ dateRowObject: dRO }) => {
  const year = parseInt(moment(dRO.date).format('YYYY'), 0)
  const month = moment(dRO.date).format('MMMM')
  const text = `${month} ${year}`
  const className = month === 'December' ? `eventsTable-body-monthRow yearRow ${year}` : 'eventsTable-body-monthRow'

  return (
    <div className={['eventsTable-body-row', className].join(' ')}>
      <div className="eventsTable-body-cell">
        {text}
      </div>
    </div>
  )
}

MonthRow.displayName = 'MonthRow'

MonthRow.propTypes = {
  dateRowObject: React.PropTypes.object
}

export default MonthRow
