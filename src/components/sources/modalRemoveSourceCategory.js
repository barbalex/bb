'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalRemoveSourceCategory',

  propTypes: {
    doc: React.PropTypes.object,
    removeSourceCategory: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { removeSourceCategory } = this.props
    removeSourceCategory(true)
  },

  close () {
    const { removeSourceCategory } = this.props
    removeSourceCategory(false)
  },

  render () {
    const { doc } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Remove commentary "{doc.category}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, you want to remove source category "{doc.category}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='danger' onClick={this.onClickRemove}>yes, remove!</Button>
            <Button onClick={this.close}>no!</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
