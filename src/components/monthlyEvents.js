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
    docs: React.PropTypes.array,
    editing: React.PropTypes.bool,
    onSaveArticle: React.PropTypes.func
  },

  getInitialState () {
    return {
      docs: []
    }
  },

  componentDidMount () {
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    app.Actions.getMonthlyEvents()
  },

  onMonthlyEventsStoreChange (docs) {
    this.setState({ docs })
  },

  yearsOfEvents () {
    let { docs } = this.state
    const allYears = _.map(docs, (doc) => getYearFromEventId(doc._id))
    if (allYears.length > 0) {
      const years = _.uniq(allYears)
      return years.sort().reverse()
    }
    return []
  },

  eventYears () {
    let { docs } = this.state
    const years = this.yearsOfEvents()
    if (docs.length > 0 && years.length > 0) {
      docs = docs.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return years.map((year, yIndex) => {
        return (
          <Panel key={yIndex} header={year} eventKey={yIndex} className='year'>
            {this.eventsOfYear(year)}
          </Panel>
        )
      })
    }
    return null
  },

  eventsOfYear (year) {
    return (
      <PanelGroup defaultActiveKey='0' accordion>
        {this.events(year)}
      </PanelGroup>
    )
  },

  events (year) {
    let { docs, editing, onSaveArticle } = this.state
    let events = []
    docs.forEach((doc, dIndex) => {
      if (getYearFromEventId(doc._id) === year) {
        const event = (
          <Panel
            key={dIndex}
            header={doc.title}
            eventKey={dIndex}
            className='month'
          >
            <Event doc={doc} editing={editing} onSaveArticle={onSaveArticle} />
          </Panel>
        )
        events.push(event)
      }
    })
    return events
  },

  render () {
    return (
      <div id='events'>
        <h1>Events</h1>
        <PanelGroup defaultActiveKey={0} accordion>
          {this.eventYears()}
        </PanelGroup>
      </div>
    )
  }
})
