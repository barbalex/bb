import app from 'ampersand-app'
import React from 'react'
import {
  Glyphicon,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap'

const glyphStyle = {
  fontSize: '0.9em',
  paddingLeft: 8,
  cursor: 'pointer'
}

const EditEventGlyph = ({ event }) =>
  <OverlayTrigger
    placement="top"
    overlay={
      <Tooltip id="editThisEvent">
        edit
      </Tooltip>
    }
  >
    <Glyphicon
      glyph="pencil"
      style={glyphStyle}
      onClick={() =>
        app.Actions.getEvent(event._id)
      }
    />
  </OverlayTrigger>

EditEventGlyph.displayName = 'EditEventGlyph'

EditEventGlyph.propTypes = {
  event: React.PropTypes.object
}

export default EditEventGlyph
