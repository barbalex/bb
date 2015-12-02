'use strict'

import React from 'react'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'

export default React.createClass({
  displayName: 'EventDate',

  propTypes: {
    date: React.PropTypes.object,
    onChangeDate: React.PropTypes.func
  },

  handleDateTimeFieldFocus (e) {
    const parent = e.target.parentElement
    const children = parent.childNodes
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName.toLowerCase() === 'span') return children[i].click()
    }
  },

  render () {
    const { date, onChangeDate } = this.props
    const that = this
    const dateTimeFieldInputProps = {
      onFocus (e) {
        that.handleDateTimeFieldFocus(e)
      }
    }
    const dateLabelStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    const dtfStyle = {
      marginBottom: 20
    }
    return (
      <div>
        <div
          style={dateLabelStyle}>
          Date
        </div>
        <div
          style={dtfStyle}>
          <DateTimeField
            dateTime={moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
            format='DD.MM.YYYY'
            inputFormat ='DD.MM.YYYY'
            mode='date'
            inputProps={dateTimeFieldInputProps}
            onChange={onChangeDate} />
        </div>
      </div>
    )
  }
})
