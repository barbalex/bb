'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalRemoveActor',

  propTypes: {
    doc: React.PropTypes.object,
    removeActor: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { removeActor } = this.props
    removeActor(true)
  },

  close () {
    const { removeActor } = this.props
    removeActor(false)
  },

  render () {
    const { doc } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Remove actor "{doc.category}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, you want to remove actor "{doc.category}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle='danger'
              onClick={this.onClickRemove}>
              yes, remove!
            </Button>
            <Button
              onClick={this.close}>
              no!
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
