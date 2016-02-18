'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Table, Button } from 'react-bootstrap'
import moment from 'moment'
import { min } from 'lodash'
import GeminiScrollbar from 'react-gemini-scrollbar'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import MonthlyStatisticsRow from './monthlyStatisticsRow.js'
import getDaterowObjectsSinceOldestEvent from '../../modules/getDaterowObjectsSinceOldestEvent.js'

export default React.createClass({
  displayName: 'Events',

  propTypes: {
    events: React.PropTypes.array,
    yearsOfEvents: React.PropTypes.array,
    dateRowObjects: React.PropTypes.array,
    email: React.PropTypes.string,
    introJumbotronHeight: React.PropTypes.number,
    activeEventYears: React.PropTypes.array,
    setActiveEventYears: React.PropTypes.func,
    onRemoveEvent: React.PropTypes.func
  },

  getInitialState () {
    return {
      dateRowObjects: []
    }
  },

  dateRows () {
    const { events, email, onRemoveEvent, activeEventYears } = this.props
    const dateRowObjects = getDaterowObjectsSinceOldestEvent(events, activeEventYears)
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
              onRemoveEvent={onRemoveEvent} />
          )
        }
        dateRows.push(
          <DateRow
          key={index}
          dateRowObject={dROForDateRow}
          email={email}
          onRemoveEvent={onRemoveEvent} />
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

  showNextYearButton () {
    const { activeEventYears, yearsOfEvents } = this.props
    const firstActiveEventYear = min(activeEventYears)
    const firstEventYear = yearsOfEvents.length > 0 ? min(yearsOfEvents) : 2015
    console.log('firstEventYear', firstEventYear)
    const divStyle = {
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 30
    }
    if (firstActiveEventYear > firstEventYear) {
      return (
        <div style={divStyle}>
          <Button
            onClick={this.showNextYear}
          >
            load events for {min(activeEventYears) - 1}
          </Button>
        </div>
      )
    }
    if (firstActiveEventYear === firstEventYear) {
      return (
        <div style={divStyle}>
          <Button
            onClick={this.showArchive}
          >
            see events between 2011 and 2014 in the archive
          </Button>
        </div>
      )
    }
    if (firstActiveEventYear < firstEventYear) return null
  },

  showNextYear () {
    let { activeEventYears, setActiveEventYears } = this.props
    activeEventYears.push(min(activeEventYears) - 1)
    app.Actions.getEvents(activeEventYears)
    setActiveEventYears(activeEventYears)
  },

  showArchive () {
    app.Actions.getPage('pages_monthlyEvents')
  },

  render () {
    const { introJumbotronHeight, activeEventYears } = this.props
    // const eventsTableHeadTop = introJumbotronHeight ? introJumbotronHeight + 65 : 373
    const eventsTableHeadTop = introJumbotronHeight ? introJumbotronHeight + 88 : 368
    const eventsTableHeadStyle = {
      top: eventsTableHeadTop
    }
    const fontSize = window.innerWidth < 500 ? 20 : 24
    const headerStyle = {
      fontSize: fontSize,
      whiteSpace: 'nowrap',
      textOverflox: 'ellipsis',
      textAlign: 'center'
    }
    const showNextYearButton = min(activeEventYears) > 2014

    return (
      <div>
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
          {
            showNextYearButton &&
            this.showNextYearButton()
          }
        </GeminiScrollbar>

      </div>
    )
  }
})
