'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pageMeta.js'

export default React.createClass({
  displayName: 'Commentary',

  propTypes: {
    commentary: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveCommentaryArticle: React.PropTypes.func
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
    const { commentary, editing, onSaveCommentaryArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = commentary.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div>
          {showMeta ? <Meta doc={commentary} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={commentary} articleDecoded={articleDecoded} onSaveCommentaryArticle={onSaveCommentaryArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div>
        <h1>{commentary.title}</h1>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
