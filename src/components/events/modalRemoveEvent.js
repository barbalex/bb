'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalRemoveEvent',

  propTypes: {
    doc: React.PropTypes.object,
    removeEvent: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { removeEvent } = this.props
    removeEvent(true)
  },

  close () {
    const { removeEvent } = this.props
    removeEvent(false)
  },

  render () {
    const { doc } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Remove event "{doc.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, you want to remove event "{doc.title}"?</p>
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
