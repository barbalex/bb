'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalRemoveCommentary',

  propTypes: {
    doc: React.PropTypes.object,
    removeCommentary: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { removeCommentary } = this.props
    removeCommentary(true)
  },

  close () {
    const { removeCommentary } = this.props
    removeCommentary(false)
  },

  render () {
    const { doc } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Remove commentary "{doc.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, you want to remove commentary "{doc.title}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='danger' onClick={this.onClickRemove}>yes, remove!</Button>
            <Button onClick={this.close}>close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
