'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { ButtonGroup, Button } from 'react-bootstrap'
import moment from 'moment'
import { debounce, min } from 'lodash'
import IntroJumbotron from './introJumbotron.js'
import NewEvent from './newEvent.js'
import EditEvent from './editEvent.js'
import ModalRemoveEvent from './modalRemoveEvent.js'
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
    activeEventYears: React.PropTypes.array,
    setActiveEventYears: React.PropTypes.func
  },

  getInitialState () {
    return {
      docToRemove: null,
      introJumbotronHeight: null
    }
  },

  componentDidMount () {
    app.Actions.getEvents([parseInt(moment().format('YYYY'), 0)])
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
    const { events, activeEventYears } = this.props
    const years = getYearsFromEvents(events)
    return years.map((year, index) => {
      return (
        <Button
          key={index}
          active={activeEventYears.includes(year)}
          onClick={this.setActiveYear.bind(this, year)}
        >
          {year}
        </Button>
      )
    })
  },

  showArchive () {
    app.Actions.getPage('pages_monthlyEvents')
  },

  setActiveYear (activeEventYears) {
    const { setActiveEventYears } = this.props
    activeEventYears = [activeEventYears]
    app.Actions.getEvents(activeEventYears)
    setActiveEventYears(activeEventYears)
  },

  render () {
    const { events, email, showNewEvent, onCloseNewEvent, activeEvent, onChangeActiveEvent, activeEventYears, setActiveEventYears } = this.props
    const { docToRemove, introJumbotronHeight } = this.state
    const showEventsTable = min(activeEventYears) > 2014

    return (
      <div className='events'>
        <IntroJumbotron ref={(j) => this.introJumbotron = j} />
        <div style={{ textAlign: 'center' }}>Choose a year:&nbsp;
          <ButtonGroup>
            {this.yearButtons()}
            <Button
              onClick={this.showArchive}
            >
              2014 - 2011 (Archive)
            </Button>
          </ButtonGroup>
        </div>
        {
          showEventsTable &&
          <EventsTable
            events={events}
            email={email}
            activeEventYears={activeEventYears}
            setActiveEventYears={setActiveEventYears}
            introJumbotronHeight={introJumbotronHeight}
            onRemoveEvent={this.onRemoveEvent} />
        }
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
