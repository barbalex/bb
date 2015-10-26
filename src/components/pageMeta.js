'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'PageMeta',

  propTypes: {
    doc: React.PropTypes.object,
    onSaveArticle: React.PropTypes.func,
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
    return (
      <Modal show={true} onHide={this.close}>
        <Modal.Header>
          <Modal.Title>Meta-Daten</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>bla bla</p>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.close}>schliessen</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
