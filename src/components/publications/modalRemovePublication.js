'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalRemovePublication',

  propTypes: {
    doc: React.PropTypes.object,
    removePublication: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { removePublication } = this.props
    removePublication(true)
  },

  close () {
    const { removePublication } = this.props
    removePublication(false)
  },

  render () {
    const { doc } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Remove publication "{doc.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, you want to remove publication "{doc.title}"?</p>
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
