'use strict'

import React from 'react'
import { Table } from 'react-bootstrap'
import moment from 'moment'
import GeminiScrollbar from 'react-gemini-scrollbar'
import DateRow from './dateRow.js'
import MonthRow from './monthRow.js'
import MonthlyStatisticsRow from './monthlyStatisticsRow.js'
import getDaterowObjectsSinceOldestEvent from '../../modules/getDaterowObjectsSinceOldestEvent.js'

export default React.createClass({
  displayName: 'Events',

  propTypes: {
    events: React.PropTypes.array,
    dateRowObjects: React.PropTypes.array,
    email: React.PropTypes.string,
    introJumbotronHeight: React.PropTypes.number,
    activeYear: React.PropTypes.number,
    onRemoveEvent: React.PropTypes.func
  },

  getInitialState () {
    return {
      dateRowObjects: []
    }
  },

  dateRows () {
    const { events, email, onRemoveEvent, activeYear } = this.props
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

  render () {
    const { introJumbotronHeight } = this.props
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
          <p
            style={{ marginTop: 40, textAlign: 'center', marginBottom: 40 }}>
            Looking for Events between 2011 and 2014? Visit the <a href='/monthlyEvents'>archive</a>.
          </p>
        </GeminiScrollbar>
      </div>
    )
  }
})
