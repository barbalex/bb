import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalRemoveEvent = ({ doc, removeEvent }) =>
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          Remove event "{doc.title}"
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to remove event "{doc.title}"?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() =>
            removeEvent(true)
          }
        >
          yes, remove!
        </Button>
        <Button
          onClick={() =>
            removeEvent(false)
          }
        >
          no!
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalRemoveEvent.displayName = 'ModalRemoveEvent'

ModalRemoveEvent.propTypes = {
  doc: React.PropTypes.object,
  removeEvent: React.PropTypes.func
}

export default ModalRemoveEvent
