'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import MonthlyEventsOfYear from './monthlyEventsOfYear.js'
import NewMonthlyEvent from './newMonthlyEvent.js'

export default React.createClass({
  displayName: 'MonthlyEvents',

  mixins: [ListenerMixin],

  propTypes: {
    monthlyEvents: React.PropTypes.array,
    activeMonthlyEvent: React.PropTypes.object,
    activeYear: React.PropTypes.number,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveMonthlyEventArticle: React.PropTypes.func,
    onCloseNewMonthlyEvent: React.PropTypes.func,
    showNewMonthlyEvent: React.PropTypes.bool,
    maxArrivalsAndVictims: React.PropTypes.number
  },

  getInitialState () {
    return {
      monthlyEvents: [],
      maxArrivalsAndVictims: null,
      activeYear: null
    }
  },

  componentDidMount () {
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    app.Actions.getMonthlyEvents()
  },

  onMonthlyEventsStoreChange (monthlyEvents) {
    const { email } = this.props
    if (!email) monthlyEvents = monthlyEvents.filter((monthlyEvent) => !monthlyEvent.draft)
    const maxArrivalsAndVictims = this.getMaxArrivalsAndVictims(monthlyEvents)
    this.setState({ monthlyEvents, maxArrivalsAndVictims })
  },

  getMaxArrivalsAndVictims (monthlyEvents) {
    let avArray = []
    monthlyEvents.forEach((monthlyEvent) => {
      if (monthlyEvent.arrivals) avArray.push(monthlyEvent.arrivals)
      if (monthlyEvent.victims) avArray.push(monthlyEvent.victims)
    })
    return avArray.length > 0 ? _.max(avArray) : 0
  },

  onClickYear (activeYear) {
    this.setState({ activeYear })
    // make sure no monthlyEvent is loaded
    // i.e. if an monthlyEvent was loaded it is unloaded
    app.Actions.getMonthlyEvent(null)
  },

  yearsOfEvents () {
    let { monthlyEvents } = this.state
    const allYears = _.map(monthlyEvents, (doc) => getYearFromEventId(doc._id))
    if (allYears.length > 0) {
      const years = _.uniq(allYears)
      return years.sort().reverse()
    }
    return []
  },

  mostRecentYear () {
    const years = this.yearsOfEvents()
    return years[0]
  },

  eventYearsComponent (activeYear) {
    const { activeMonthlyEvent, editing, email, onSaveMonthlyEventArticle } = this.props
    const { maxArrivalsAndVictims } = this.state
    let { monthlyEvents } = this.state
    const years = this.yearsOfEvents()
    if (monthlyEvents.length > 0 && years.length > 0) {
      monthlyEvents = monthlyEvents.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return years.map((year, yIndex) => {
        // wanted to only build MonthlyEventsOfYear if isActiveYear
        // but opening a year was way to hideous
        // const isActiveYear = year === activeYear
        return (
          <Panel key={year} header={year} eventKey={year} className='year' onClick={this.onClickYear.bind(this, year)}>
            <MonthlyEventsOfYear year={year} monthlyEvents={monthlyEvents} activeMonthlyEvent={activeMonthlyEvent} maxArrivalsAndVictims={maxArrivalsAndVictims} editing={editing} email={email} onSaveMonthlyEventArticle={onSaveMonthlyEventArticle} />
          </Panel>
        )
      })
    }
    return null
  },

  render () {
    const { activeMonthlyEvent, showNewMonthlyEvent, onCloseNewMonthlyEvent } = this.props
    const { maxArrivalsAndVictims } = this.state
    let activeYear
    if (_.has(activeMonthlyEvent, '_id')) {
      activeYear = getYearFromEventId(activeMonthlyEvent._id)
    } else {
      activeYear = this.state.activeYear ? this.state.activeYear : this.mostRecentYear()
    }
    const numbersDivStyle = {
      position: 'relative'
    }
    const minStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      marginBottom: 0
    }
    const textStyle = {
      width: 100 + '%',
      textAlign: 'center',
      marginBottom: 0
    }
    const maxStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      marginBottom: 0
    }
    const victimsStyle = {
      color: '#CE0000',
      marginRight: 45
    }
    const arrivalsStyle = {
      color: '#0000A5',
      marginLeft: 45
    }
    return (
      <div id='monthlyEvents'>
        <h1>Events</h1>
        <div style={numbersDivStyle}>
          <p style={minStyle}>&#60;&#32;0</p>
          <p style={textStyle}><span style={victimsStyle}>victims</span><span style={arrivalsStyle}>arrivals</span></p>
          <p style={maxStyle}>{maxArrivalsAndVictims}&#32;&#62;</p>
        </div>
        <PanelGroup activeKey={activeYear} accordion>
          {this.eventYearsComponent(activeYear)}
        </PanelGroup>
        {showNewMonthlyEvent ? <NewMonthlyEvent onCloseNewMonthlyEvent={onCloseNewMonthlyEvent} /> : null}
      </div>
    )
  }
})
