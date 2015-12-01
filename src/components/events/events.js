'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Table } from 'react-bootstrap'
import moment from 'moment'
import GeminiScrollbar from 'react-gemini-scrollbar'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import NewEvent from './newEvent.js'
import EditEvent from './editEvent.js'
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
    onChangeActiveEvent: React.PropTypes.func,
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

  onRemoveEvent (docToRemove) {
    this.setState({ docToRemove })
  },

  removeEvent (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeEvent(docToRemove)
    this.setState({ docToRemove: null })
  },

  dateRows () {
    const { events, email } = this.props
    const dateRowObjects = getDaterowObjectsSinceOldestEvent(events)
    let dateRows = []
    dateRowObjects.forEach((dateRowObject, index) => {
      const day = moment(dateRowObject.date).format('D')
      const endOfMonth = moment(dateRowObject.date).endOf('month').format('DD')
      const needsMonthRow = day === endOfMonth || index === 0
      if (needsMonthRow) dateRows.push(<MonthRow key={index + 'monthRow'} dateRowObject={dateRowObject} />)
      dateRows.push(<DateRow key={index} dateRowObject={dateRowObject} email={email} onRemoveEvent={this.onRemoveEvent} />)
    })
    return dateRows
  },

  render () {
    const { showNewEvent, onCloseNewEvent, activeEvent, onChangeActiveEvent } = this.props
    const { docToRemove } = this.state
    const introText = `In 2015, Europe witnessed a tremendous increase in the arrival of migrants and refugees. Most of them had to cross the blue borders of the Eastern and Central Mediterranean, often under difficult circumstances. As is to be expected in the age of the Internet, interested observers of these movements are confronted with an enormous amount of information. This is where the present website comes in. Its main purpose is to present an overview by focusing on two topics: on actual blue border events and on the surrounding politics. And, to simplify matters, the information is arranged in chronological order.`

    return (
      <div className='events'>
        <div className='eventsIntro'>
          <p>{introText}</p>
        </div>
        <Table id='eventsTableHead' condensed hover>
          <colgroup>
            <col className='day' />
            <col className='migration' />
            <col className='politics' />
          </colgroup>
          <thead>
            <tr>
              <th className='day'>Date</th>
              <th className='migration'>Migration Events</th>
              <th className='politics'>Political Events</th>
            </tr>
          </thead>
        </Table>
        <GeminiScrollbar id='eventsTableBody' autoshow>
          <Table condensed hover>
            <colgroup>
              <col className='day' />
              <col className='migration' />
              <col className='politics' />
            </colgroup>
            <tbody>
              {this.dateRows()}
            </tbody>
          </Table>
          <p style={{ marginTop: 20 }}>Looking for Events between 2011 and 2014? Visit the <a href='/monthlyEvents'>archive</a>.</p>
        </GeminiScrollbar>
        {
          activeEvent
          ? <EditEvent
              activeEvent={activeEvent}
              onChangeActiveEvent={onChangeActiveEvent} />
          : null
        }
        {
          showNewEvent
          ? <NewEvent
              onCloseNewEvent={onCloseNewEvent} />
          : null
        }
        {
          docToRemove
          ? <ModalRemoveEvent
              doc={docToRemove}
              removeEvent={this.removeEvent} />
          : null
        }
      </div>
    )
  }
})
