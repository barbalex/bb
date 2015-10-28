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
    onSaveMonthlyEvent: React.PropTypes.func,
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
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    app.Actions.getMonthlyEvents()
  },

  onMonthlyEventsStoreChange (monthlyEvents) {
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

  eventYearsComponent () {
    const { monthlyEvent, editing, onSaveMonthlyEvent } = this.props
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
            <MonthlyEventsOfYear year={year} monthlyEvents={monthlyEvents} monthlyEvent={monthlyEvent} editing={editing} onSaveMonthlyEvent={onSaveMonthlyEvent} />
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