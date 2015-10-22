'use strict'

import React from 'react'
import { Base64 } from 'js-base64'

export default React.createClass({
  displayName: 'Editor',

  propTypes: {
    articleDecoded: React.PropTypes.string,
    onSaveArticle: React.PropTypes.func
  },

  componentDidMount () {
    const { onSaveArticle } = this.props
    // height = window - menu height - (menubar + iconbar)
    const height = window.innerHeight - 52 - 74
    window.tinymce.init({
      selector: '#article',
      plugins: [
        'advlist autolink link image lists charmap print hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor autosave'
      ],
      menubar: 'edit insert view format table tools',
      toolbar: 'insertfile undo redo | styleselect | bold italic underline forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | emoticons print fullscreen',
      height: height,
      browser_spellcheck: true,
      automatic_uploads: false,
      statusbar: false,
      // enable auto-saving
      setup (editor) {
        editor.on('change undo redo', (e) => {
          const articleDecoded = editor.getContent()
          const articleEncoded = Base64.encode(articleDecoded)
          onSaveArticle(articleEncoded)
        })
      }
    })
    // scroll editor to top
    window.$('html, body').animate({
      scrollTop: 140
    }, 800)
  },

  componentWillUnmount () {
    // this is needed for correct behaviour, see
    // http://stackoverflow.com/questions/29169158/react-html-editor-tinymce
    window.tinymce.remove('#article')
  },

  shouldComponentUpdate () {
    // make shure react does not touch this component
    return false
  },

  render () {
    const { articleDecoded } = this.props
    return (
      <textarea id='article' defaultValue={articleDecoded} />
    )
  }
})
