'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'
import EventType from './eventType.js'
import EventLinks from './eventLinks.js'

export default React.createClass({
  displayName: 'NewEvent',

  propTypes: {
    onCloseNewEvent: React.PropTypes.func,
    title: React.PropTypes.string,
    date: React.PropTypes.number,
    links: React.PropTypes.array,
    eventType: React.PropTypes.string,
    tags: React.PropTypes.array,
    error: React.PropTypes.string
  },

  getInitialState () {
    return {
      title: null,
      date: moment(),
      links: [],
      eventType: null,
      tags: [],
      error: null
    }
  },

  onChangeTitle (event) {
    const title = event.target.value
    this.setState({ title })
  },

  onChangeDate (date) {
    this.setState({ date })
  },

  createNewEvent () {
    const { onCloseNewEvent } = this.props
    const { title, date, links, eventType, tags } = this.state
    if (title && date) {
      app.Actions.newEvent(date, title, links, eventType, tags)
      onCloseNewEvent()
    } else {
      let error = 'Please choose a date'
      if (!title) error = 'Please add a title'
      this.setState({ error })
    }
  },

  close () {
    const { onCloseNewEvent } = this.props
    onCloseNewEvent()
  },

  onHide () {
    // seems that this method is needed ???
  },

  handleDateTimeFieldFocus (e) {
    const parent = e.target.parentElement
    const children = parent.childNodes
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName.toLowerCase() === 'span') {
        children[i].click()
        return
      }
    }
  },

  onChangeLinks (links) {
    this.setState({ links })
  },

  onChangeEventType (eventType) {
    this.setState({ eventType })
  },

  render () {
    const { title, date, links, eventType, error } = this.state
    const that = this
    const dateTimeFieldInputProps = {
      onFocus (e) {
        that.handleDateTimeFieldFocus(e)
      }
    }
    const alertStyle = {
      marginBottom: 10
    }
    const dateLabelStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    const dtfStyle = {
      marginBottom: 20
    }
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>New event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='Title' value={title} onChange={this.onChangeTitle} autoFocus />
          <div style={dateLabelStyle}>Date</div>
          <div style={dtfStyle}>
            <DateTimeField
              dateTime={moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
              format='DD.MM.YYYY'
              inputFormat ='DD.MM.YYYY'
              mode='date'
              inputProps={dateTimeFieldInputProps}
              onChange={this.onChangeDate} />
          </div>
          <EventType eventType={eventType} onChangeEventType={this.onChangeEventType} />
          <EventLinks links={links} onChangeLinks={this.onChangeLinks} />
          {error ? <Alert bsStyle='danger' style={alertStyle}>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>discard input and close</Button>
          <Button bsStyle='primary' onClick={this.createNewEvent}>create new event</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
