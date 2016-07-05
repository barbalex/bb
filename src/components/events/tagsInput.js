import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import allTags from './tags.js'

const tagIcon = (option) => {
  const top = option.top ? option.top : 0
  const glyphStyle = {
    top,
    fontSize: '1.5em'
  }
  return (
    <Glyphicon
      glyph={option.iconText}
      style={glyphStyle}
    />
  )
}

const tags = (activeEvent) => {
  const options = allTags()
  return options.map((option, index) => {
    const checked = activeEvent.tags.includes(option.tag)
    return (
      <div
        key={index}
        className="form-group event-tag"
      >
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) =>
              onChangeTag(option.tag, event, activeEvent)
            }
          />
            {
              option.iconText &&
              tagIcon(option)
            }
            &nbsp;{option.tag}
        </label>
      </div>
    )
  })
}

const onChangeTag = (tag, event, activeEvent) => {
  const checked = event.target.checked
  if (checked) {
    activeEvent.tags.push(tag)
    app.Actions.saveEvent(activeEvent)
  } else {
    activeEvent.tags = activeEvent.tags.filter((_tag) =>
      _tag !== tag
    )
    app.Actions.saveEvent(activeEvent)
  }
}

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: 2
}

const EventTags = ({ activeEvent }) =>
  <div style={{ marginBottom: 20 }}>
    <div style={labelStyle}>
      Tags
    </div>
    <div className="event-tags">
      {tags(activeEvent)}
    </div>
  </div>

EventTags.displayName = 'EventTags'

EventTags.propTypes = {
  activeEvent: React.PropTypes.object
}

export default EventTags
