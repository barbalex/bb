'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'NewStatistic',

  propTypes: {
    onCloseNewStatistic: React.PropTypes.func,
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

  createNewStatistic () {
    const { onCloseNewStatistic } = this.props
    const { category } = this.state
    if (category) {
      app.Actions.newStatistic(category)
      onCloseNewStatistic()
    } else {
      const error = 'Please choose a category'
      this.setState({ error })
    }
  },

  close () {
    const { onCloseNewStatistic } = this.props
    onCloseNewStatistic()
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
          <Modal.Title>New statistic</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='Category' value={category} onChange={this.onChangeCategory} autoFocus />
          {error ? <Alert bsStyle='danger' style={alertStyle}>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>discard input and close</Button>
          <Button bsStyle='primary' onClick={this.createNewStatistic}>create new source</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
