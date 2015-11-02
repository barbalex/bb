'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'NewSourceCategory',

  propTypes: {
    onCloseNewSourceCategory: React.PropTypes.func,
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

  createNewSourceCategory () {
    const { onCloseNewSourceCategory } = this.props
    const { category } = this.state
    if (category) {
      app.Actions.newSourceCategory(category)
      onCloseNewSourceCategory()
    } else {
      const error = 'Please choose a category'
      this.setState({ error })
    }
  },

  close () {
    const { onCloseNewSourceCategory } = this.props
    onCloseNewSourceCategory()
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
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>New source category</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='Category' value={category} onChange={this.onChangeCategory} autoFocus />
          {error ? <Alert bsStyle='danger' style={alertStyle}>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>discard input and close</Button>
          <Button bsStyle='primary' onClick={this.createNewSourceCategory}>create new source category</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
