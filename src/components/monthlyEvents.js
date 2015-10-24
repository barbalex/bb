'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import Event from './event.js'

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
    const dates = _.pluck(docs, 'date')
    if (dates.length > 0) {
      const allYears = dates.map((datenumber) => {
        const date = new Date(datenumber)
        const year = date.getFullYear()
        return year
      })
      const years = _.uniq(allYears)
      return years.sort().reverse()
    }
    return []
  },

  eventsOfYearPanel (year) {
    return (
      <PanelGroup defaultActiveKey='0' accordion>
        {this.eventsOfYear(year)}
      </PanelGroup>
    )
  },

  eventsOfYear (year) {
    let { docs, editing, onSaveArticle } = this.state
    let events = []
    docs.forEach((doc, dIndex) => {
      const date = new Date(doc.date)
      if (date.getFullYear() === year) {
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

  events () {
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
            {this.eventsOfYearPanel(year)}
          </Panel>
        )
      })
    }
    return null
  },

  render () {
    console.log('rendering monthly events')
    return (
      <div id='events'>
        <h1>Events</h1>
        <PanelGroup defaultActiveKey={0} accordion>
          {this.events()}
        </PanelGroup>
      </div>
    )
  }
})
