'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, Tooltip, OverlayTrigger, PanelGroup } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import ActorCategory from './actorCategory.js'
import NewActorCategory from './newActorCategory.js'
import ModalRemoveActorCategory from './modalRemoveActorCategory.js'

export default React.createClass({
  displayName: 'ActorCategories',

  mixins: [ListenerMixin],

  propTypes: {
    actorCategories: React.PropTypes.array,
    activeActorCategory: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveActorCategoryArticle: React.PropTypes.func,
    onCloseNewActorCategory: React.PropTypes.func,
    showNewActorCategory: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      actorCategories: [],
      docToRemove: null
    }
  },

  componentDidMount () {
    this.listenTo(app.actorCategoriesStore, this.onActorCategoriesStoreChange)
    app.Actions.getActorCategories()
  },

  componentDidUpdate (prevProps) {
    if (this.props.activeActorCategory._id && !prevProps.activeActorCategory._id) {
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
    if (this.props.activeActorCategory._id !== prevProps.activeActorCategory._id) {
      // this is later rerender
      // only scroll into view if the active item changed last render
      this.scrollToActivePanel()
    }
  },

  onActorCategoriesStoreChange (actorCategories) {
    const { email } = this.props
    if (!email) actorCategories = actorCategories.filter((actorCategory) => !actorCategory.draft)
    this.setState({ actorCategories })
  },

  onClickActorCategory (id, e) {
    const { activeActorCategory } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (Object.keys(activeActorCategory).length === 0 || activeActorCategory._id !== id) ? id : null
    app.Actions.getActorCategory(idToGet)
  },

  onClickActorCategoryCollapse (event) {
    // prevent higher level panels from reacting
    event.preventDefault()
    event.stopPropagation()
  },

  onRemoveActorCategory (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  scrollToActivePanel () {
    const node = ReactDOM.findDOMNode(this._activeActorCategoryPanel)
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

  removeActorCategory (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeActorCategory(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeActorCategoryTooltip () {
    return <Tooltip id='removeThisActorCategory'>remove</Tooltip>
  },

  removeActorCategoryGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeActorCategoryTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveActorCategory.bind(this, doc)} />
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
    app.Actions.toggleDraftOfActorCategory(doc)
  },

  actorCategoriesComponent () {
    const { activeActorCategory, editing, email, onSaveActorCategoryArticle } = this.props
    let { actorCategories } = this.state
    if (actorCategories.length > 0) {
      actorCategories = actorCategories.sort((a, b) => {
        if (a._id < b._id) return -1
        return 1
      })
      return actorCategories.map((doc, index) => {
        const isActorCategory = Object.keys(activeActorCategory).length > 0
        const isActiveActorCategory = isActorCategory ? doc._id === activeActorCategory._id : false
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
        if (!isActiveActorCategory) {
          Object.assign(panelHeadingStyle, {
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3
          })
        }
        const ref = isActiveActorCategory ? '_activeActorCategoryPanel' : '_actorCategoryPanel' + doc._id
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        return (
          <div key={doc._id} ref={(c) => this[ref] = c} className='panel panel-default'>
            <div className='panel-heading' role='tab' id={'heading' + index} onClick={this.onClickActorCategory.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#actorCategoriesAccordion' href={'#collapse' + index} aria-expanded='false' aria-controls={'#collapse' + index}>
                  {doc.category}
                </a>
              </h4>
              {showEditingGlyphons ?
                this.toggleDraftGlyph(doc)
                : null
              }
              {showEditingGlyphons ?
                this.removeActorCategoryGlyph(doc)
                : null
              }
            </div>
            {isActiveActorCategory ?
              <div id={'#collapse' + index} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + index} onClick={this.onClickActorCategoryCollapse}>
                <div className='panel-body' style={panelBodyStyle}>
                  <ActorCategory activeActorCategory={activeActorCategory} editing={editing} onSaveActorCategoryArticle={onSaveActorCategoryArticle} />
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
    const { activeActorCategory, showNewActorCategory, onCloseNewActorCategory } = this.props
    const { docToRemove } = this.state
    const activeId = _.has(activeActorCategory, '_id') ? activeActorCategory._id : null
    return (
      <div className='actorCategories'>
        <PanelGroup activeKey={activeId} id='actorCategoriesAccordion' accordion>
          {this.actorCategoriesComponent()}
        </PanelGroup>
        {showNewActorCategory ? <NewActorCategory onCloseNewActorCategory={onCloseNewActorCategory} /> : null}
        {docToRemove ? <ModalRemoveActorCategory doc={docToRemove} removeActorCategory={this.removeActorCategory} /> : null}
      </div>
    )
  }
})
