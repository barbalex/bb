'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
import moment from 'moment'
import EventTypeButtonGroup from './eventTypeButtonGroup.js'
import DateInput from './dateInput.js'
import TagsInput from './tagsInput.js'
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

  onChangeDate (datePassed) {
    const date = moment(datePassed, 'DD.MM.YYYY')
    this.setState({ date })
  },

  onChangeLinks (links) {
    // remove empty links
    links = links.filter((link) => link.url && link.label)
    this.setState({ links })
  },

  onChangeEventType (eventType) {
    this.setState({ eventType })
  },

  onChangeTags (tags) {
    this.setState({ tags })
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

  render () {
    const { title, date, links, eventType, tags, error } = this.state
    const alertStyle = {
      marginTop: 10,
      marginBottom: 10
    }
    return (
      <Modal show={true} onHide={this.close} bsSize='large' dialogClassName='editEvent'>
        <Modal.Header>
          <Modal.Title>New event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='Title' value={title} onChange={this.onChangeTitle} autoFocus />
          <DateInput date={date} onChangeDate={this.onChangeDate} />
          <EventTypeButtonGroup eventType={eventType} onChangeEventType={this.onChangeEventType} />
          <TagsInput tags={tags} onChangeTags={this.onChangeTags} />
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
