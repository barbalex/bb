'use strict'

import React from 'react'
import { Base64 } from 'js-base64'
import CkEditor from './ckeditor.js'

export default React.createClass({
  displayName: 'Page',

  propTypes: {
    pageDoc: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  render () {
    const { pageDoc, editing } = this.props
    const articleValue = Base64.decode(pageDoc.article)
    if (editing) {
      return (
        <div>
          <CkEditor value={articleValue} />
        </div>
      )
    }
    return (
      <div>
        {articleValue}
      </div>
    )
  }
})
