'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'
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

  render () {
    const { title, date, error } = this.state
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
          <Modal.Title>New commentary</Modal.Title>
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
          {error ? <Alert bsStyle='danger' style={alertStyle}>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>discard input and close</Button>
          <Button bsStyle='primary' onClick={this.createNewCommentary}>create new commentary</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
