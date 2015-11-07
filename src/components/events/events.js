'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon, Tooltip, OverlayTrigger, Table } from 'react-bootstrap'
import moment from 'moment'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import NewEvent from './newEvent.js'
import ModalRemoveEvent from './modalRemoveEvent.js'
import getDaterowObjectsSinceOldestEvent from '../../modules/getDaterowObjectsSinceOldestEvent.js'

export default React.createClass({
  displayName: 'Events',

  propTypes: {
    events: React.PropTypes.array,
    activeEvent: React.PropTypes.object,
    dateRowObjects: React.PropTypes.array,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onCloseNewEvent: React.PropTypes.func,
    showNewEvent: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docToRemove: null,
      dateRowObjects: []
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

  dateRows () {
    const { events } = this.props
    const dateRowObjects = getDaterowObjectsSinceOldestEvent(events)
    let dateRows = []
    dateRowObjects.forEach((dateRowObject, index) => {
      const day = moment(dateRowObject.date).format('D')
      const endOfMonth = moment(dateRowObject.date).endOf('month').format('DD')
      const needsMonthRow = day === endOfMonth || index === 0
      if (needsMonthRow) dateRows.push(<MonthRow key={index + 'monthRow'} dateRowObject={dateRowObject} />)
      dateRows.push(<DateRow key={index} dateRowObject={dateRowObject} />)
    })
    return dateRows
  },

  render () {
    const { showNewEvent, onCloseNewEvent } = this.props
    const { docToRemove } = this.state

    return (
      <div className='events'>
        <h1>Events</h1>
        <div id='eventsTableContainer'>
          <Table condensed hover>
            <colgroup>
              <col className='day' />
              <col className='migration' />
              <col className='politics' />
            </colgroup>
            <thead>
              <tr>
                <th className='day'>Date</th>
                <th className='migration'>Migration</th>
                <th className='politics'>Politics</th>
              </tr>
            </thead>
            <tbody>
              {this.dateRows()}
            </tbody>
          </Table>
        </div>
        {showNewEvent ? <NewEvent onCloseNewEvent={onCloseNewEvent} /> : null}
        {docToRemove ? <ModalRemoveEvent doc={docToRemove} removeEvent={this.removeEvent} /> : null}
      </div>
    )
  }
})
