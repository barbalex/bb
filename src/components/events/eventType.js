'use strict'

import React from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EventType',

  propTypes: {
    eventType: React.PropTypes.string,
    onChangeEventType: React.PropTypes.func
  },

  onChangeEventType (eventType) {
    const { onChangeEventType } = this.props
    onChangeEventType(eventType)
  },

  render () {
    const { eventType } = this.props
    return (
      <ButtonGroup>
        <Button className={eventType === 'migration' ? 'active' : ''} onClick={this.onChangeEventType.bind(this, 'migration')}>migration</Button>
        <Button className={eventType === 'politics' ? 'active' : ''} onClick={this.onChangeEventType.bind(this, 'politics')}>politics</Button>
      </ButtonGroup>
    )
  }
})
