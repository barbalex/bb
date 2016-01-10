'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
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

  getInitialState () {
    return {
      error: null
    }
  },

  onChangeTitle (e) {
    let { activeEvent, onChangeActiveEvent } = this.props
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

  onBlurTitle (e) {
    const { activeEvent } = this.props
    const title = e.target.value
    if (title) {
      const date = getDateFromEventId(activeEvent._id)
      app.Actions.replaceEvent(activeEvent, date, title, activeEvent.links, activeEvent.eventType, activeEvent.tags)
    }
  },

  onChangeDate (datePassed) {
    const { activeEvent } = this.props
    if (datePassed) {
      const date = moment(datePassed, 'DD.MM.YYYY')
      app.Actions.replaceEvent(activeEvent, date, activeEvent.title, activeEvent.links, activeEvent.eventType, activeEvent.tags)
    } else {
      const error = 'Please choose a date'
      this.setState({ error })
    }
  },

  onChangeEventType (eventType) {
    let { activeEvent } = this.props
    activeEvent.eventType = eventType
    app.Actions.saveEvent(activeEvent)
  },

  close () {
    app.Actions.getEvent(null)
  },

  onHide () {
    // seems that this method is needed ???
  },

  render () {
    const { activeEvent, error } = this.props
    const date = getDateFromEventId(activeEvent._id)
    const alertStyle = {
      marginTop: 10,
      marginBottom: 10
    }
    return (
      <Modal
        show
        onHide={this.close}
        bsSize='large'
        dialogClassName='editEvent'>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit event
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input
            type='text'
            label='Title'
            value={activeEvent.title}
            onChange={this.onChangeTitle}
            onBlur={this.onBlurTitle} />
          <DateInput
            date={date}
            onChangeDate={this.onChangeDate} />
          <EventTypeButtonGroup
            eventType={activeEvent.eventType}
            onChangeEventType={this.onChangeEventType} />
          <TagsInput
            activeEvent={activeEvent} />
          <EventLinks
            activeEvent={activeEvent} />
          {
            error &&
            <Alert
              bsStyle='danger'
              style={alertStyle}>
              {error}
            </Alert>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={this.close}>
            close
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
