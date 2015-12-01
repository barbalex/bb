'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'NewSource',

  propTypes: {
    onCloseNewSource: React.PropTypes.func,
    category: React.PropTypes.string,
    error: React.PropTypes.string
  },

  getInitialState () {
    return {
      category: null,
      error: null
    }
  },

  onChangeCategory (event) {
    const category = event.target.value
    this.setState({ category })
  },

  createNewSource () {
    const { onCloseNewSource } = this.props
    const { category } = this.state
    if (category) {
      app.Actions.newSource(category)
      onCloseNewSource()
    } else {
      const error = 'Please choose a category'
      this.setState({ error })
    }
  },

  close () {
    const { onCloseNewSource } = this.props
    onCloseNewSource()
  },

  onHide () {
    // seems that this method is needed ???
  },

  render () {
    const { category, error } = this.state
    const alertStyle = {
      marginBottom: 10
    }
    return (
      <Modal show onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>New source</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='Category' value={category} onChange={this.onChangeCategory} autoFocus />
          {error ? <Alert bsStyle='danger' style={alertStyle}>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>discard input and close</Button>
          <Button bsStyle='primary' onClick={this.createNewSource}>create new source</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
