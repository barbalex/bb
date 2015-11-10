'use strict'

import React from 'react'
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Event',

  propTypes: {
    event: React.PropTypes.object,
    onRemoveEvent: React.PropTypes.func,
    email: React.PropTypes.string
  },

  onRemoveEvent (doc, event) {
    const { onRemoveEvent } = this.props
    event.preventDefault()
    event.stopPropagation()
    onRemoveEvent(doc)
  },

  removeEventTooltip () {
    return <Tooltip id='removeThisEvent'>remove</Tooltip>
  },

  removeEventGlyph () {
    const { event } = this.props
    const glyphStyle = {
      fontSize: 0.9 + 'em',
      color: 'red',
      paddingLeft: 5,
      marginBottom: -3 + 'px'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeEventTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveEvent.bind(this, event)} />
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
      <div>
        <p>
          {event.title} <span>{links}</span>
          {showEditingGlyphons ?
            this.removeEventGlyph()
            : null
          }
        </p>
      </div>
    )
  }
})
