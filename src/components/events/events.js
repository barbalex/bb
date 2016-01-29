'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Table, ButtonGroup, Button } from 'react-bootstrap'
import moment from 'moment'
import GeminiScrollbar from 'react-gemini-scrollbar'
import { debounce } from 'lodash'
import IntroJumbotron from './introJumbotron.js'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import MonthlyStatisticsRow from './monthlyStatisticsRow.js'
import NewEvent from './newEvent.js'
import EditEvent from './editEvent.js'
import ModalRemoveEvent from './modalRemoveEvent.js'
import getDaterowObjectsSinceOldestEvent from '../../modules/getDaterowObjectsSinceOldestEvent.js'
import getYearsFromEvents from '../../modules/getYearsFromEvents.js'
import MonthlyEvents from '../monthlyEvents/monthlyEvents.js'

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
    introJumbotronHeight: React.PropTypes.number,
    activeYear: React.PropTypes.number
  },

  getInitialState () {
    return {
      docToRemove: null,
      dateRowObjects: [],
      introJumbotronHeight: null,
      activeYear: moment().format('YYYY')
    }
  },

  componentDidMount () {
    app.Actions.getEvents(moment().format('YYYY'))
    this.setIntroComponentsHeight()
    window.addEventListener('resize', debounce(this.setIntroComponentsHeight, 50))
  },

  componentWillUnmount () {
    window.removeEventListener('resize', debounce(this.setIntroComponentsHeight, 50))
  },

  setIntroComponentsHeight () {
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
    const { activeYear } = this.state
    const dateRowObjects = getDaterowObjectsSinceOldestEvent(events, activeYear)
    let dateRows = []
    if (dateRowObjects.length > 0) {
      dateRowObjects.forEach((dRO, index) => {
        const day = moment(dRO.date).format('D')
        const endOfMonth = moment(dRO.date).endOf('month').format('DD')
        const dROForDateRow = {
          date: dRO.date,
          migrationEvents: dRO.migrationEvents.filter((event) =>
            !event.tags || !event.tags.includes('monthlyStatistics')
          ),
          politicsEvents: dRO.politicsEvents.filter((event) =>
            !event.tags || !event.tags.includes('monthlyStatistics')
          )
        }
        const dROForMonthlyStatsRow = {
          date: dRO.date,
          migrationEvents: dRO.migrationEvents.filter((event) =>
            event.tags && event.tags.includes('monthlyStatistics')
          ),
          politicsEvents: dRO.politicsEvents.filter((event) =>
            event.tags && event.tags.includes('monthlyStatistics')
          )
        }
        const dROForMonthlyStatsHasEvents = dROForMonthlyStatsRow.migrationEvents.length > 0 || dROForMonthlyStatsRow.politicsEvents.length > 0
        const needsMonthRow = day === endOfMonth || index === 0
        const needsMonthlyStatisticsRow = day === endOfMonth && dROForMonthlyStatsHasEvents
        if (needsMonthRow) {
          dateRows.push(
            <MonthRow
              key={index + 'monthRow'}
              dateRowObject={dRO} />
          )
        }
        if (needsMonthlyStatisticsRow) {
          dateRows.push(
            <MonthlyStatisticsRow
              key={index + 'monthlyStatisticsRow'}
              dateRowObject={dROForMonthlyStatsRow}
              email={email}
              onRemoveEvent={this.onRemoveEvent} />
          )
        }
        dateRows.push(
          <DateRow
          key={index}
          dateRowObject={dROForDateRow}
          email={email}
          onRemoveEvent={this.onRemoveEvent} />
        )
      })
      return dateRows
    } else {
      return (
        <tr>
          <td colSpan='3'>
            <p>Loading events...</p>
          </td>
        </tr>
      )
    }
  },

  yearButtons () {
    const { events } = this.props
    const { activeYear } = this.state
    const years = getYearsFromEvents(events)
    return years.map((year, index) => {
      return (
        <Button
          key={index}
          active={year === activeYear}
          onClick={this.setActiveYear.bind(this, year)}
        >
          {year}
        </Button>
      )
    })
  },

  setActiveYear (activeYear) {
    app.Actions.getEvents(activeYear)
    this.setState({ activeYear })
  },

  render () {
    const { showNewEvent, onCloseNewEvent, activeEvent, onChangeActiveEvent } = this.props
    const { docToRemove, introJumbotronHeight, activeYear } = this.state
    const eventsTableHeadTop = introJumbotronHeight ? introJumbotronHeight + 65 : 373
    const eventsTableHeadStyle = {
      top: eventsTableHeadTop
    }
    const fontSize = window.innerWidth < 500 ? 20 : 21
    const headerStyle = {
      fontSize: fontSize,
      whiteSpace: 'nowrap',
      textOverflox: 'ellipsis',
      textAlign: 'center'
    }
    const showEventsTable = activeYear > 2014
    const showArchive = activeYear === 2013

    return (
      <div className='events'>
        <IntroJumbotron ref={(j) => this.introJumbotron = j} />
        <div style={{ textAlign: 'center' }}>Choose a year:&nbsp;
          <ButtonGroup>
            {this.yearButtons()}
            <Button>2014 - 2011</Button>
          </ButtonGroup>
        </div>
        <Table id='eventsTableHead' condensed hover style={eventsTableHeadStyle}>
          <colgroup>
            <col className='day' />
            <col className='migration' />
            <col className='politics' />
          </colgroup>
          <thead>
            <tr>
              <th className='day' style={headerStyle}></th>
              <th className='migration' style={headerStyle}>Maritime Events</th>
              <th className='politics' style={headerStyle}>Political Events</th>
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
          <p
            style={{ marginTop: 40, textAlign: 'center', marginBottom: 40 }}>
            Looking for Events between 2011 and 2014? Visit the <a href='/monthlyEvents'>archive</a>.
          </p>
        </GeminiScrollbar>
        {
          activeEvent &&
          <EditEvent
            activeEvent={activeEvent}
            onChangeActiveEvent={onChangeActiveEvent} />
        }
        {
          showNewEvent &&
          <NewEvent
            onCloseNewEvent={onCloseNewEvent} />
        }
        {
          docToRemove &&
          <ModalRemoveEvent
            doc={docToRemove}
            removeEvent={this.removeEvent} />
        }
      </div>
    )
  }
})
