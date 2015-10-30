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
    maxVictims: React.PropTypes.number
  },

  getInitialState () {
    return {
      monthlyEvents: [],
      maxArrivals: null,
      maxVictims: null,
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
    console.log('maxArrivals', maxArrivals)
    console.log('maxVictims', maxVictims)
  },

  getMaxArrivals (monthlyEvents) {
    let arrivalsArray = []
    monthlyEvents.forEach((monthlyEvent) => {
      if (monthlyEvent.arrivals) arrivalsArray.push(monthlyEvent.arrivals)
    })
    const maxArrivals = arrivalsArray.length > 0 ? _.max(arrivalsArray) : null
    return maxArrivals
  },

  getMaxVictims (monthlyEvents) {
    let victimsArray = []
    monthlyEvents.forEach((monthlyEvent) => {
      if (monthlyEvent.victims) victimsArray.push(monthlyEvent.victims)
    })
    const maxVictims = victimsArray.length > 0 ? _.max(victimsArray) : null
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

  eventYearsComponent () {
    const { monthlyEvent, editing, email, onSaveMonthlyEventArticle } = this.props
    let { monthlyEvents } = this.state
    const years = this.yearsOfEvents()
    if (monthlyEvents.length > 0 && years.length > 0) {
      monthlyEvents = monthlyEvents.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return years.map((year, yIndex) => {
        return (
          <Panel key={year} header={year} eventKey={year} className='year' onClick={this.onClickYear.bind(this, year)}>
            <MonthlyEventsOfYear year={year} monthlyEvents={monthlyEvents} monthlyEvent={monthlyEvent} editing={editing} email={email} onSaveMonthlyEventArticle={onSaveMonthlyEventArticle} />
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
    return (
      <div id='monthlyEvents'>
        <h1>Events</h1>
        <PanelGroup activeKey={activeYear} accordion>
          {this.eventYearsComponent()}
        </PanelGroup>
        {showNewMonthlyEvent ? <NewMonthlyEvent onCloseNewMonthlyEvent={onCloseNewMonthlyEvent} /> : null}
      </div>
    )
  }
})
