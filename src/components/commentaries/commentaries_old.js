'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListGroup, ListGroupItem, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import getPathFromDoc from '../../modules/getPathFromDoc.js'
import NewCommentary from './newCommentary.js'
import ModalRemoveCommentary from './modalRemoveCommentary.js'

export default React.createClass({
  displayName: 'Commentaries',

  mixins: [ListenerMixin],

  propTypes: {
    docs: React.PropTypes.array,
    showNewCommentary: React.PropTypes.bool,
    email: React.PropTypes.string,
    onCloseNewCommentary: React.PropTypes.func,
    docToRemove: React.PropTypes.object
  },

  getInitialState () {
    return {
      docs: [],
      docToRemove: null
    }
  },

  componentDidMount () {
    this.listenTo(app.commentariesStore, this.onCommentariesStoreChange)
    app.Actions.getCommentaries()
  },

  onCommentariesStoreChange (docs) {
    const { email } = this.props
    if (!email) docs = docs.filter((doc) => !doc.draft)
    this.setState({ docs })
  },

  onRemoveCommentary (docToRemove, event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ docToRemove })
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
      top: 10,
      fontSize: 1.5 + 'em'
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
    const color = doc.draft ? 'red' : 'green'
    const glyphStyle = {
      position: 'absolute',
      right: 40,
      top: 10,
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

  commentaries () {
    const { email } = this.props
    let { docs } = this.state
    const showEditingGlyphons = !!email
    if (docs.length > 0) {
      docs = docs.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return docs.map((doc, index) => {
        const path = getPathFromDoc(doc)
        return (
          <ListGroupItem
            key={index}
            href={path}
          >
            {doc.title}
            {showEditingGlyphons ?
              this.toggleDraftGlyph(doc)
              : null
            }
            {showEditingGlyphons ?
              this.removeCommentaryGlyph(doc)
              : null
            }
          </ListGroupItem>
        )
      })
    }
    return null
  },

  render () {
    const { showNewCommentary, onCloseNewCommentary } = this.props
    const { docToRemove } = this.state
    return (
      <div className='commentaries'>
        <h1>Commentaries</h1>
        <ListGroup>
          {this.commentaries()}
        </ListGroup>
        {showNewCommentary ? <NewCommentary onCloseNewCommentary={onCloseNewCommentary} /> : null}
        {docToRemove ? <ModalRemoveCommentary doc={docToRemove} removeCommentary={this.removeCommentary} /> : null}
      </div>
    )
  }
})