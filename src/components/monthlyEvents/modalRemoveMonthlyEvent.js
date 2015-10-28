'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import getMonthFromEventId from '../../modules/getMonthFromEventId.js'

export default React.createClass({
  displayName: 'ModalRemoveMonthlyEvent',

  propTypes: {
    doc: React.PropTypes.object,
    removeMonthlyEvent: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { removeMonthlyEvent } = this.props
    removeMonthlyEvent(true)
  },

  close () {
    const { removeMonthlyEvent } = this.props
    removeMonthlyEvent(false)
  },

  render () {
    const { doc } = this.props
    const year = getYearFromEventId(doc._id)
    const month = getMonthFromEventId(doc._id)
    const eventName = `${month} ${year}`

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Remove monthly event "{eventName}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, you want to remove monthly event "{eventName}"?</p>
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
