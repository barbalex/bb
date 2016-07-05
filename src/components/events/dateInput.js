import React from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment'
import { FormGroup, ControlLabel, FormControl, InputGroup } from 'react-bootstrap'

const EventDate = ({ date, onChangeDatePicker }) =>
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
        drops="down"
        opens="left"
        onApply={onChangeDatePicker}
      >
        <FormControl
          type="text"
          value={moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
          onChange={() => { /* react wants an onChange handler */ }}
          bsSize="small"
          tabIndex={2}
        />
      </DateRangePicker>
    </InputGroup>
  </FormGroup>

EventDate.displayName = 'EventDate'

EventDate.propTypes = {
  date: React.PropTypes.object,
  onChangeDatePicker: React.PropTypes.func
}

export default EventDate
