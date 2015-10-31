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
    monthlyEvent: React.PropTypes.object,
    activeYear: React.PropTypes.number,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveMonthlyEventArticle: React.PropTypes.func,
    onCloseNewMonthlyEvent: React.PropTypes.func,
    showNewMonthlyEvent: React.PropTypes.bool,
    maxArrivals: React.PropTypes.number,
    maxVictims: React.PropTypes.number,
    showMaxArrivals: React.PropTypes.bool,
    showMaxVictims: React.PropTypes.bool
  },

  getInitialState () {
    return {
      monthlyEvents: [],
      maxArrivals: null,
      maxVictims: null,
      showMaxArrivals: true,
      showMaxVictims: true,
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
    const maxArrivals = this.getMaxArrivals(monthlyEvents)
    const maxVictims = this.getMaxVictims(monthlyEvents)
    this.setState({ monthlyEvents, maxArrivals, maxVictims })
  },

  getMaxArrivals (monthlyEvents) {
    let arrivalsArray = []
    monthlyEvents.forEach((monthlyEvent) => {
      if (monthlyEvent.arrivals) arrivalsArray.push(monthlyEvent.arrivals)
    })
    const maxArrivals = arrivalsArray.length > 0 ? _.max(arrivalsArray) : 0
    return maxArrivals
  },

  getMaxVictims (monthlyEvents) {
    let victimsArray = []
    monthlyEvents.forEach((monthlyEvent) => {
      if (monthlyEvent.victims) victimsArray.push(monthlyEvent.victims)
    })
    const maxVictims = victimsArray.length > 0 ? _.max(victimsArray) : 0
    return maxVictims
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

  getMaxArrivalsVictims () {
    const { maxArrivals, maxVictims } = this.state
    return _.max([maxArrivals, maxVictims])
  },

  eventYearsComponent (activeYear) {
    const { monthlyEvent, editing, email, onSaveMonthlyEventArticle } = this.props
    const { maxArrivals, maxVictims, showMaxArrivals, showMaxVictims } = this.state
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
            <MonthlyEventsOfYear year={year} monthlyEvents={monthlyEvents} monthlyEvent={monthlyEvent} maxArrivals={maxArrivals} maxVictims={maxVictims} showMaxArrivals={showMaxArrivals} showMaxVictims={showMaxVictims} editing={editing} email={email} onSaveMonthlyEventArticle={onSaveMonthlyEventArticle} />
          </Panel>
        )
      })
    }
    return null
  },

  render () {
    const { monthlyEvent, showNewMonthlyEvent, onCloseNewMonthlyEvent } = this.props
    let activeYear
    if (_.has(monthlyEvent, '_id')) {
      activeYear = getYearFromEventId(monthlyEvent._id)
    } else {
      activeYear = this.state.activeYear ? this.state.activeYear : this.mostRecentYear()
    }
    const numbersDivStyle = {
      position: 'relative'
    }
    const minStyle = {
      position: 'absolute',
      top: 0,
      left: 0
    }
    const textStyle = {
      width: 100 + '%',
      textAlign: 'center'
    }
    const maxStyle = {
      position: 'absolute',
      top: 0,
      right: 0
    }
    const victimsStyle = {
      color: 'red',
      marginRight: 8
    }
    const arrivalsStyle = {
      color: 'blue',
      marginLeft: 8
    }
    return (
      <div id='monthlyEvents'>
        <h1>Events</h1>
        <div style={numbersDivStyle}>
          <p style={minStyle}>0</p>
          <p style={textStyle}><span style={victimsStyle}>victims</span><span style={arrivalsStyle}>arrivals</span></p>
          <p style={maxStyle}>{this.getMaxArrivalsVictims()}</p>
        </div>
        <PanelGroup activeKey={activeYear} accordion>
          {this.eventYearsComponent(activeYear)}
        </PanelGroup>
        {showNewMonthlyEvent ? <NewMonthlyEvent onCloseNewMonthlyEvent={onCloseNewMonthlyEvent} /> : null}
      </div>
    )
  }
})
