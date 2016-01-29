'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { ButtonGroup, Button } from 'react-bootstrap'
import moment from 'moment'
import { debounce } from 'lodash'
import IntroJumbotron from './introJumbotron.js'
import NewEvent from './newEvent.js'
import EditEvent from './editEvent.js'
import ModalRemoveEvent from './modalRemoveEvent.js'
import MonthlyEvents from '../monthlyEvents/monthlyEvents.js'
import EventsTable from './eventsTable.js'
import getYearsFromEvents from '../../modules/getYearsFromEvents.js'

export default React.createClass({
  displayName: 'Events',

  propTypes: {
    events: React.PropTypes.array,
    activeEvent: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onCloseNewEvent: React.PropTypes.func,
    onChangeActiveEvent: React.PropTypes.func,
    showNewEvent: React.PropTypes.bool,
    docToRemove: React.PropTypes.object,
    introJumbotronHeight: React.PropTypes.number,
    activeYear: React.PropTypes.number
  },

  getInitialState () {
    return {
      docToRemove: null,
      introJumbotronHeight: null,
      activeYear: moment().format('YYYY')
    }
  },

  componentDidMount () {
    app.Actions.getEvents(moment().format('YYYY'))
    this.setIntroComponentsHeight()
    window.addEventListener('resize', debounce(this.setIntroComponentsHeight, 50))
  },

  componentWillUnmount () {
    window.removeEventListener('resize', debounce(this.setIntroComponentsHeight, 50))
  },

  setIntroComponentsHeight () {
    const { introJumbotronHeight: introJumbotronHeightOld } = this.state
    const introJumbotronDomNode = this.introJumbotron ? ReactDOM.findDOMNode(this.introJumbotron) : null
    const introJumbotronHeight = introJumbotronDomNode ? introJumbotronDomNode.clientHeight : null
    if (introJumbotronHeight && introJumbotronHeight !== introJumbotronHeightOld) this.setState({ introJumbotronHeight })
  },

  onRemoveEvent (docToRemove) {
    this.setState({ docToRemove })
  },

  removeEvent (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeEvent(docToRemove)
    this.setState({ docToRemove: null })
  },

  yearButtons () {
    const { events } = this.props
    const { activeYear } = this.state
    const years = getYearsFromEvents(events)
    return years.map((year, index) => {
      return (
        <Button
          key={index}
          active={year === activeYear}
          onClick={this.setActiveYear.bind(this, year)}
        >
          {year}
        </Button>
      )
    })
  },

  setActiveYear (activeYear) {
    app.Actions.getEvents(activeYear)
    this.setState({ activeYear })
  },

  render () {
    const { events, email, showNewEvent, onCloseNewEvent, activeEvent, onChangeActiveEvent } = this.props
    const { docToRemove, introJumbotronHeight, activeYear } = this.state
    const showEventsTable = activeYear > 2014
    const showArchive = activeYear === 2013

    return (
      <div className='events'>
        <IntroJumbotron ref={(j) => this.introJumbotron = j} />
        <div style={{ textAlign: 'center' }}>Choose a year:&nbsp;
          <ButtonGroup>
            {this.yearButtons()}
            <Button>2014 - 2011</Button>
          </ButtonGroup>
        </div>
        <EventsTable
          events={events}
          email={email}
          activeYear={activeYear}
          introJumbotronHeight={introJumbotronHeight}
          onRemoveEvent={this.onRemoveEvent} />
        {
          activeEvent &&
          <EditEvent
            activeEvent={activeEvent}
            onChangeActiveEvent={onChangeActiveEvent} />
        }
        {
          showNewEvent &&
          <NewEvent
            onCloseNewEvent={onCloseNewEvent} />
        }
        {
          docToRemove &&
          <ModalRemoveEvent
            doc={docToRemove}
            removeEvent={this.removeEvent} />
        }
      </div>
    )
  }
})
