'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import Event from './event.js'
import getYearFromEventId from '../modules/getYearFromEventId.js'

export default React.createClass({
  displayName: 'Events',

  mixins: [ListenerMixin],

  propTypes: {
    events: React.PropTypes.array,
    event: React.PropTypes.object,
    activeYear: React.PropTypes.number,
    editing: React.PropTypes.bool,
    onSaveArticle: React.PropTypes.func
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

  onClickMonthlyEvent (id) {
    const { event } = this.props
    const idToGet = (Object.keys(event).length === 0 || event._id !== id) ? id : null
    app.Actions.getEvent(idToGet)
  },

  onClickYear (activeYear) {
    this.setState({ activeYear })
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
    const { event } = this.props
    const activeEventId = _.has(event, '_id') ? event._id : null
    return (
      <PanelGroup activeKey={activeEventId} accordion>
        {this.monthlyEvents(year)}
      </PanelGroup>
    )
  },

  monthlyEvents (year) {
    const { event } = this.props
    const { events, editing, onSaveArticle } = this.state
    // console.log('monthlyEvents.js, monthlyEvents, event', event)
    let monthlyEvents = []
    events.forEach((doc, dIndex) => {
      if (getYearFromEventId(doc._id) === year) {
        const showEvent = event ? doc._id === event._id : false
        // console.log('monthlyEvents.js, monthlyEvents, doc', doc)
        // console.log('monthlyEvents.js, monthlyEvents, showEvent', showEvent)
        const eventComponent = (
          <Panel
            key={dIndex}
            header={doc.title}
            eventKey={doc._id}
            className='month'
            onClick={this.onClickMonthlyEvent.bind(this, doc._id)}
          >
            {showEvent ? <Event doc={event} editing={editing} onSaveArticle={onSaveArticle} /> : null}
          </Panel>
        )
        /* version with pure bootstrap. advantage: could add edit icon to panel-heading
        const event = (
          <div key={dIndex} className='panel panel-default month'>
            <div className='panel-heading' role='tab' id={'heading' + dIndex}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#accordion' href={'#collapse' + dIndex} aria-expanded='true' aria-controls={'#collapse' + dIndex}>
                  {doc.title}
                </a>
              </h4>
            </div>
            <div id={'#collapse' + dIndex} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + dIndex}>
              <div className='panel-body'>
                <Event doc={doc} editing={editing} onSaveArticle={onSaveArticle} />
              </div>
            </div>
          </div>
        )*/
        monthlyEvents.push(eventComponent)
      }
    })
    return monthlyEvents
  },

  render () {
    const { event } = this.props
    let activeYear
    if (_.has(event, '_id')) {
      activeYear = getYearFromEventId(event._id)
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
