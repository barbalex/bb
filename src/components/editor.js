'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import { Base64 } from 'js-base64'
// import 'tinymce/tinymce.js'
import TinyMCE from 'react-tinymce'

export default React.createClass({
  displayName: 'Editor',

  mixins: [ListenerMixin],

  propTypes: {
    articleDecoded: React.PropTypes.string,
    onSaveArticle: React.PropTypes.func
  },

  componentDidMount () {
    this.listenTo(app.requestSaveCkeditorStore, this.onRequestSaveCkeditor)
    window.tinymce.init({
      selector: '#article'
    })
  },

  onRequestSaveCkeditor () {
    const { onSaveArticle } = this.props
    // TODO: how get the right instance?
    const articleDecoded = window.tinyMCE.activeEditor.getContent()
    console.log('editor.js, onRequestSaveCkeditor, articleDecoded', articleDecoded)
    const articleEncoded = Base64.encode(articleDecoded)
    onSaveArticle(articleEncoded)
  },

  shouldComponentUpdate () {
    return false
  },

  render () {
    const { articleDecoded } = this.props
    return (
      <textarea id='article' defaultValue={articleDecoded} />
    )
  }
})
