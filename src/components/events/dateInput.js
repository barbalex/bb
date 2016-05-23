'use strict'

import React from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment'
import { FormGroup, ControlLabel, FormControl, InputGroup, Glyphicon } from 'react-bootstrap'

const handleDateTimeFieldFocus = (e) => {
  const parent = e.target.parentElement
  const children = parent.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i].tagName.toLowerCase() === 'span') return children[i].click()
  }
}

const EventDate = ({ date, onBlurDate, onChangeDatePicker }) => {
  const dateTimeFieldInputProps = {
    onFocus(e) {
      handleDateTimeFieldFocus(e)
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
    <FormGroup
      controlId="date"
    >
      <ControlLabel>Date</ControlLabel>
      <InputGroup>
        <FormControl
          type="text"
          value={moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
          onChange={onBlurDate}
          bsSize="small"
          tabIndex={2}
        />
        <InputGroup.Addon>
          <DateRangePicker
            singleDatePicker
            drops="up"
            opens="left"
            onApply={onChangeDatePicker}
          >
            <Glyphicon glyph="calendar" />
          </DateRangePicker>
        </InputGroup.Addon>
      </InputGroup>
    </FormGroup>
  )
}

EventDate.displayName = 'EventDate'

EventDate.propTypes = {
  date: React.PropTypes.object,
  onBlurDate: React.PropTypes.func,
  onChangeDatePicker: React.PropTypes.func
}

export default EventDate
