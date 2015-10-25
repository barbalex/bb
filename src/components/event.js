'use strict'

import React from 'react'
import { Base64 } from 'js-base64'
import Editor from './editor.js'

export default React.createClass({
  displayName: 'Event',

  propTypes: {
    doc: React.PropTypes.object,
    editing: React.PropTypes.bool,
    onSaveArticle: React.PropTypes.func
  },

  render () {
    const { doc, editing, onSaveArticle } = this.props
    const articleEncoded = doc.article
    const articleDecoded = Base64.decode(articleEncoded)
    if (editing) {
      return (
        <div>
          <Editor docId={doc._id} articleDecoded={articleDecoded} onSaveArticle={onSaveArticle} />
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
