'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Event',

  propTypes: {
    event: React.PropTypes.object
  },

  render () {
    const { event } = this.props

    const links = event.links.map((link, key) => {
      return (
        <span key={key}>{key > 0 ? ' / ' : ''}<a href={link.url} target='_blank'>{link.label}</a></span>
      )
    })

    return (
      <div>
        <p>{event.title} <span>{links}</span></p>
      </div>
    )
  }
})
