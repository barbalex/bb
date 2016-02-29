'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
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

  getInitialState () {
    return {
      title: null,
      date: moment(),
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

  createNewEvent () {
    const { title, date } = this.state
    if (title && date) {
      app.Actions.newEvent(date, title)
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
    const { title, date, error } = this.state
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
        <Modal.Header>
          <Modal.Title>
            New event
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input
            type='text'
            label='Title'
            value={title}
            onChange={this.onChangeTitle}
            autoFocus />
          <DateInput
            date={date}
            onChangeDate={this.onChangeDate} />
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
            discard input and close
          </Button>
          <Button
            bsStyle='primary'
            onClick={this.createNewEvent}>
            create new event
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
