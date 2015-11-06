'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon, Tooltip, OverlayTrigger, Table } from 'react-bootstrap'
import _ from 'lodash'
import EventTableRow from './eventTableRow.js'
import NewEvent from './newEvent.js'
import ModalRemoveEvent from './modalRemoveEvent.js'

export default React.createClass({
  displayName: 'Commentaries',

  propTypes: {
    events: React.PropTypes.array,
    activeEvent: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onCloseNewEvent: React.PropTypes.func,
    showNewEvent: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docToRemove: null
    }
  },

  componentDidMount () {
    app.Actions.getEvents()
  },

  onClickEvent (id, e) {
    const { activeEvent } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (!activeEvent || activeEvent._id !== id) ? id : null
    app.Actions.getEvent(idToGet)
  },

  onRemoveEvent (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  removeEvent (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeEvent(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeEventTooltip () {
    return <Tooltip id='removeThisEvent'>remove</Tooltip>
  },

  removeEventGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeEventTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveEvent.bind(this, doc)} />
      </OverlayTrigger>
    )
  },

  eventsRows () {
    const { events, activeEvent, editing, email } = this.props

    if (events.length > 0) {
      return events.map((doc, index) => {
        
      })
    }
    return null
  },

  render () {
    const { activeEvent, showNewEvent, onCloseNewEvent } = this.props
    const { docToRemove } = this.state
    const activeEventId = _.has(activeEvent, '_id') ? activeEvent._id : null
    return (
      <div className='events'>
        <h1>Events</h1>
        <Table responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Migration</th>
              <th>Politics</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </Table>
        {showNewEvent ? <NewEvent onCloseNewEvent={onCloseNewEvent} /> : null}
        {docToRemove ? <ModalRemoveEvent doc={docToRemove} removeEvent={this.removeEvent} /> : null}
      </div>
    )
  }
})
