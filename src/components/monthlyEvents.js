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
    doc: React.PropTypes.object,
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

  onClickMonthlyEvent (id) {
    app.Actions.getDoc(id)
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
    const { doc } = this.props
    const activeKey = doc ? doc._id : null
    return (
      <PanelGroup activeKey={activeKey} accordion>
        {this.events(year)}
      </PanelGroup>
    )
  },

  events (year) {
    const { doc } = this.props
    const { docs, editing, onSaveArticle } = this.state
    let events = []
    docs.forEach((ddoc, dIndex) => {
      if (getYearFromEventId(ddoc._id) === year) {
        const showEvent = doc ? ddoc._id === doc._id : false
        const event = (
          <Panel
            key={dIndex}
            header={ddoc.title}
            eventKey={ddoc._id}
            className='month'
            onClick={this.onClickMonthlyEvent.bind(this, ddoc._id)}
          >
            {showEvent ? <Event doc={doc} editing={editing} onSaveArticle={onSaveArticle} /> : null}
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
        events.push(event)
      }
    })
    return events
  },

  render () {
    const { doc } = this.props
    console.log('monthlyEvents.js, doc', doc)
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
