'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'

export default React.createClass({
  displayName: 'NewCommentary',

  propTypes: {
    onCloseNewCommentary: React.PropTypes.func,
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

  onChangeDate (date) {
    this.setState({ date })
  },

  createNewCommentary () {
    const { onCloseNewCommentary } = this.props
    const { title, date } = this.state
    if (title && date) {
      app.Actions.newCommentary(title, date)
      onCloseNewCommentary()
    } else {
      let error = 'Please choose a date'
      if (!title) error = 'Please add a title'
      this.setState({ error })
    }
  },

  close () {
    const { onCloseNewCommentary } = this.props
    onCloseNewCommentary()
  },

  onHide () {
    // seems that this method is needed ???
  },

  render () {
    const { title, date, error } = this.state
    const alertStyle = {
      marginTop: 10
    }
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>New Commentary</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='title' value={title} onChange={this.onChangeTitle} />
          <DatePicker
            selected={date}
            dateFormat='DD.MM.YYYY'
            onChange={this.onChangeDate} />
          {error ? <Alert bsStyle='danger'>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>close</Button>
          <Button bsStyle='primary' onClick={this.createNewCommentary}>Create new commentary</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})