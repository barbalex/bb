'use strict'

import React from 'react'
import { Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Event',

  propTypes: {
    event: React.PropTypes.object
  },

  render () {
    const { event } = this.props
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
        <span key={key} style={outerSpanStyle}>{key > 0 ? ' / ' : ''}<a href={link.url} target='_blank'><Glyphicon glyph='new-window' style={linkGlyphStyle} />{link.label}</a></span>
      )
    })

    return (
      <div>
        <p>{event.title} <span>{links}</span></p>
      </div>
    )
  }
})
