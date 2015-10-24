'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'

export default React.createClass({
  displayName: 'Events',

  mixins: [ListenerMixin],

  propTypes: {
    docs: React.PropTypes.array
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

  eventsOfYear (year) {
    let { docs } = this.state
    let events = []
    docs.forEach((doc, dIndex) => {
      const date = new Date(doc.date)
      if (date.getFullYear() === year) {
        const event = (
          <li
            key={dIndex}
            className='list-group-item'
          >
            {doc.title}
            <Glyphicon className='pull-right' glyph='pencil' />
          </li>
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
          <div key={yIndex} className='panel panel-default'>
            <div className='panel-heading' role='tab' id='headingOne'>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#accordion' href='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                  {year}
                </a>
              </h4>
            </div>
            <div id='collapseOne' className='panel-collapse collapse in' role='tabpanel' aria-labelledby='headingOne'>
              <div className='list-group'>
                {this.eventsOfYear(year)}
              </div>
            </div>
          </div>
        )
      })
    }
    return null
  },

  render () {
    console.log('rendering monthly events')
    return (
      <div>
        <h1>Events</h1>
        <div className='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>
          {this.events()}
        </div>
      </div>
    )
  }
})
