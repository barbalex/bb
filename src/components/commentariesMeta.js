'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AttachedImgagesList from './attachedImgagesList.js'
import AttachImages from './attachImages.js'

export default React.createClass({
  displayName: 'CommentariesMeta',

  propTypes: {
    doc: React.PropTypes.object,
    onSavePage: React.PropTypes.func,
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
    const { doc, onSavePage } = this.props
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>Metadaten für {doc.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AttachedImgagesList doc={doc} onSavePage={onSavePage} />
          <AttachImages doc={doc} />
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.close}>schliessen</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
