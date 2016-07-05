import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, Tooltip, OverlayTrigger, PanelGroup } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import { sortBy } from 'lodash'
import Actor from './actor.js'
import NewActor from './newActor.js'
import ModalRemoveActor from './modalRemoveActor.js'

export default React.createClass({
  displayName: 'Actors',

  propTypes: {
    actors: React.PropTypes.array,
    activeActor: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveActorArticle: React.PropTypes.func,
    onCloseNewActor: React.PropTypes.func,
    showNewActor: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      docToRemove: null
    }
  },

  componentDidMount() {
    app.Actions.getActors()
  },

  componentDidUpdate(prevProps) {
    if (this.props.activeActor) {
      if (!prevProps.activeActor) {
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
      } else if (this.props.activeActor._id !== prevProps.activeActor._id) {
        // this is later rerender
        // only scroll into view if the active item changed last render
        this.scrollToActivePanel()
      }
    }
  },

  onClickActor(id, e) {
    const { activeActor } = this.props
    // prevent higher level panels from reacting
    e.stopPropagation()
    const idToGet = (!activeActor || activeActor._id !== id) ? id : null
    app.Actions.getActor(idToGet)
  },

  onClickActorCollapse(event) {
    // prevent higher level panels from reacting
    event.stopPropagation()
  },

  onRemoveActor(docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  onToggleDraft(doc, event) {
    event.preventDefault()
    event.stopPropagation()
    app.Actions.toggleDraftOfActor(doc)
  },

  scrollToActivePanel() {
    const node = ReactDOM.findDOMNode(this._activeActorPanel)
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

  removeActor(remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeActor(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeActorGlyph(doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: `${1.5}em`,
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="removeThisActor">
            remove
          </Tooltip>
        }
      >
        <Glyphicon
          glyph="remove-circle"
          style={glyphStyle}
          onClick={(event) =>
            this.onRemoveActor(doc, event)
          }
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

  actorsComponent() {
    const {
      activeActor,
      editing,
      email,
      onSaveActorArticle
    } = this.props
    let { actors } = this.props
    if (actors.length > 0) {
      actors = sortBy(actors, (actor) => {
        if (actor.order) return actor.order
        return 100
      })
      return actors.map((doc, index) => {
        const isActiveActor = activeActor ? doc._id === activeActor._id : false
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
        if (!isActiveActor) {
          Object.assign(panelHeadingStyle, {
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3
          })
        }
        const ref = isActiveActor ? '_activeActorPanel' : `_actorPanel${doc._id}`
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
              onClick={this.onClickActor.bind(this, doc._id)}
              style={panelHeadingStyle}
            >
              <h4
                className="panel-title"
              >
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#actorsAccordion"
                  href={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`#collapse${index}`}
                >
                  {doc.category}
                </a>
              </h4>
              {
                showEditingGlyphons &&
                this.toggleDraftGlyph(doc)
              }
              {
                showEditingGlyphons &&
                this.removeActorGlyph(doc)
              }
            </div>
            {
              isActiveActor &&
              <div
                id={`#collapse${index}`}
                className="panel-collapse collapse in"
                role="tabpanel"
                aria-labelledby={`heading${index}`}
                onClick={this.onClickActorCollapse}
              >
                <div
                  className="panel-body"
                  style={panelBodyStyle}
                >
                  <Actor
                    activeActor={activeActor}
                    editing={editing}
                    onSaveActorArticle={onSaveActorArticle}
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
    const { activeActor, showNewActor, onCloseNewActor } = this.props
    const { docToRemove } = this.state
    const activeId = activeActor ? activeActor._id : null
    return (
      <div
        className="actors"
      >
        <PanelGroup
          activeKey={activeId}
          id="actorsAccordion"
          accordion
        >
          {this.actorsComponent()}
        </PanelGroup>
        {
          showNewActor &&
          <NewActor
            onCloseNewActor={onCloseNewActor}
          />
        }
        {
          docToRemove &&
          <ModalRemoveActor
            doc={docToRemove}
            removeActor={this.removeActor}
          />
        }
      </div>
    )
  }
})
