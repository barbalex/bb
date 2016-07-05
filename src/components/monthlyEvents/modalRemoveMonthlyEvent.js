import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import getMonthFromEventId from '../../modules/getMonthFromEventId.js'

const ModalRemoveMonthlyEvent = ({ doc, removeMonthlyEvent }) => {
  const year = getYearFromEventId(doc._id)
  const month = getMonthFromEventId(doc._id)
  const eventName = `${month} ${year}`

  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            Remove monthly event "{eventName}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to remove monthly event "{eventName}"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle="danger"
            onClick={() =>
              removeMonthlyEvent(true)
            }
          >
            yes, remove!
          </Button>
          <Button
            onClick={() =>
              removeMonthlyEvent(false)
            }
          >
            no!
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  )
}

ModalRemoveMonthlyEvent.displayName = 'ModalRemoveMonthlyEvent'

ModalRemoveMonthlyEvent.propTypes = {
  doc: React.PropTypes.object,
  removeMonthlyEvent: React.PropTypes.func
}

export default ModalRemoveMonthlyEvent
