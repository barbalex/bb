'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, Tooltip, OverlayTrigger, PanelGroup } from 'react-bootstrap'
import Source from './source.js'
import NewSource from './newSource.js'
import ModalRemoveSource from './modalRemoveSource.js'

export default React.createClass({
  displayName: 'Sources',

  propTypes: {
    sources: React.PropTypes.array,
    activeSource: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveSourceArticle: React.PropTypes.func,
    onCloseNewSource: React.PropTypes.func,
    showNewSource: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docToRemove: null
    }
  },

  componentDidMount () {
    app.Actions.getSources()
  },

  componentDidUpdate (prevProps) {
    if (this.props.activeSource) {
      if (!prevProps.activeSource) {
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
      } else if (this.props.activeSource._id !== prevProps.activeSource._id) {
        // this is later rerender
        // only scroll into view if the active item changed last render
        this.scrollToActivePanel()
      }
    }
  },

  onClickSource (id, e) {
    const { activeSource } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (!activeSource || activeSource._id !== id) ? id : null
    app.Actions.getSource(idToGet)
  },

  onClickSourceCollapse (event) {
    // prevent higher level panels from reacting
    event.preventDefault()
    event.stopPropagation()
  },

  onRemoveSource (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  scrollToActivePanel () {
    const node = ReactDOM.findDOMNode(this._activeSourcePanel)
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

  removeSource (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeSource(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeSourceTooltip () {
    return <Tooltip id='removeThisSource'>remove</Tooltip>
  },

  removeSourceGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeSourceTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveSource.bind(this, doc)} />
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
    app.Actions.toggleDraftOfSource(doc)
  },

  sourcesComponent () {
    const { sources, activeSource, editing, email, onSaveSourceArticle } = this.props
    if (sources.length > 0) {
      return sources.map((doc, index) => {
        const isActiveSource = activeSource ? doc._id === activeSource._id : false
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
        if (!isActiveSource) {
          Object.assign(panelHeadingStyle, {
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3
          })
        }
        const ref = isActiveSource ? '_activeSourcePanel' : '_sourcePanel' + doc._id
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        return (
          <div key={doc._id} ref={(c) => this[ref] = c} className='panel panel-default'>
            <div className='panel-heading' role='tab' id={'heading' + index} onClick={this.onClickSource.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#sourcesAccordion' href={'#collapse' + index} aria-expanded='false' aria-controls={'#collapse' + index}>
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
                ? this.removeSourceGlyph(doc)
                : null
              }
            </div>
            {
              isActiveSource
              ? <div
                  id={'#collapse' + index}
                  className='panel-collapse collapse in'
                  role='tabpanel'
                  aria-labelledby={'heading' + index}
                  onClick={this.onClickSourceCollapse}>
                  <div className='panel-body' style={panelBodyStyle}>
                    <Source
                      activeSource={activeSource}
                      editing={editing}
                      onSaveSourceArticle={onSaveSourceArticle} />
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
    const { activeSource, showNewSource, onCloseNewSource } = this.props
    const { docToRemove } = this.state
    const activeId = activeSource ? activeSource._id : null
    return (
      <div className='sources'>
        <PanelGroup activeKey={activeId} id='sourcesAccordion' accordion>
          {this.sourcesComponent()}
        </PanelGroup>
        {
          showNewSource
          ? <NewSource onCloseNewSource={onCloseNewSource} />
          : null
        }
        {
          docToRemove
          ? <ModalRemoveSource
              doc={docToRemove}
              removeSource={this.removeSource} />
          : null
        }
      </div>
    )
  }
})
