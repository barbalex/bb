'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'

const removeEventTooltip = () => (
  <Tooltip id='removeThisEvent'>remove</Tooltip>
)

const editEventTooltip = () => (
  <Tooltip id='editThisEvent'>edit</Tooltip>
)

const removeEventGlyph = (event, onRemoveEvent) => {
  const glyphStyle = {
    fontSize: 0.9 + 'em',
    color: 'red',
    paddingLeft: 8,
    cursor: 'pointer'
  }
  return (
    <OverlayTrigger
      placement='top'
      overlay={removeEventTooltip()}
    >
      <Glyphicon
        glyph='remove-circle'
        style={glyphStyle}
        onClick={() =>
          onRemoveEvent(event)
        }
      />
    </OverlayTrigger>
  )
}

const editEventGlyph = (event) => {
  const glyphStyle = {
    fontSize: 0.9 + 'em',
    paddingLeft: 8,
    cursor: 'pointer'
  }
  return (
    <OverlayTrigger
      placement='top'
      overlay={editEventTooltip()}
    >
      <Glyphicon
        glyph='pencil'
        style={glyphStyle}
        onClick={() =>
          app.Actions.getEvent(event._id)
        }
      />
    </OverlayTrigger>
  )
}

const Event = ({ event, email, onRemoveEvent }) => {
  const showEditingGlyphons = !!email
  const classNames = (
    event.tags && event.tags.length > 0 ?
    event.tags.map((tag) => `event-${tag}`).join(' ') :
    []
  )
  const linkGlyphStyle = {
    fontSize: `${0.7}em`,
    paddingRight: 3,
    verticalAlign: `${10}%`
  }
  const outerSpanStyle = {
    paddingLeft: 5
  }

  const links = event.links.map((link, key) =>
    <span
      key={key}
      style={outerSpanStyle}>
      {
        key > 0 &&
        ' '
      }
      <a
        href={link.url}
        target='_blank'>
        <Glyphicon
          glyph='new-window'
          style={linkGlyphStyle} />
        {link.label}
      </a>
    </span>
  )

  return (
    <li
      className={classNames}>
      <p
      className={classNames}>
        {event.title} <span>{links}</span>
        {
          showEditingGlyphons &&
          editEventGlyph(event)
        }
        {
          showEditingGlyphons &&
          removeEventGlyph(event, onRemoveEvent)
        }
      </p>
    </li>
  )
}

Event.displayName = 'Event'

Event.propTypes = {
  event: React.PropTypes.object,
  onRemoveEvent: React.PropTypes.func,
  email: React.PropTypes.string
}

export default Event
