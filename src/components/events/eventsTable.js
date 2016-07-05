import React from 'react'
import GeminiScrollbar from 'react-gemini-scrollbar'
import DateRows from './dateRows.js'

const Events = ({
  introJumbotronHeight,
  activeEventYears,
  events,
  email,
  onRemoveEvent,
}) => {
  const eventsTableHeadTop = introJumbotronHeight ? introJumbotronHeight + 88 : 173
  const eventsTableHeadStyle = {
    top: eventsTableHeadTop,
    position: 'absolute'
  }
  const fontSize = window.innerWidth < 500 ? 20 : 24
  const headerStyle = { fontSize }

  return (
    <div className="eventsTable">
      <div
        style={eventsTableHeadStyle}
        className="eventsTable-header"
      >
        <div className="eventsTable-header-row">
          <div
            className="eventsTable-header-cell eventsTable-cell-day"
            style={headerStyle}
          >
          </div>
          <div
            className="eventsTable-header-cell eventsTable-cell-migration"
            style={headerStyle}
          >
            Maritime Events
          </div>
          <div
            className="eventsTable-header-cell eventsTable-cell-politics"
            style={headerStyle}
          >
            Political Events
          </div>
        </div>
      </div>
      <div className="eventsTable-body">
        <GeminiScrollbar id="eventsTableBody" autoshow>
          <DateRows
            events={events}
            email={email}
            activeEventYears={activeEventYears}
            onRemoveEvent={onRemoveEvent}
          />
        </GeminiScrollbar>
      </div>
    </div>
  )
}

Events.displayName = 'Events'

Events.propTypes = {
  events: React.PropTypes.array,
  yearsOfEvents: React.PropTypes.array,
  email: React.PropTypes.string,
  introJumbotronHeight: React.PropTypes.number,
  activeEventYears: React.PropTypes.array,
  setActiveEventYears: React.PropTypes.func,
  onRemoveEvent: React.PropTypes.func,
}

export default Events
