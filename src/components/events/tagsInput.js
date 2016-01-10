'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import allTags from './tags.js'

export default React.createClass({
  displayName: 'EventTags',

  propTypes: {
    activeEvent: React.PropTypes.object
  },

  onChangeTag (tag, event) {
    let { activeEvent } = this.props
    const checked = event.target.checked
    if (checked) {
      activeEvent.tags.push(tag)
      app.Actions.saveEvent(activeEvent)
    } else {
      activeEvent.tags = activeEvent.tags.filter((_tag) => _tag !== tag)
      app.Actions.saveEvent(activeEvent)
    }
  },

  tagIcon (option) {
    const top = option.top ? option.top : 0
    const glyphStyle = {
      top: top,
      fontSize: 1.5 + 'em'
    }
    return (
      <Glyphicon glyph={option.iconText} style={glyphStyle} />
    )
  },

  tags () {
    const { activeEvent } = this.props
    const options = allTags()
    return options.map((option, index) => {
      const checked = activeEvent.tags.includes(option.tag)
      return (
        <div
          key={index}
          className='form-group event-tag'>
          <label>
            <input
              type='checkbox'
              checked={checked}
              onChange={this.onChangeTag.bind(this, option.tag)} />
              {
                option.iconText &&
                this.tagIcon(option)
              }
              {option.tag}
          </label>
        </div>
      )
    })
  },

  render () {
    const labelStyle = {
      fontWeight: 'bold',
      marginBottom: 2
    }

    return (
      <div
        style={{marginBottom: 20}}>
        <div
          style={labelStyle}>
          Tags
        </div>
        <div
          className='event-tags'>
          {this.tags()}
        </div>
      </div>
    )
  }
})
