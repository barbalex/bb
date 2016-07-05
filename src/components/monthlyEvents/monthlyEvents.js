import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import { uniq, has } from 'lodash'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import MonthlyEventsOfYear from './monthlyEventsOfYear.js'
import NewMonthlyEvent from './newMonthlyEvent.js'

export default React.createClass({
  displayName: 'MonthlyEvents',

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

  getInitialState() {
    return {
      activeYear: null
    }
  },

  componentDidMount() {
    app.Actions.getMonthlyEvents()
  },

  onClickYear(activeYear) {
    this.setState({ activeYear })
    // make sure no monthlyEvent is loaded
    // i.e. if an monthlyEvent was loaded it is unloaded
    app.Actions.getMonthlyEvent(null)
  },

  yearsOfEvents() {
    const { monthlyEvents } = this.props
    const allYears = monthlyEvents.map((doc) =>
      getYearFromEventId(doc._id)
    )
    if (allYears.length > 0) {
      const years = uniq(allYears)
      return years.sort().reverse()
    }
    return []
  },

  mostRecentYear() {
    const years = this.yearsOfEvents()
    return years[0]
  },

  eventYearsComponent(activeYear) {
    const {
      activeMonthlyEvent,
      editing,
      email,
      onSaveMonthlyEventArticle
    } = this.props
    let { monthlyEvents } = this.props
    const years = this.yearsOfEvents()
    if (monthlyEvents.length > 0 && years.length > 0) {
      return years.map((year) => {
        const className = year === activeYear ? 'year active' : 'year not-active'
        // wanted to only build MonthlyEventsOfYear if isActiveYear
        // but opening a year was way to hideous
        return (
          <Panel
            key={year}
            header={year}
            eventKey={year}
            className={className}
            onClick={this.onClickYear.bind(this, year)}
          >
            <MonthlyEventsOfYear
              year={year}
              monthlyEvents={monthlyEvents}
              activeMonthlyEvent={activeMonthlyEvent}
              editing={editing}
              email={email}
              onSaveMonthlyEventArticle={onSaveMonthlyEventArticle}
            />
          </Panel>
        )
      })
    }
    return null
  },

  render() {
    const {
      activeMonthlyEvent,
      showNewMonthlyEvent,
      onCloseNewMonthlyEvent
    } = this.props
    let activeYear
    if (has(activeMonthlyEvent, '_id')) {
      activeYear = getYearFromEventId(activeMonthlyEvent._id)
    } else {
      activeYear = this.state.activeYear ? this.state.activeYear : this.mostRecentYear()
    }
    const divStyle = {
      marginBottom: 20
    }

    return (
      <div
        id="monthlyEvents"
        style={divStyle}
      >
        <h1>
          Events Archive
        </h1>
        <PanelGroup
          activeKey={activeYear}
          accordion
        >
          {this.eventYearsComponent(activeYear)}
        </PanelGroup>
        {
          showNewMonthlyEvent &&
          <NewMonthlyEvent
            onCloseNewMonthlyEvent={onCloseNewMonthlyEvent}
          />
        }
      </div>
    )
  }
})
