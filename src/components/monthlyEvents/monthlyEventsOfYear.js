'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { PanelGroup, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'
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
    activeMonthlyEvent: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveMonthlyEventArticle: React.PropTypes.func,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docToRemove: null
    }
  },

  componentDidMount () {
    // somehow on first load the panel does not scroll up far enough
    // call for more
    this.scrollToActivePanel('more')
  },

  componentDidUpdate (prevProps) {
    if (this.props.activeMonthlyEvent) {
      const activeMonthlyEventChanged = !prevProps.activeMonthlyEvent || this.props.activeMonthlyEvent._id !== prevProps.activeMonthlyEvent._id
      if (activeMonthlyEventChanged) {
        // this is later rerender
        // only scroll into view if the active item changed last render
        this.scrollToActivePanel()
      }
    }
  },

  onClickMonthlyEvent (id, event) {
    const { activeMonthlyEvent } = this.props
    // prevent higher level panels from reacting
    event.stopPropagation()
    const idToGet = (!activeMonthlyEvent || activeMonthlyEvent._id && activeMonthlyEvent._id !== id) ? id : null
    app.Actions.getMonthlyEvent(idToGet)
  },

  onClickEventCollapse (event) {
    // prevent higher level panels from reacting
    event.stopPropagation()
  },

  onRemoveMonthlyEvent (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  scrollToActivePanel (more) {
    const node = ReactDOM.findDOMNode(this._activeMonthlyEventPanel)
    if (node) {
      const navWrapperOffsetTop = document.getElementById('nav-wrapper').offsetTop
      let reduce = navWrapperOffsetTop > 0 ? navWrapperOffsetTop - 30 : 52
      // somehow on first load the panel does not scroll up far enough
      if (more) reduce = reduce - 5
      if (node.offsetTop) {
        window.$('html, body').animate({
          scrollTop: node.offsetTop - reduce
        }, 500)
      }
    }
  },

  removeMonthlyEvent (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeMonthlyEvent(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeMonthlyEventTooltip () {
    return <Tooltip id='removeThisMonthlyEvent'>remove</Tooltip>
  },

  removeMonthlyEventGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 8,
      top: 6,
      fontSize: 1.5 + 'em'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeMonthlyEventTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveMonthlyEvent.bind(this, doc)} />
      </OverlayTrigger>
    )
  },

  toggleDraftTooltip (doc) {
    const text = doc.draft ? 'publish' : 'unpublish'
    return <Tooltip id='toggleDraft'>{text}</Tooltip>
  },

  toggleDraftGlyph (doc) {
    const glyph = doc.draft ? 'ban-circle' : 'ok-circle'
    const color = doc.draft ? 'red' : 'green'
    const glyphStyle = {
      position: 'absolute',
      right: 38,
      top: 6,
      fontSize: 1.5 + 'em',
      color: color
    }
    return (
      <OverlayTrigger placement='top' overlay={this.toggleDraftTooltip(doc)}>
        <Glyphicon glyph={glyph} style={glyphStyle} onClick={this.onToggleDraft.bind(this, doc)} />
      </OverlayTrigger>
    )
  },

  onToggleDraft (doc, event) {
    event.preventDefault()
    event.stopPropagation()
    app.Actions.toggleDraftOfMonthlyEvent(doc)
  },

  monthlyEventsComponent (year) {
    const { activeMonthlyEvent, editing, email, onSaveMonthlyEventArticle } = this.props
    let { monthlyEvents } = this.props
    // filter only events of current year
    monthlyEvents = monthlyEvents.filter((monthlyEvent) => getYearFromEventId(monthlyEvent._id) === year)
    return monthlyEvents.map((doc, dIndex) => {
      const isActiveMonthlyEvent = _.has(activeMonthlyEvent, '_id') ? doc._id === activeMonthlyEvent._id : false
      const month = getMonthFromEventId(doc._id)
      const showEditingGlyphons = !!email
      const panelHeadingStyle = {
        position: 'relative'
      }
      const panelBodyStyle = {
        maxHeight: window.innerHeight - 127,
        overflowY: 'auto'
      }
      const ref = isActiveMonthlyEvent ? '_activeMonthlyEventPanel' : '_monthlyEventPanel' + doc._id
      // use pure bootstrap.
      // advantage: can add edit icon to panel-heading
      return (
        <div key={dIndex} ref={(c) => this[ref] = c} className='panel panel-default month'>
          <div
            className='panel-heading'
            role='tab'
            id={'heading' + dIndex}
            onClick={this.onClickMonthlyEvent.bind(this, doc._id)}
            style={panelHeadingStyle}
          >
            <h4 className='panel-title'>
              <a
                role='button'
                data-toggle='collapse'
                data-parent={'#' + year}
                href={'#collapse' + dIndex}
                aria-expanded='false'
                aria-controls={'#collapse' + dIndex}
              >
                {month}
              </a>
            </h4>
            {
              showEditingGlyphons
              ? this.toggleDraftGlyph(doc)
              : null
            }
            {
              showEditingGlyphons
              ? this.removeMonthlyEventGlyph(doc)
              : null
            }
          </div>
          {
            isActiveMonthlyEvent
            ? <div
                id={'#collapse' + dIndex}
                className='panel-collapse collapse in'
                role='tabpanel'
                aria-labelledby={'heading' + dIndex}
                onClick={this.onClickEventCollapse}>
                <div className='panel-body' style={panelBodyStyle}>
                  <MonthlyEvent
                    activeMonthlyEvent={activeMonthlyEvent}
                    year={year}
                    month={month}
                    editing={editing}
                    onSaveMonthlyEventArticle={onSaveMonthlyEventArticle}
                  />
                </div>
              </div>
            : null
          }
        </div>
      )
    })
  },

  render () {
    const { year, activeMonthlyEvent } = this.props
    const { docToRemove } = this.state
    const activeEventId = _.has(activeMonthlyEvent, '_id') ? activeMonthlyEvent._id : null
    return (
      <PanelGroup activeKey={activeEventId} id={year} ref={(c) => this[year] = c} accordion>
        {this.monthlyEventsComponent(year)}
        {docToRemove ? <ModalRemoveMonthlyEvent doc={docToRemove} removeMonthlyEvent={this.removeMonthlyEvent} /> : null}
      </PanelGroup>
    )
  }
})
