'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AttachedImgagesList from './attachedImgagesList.js'

export default React.createClass({
  displayName: 'PageMeta',

  propTypes: {
    doc: React.PropTypes.object,
    onSaveDoc: React.PropTypes.func,
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
    const { doc, onSaveDoc } = this.props
    return (
      <Modal show={true} onHide={this.close} dialogClassName='pageMetaClass'>
        <Modal.Header>
          <Modal.Title>Meta-Daten für {doc.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AttachedImgagesList doc={doc} onSaveDoc={onSaveDoc} />
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.close}>schliessen</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
