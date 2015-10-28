'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel, Glyphicon } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import MonthlyEvent from './monthlyEvent.js'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import getMonthFromEventId from '../../modules/getMonthFromEventId.js'

export default React.createClass({
  displayName: 'MonthlyEvents',

  mixins: [ListenerMixin],

  propTypes: {
    monthlyEvents: React.PropTypes.array,
    monthlyEvent: React.PropTypes.object,
    activeYear: React.PropTypes.number,
    editing: React.PropTypes.bool,
    onSaveMonthlyEvent: React.PropTypes.func
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

  onClickMonthlyEvent (id, e) {
    const { monthlyEvent } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (Object.keys(monthlyEvent).length === 0 || monthlyEvent._id !== id) ? id : null
    app.Actions.getMonthlyEvent(idToGet)
  },

  onClickEventCollapse (event) {
    // prevent higher level panels from reacting
    event.preventDefault()
    event.stopPropagation()
  },

  onRemoveMonthlyEvent (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    // TODO
    console.log('remove monthlyEvent', docToRemove)
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
            {this.eventsOfYearComponent(year)}
          </Panel>
        )
      })
    }
    return null
  },

  eventsOfYearComponent (year) {
    const { monthlyEvent } = this.props
    const activeEventId = _.has(monthlyEvent, '_id') ? monthlyEvent._id : null
    return (
      <PanelGroup activeKey={activeEventId} id={year} accordion>
        {this.monthlyEventsComponent(year)}
      </PanelGroup>
    )
  },

  monthlyEventsComponent (year) {
    const { monthlyEvent, editing, onSaveMonthlyEvent } = this.props
    const { monthlyEvents } = this.state
    let monthlyEventsArray = []
    monthlyEvents.forEach((doc, dIndex) => {
      if (getYearFromEventId(doc._id) === year) {
        const showEvent = monthlyEvent ? doc._id === monthlyEvent._id : false
        const month = getMonthFromEventId(doc._id)
        const showRemoveGlyphicon = !!window.localStorage.email
        const glyphStyle = {
          position: 'absolute',
          right: 8,
          top: 6,
          fontSize: 1.5 + 'em'
        }
        const panelHeadingStyle = {
          position: 'relative'
        }
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        const eventComponent = (
          <div key={dIndex} className='panel panel-default month'>
            <div className='panel-heading' role='tab' id={'heading' + dIndex} onClick={this.onClickMonthlyEvent.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent={'#' + year} href={'#collapse' + dIndex} aria-expanded='false' aria-controls={'#collapse' + dIndex}>
                  {month}
                </a>
              </h4>
              {showRemoveGlyphicon ?
                <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveMonthlyEvent.bind(this, doc)} />
                : null
              }
            </div>
            {showEvent ?
              <div id={'#collapse' + dIndex} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + dIndex} onClick={this.onClickEventCollapse}>
                <div className='panel-body'>
                  <MonthlyEvent monthlyEvent={monthlyEvent} editing={editing} onSaveMonthlyEvent={onSaveMonthlyEvent} />
                </div>
              </div>
              : null
            }
          </div>
        )
        monthlyEventsArray.push(eventComponent)
      }
    })
    return monthlyEventsArray
  },

  render () {
    const { monthlyEvent } = this.props
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
      </div>
    )
  }
})
