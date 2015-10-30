'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, Tooltip, OverlayTrigger, PanelGroup } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import Commentary from './commentary.js'
import NewCommentary from './newCommentary.js'
import ModalRemoveCommentary from './modalRemoveCommentary.js'

export default React.createClass({
  displayName: 'Commentaries',

  mixins: [ListenerMixin],

  propTypes: {
    commentaries: React.PropTypes.array,
    commentary: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveCommentary: React.PropTypes.func,
    onCloseNewCommentary: React.PropTypes.func,
    showNewCommentary: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      commentaries: [],
      docToRemove: null
    }
  },

  componentDidMount () {
    this.listenTo(app.commentariesStore, this.onCommentariesStoreChange)
    app.Actions.getCommentaries()
  },

  componentDidUpdate (prevProps) {
    if (this.props.commentary._id && !prevProps.commentary._id) {
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
    }
    if (this.props.commentary._id !== prevProps.commentary._id) {
      // this is later rerender
      // only scroll into view if the active item changed last render
      this.scrollToActivePanel()
    }
  },

  onCommentariesStoreChange (commentaries) {
    const { email } = this.props
    if (!email) commentaries = commentaries.filter((commentary) => !commentary.draft)
    this.setState({ commentaries })
  },

  onClickCommentary (id, e) {
    const { commentary } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (Object.keys(commentary).length === 0 || commentary._id !== id) ? id : null
    app.Actions.getCommentary(idToGet)
  },

  onClickCommentaryCollapse (event) {
    // prevent higher level panels from reacting
    event.preventDefault()
    event.stopPropagation()
  },

  onRemoveCommentary (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  scrollToActivePanel () {
    const node = ReactDOM.findDOMNode(this._activeCommentaryPanel)
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

  removeCommentary (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeCommentary(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeCommentaryTooltip () {
    return <Tooltip id='removeThisCommentary'>remove</Tooltip>
  },

  removeCommentaryGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeCommentaryTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveCommentary.bind(this, doc)} />
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
    app.Actions.toggleDraftOfCommentary(doc)
  },

  commentariesComponent () {
    const { commentary, editing, email, onSaveCommentary } = this.props
    let { commentaries } = this.state
    if (commentaries.length > 0) {
      commentaries = commentaries.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return commentaries.map((doc, index) => {
        const isCommentary = Object.keys(commentary).length > 0
        const isActiveCommentary = isCommentary ? doc._id === commentary._id : false
        const showEditingGlyphons = !!email
        const panelHeadingStyle = {
          position: 'relative'
        }
        const panelBodyPadding = editing ? 0 : 15
        const panelBodyMarginTop = editing ? -1 + 'px' : 0
        const panelBodyStyle = {
          padding: panelBodyPadding,
          marginTop: panelBodyMarginTop,
          maxHeight: window.innerHeight - 141,
          overflowY: 'auto'
        }
        if (!isActiveCommentary) {
          Object.assign(panelHeadingStyle, {
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3
          })
        }
        const ref = isActiveCommentary ? '_activeCommentaryPanel' : '_commentaryPanel' + doc._id
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        return (
          <div key={doc._id} ref={(c) => this[ref] = c} className='panel panel-default'>
            <div className='panel-heading' role='tab' id={'heading' + index} onClick={this.onClickCommentary.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#commentariesAccordion' href={'#collapse' + index} aria-expanded='false' aria-controls={'#collapse' + index}>
                  {doc.title}
                </a>
              </h4>
              {showEditingGlyphons ?
                this.toggleDraftGlyph(doc)
                : null
              }
              {showEditingGlyphons ?
                this.removeCommentaryGlyph(doc)
                : null
              }
            </div>
            {isActiveCommentary ?
              <div id={'#collapse' + index} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + index} onClick={this.onClickCommentaryCollapse}>
                <div className='panel-body' style={panelBodyStyle}>
                  <Commentary commentary={commentary} editing={editing} onSaveCommentary={onSaveCommentary} />
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
    const { commentary, showNewCommentary, onCloseNewCommentary } = this.props
    const { docToRemove } = this.state
    const activeCommentaryId = _.has(commentary, '_id') ? commentary._id : null
    return (
      <div className='commentaries'>
        <h1>Commentaries</h1>
        <PanelGroup activeKey={activeCommentaryId} id='commentariesAccordion' accordion>
          {this.commentariesComponent()}
        </PanelGroup>
        {showNewCommentary ? <NewCommentary onCloseNewCommentary={onCloseNewCommentary} /> : null}
        {docToRemove ? <ModalRemoveCommentary doc={docToRemove} removeCommentary={this.removeCommentary} /> : null}
      </div>
    )
  }
})
