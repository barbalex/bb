import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalRemoveCommentary = ({ doc, removeCommentary }) =>
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          Remove commentary "{doc.title}"
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to remove commentary "{doc.title}"?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() =>
            removeCommentary(true)
          }
        >
          yes, remove!
        </Button>
        <Button
          onClick={() =>
            removeCommentary(false)
          }
        >
          no!
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalRemoveCommentary.displayName = 'ModalRemoveCommentary'

ModalRemoveCommentary.propTypes = {
  doc: React.PropTypes.object,
  removeCommentary: React.PropTypes.func
}

export default ModalRemoveCommentary
