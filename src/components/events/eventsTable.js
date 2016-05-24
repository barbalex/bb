'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { min } from 'lodash'
import GeminiScrollbar from 'react-gemini-scrollbar'
import createDateRows from './createDateRows.js'

export default React.createClass({
  displayName: 'Events',

  propTypes: {
    events: React.PropTypes.array,
    yearsOfEvents: React.PropTypes.array,
    email: React.PropTypes.string,
    introJumbotronHeight: React.PropTypes.number,
    activeEventYears: React.PropTypes.array,
    setActiveEventYears: React.PropTypes.func,
    onRemoveEvent: React.PropTypes.func,
    showNextButton: React.PropTypes.bool
  },

  getInitialState () {
    return {
      showNextButton: false
    }
  },

  componentWillMount () {
    // delay showing of next buttons
    setTimeout(() => {
      this.setState({ showNextButton: true })
    }, 1000)
  },

  showNextYearButton () {
    const { activeEventYears, yearsOfEvents } = this.props
    const { showNextButton } = this.state
    const firstActiveEventYear = min(activeEventYears)
    const firstEventYear = yearsOfEvents.length > 0 ? min(yearsOfEvents) : 2015
    const divStyle = {
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 30
    }
    if (firstActiveEventYear > firstEventYear) {
      return (
        <div
          style={divStyle}
          className={showNextButton ? '' : 'hidden'} >
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
        <div
          style={divStyle}
          className={showNextButton ? '' : 'hidden'} >
          <Button
            onClick={this.showArchive}
          >
            load events from 2011 to 2014
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
    const { introJumbotronHeight, activeEventYears, events, email, onRemoveEvent } = this.props
    const eventsTableHeadTop = introJumbotronHeight ? introJumbotronHeight + 88 : 396
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
        <Table
          id='eventsTableHead'
          condensed
          hover
          style={eventsTableHeadStyle}
        >
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
              {createDateRows(events, email, activeEventYears, onRemoveEvent)}
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
