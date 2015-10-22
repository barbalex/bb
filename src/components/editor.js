'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import { Base64 } from 'js-base64'

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
      selector: '#article',
      plugins: [
        'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
        'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor'
      ],
      height: 600
    })
  },

  onRequestSaveCkeditor () {
    const { onSaveArticle } = this.props
    // TODO: how get the right instance?
    const articleDecoded = window.tinymce.activeEditor.getContent()
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
