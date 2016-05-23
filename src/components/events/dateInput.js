'use strict'

import React from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment'
import { FormGroup, ControlLabel, FormControl, InputGroup } from 'react-bootstrap'

const handleDateTimeFieldFocus = (e) => {
  const parent = e.target.parentElement
  const children = parent.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i].tagName.toLowerCase() === 'span') return children[i].click()
  }
}

const EventDate = ({ date, onChangeDatePicker }) => {
  return (
    <FormGroup
      controlId="date"
    >
      <ControlLabel>Date</ControlLabel>
      <InputGroup
        style={{
          width: `${100}%`
        }}
      >
        <DateRangePicker
          singleDatePicker
          drops="up"
          opens="left"
          onApply={onChangeDatePicker}
        >
          <FormControl
            type="text"
            value={moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
            onChange={() => {/* react wants an onChange handler */}}
            bsSize="small"
            tabIndex={2}
          />
        </DateRangePicker>
      </InputGroup>
    </FormGroup>
  )
}

EventDate.displayName = 'EventDate'

EventDate.propTypes = {
  date: React.PropTypes.object,
  onChangeDatePicker: React.PropTypes.func
}

export default EventDate
