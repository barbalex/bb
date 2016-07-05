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
import EventTypeButtonGroup from './eventTypeButtonGroup.js'
import DateInput from './dateInput.js'
import TagsInput from './tagsInput.js'
import EventLinks from './eventLinks.js'
import getDateFromEventId from '../../modules/getDateFromEventId.js'

export default React.createClass({
  displayName: 'EditEvent',

  propTypes: {
    activeEvent: React.PropTypes.object,
    onChangeActiveEvent: React.PropTypes.func,
    error: React.PropTypes.string
  },

  getInitialState() {
    return {
      error: null
    }
  },

  onChangeTitle(e) {
    const { activeEvent, onChangeActiveEvent } = this.props
    const title = e.target.value
    if (title) {
      activeEvent.title = title
      onChangeActiveEvent(activeEvent)
      this.setState({ error: null })
    } else {
      const error = 'Please add a title'
      this.setState({ error })
    }
  },

  onBlurTitle(e) {
    const { activeEvent } = this.props
    activeEvent.title = e.target.value
    if (activeEvent.title) {
      activeEvent.date = getDateFromEventId(activeEvent._id)
      app.Actions.replaceEvent(activeEvent)
    }
  },

  onChangeDatePicker(event, picker) {
    const { activeEvent } = this.props
    const datePassed = moment(picker.startDate, 'DD.MM.YYYY')
    if (datePassed) {
      activeEvent.date = datePassed
      app.Actions.replaceEvent(activeEvent)
    } else {
      const error = 'Please choose a date'
      this.setState({ error })
    }
  },

  onChangeEventType(eventType) {
    const { activeEvent } = this.props
    activeEvent.eventType = eventType
    app.Actions.saveEvent(activeEvent)
  },

  onChangeOrder(e) {
    const { activeEvent, onChangeActiveEvent } = this.props
    activeEvent.order = e.target.value
    onChangeActiveEvent(activeEvent)
    this.setState({ error: null })
  },

  onBlurOrder(e) {
    const { activeEvent } = this.props
    activeEvent.order = e.target.value
    app.Actions.saveEvent(activeEvent)
  },

  onHide() {
    // seems that this method is needed ???
  },

  close() {
    app.Actions.getEvent(null)
  },

  render() {
    const { activeEvent, error } = this.props
    const date = getDateFromEventId(activeEvent._id)
    const alertStyle = {
      marginTop: 10,
      marginBottom: 10
    }
    const inputStyle = {
      marginBottom: 20
    }
    return (
      <Modal
        show
        onHide={this.close}
        bsSize="large"
        dialogClassName="editEvent"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit event
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="eventTitle"
          >
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={activeEvent.title}
              onChange={this.onChangeTitle}
              onBlur={this.onBlurTitle}
              tabIndex={1}
            />
          </FormGroup>
          <DateInput
            date={date}
            onChangeDatePicker={this.onChangeDatePicker}
          />
          <EventTypeButtonGroup
            eventType={activeEvent.eventType}
            onChangeEventType={this.onChangeEventType}
          />
          <FormGroup
            controlId="eventOrder"
          >
            <ControlLabel>Order</ControlLabel>
            <FormControl
              type="number"
              value={activeEvent.order}
              onChange={this.onChangeOrder}
              onBlur={this.onBlurOrder}
              tabIndex={4}
              style={inputStyle}
            />
          </FormGroup>
          <TagsInput
            activeEvent={activeEvent}
          />
          <EventLinks
            activeEvent={activeEvent}
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
            close
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
