'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Table, Jumbotron } from 'react-bootstrap'
import moment from 'moment'
import GeminiScrollbar from 'react-gemini-scrollbar'
import _ from 'lodash'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import MonthlyStatisticsRow from './monthlyStatisticsRow.js'
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
    docToRemove: React.PropTypes.object,
    introJumbotronHeight: React.PropTypes.number
  },

  getInitialState () {
    return {
      docToRemove: null,
      dateRowObjects: [],
      introJumbotronHeight: null
    }
  },

  componentDidMount () {
    app.Actions.getEvents()
    this.setIntroJumbotronHeight()
    window.addEventListener('resize', _.debounce(this.setIntroJumbotronHeight, 50))
  },

  componentWillUnmount () {
    window.removeEventListener('resize', _.debounce(this.setIntroJumbotronHeight, 50))
  },

  setIntroJumbotronHeight () {
    const { introJumbotronHeight: introJumbotronHeightOld } = this.state
    const introJumbotronDomNode = this.introJumbotron ? ReactDOM.findDOMNode(this.introJumbotron) : null
    const introJumbotronHeight = introJumbotronDomNode ? introJumbotronDomNode.clientHeight : null
    if (introJumbotronHeight && introJumbotronHeight !== introJumbotronHeightOld) this.setState({ introJumbotronHeight })
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
    dateRowObjects.forEach((dRO, index) => {
      const day = moment(dRO.date).format('D')
      const endOfMonth = moment(dRO.date).endOf('month').format('DD')
      const dROForDateRow = {
        date: dRO.date,
        migrationEvents: dRO.migrationEvents.filter((event) => !event.tags || !event.tags.includes('monthlyStatistics')),
        politicsEvents: dRO.politicsEvents.filter((event) => !event.tags || !event.tags.includes('monthlyStatistics'))
      }
      const dROForMonthlyStatsRow = {
        date: dRO.date,
        migrationEvents: dRO.migrationEvents.filter((event) => event.tags && event.tags.includes('monthlyStatistics')),
        politicsEvents: dRO.politicsEvents.filter((event) => event.tags && event.tags.includes('monthlyStatistics'))
      }
      const dROForMonthlyStatsHasEvents = dROForMonthlyStatsRow.migrationEvents.length > 0 || dROForMonthlyStatsRow.politicsEvents.length > 0
      const needsMonthRow = day === endOfMonth || index === 0
      const needsMonthlyStatisticsRow = day === endOfMonth && dROForMonthlyStatsHasEvents
      if (needsMonthRow) {
        dateRows.push(<MonthRow key={index + 'monthRow'} dateRowObject={dRO} />)
      }
      if (needsMonthlyStatisticsRow) {
        dateRows.push(<MonthlyStatisticsRow key={index + 'monthlyStatisticsRow'} dateRowObject={dROForMonthlyStatsRow} email={email} onRemoveEvent={this.onRemoveEvent} />)
      }
      dateRows.push(<DateRow key={index} dateRowObject={dROForDateRow} email={email} onRemoveEvent={this.onRemoveEvent} />)
    })
    return dateRows
  },

  render () {
    const { showNewEvent, onCloseNewEvent, activeEvent, onChangeActiveEvent } = this.props
    const { docToRemove, introJumbotronHeight } = this.state
    const eventsTableHeadTop = introJumbotronHeight ? introJumbotronHeight + 18 : 326
    const eventsTableHeadStyle = {
      top: eventsTableHeadTop
    }

    return (
      <div className='events'>
        <Jumbotron ref={(j) => this.introJumbotron = j} className='eventsIntro'>
          <p>In 2015, Europe witnessed a tremen&shy;dous increase in the arrival of mi&shy;grants and refu&shy;gees. Most of them had to cross the blue bor&shy;ders of the Eas&shy;tern and Cen&shy;tral Me&shy;di&shy;ter&shy;ra&shy;ne&shy;an.</p>
          <p><strong>The pur&shy;pose of this web&shy;site is to gain an over&shy;view by cove&shy;ring chro&shy;no&shy;lo&shy;gi&shy;cal&shy;ly both ma&shy;ri&shy;ti&shy;me and poli&shy;ti&shy;cal events.</strong></p>
          <p style={{ marginBottom: 0 }}>Maritime events in&shy;clude in&shy;for&shy;ma&shy;tion on em&shy;bar&shy;ka&shy;tion, ac&shy;ci&shy;dents, search and res&shy;cue (SAR) ope&shy;ra&shy;tions, vic&shy;tims and dis&shy;em&shy;bar&shy;ka&shy;tion. By po&shy;li&shy;ti&shy;cal events I mean the re&shy;ac&shy;tions and ac&shy;tions un&shy;der&shy;ta&shy;ken by na&shy;tio&shy;nal, re&shy;gio&shy;nal and glo&shy;bal ac&shy;tors, pub&shy;lic as well as private.</p>
        </Jumbotron>
        <Table id='eventsTableHead' condensed hover style={eventsTableHeadStyle}>
          <colgroup>
            <col className='day' />
            <col className='migration' />
            <col className='politics' />
          </colgroup>
          <thead>
            <tr>
              <th className='day'>Date</th>
              <th className='migration'>Maritime Events</th>
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
