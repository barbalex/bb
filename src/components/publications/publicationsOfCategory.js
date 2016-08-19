import app from 'ampersand-app'
import React from 'react'
import ReactDOM from 'react-dom'
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Publication from './publication.js'
import ModalRemovePublication from './modalRemovePublication.js'

export default React.createClass({
  displayName: 'PublicationOfCategory',

  propTypes: {
    category: React.PropTypes.string,
    publications: React.PropTypes.array,
    activePublication: React.PropTypes.object,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSavePublicationArticle: React.PropTypes.func,
    docToRemove: React.PropTypes.object
  },

  getInitialState() {
    return {
      docToRemove: null
    }
  },

  componentDidMount() {
    // somehow on first load the panel does not scroll up far enough
    // call for more
    this.scrollToActivePanel('more')
  },

  componentDidUpdate(prevProps) {
    if (this.props.activePublication) {
      if (
        !prevProps.activePublication ||
        this.props.activePublication._id !== prevProps.activePublication._id
      ) {
        // this is later rerender
        // only scroll into view if the active item changed last render
        this.scrollToActivePanel()
      }
    }
  },

  onClickPublication(id, e) {
    const { activePublication } = this.props
    // prevent higher level panels from reacting
    e.stopPropagation()
    const idToGet = (!activePublication || activePublication._id !== id) ? id : null
    app.Actions.getPublication(idToGet)
  },

  onClickEventCollapse(event) {
    // prevent higher level panels from reacting
    event.stopPropagation()
  },

  onRemovePublication(docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
  },

  onToggleDraft(doc, event) {
    event.preventDefault()
    event.stopPropagation()
    app.Actions.toggleDraftOfPublication(doc)
  },

  scrollToActivePanel(more) {
    const node = ReactDOM.findDOMNode(this._activePublicationPanel)
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

  removePublication(remove) {
    const { docToRemove } = this.state
    if (remove) app.Actions.removePublication(docToRemove)
    this.setState({ docToRemove: null })
  },

  removePublicationGlyph(doc) {
    const glyphStyle = {
      position: 'absolute',
      right: 8,
      top: 6,
      fontSize: '1.5em'
    }
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="removeThisPublication">
            remove
          </Tooltip>
        }
      >
        <Glyphicon
          glyph="remove-circle"
          style={glyphStyle}
          onClick={this.onRemovePublication.bind(this, doc)}
        />
      </OverlayTrigger>
    )
  },

  toggleDraftGlyph(doc) {
    const glyph = doc.draft ? 'ban-circle' : 'ok-circle'
    const color = doc.draft ? 'red' : 'green'
    const glyphStyle = {
      position: 'absolute',
      right: 38,
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

  publicationsComponent(category) {
    const {
      activePublication,
      editing,
      email,
      onSavePublicationArticle
    } = this.props
    let { publications } = this.props
    // filter only publication of current category
    publications = publications.filter((publication) =>
      publication.category === category
    )
    publications = publications.sort((a, b) => {
      if (a.order && b.order) {
        if (a.order < b.order) return -1
        return 1
      }
      if (a.title < b.title) return -1
      return 1
    })
    return publications.map((doc, dIndex) => {
      const isActivePublication = (
        activePublication ?
        doc._id === activePublication._id :
        false
      )
      const showEditingGlyphons = !!email
      const panelHeadingStyle = {
        position: 'relative'
      }
      const panelBodyStyle = {
        maxHeight: window.innerHeight - 127,
        overflowY: 'auto'
      }
      const ref = (
        isActivePublication ?
        '_activePublicationPanel' :
        `_publicationPanel${doc._id}`
      )
      // use pure bootstrap.
      // advantage: can add edit icon to panel-heading
      return (
        <div
          key={dIndex}
          ref={(c) => {
            this[ref] = c
          }}
          className="panel panel-default month"
        >
          <div
            className="panel-heading"
            role="tab"
            id={`heading${dIndex}`}
            onClick={this.onClickPublication.bind(this, doc._id)}
            style={panelHeadingStyle}
          >
            <h4
              className="panel-title"
            >
              <a
                role="button"
                data-toggle="collapse"
                data-parent={`#${category}`}
                href={`#collapse${dIndex}`}
                aria-expanded="false"
                aria-controls={`#collapse${dIndex}`}
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
              this.removePublicationGlyph(doc)
            }
          </div>
          {
            isActivePublication &&
            <div
              id={`#collapse${dIndex}`}
              className="panel-collapse collapse in"
              role="tabpanel"
              aria-labelledby={`heading${dIndex}`}
              onClick={this.onClickEventCollapse}
            >
              <div
                className="panel-body"
                style={panelBodyStyle}
              >
                <Publication
                  activePublication={activePublication}
                  editing={editing}
                  onSavePublicationArticle={onSavePublicationArticle}
                />
              </div>
            </div>
          }
        </div>
      )
    })
  },

  render() {
    const { category } = this.props
    const { docToRemove } = this.state
    return (
      <div
        className="panel-group"
        id={category}
        ref={(c) => {
          this[category] = c
        }}
      >
        {this.publicationsComponent(category)}
        {
          docToRemove &&
          <ModalRemovePublication
            doc={docToRemove}
            removePublication={this.removePublication}
          />
        }
      </div>
    )
  }
})
