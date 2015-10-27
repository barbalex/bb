'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AttachedImages from './attachedImages.js'

export default React.createClass({
  displayName: 'PageMeta',

  propTypes: {
    doc: React.PropTypes.object,
    onCloseMeta: React.PropTypes.func
  },

  close () {
    const { onCloseMeta } = this.props
    onCloseMeta()
  },

  onHide () {
    // seems that this method is needed ???
  },

  render () {
    const { doc } = this.props
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>Metadaten für {doc.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AttachedImages doc={doc} />
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.close}>schliessen</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
