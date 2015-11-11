'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Event',

  propTypes: {
    event: React.PropTypes.object,
    onRemoveEvent: React.PropTypes.func,
    email: React.PropTypes.string
  },

  onRemoveEvent (doc) {
    const { onRemoveEvent } = this.props
    onRemoveEvent(doc)
  },

  onEditEvent () {
    const { event } = this.props
    app.Actions.getEvent(event._id)
  },

  removeEventTooltip () {
    return <Tooltip id='removeThisEvent'>remove</Tooltip>
  },

  editEventTooltip () {
    return <Tooltip id='editThisEvent'>edit</Tooltip>
  },

  removeEventGlyph () {
    const { event } = this.props
    const glyphStyle = {
      fontSize: 0.9 + 'em',
      color: 'red',
      paddingLeft: 8,
      cursor: 'pointer'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeEventTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveEvent.bind(this, event)} />
      </OverlayTrigger>
    )
  },

  editEventGlyph () {
    const glyphStyle = {
      fontSize: 0.9 + 'em',
      paddingLeft: 8,
      cursor: 'pointer'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.editEventTooltip()}>
        <Glyphicon glyph='pencil' style={glyphStyle} onClick={this.onEditEvent} />
      </OverlayTrigger>
    )
  },

  render () {
    const { event, email } = this.props
    const showEditingGlyphons = !!email
    const linkGlyphStyle = {
      fontSize: 0.7 + 'em',
      paddingRight: 3,
      verticalAlign: 10 + '%'
    }
    const outerSpanStyle = {
      paddingLeft: 5
    }

    const links = event.links.map((link, key) => {
      return (
        <span key={key} style={outerSpanStyle}>{key > 0 ? ' ' : ''}<a href={link.url} target='_blank'><Glyphicon glyph='new-window' style={linkGlyphStyle} />{link.label}</a></span>
      )
    })

    return (
      <li>
        <p>
          {event.title} <span>{links}</span>
          {showEditingGlyphons ?
            this.editEventGlyph()
            : null
          }
          {showEditingGlyphons ?
            this.removeEventGlyph()
            : null
          }
        </p>
      </li>
    )
  }
})
