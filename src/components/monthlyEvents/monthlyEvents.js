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
    showNewMonthlyEvent: React.PropTypes.bool
  },

  getInitialState () {
    return {
      monthlyEvents: [],
      activeYear: null
    }
  },

  componentDidMount () {
    this.listenTo(app.activeMonthlyEventStore, this.onActiveMonthlyEventStoreChange)
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    app.Actions.getMonthlyEvents()
  },

  onActiveMonthlyEventStoreChange (activeMonthlyEvent) {
    // need to requery monthly events
    // so new / changed arrivals and victims are shown
    app.Actions.getMonthlyEvents()
  },

  onMonthlyEventsStoreChange (monthlyEvents) {
    const { email } = this.props
    if (!email) monthlyEvents = monthlyEvents.filter((monthlyEvent) => !monthlyEvent.draft)
    this.setState({ monthlyEvents })
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
    let { monthlyEvents } = this.state
    const years = this.yearsOfEvents()
    if (monthlyEvents.length > 0 && years.length > 0) {
      monthlyEvents = monthlyEvents.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return years.map((year, yIndex) => {
        const className = year === activeYear ? 'year active' : 'year not-active'
        // wanted to only build MonthlyEventsOfYear if isActiveYear
        // but opening a year was way to hideous
        return (
          <Panel key={year} header={year} eventKey={year} className={className} onClick={this.onClickYear.bind(this, year)}>
            <MonthlyEventsOfYear year={year} monthlyEvents={monthlyEvents} activeMonthlyEvent={activeMonthlyEvent} editing={editing} email={email} onSaveMonthlyEventArticle={onSaveMonthlyEventArticle} />
          </Panel>
        )
      })
    }
    return null
  },

  render () {
    const { activeMonthlyEvent, showNewMonthlyEvent, onCloseNewMonthlyEvent } = this.props
    let activeYear
    if (_.has(activeMonthlyEvent, '_id')) {
      activeYear = getYearFromEventId(activeMonthlyEvent._id)
    } else {
      activeYear = this.state.activeYear ? this.state.activeYear : this.mostRecentYear()
    }
    return (
      <div id='monthlyEvents'>
        <h1>Events</h1>
        <PanelGroup activeKey={activeYear} accordion>
          {this.eventYearsComponent(activeYear)}
        </PanelGroup>
        {showNewMonthlyEvent ? <NewMonthlyEvent onCloseNewMonthlyEvent={onCloseNewMonthlyEvent} /> : null}
      </div>
    )
  }
})
