import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalRemovePublication = ({ doc, removePublication }) =>
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          Remove publication "{doc.title}"
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to remove publication "{doc.title}"?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() =>
            removePublication(true)
          }
        >
          yes, remove!
        </Button>
        <Button
          onClick={() =>
            removePublication(false)
          }
        >
          no!
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalRemovePublication.displayName = 'ModalRemovePublication'

ModalRemovePublication.propTypes = {
  doc: React.PropTypes.object,
  removePublication: React.PropTypes.func
}

export default ModalRemovePublication
