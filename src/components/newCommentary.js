'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
import Calendar from 'react-input-calendar'

export default React.createClass({
  displayName: 'CommentariesMeta',

  propTypes: {
    onCloseNewCommentary: React.PropTypes.func,
    title: React.PropTypes.string,
    date: React.PropTypes.number,
    error: React.PropTypes.string
  },

  getInitialState () {
    return {
      title: null,
      date: null,
      error: null
    }
  },

  onChangeTitle (event) {
    const title = event.target.value
    this.setState({ title })
  },

  onChangeDate (date) {
    // TODO
    console.log('date', date)
    // this.setState({ date })
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
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>New Commentary</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='title' value={title} onChange={this.onChangeTitle} />
          <Calendar
            format='DD.MM.YYYY'
            computableFormat='DD.MM.YYYY'
            date={date}
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
