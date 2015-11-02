'use strict'

import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, Tooltip, OverlayTrigger, PanelGroup } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import SourceCategory from './sourceCategory.js'
import NewSourceCategory from './newSourceCategory.js'
import ModalRemoveSourceCategory from './modalRemoveSourceCategory.js'

export default React.createClass({
  displayName: 'SourceCategories',

  mixins: [ListenerMixin],

  propTypes: {
    sourceCategories: React.PropTypes.array,
    activeSourceCategory: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSaveSourceCategoryArticle: React.PropTypes.func,
    onCloseNewSourceCategory: React.PropTypes.func,
    showNewSourceCategory: React.PropTypes.bool,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      sourceCategories: [],
      docToRemove: null
    }
  },

  componentDidMount () {
    this.listenTo(app.sourceCategoriesStore, this.onSourceCategoriesStoreChange)
    app.Actions.getSourceCategories()
  },

  componentDidUpdate (prevProps) {
    if (this.props.activeSourceCategory._id && !prevProps.activeSourceCategory._id) {
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
    if (this.props.activeSourceCategory._id !== prevProps.activeSourceCategory._id) {
      // this is later rerender
      // only scroll into view if the active item changed last render
      this.scrollToActivePanel()
    }
  },

  onSourceCategoriesStoreChange (sourceCategories) {
    const { email } = this.props
    if (!email) sourceCategories = sourceCategories.filter((sourceCategory) => !sourceCategory.draft)
    this.setState({ sourceCategories })
  },

  onClickSourceCategory (id, e) {
    const { activeSourceCategory } = this.props
    // prevent higher level panels from reacting
    e.preventDefault()
    e.stopPropagation()
    const idToGet = (Object.keys(activeSourceCategory).length === 0 || activeSourceCategory._id !== id) ? id : null
    app.Actions.getSourceCategory(idToGet)
  },

  onClickSourceCategoryCollapse (event) {
    // prevent higher level panels from reacting
    event.preventDefault()
    event.stopPropagation()
  },

  onRemoveSourceCategory (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  scrollToActivePanel () {
    const node = ReactDOM.findDOMNode(this._activeSourceCategoryPanel)
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

  removeSourceCategory (remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removeSourceCategory(docToRemove)
    this.setState({ docToRemove: null })
  },

  removeSourceCategoryTooltip () {
    return <Tooltip id='removeThisSourceCategory'>remove</Tooltip>
  },

  removeSourceCategoryGlyph (doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: '#edf4f8'
    }
    return (
      <OverlayTrigger placement='top' overlay={this.removeSourceCategoryTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveSourceCategory.bind(this, doc)} />
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
    app.Actions.toggleDraftOfSourceCategory(doc)
  },

  sourceCategoriesComponent () {
    const { activeSourceCategory, editing, email, onSaveSourceCategoryArticle } = this.props
    let { sourceCategories } = this.state
    if (sourceCategories.length > 0) {
      sourceCategories = sourceCategories.sort((a, b) => {
        if (a._id < b._id) return -1
        return 1
      })
      return sourceCategories.map((doc, index) => {
        const isSourceCategory = Object.keys(activeSourceCategory).length > 0
        const isActiveSourceCategory = isSourceCategory ? doc._id === activeSourceCategory._id : false
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
        if (!isActiveSourceCategory) {
          Object.assign(panelHeadingStyle, {
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3
          })
        }
        const ref = isActiveSourceCategory ? '_activeSourceCategoryPanel' : '_sourceCategoryPanel' + doc._id
        // use pure bootstrap.
        // advantage: can add edit icon to panel-heading
        return (
          <div key={doc._id} ref={(c) => this[ref] = c} className='panel panel-default'>
            <div className='panel-heading' role='tab' id={'heading' + index} onClick={this.onClickSourceCategory.bind(this, doc._id)} style={panelHeadingStyle}>
              <h4 className='panel-title'>
                <a role='button' data-toggle='collapse' data-parent='#sourceCategoriesAccordion' href={'#collapse' + index} aria-expanded='false' aria-controls={'#collapse' + index}>
                  {doc.category}
                </a>
              </h4>
              {showEditingGlyphons ?
                this.toggleDraftGlyph(doc)
                : null
              }
              {showEditingGlyphons ?
                this.removeSourceCategoryGlyph(doc)
                : null
              }
            </div>
            {isActiveSourceCategory ?
              <div id={'#collapse' + index} className='panel-collapse collapse in' role='tabpanel' aria-labelledby={'heading' + index} onClick={this.onClickSourceCategoryCollapse}>
                <div className='panel-body' style={panelBodyStyle}>
                  <SourceCategory activeSourceCategory={activeSourceCategory} editing={editing} onSaveSourceCategoryArticle={onSaveSourceCategoryArticle} />
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
    const { activeSourceCategory, showNewSourceCategory, onCloseNewSourceCategory } = this.props
    const { docToRemove } = this.state
    const activeId = _.has(activeSourceCategory, '_id') ? activeSourceCategory._id : null
    return (
      <div className='sourceCategories'>
        <PanelGroup activeKey={activeId} id='sourceCategoriesAccordion' accordion>
          {this.sourceCategoriesComponent()}
        </PanelGroup>
        {showNewSourceCategory ? <NewSourceCategory onCloseNewSourceCategory={onCloseNewSourceCategory} /> : null}
        {docToRemove ? <ModalRemoveSourceCategory doc={docToRemove} removeSourceCategory={this.removeSourceCategory} /> : null}
      </div>
    )
  }
})
