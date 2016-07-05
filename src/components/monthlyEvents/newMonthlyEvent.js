import app from 'ampersand-app'
import React from 'react'
import {
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Alert,
} from 'react-bootstrap'
import moment from 'moment'
import getMonths from '../../modules/getMonths.js'

export default React.createClass({
  displayName: 'NewMonthlyEvent',

  propTypes: {
    onCloseNewMonthlyEvent: React.PropTypes.func,
    year: React.PropTypes.string,
    month: React.PropTypes.number,
    error: React.PropTypes.string
  },

  getInitialState() {
    return {
      year: moment().format('YYYY'),
      month: moment().format('MM'),
      error: null
    }
  },

  onChangeYear(event) {
    const year = event.target.value
    this.setState({ year })
  },

  onChangeMonth(event) {
    const month = event.target.value
    this.setState({ month })
  },

  createNewMonthlyEvent() {
    const { onCloseNewMonthlyEvent } = this.props
    const { year, month } = this.state
    if (year && month) {
      app.Actions.newMonthlyEvent(year, month)
      onCloseNewMonthlyEvent()
    } else {
      let error = 'Please choose a month'
      if (!year) error = 'Please add a year'
      this.setState({ error })
    }
  },

  close() {
    const { onCloseNewMonthlyEvent } = this.props
    onCloseNewMonthlyEvent()
  },

  monthOptions() {
    const months = getMonths()
    const options = Object.keys(months).map((key, index) =>
      <option
        key={index}
        value={key}
      >
        {months[key]}
      </option>
    )
    return options
  },

  render() {
    const { year, month, error } = this.state
    const alertStyle = {
      marginBottom: 10
    }
    return (
      <Modal
        show
        onHide={this.close}
        bsSize="large"
      >
        <Modal.Header>
          <Modal.Title>
            New monthly event
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup id="yearInput">
            <ControlLabel>Year</ControlLabel>
            <FormControl
              type="number"
              value={year}
              onChange={this.onChangeYear}
              autoFocus
            />
          </FormGroup>
          <FormGroup id="monthInput">
            <ControlLabel>Month</ControlLabel>
            <FormControl
              componentClass="select"
              value={month}
              onChange={this.onChangeMonth}
            >
              {this.monthOptions()}
            </FormControl>
          </FormGroup>
          {
            error &&
            <Alert
              bsStyle="danger"
              style={alertStyle}
            >
              {error}
            </Alert>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={this.close}
          >
            discard input and close
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.createNewMonthlyEvent}
          >
            create new monthly event
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
