import app from 'ampersand-app'
import React from 'react'
import {
  Modal,
  Button,
  Alert,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap'
import moment from 'moment'
import DateInput from './dateInput.js'

export default React.createClass({
  displayName: 'NewEvent',

  propTypes: {
    onCloseNewEvent: React.PropTypes.func,
    title: React.PropTypes.string,
    date: React.PropTypes.number,
    error: React.PropTypes.string
  },

  getInitialState() {
    return {
      title: '',
      date: moment(),
      error: null
    }
  },

  onChangeTitle(event) {
    const title = event.target.value
    this.setState({ title })
  },

  onChangeDatePicker(event, picker) {
    const date = moment(picker.startDate, 'DD.MM.YYYY')
    this.setState({ date })
  },

  close() {
    const { onCloseNewEvent } = this.props
    onCloseNewEvent()
  },

  createNewEvent() {
    const { title, date } = this.state
    if (title && date) {
      app.Actions.newEvent({ date, title })
    } else {
      let error = 'Please choose a date'
      if (!title) error = 'Please add a title'
      this.setState({ error })
    }
  },

  render() {
    const { title, date, error } = this.state
    const alertStyle = {
      marginTop: 10,
      marginBottom: 10
    }
    return (
      <Modal
        show
        onHide={this.close}
        bsSize="large"
        dialogClassName="editEvent"
      >
        <Modal.Header>
          <Modal.Title>
            New event
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="newEventTitle"
          >
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={title}
              onChange={this.onChangeTitle}
              autoFocus
              tabIndex={1}
            />
          </FormGroup>
          <DateInput
            date={date}
            onChangeDatePicker={this.onChangeDatePicker}
          />
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
            onClick={this.createNewEvent}
          >
            create new event
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
