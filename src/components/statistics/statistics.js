'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, Tooltip, OverlayTrigger, PanelGroup } from 'react-bootstrap'
import { sortBy } from 'lodash'
import Statistic from './statistic.js'
import NewStatistic from './newStatistic.js'
import ModalRemoveStatistic from './modalRemoveStatistic.js'

export default React.createClass({
  displayName: 'Statistics',

  propTypes: {
    statistics: React.PropTypes.array,
    activeStatistic: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveStatisticArticle: React.PropTypes.func,
    onCloseNewStatistic: React.PropTypes.func,
    showNewStatistic: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docToRemove: null
    }
  },

  componentDidMount () {
    app.Actions.getStatistics()
  },

  componentDidUpdate (prevProps) {
    if (this.props.activeStatistic) {
      if (!prevProps.activeStatistic) {
        /**
         * this is first render
         * componentDidUpdate and componentDidMount are actually executed
         * BEFORE the dom elements are done being drawn,
         * but AFTER they've been passed from React to the browser's DOM
         */
        window.setTimeout(() => {
          this.scrollToActivePanel()
        }, 200)
        // window.requestAnimationFrame(() => this.scrollToActivePanel())
      } else if (this.props.activeStatistic._id !== prevProps.activeStatistic._id) {
        // this is later rerender
        // only scroll into view if the active item changed last render
        this.scrollToActivePanel()
      }
    }
  },

  onClickStatistic (id, e) {
    const { activeStatistic } = this.props
    // prevent higher level panels from reacting
    e.stopPropagation()
    const idToGet = (!activeStatistic || activeStatistic._id !== id) ? id : null
    app.Actions.getStatistic(idToGet)
  },

  onClickStatisticCollapse (event) {
    // prevent higher level panels from reacting
    event.stopPropagation()
  },

  onRemoveStatistic (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  scrollToActivePanel () {
    const node = ReactDOM.findDOMNode(this._activeStatisticPanel)
    if (node) {
      const navWrapperOffsetTop = document.getElementById('nav-wrapper').offsetTop
      const reduce = navWrapperOffsetTop > 0 ? navWrapperOffsetTop - 33 : 55
      if (node.offsetTop) {
        window.$('html, body').animate({
          scrollTop: node.offsetTop - reduce
        }, 500)
      }
    }
  },

  removeStatistic (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeStatistic(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeStatisticTooltip () {
    return <Tooltip id='removeThisStatistic'>remove</Tooltip>
  },

  removeStatisticGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeStatisticTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveStatistic.bind(this, doc)} />
      </OverlayTrigger>
    )
  },

  toggleDraftTooltip (doc) {
    const text = doc.draft ? 'publish' : 'unpublish'
    return <Tooltip id='toggleDraft'>{text}</Tooltip>
  },

  toggleDraftGlyph (doc) {
    const glyph = doc.draft ? 'ban-circle' : 'ok-circle'
    const color = doc.draft ? 'red' : '#00D000'
    const glyphStyle = {
      position: 'absolute',
      right: 40,
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
    app.Actions.toggleDraftOfStatistic(doc)
  },

  statisticsComponent () {
    const { activeStatistic, editing, email, onSaveStatisticArticle } = this.props
    let { statistics } = this.props
    if (statistics.length > 0) {
      statistics = sortBy(statistics, (stat) => {
        if (stat.order) return stat.order
        return 100
      })
      return statistics.map((doc, index) => {
        const isActiveStatistic = activeStatistic ? doc._id === activeStatistic._id : false
        const showEditingGlyphons = !!email
        const panelHeadingStyle = {
          position: 'relative',
          cursor: 'pointer'
        }
        const panelBodyPadding = editing ? 0 : 15
        const panelBodyMarginTop = editing ? -1 + 'px' : 0
        const panelBodyStyle = {
          padding: panelBodyPadding,
          marginTop: panelBodyMarginTop,
          maxHeight: window.innerHeight - 141,
          overflowY: 'auto'
        }
        if (!isActiveStatistic) {
          Object.assign(panelHeadingStyle, {
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3
          })
        }
        const ref = isActiveStatistic ? '_activeStatisticPanel' : '_statisticPanel' + doc._id
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        return (
          <div key={doc._id} ref={(c) => this[ref] = c} className='panel panel-default'>
            <div className='panel-heading' role='tab' id={'heading' + index} onClick={this.onClickStatistic.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#statisticsAccordion' href={'#collapse' + index} aria-expanded='false' aria-controls={'#collapse' + index}>
                  {doc.category}
                </a>
              </h4>
              {
                showEditingGlyphons
                ? this.toggleDraftGlyph(doc)
                : null
              }
              {
                showEditingGlyphons
                ? this.removeStatisticGlyph(doc)
                : null
              }
            </div>
            {
              isActiveStatistic
              ? <div
                  id={'#collapse' + index}
                  className='panel-collapse collapse in'
                  role='tabpanel'
                  aria-labelledby={'heading' + index}
                  onClick={this.onClickStatisticCollapse}>
                  <div className='panel-body' style={panelBodyStyle}>
                    <Statistic
                      activeStatistic={activeStatistic}
                      editing={editing}
                      onSaveStatisticArticle={onSaveStatisticArticle} />
                  </div>
                </div>
              : null
            }
          </div>
        )
      })
    }
    return null
  },

  render () {
    const { activeStatistic, showNewStatistic, onCloseNewStatistic } = this.props
    const { docToRemove } = this.state
    const activeId = activeStatistic ? activeStatistic._id : null
    return (
      <div className='statistics'>
        <h1>
          Statistics
        </h1>
        <PanelGroup activeKey={activeId} id='statisticsAccordion' accordion>
          {this.statisticsComponent()}
        </PanelGroup>
        {
          showNewStatistic
          ? <NewStatistic onCloseNewStatistic={onCloseNewStatistic} />
          : null
        }
        {
          docToRemove
          ? <ModalRemoveStatistic
              doc={docToRemove}
              removeStatistic={this.removeStatistic} />
          : null
        }
      </div>
    )
  }
})
