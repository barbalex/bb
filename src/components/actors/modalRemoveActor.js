import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalRemoveActor = ({ doc, removeActor }) =>
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          Remove actor "{doc.category}"
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to remove actor "{doc.category}"?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() =>
            removeActor(true)
          }
        >
          yes, remove!
        </Button>
        <Button
          onClick={() =>
            removeActor(false)
          }
        >
          no!
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalRemoveActor.displayName = 'ModalRemoveActor'

ModalRemoveActor.propTypes = {
  doc: React.PropTypes.object,
  removeActor: React.PropTypes.func
}

export default ModalRemoveActor
