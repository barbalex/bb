import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AttachedImages from '../attachedImages.js'

const PageMeta = ({ doc, onCloseMeta }) =>
  <Modal
    show
    bsSize="large"
  >
    <Modal.Header>
      <Modal.Title>
        Images for "{doc.title ? doc.title : doc.category}"
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <AttachedImages doc={doc} />
    </Modal.Body>

    <Modal.Footer>
      <Button
        bsStyle="primary"
        onClick={() => onCloseMeta()}
      >
        close
      </Button>
    </Modal.Footer>

  </Modal>

PageMeta.displayName = 'PageMeta'

PageMeta.propTypes = {
  doc: React.PropTypes.object,
  onCloseMeta: React.PropTypes.func
}

export default PageMeta
