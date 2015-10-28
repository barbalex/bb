'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel, Glyphicon } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import MonthlyEvent from './monthlyEvent.js'
import getYearFromEventId from '../modules/getYearFromEventId.js'
import getMonthFromEventId from '../modules/getMonthFromEventId.js'

export default React.createClass({
  displayName: 'Events',

  mixins: [ListenerMixin],

  propTypes: {
    events: React.PropTypes.array,
    monthlyEvent: React.PropTypes.object,
    activeYear: React.PropTypes.number,
    editing: React.PropTypes.bool,
    onSaveMonthlyEvent: React.PropTypes.func
  },

  getInitialState () {
    return {
      events: [],
      activeYear: null
    }
  },

  componentDidMount () {
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    app.Actions.getMonthlyEvents()
  },

  onMonthlyEventsStoreChange (events) {
    this.setState({ events })
  },

  onClickMonthlyEvent (id, e) {
    const { monthlyEvent } = this.props
    // prevent higher level panels from reacting
    e.stopPropagation()
    // make sure the heading was clicked
    const parent = e.target.parentElement
    const headingWasClicked = _.includes(parent.className, 'panel-title') || _.includes(parent.className, 'panel-heading')
    if (headingWasClicked) {
      const idToGet = (Object.keys(monthlyEvent).length === 0 || monthlyEvent._id !== id) ? id : null
      app.Actions.getEvent(idToGet)
    }
  },

  onRemoveMonthlyEvent (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    console.log('remove monthlyEvent', docToRemove)
  },

  onClickYear (activeYear) {
    this.setState({ activeYear })
    // make sure no monthlyEvent is loaded
    // i.e. if an monthlyEvent was loaded it is unloaded
    app.Actions.getEvent(null)
  },

  yearsOfEvents () {
    let { events } = this.state
    const allYears = _.map(events, (doc) => getYearFromEventId(doc._id))
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

  eventYears () {
    let { events } = this.state
    const years = this.yearsOfEvents()
    if (events.length > 0 && years.length > 0) {
      events = events.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return years.map((year, yIndex) => {
        return (
          <Panel key={year} header={year} eventKey={year} className='year' onClick={this.onClickYear.bind(this, year)}>
            {this.eventsOfYear(year)}
          </Panel>
        )
      })
    }
    return null
  },

  eventsOfYear (year) {
    const { monthlyEvent } = this.props
    const activeEventId = _.has(monthlyEvent, '_id') ? monthlyEvent._id : null
    return (
      <PanelGroup activeKey={activeEventId} id={year} accordion>
        {this.monthlyEvents(year)}
      </PanelGroup>
    )
  },

  monthlyEvents (year) {
    const { monthlyEvent, editing, onSaveMonthlyEvent } = this.props
    const { events } = this.state
    let monthlyEvents = []
    events.forEach((doc, dIndex) => {
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
        // version with react-bootstrap
        // disadvantage: cant show remove glyphs
        /*const eventComponent = (
          <Panel
            key={dIndex}
            header={month}
            eventKey={doc._id}
            className='month'
            onClick={this.onClickMonthlyEvent.bind(this, doc._id)}
          >
            {showEvent ? <MonthlyEvent doc={monthlyEvent} editing={editing} onSaveMonthlyEvent={onSaveMonthlyEvent} /> : null}
            {showRemoveGlyphicon ?
              <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveMonthlyEvent.bind(this, doc)} />
              : null
            }
          </Panel>
        )*/
        // version with pure bootstrap.
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
            <div id={'#collapse' + dIndex} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + dIndex}>
              <div className='panel-body'>
                {showEvent ? <MonthlyEvent doc={monthlyEvent} editing={editing} onSaveMonthlyEvent={onSaveMonthlyEvent} /> : null}
              </div>
            </div>
          </div>
        )
        monthlyEvents.push(eventComponent)
      }
    })
    return monthlyEvents
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
      <div id='events'>
        <h1>Events</h1>
        <PanelGroup activeKey={activeYear} accordion>
          {this.eventYears()}
        </PanelGroup>
      </div>
    )
  }
})
