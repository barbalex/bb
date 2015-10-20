'use strict'

import React from 'react'
import { Base64 } from 'js-base64'
import CkEditor from './ckeditor.js'

export default React.createClass({
  displayName: 'Page',

  propTypes: {
    pageDoc: React.PropTypes.object
  },

  render () {
    const { pageDoc } = this.props
    const articleValue = Base64.decode(pageDoc.article)
    return (
      <div>
        <p>Hello World</p>
        <CkEditor value={articleValue} />
      </div>
    )
  }
})
