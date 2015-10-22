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
        'advlist autolink link image lists charmap print hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor autosave'
      ],
      menubar: 'edit insert view format table tools',
      toolbar: 'insertfile undo redo | styleselect | bold italic underline forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | emoticons print fullscreen',
      height: 1000,
      browser_spellcheck: true,
      automatic_uploads: false,
      statusbar: false
    })
  },

  componentWillUnmount () {
    // this is needed for correct behaviour, see
    // http://stackoverflow.com/questions/29169158/react-html-editor-tinymce
    window.tinymce.remove('#article')
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
