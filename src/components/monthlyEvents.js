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
    activeEventId: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onSaveArticle: React.PropTypes.func
  },

  getInitialState () {
    const { event } = this.props
    const activeYear = event && event._id ? getYearFromEventId(event._id) : this.mostRecentYear()
    const activeEventId = event && event._id ? event._id : null
    return {
      events: [],
      activeYear: activeYear,
      activeEventId: activeEventId
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
    if (!event || event._id !== id) {
      app.Actions.getEvent(id)
    } else {
      app.Actions.getEvent(null)
    }
  },

  onClickYear (year) {

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
    const { activeEventId } = this.state
    return (
      <PanelGroup activeKey={activeEventId} accordion>
        {this.monthlyEvents(year)}
      </PanelGroup>
    )
  },

  monthlyEvents (year) {
    const { event } = this.props
    const { events, editing, onSaveArticle } = this.state
    let monthlyEvents = []
    events.forEach((doc, dIndex) => {
      if (getYearFromEventId(doc._id) === year) {
        const showEvent = event ? doc._id === event._id : false
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
    const { activeYear } = this.state
    console.log('event', event)
    return (
      <div id='events'>
        <h1>Events</h1>
        <PanelGroup activeKey={activeYear} accordion>
          {/*this.eventYears()*/}
        </PanelGroup>
      </div>
    )
  }
})
