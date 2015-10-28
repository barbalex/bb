'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import MonthlyEvent from './monthlyEvent.js'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import getMonthFromEventId from '../../modules/getMonthFromEventId.js'

export default React.createClass({
  displayName: 'MonthlyEvents_Months',

  propTypes: {
    year: React.PropTypes.number,
    monthlyEvents: React.PropTypes.array,
    monthlyEvent: React.PropTypes.object,
    editing: React.PropTypes.bool,
    onSaveMonthlyEvent: React.PropTypes.func
  },

  onClickMonthlyEvent (id, e) {
    const { monthlyEvent } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (Object.keys(monthlyEvent).length === 0 || monthlyEvent._id !== id) ? id : null
    app.Actions.getMonthlyEvent(idToGet)
  },

  onClickEventCollapse (event) {
    // prevent higher level panels from reacting
    event.preventDefault()
    event.stopPropagation()
  },

  onRemoveMonthlyEvent (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    // TODO
    console.log('remove monthlyEvent', docToRemove)
  },

  render () {
    const { year, monthlyEvent, editing, onSaveMonthlyEvent } = this.props
    const { monthlyEvents } = this.state
    let monthlyEventsArray = []
    monthlyEvents.forEach((doc, dIndex) => {
      if (getYearFromEventId(doc._id) === year) {
        const showEvent = monthlyEvent ? doc._id === monthlyEvent._id : false
        const month = getMonthFromEventId(doc._id)
        const showRemoveGlyphicon = !!window.localStorage.email
        const glyphStyle = {
          position: 'absolute',
          right: 8,
          top: 6,
          fontSize: 1.5 + 'em'
        }
        const panelHeadingStyle = {
          position: 'relative'
        }
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        const eventComponent = (
          <div key={dIndex} className='panel panel-default month'>
            <div className='panel-heading' role='tab' id={'heading' + dIndex} onClick={this.onClickMonthlyEvent.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent={'#' + year} href={'#collapse' + dIndex} aria-expanded='false' aria-controls={'#collapse' + dIndex}>
                  {month}
                </a>
              </h4>
              {showRemoveGlyphicon ?
                <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveMonthlyEvent.bind(this, doc)} />
                : null
              }
            </div>
            {showEvent ?
              <div id={'#collapse' + dIndex} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + dIndex} onClick={this.onClickEventCollapse}>
                <div className='panel-body'>
                  <MonthlyEvent monthlyEvent={monthlyEvent} editing={editing} onSaveMonthlyEvent={onSaveMonthlyEvent} />
                </div>
              </div>
              : null
            }
          </div>
        )
        monthlyEventsArray.push(eventComponent)
      }
    })
    return monthlyEventsArray
  }
})
