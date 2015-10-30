'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from './editor.js'
import Meta from './PageMeta.js'

export default React.createClass({
  displayName: 'Page',

  propTypes: {
    doc: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSavePageArticle: React.PropTypes.func,
    onSavePage: React.PropTypes.func
  },

  getInitialState () {
    return {
      showMeta: false
    }
  },

  onClickMeta () {
    const { showMeta } = this.state
    this.setState({
      showMeta: !showMeta
    })
  },

  onCloseMeta () {
    this.setState({
      showMeta: false
    })
  },

  render () {
    const { doc, editing, onSavePageArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = doc.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div>
          {showMeta ? <Meta doc={doc} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={doc} articleDecoded={articleDecoded} onSavePageArticle={onSavePageArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    const notHome = doc.title !== 'Home'
    return (
      <div>
        {notHome ? <h1>{doc.title}</h1> : null}
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
