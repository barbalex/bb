import React from 'react'
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'

const glyphStyle = {
  fontSize: '0.9em',
  color: 'red',
  paddingLeft: 8,
  cursor: 'pointer'
}

const RemoveEventGlyph = ({ event, onRemoveEvent }) =>
  <OverlayTrigger
    placement="top"
    overlay={
      <Tooltip id="removeThisEvent">
        remove
      </Tooltip>
    }
  >
    <Glyphicon
      glyph="remove-circle"
      style={glyphStyle}
      onClick={() =>
        onRemoveEvent(event)
      }
    />
  </OverlayTrigger>

RemoveEventGlyph.displayName = 'RemoveEventGlyph'

RemoveEventGlyph.propTypes = {
  event: React.PropTypes.object,
  onRemoveEvent: React.PropTypes.func
}

export default RemoveEventGlyph
