'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import MonthlyEvent from './monthlyEvent.js'
import getYearFromEventId from '../../modules/getYearFromEventId.js'
import getMonthFromEventId from '../../modules/getMonthFromEventId.js'
import ModalRemoveMonthlyEvent from './modalRemoveMonthlyEvent.js'

export default React.createClass({
  displayName: 'MonthlyEventsOfYear',

  propTypes: {
    year: React.PropTypes.string,
    monthlyEvents: React.PropTypes.array,
    monthlyEvent: React.PropTypes.object,
    editing: React.PropTypes.bool,
    onSaveMonthlyEvent: React.PropTypes.func,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docToRemove: null
    }
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
    this.setState({ docToRemove })
  },

  removeMonthlyEvent (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeMonthlyEvent(docToRemove)
    this.setState({ docToRemove: null })
  },

  monthlyEventsComponent (year) {
    const { monthlyEvents, monthlyEvent, editing, onSaveMonthlyEvent } = this.props
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
  },

  render () {
    const { year, monthlyEvent } = this.props
    const { docToRemove } = this.state
    const activeEventId = _.has(monthlyEvent, '_id') ? monthlyEvent._id : null
    return (
      <PanelGroup activeKey={activeEventId} id={year} accordion>
        {this.monthlyEventsComponent(year)}
        {docToRemove ? <ModalRemoveMonthlyEvent doc={docToRemove} removeMonthlyEvent={this.removeMonthlyEvent} /> : null}
      </PanelGroup>
    )
  }
})