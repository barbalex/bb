import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Glyphicon,
  Tooltip,
  OverlayTrigger,
  PanelGroup,
} from 'react-bootstrap'
import { has } from 'lodash'
import Commentary from './commentary.js'
import NewCommentary from './newCommentary.js'
import ModalRemoveCommentary from './modalRemoveCommentary.js'

export default React.createClass({
  displayName: 'Commentaries',

  propTypes: {
    commentaries: React.PropTypes.array,
    activeCommentary: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveCommentaryArticle: React.PropTypes.func,
    onCloseNewCommentary: React.PropTypes.func,
    showNewCommentary: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState() {
    return {
      docToRemove: null
    }
  },

  componentDidMount() {
    app.Actions.getCommentaries()
  },

  componentDidUpdate(prevProps) {
    if (this.props.activeCommentary) {
      if (!prevProps.activeCommentary) {
        /**
         * this is first render
         * componentDidUpdate and componentDidMount are actually executed
         * BEFORE the dom elements are done being drawn,
         * but AFTER they've been passed from React to the browser's DOM
         */
        window.setTimeout(() => {
          this.scrollToActivePanel()
        }, 200)
      } else if (this.props.activeCommentary._id !== prevProps.activeCommentary._id) {
        // this is later rerender
        // only scroll into view if the active item changed last render
        this.scrollToActivePanel()
      }
    }
  },

  onClickCommentary(id, e) {
    const { activeCommentary } = this.props
    // prevent higher level panels from reacting
    e.stopPropagation()
    const idToGet = (!activeCommentary || activeCommentary._id !== id) ? id : null
    app.Actions.getCommentary(idToGet)
  },

  onClickCommentaryCollapse(event) {
    // prevent higher level panels from reacting
    event.stopPropagation()
  },

  onRemoveCommentary(docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  onToggleDraft(doc, event) {
    event.preventDefault()
    event.stopPropagation()
    app.Actions.toggleDraftOfCommentary(doc)
  },

  scrollToActivePanel() {
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

  removeCommentary(remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeCommentary(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeCommentaryGlyph(doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: '1.5em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="removeThisCommentary">
            remove
          </Tooltip>
        }
      >
        <Glyphicon
          glyph="remove-circle"
          style={glyphStyle}
          onClick={this.onRemoveCommentary.bind(this, doc)}
        />
      </OverlayTrigger>
    )
  },

  toggleDraftGlyph(doc) {
    const glyph = doc.draft ? 'ban-circle' : 'ok-circle'
    const color = doc.draft ? 'red' : '#00D000'
    const glyphStyle = {
      position: 'absolute',
      right: 40,
      top: 6,
      fontSize: '1.5em',
      color
    }
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="toggleDraft">
            {doc.draft ? 'publish' : 'unpublish'}
          </Tooltip>
        }
      >
        <Glyphicon
          glyph={glyph}
          style={glyphStyle}
          onClick={this.onToggleDraft.bind(this, doc)}
        />
      </OverlayTrigger>
    )
  },

  commentariesComponent() {
    const {
      commentaries,
      activeCommentary,
      editing,
      email,
      onSaveCommentaryArticle
    } = this.props

    if (commentaries.length > 0) {
      return commentaries.map((doc, index) => {
        const isCommentary = !!activeCommentary
        const isActiveCommentary = isCommentary ? doc._id === activeCommentary._id : false
        const showEditingGlyphons = !!email
        const panelHeadingStyle = {
          position: 'relative',
          cursor: 'pointer'
        }
        const panelBodyPadding = editing ? 0 : 15
        const panelBodyMarginTop = editing ? '-1px' : 0
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
        const ref = isActiveCommentary ? '_activeCommentaryPanel' : `_commentaryPanel${doc._id}`
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        return (
          <div
            key={doc._id}
            ref={(c) => {
              this[ref] = c
            }}
            className="panel panel-default"
          >
            <div
              className="panel-heading"
              role="tab"
              id={`heading${index}`}
              onClick={this.onClickCommentary.bind(this, doc._id)}
              style={panelHeadingStyle}
            >
              <h4
                className="panel-title"
              >
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#commentariesAccordion"
                  href={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`#collapse${index}`}
                >
                  {doc.title}
                </a>
              </h4>
              {
                showEditingGlyphons &&
                this.toggleDraftGlyph(doc)
              }
              {
                showEditingGlyphons &&
                this.removeCommentaryGlyph(doc)
              }
            </div>
            {
              isActiveCommentary &&
              <div
                id={`#collapse${index}`}
                className="panel-collapse collapse in"
                role="tabpanel"
                aria-labelledby={`heading${index}`}
                onClick={this.onClickCommentaryCollapse}
              >
                <div
                  className="panel-body"
                  style={panelBodyStyle}
                >
                  <Commentary
                    activeCommentary={activeCommentary}
                    editing={editing}
                    onSaveCommentaryArticle={onSaveCommentaryArticle}
                  />
                </div>
              </div>
            }
          </div>
        )
      })
    }
    return null
  },

  render() {
    const {
      activeCommentary,
      showNewCommentary,
      onCloseNewCommentary
    } = this.props
    const { docToRemove } = this.state
    const activeCommentaryId = (
      has(activeCommentary, '_id') ?
      activeCommentary._id :
      null
    )
    return (
      <div
        className="commentaries"
      >
        <h1>
          Commentaries
        </h1>
        <PanelGroup
          activeKey={activeCommentaryId}
          id="commentariesAccordion"
          accordion
        >
          {this.commentariesComponent()}
        </PanelGroup>
        {
          showNewCommentary &&
          <NewCommentary
            onCloseNewCommentary={onCloseNewCommentary}
          />
        }
        {
          docToRemove &&
          <ModalRemoveCommentary
            doc={docToRemove}
            removeCommentary={this.removeCommentary}
          />
        }
      </div>
    )
  }
})
