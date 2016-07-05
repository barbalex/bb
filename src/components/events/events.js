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

export default React.createClass({
  displayName: 'Events',

  propTypes: {
    events: React.PropTypes.array,
    yearsOfEvents: React.PropTypes.array,
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

  getInitialState() {
    return {
      docToRemove: null,
      introJumbotronHeight: null
    }
  },

  componentDidMount() {
    app.Actions.getEvents([parseInt(moment().format('YYYY'), 0)])
    app.Actions.getYearsOfEvents()
    this.setIntroComponentsHeight()
    window.addEventListener('resize', debounce(this.setIntroComponentsHeight, 50))
  },

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.setIntroComponentsHeight, 50))
  },

  onRemoveEvent(docToRemove) {
    this.setState({ docToRemove })
  },

  setIntroComponentsHeight() {
    const { introJumbotronHeight: introJumbotronHeightOld } = this.state
    const introJumbotronDomNode = this.introJumbotron ? ReactDOM.findDOMNode(this.introJumbotron) : null
    const introJumbotronHeight = introJumbotronDomNode ? introJumbotronDomNode.clientHeight : null
    if (introJumbotronHeight && introJumbotronHeight !== introJumbotronHeightOld) {
      this.setState({ introJumbotronHeight })
    }
  },

  setActiveYear(activeEventYears) {
    const { setActiveEventYears } = this.props
    app.Actions.getEvents([activeEventYears])
    setActiveEventYears([activeEventYears])
  },

  yearButtons() {
    const { yearsOfEvents, activeEventYears } = this.props
    return yearsOfEvents.map((year, index) =>
      <Button
        key={index}
        active={activeEventYears.includes(year)}
        onClick={() => this.setActiveYear(year)}
      >
        {year}
      </Button>
    )
  },

  removeEvent(remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeEvent(docToRemove)
    this.setState({ docToRemove: null })
  },

  render() {
    const {
      events,
      yearsOfEvents,
      email,
      showNewEvent,
      onCloseNewEvent,
      activeEvent,
      onChangeActiveEvent,
      activeEventYears,
      setActiveEventYears
    } = this.props
    const {
      docToRemove,
      introJumbotronHeight
    } = this.state
    const showEventsTable = min(activeEventYears) > 2014

    return (
      <div className="events">
        <IntroJumbotron
          ref={(j) => {
            this.introJumbotron = j
          }}
        />
        <div
          style={{ textAlign: 'center' }}
        >
          <ButtonGroup>
            {this.yearButtons()}
            <Button
              onClick={() =>
                app.Actions.getPage('pages_monthlyEvents')
              }
            >
              2014 - 2011
            </Button>
          </ButtonGroup>
        </div>
        {
          showEventsTable &&
          <EventsTable
            events={events}
            yearsOfEvents={yearsOfEvents}
            email={email}
            activeEventYears={activeEventYears}
            setActiveEventYears={setActiveEventYears}
            introJumbotronHeight={introJumbotronHeight}
            onRemoveEvent={this.onRemoveEvent}
          />
        }
        {
          activeEvent &&
          <EditEvent
            activeEvent={activeEvent}
            onChangeActiveEvent={onChangeActiveEvent}
          />
        }
        {
          showNewEvent &&
          <NewEvent
            onCloseNewEvent={onCloseNewEvent}
          />
        }
        {
          docToRemove &&
          <ModalRemoveEvent
            doc={docToRemove}
            removeEvent={this.removeEvent}
          />
        }
      </div>
    )
  }
})
