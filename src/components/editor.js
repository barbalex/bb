'use strict'

import React from 'react'
import { Base64 } from 'js-base64'

export default React.createClass({
  displayName: 'Editor',

  propTypes: {
    doc: React.PropTypes.object,
    articleDecoded: React.PropTypes.string,
    onSaveArticle: React.PropTypes.func,
    onSaveMonthlyEvent: React.PropTypes.func,
    onSaveCommentary: React.PropTypes.func
  },

  componentDidMount () {
    const { doc, onSaveArticle, onSaveMonthlyEvent, onSaveCommentary } = this.props
    // height = window - menu height - (menubar + iconbar)
    let height = window.innerHeight - 52 - 74
    if (onSaveMonthlyEvent) height = window.innerHeight - 52 - 74 - 76
    if (onSaveCommentary) height = window.innerHeight - 52 - 74 - 90
    const instanceSelector = `#${doc._id}`

    window.tinymce.init({
      selector: instanceSelector,
      plugins: [
        'advlist autolink link image lists charmap print hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor autosave codemirror'
      ],
      menubar: 'edit insert view format table tools',
      toolbar: 'insertfile undo redo | styleselect | bold italic underline forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | emoticons print code fullscreen',
      height: height,
      browser_spellcheck: true,
      automatic_uploads: false,
      statusbar: false,
      content_css: '/bb.1.0.0.css',
      // enable auto-saving
      setup (editor) {
        editor.on('change undo redo', (e) => {
          const articleDecoded = editor.getContent()
          const articleEncoded = Base64.encode(articleDecoded)
          if (onSaveArticle) onSaveArticle(articleEncoded)
          if (onSaveMonthlyEvent) onSaveMonthlyEvent(articleEncoded)
          if (onSaveCommentary) onSaveCommentary(articleEncoded)
        })
      },
      // options for http://www.avoid.org/codemirror-for-tinymce4
      codemirror: {
        path: 'http://localhost:3000/tinymce/plugins/codemirror/codemirror-4.8',
        indentOnInit: true
      }
    })
    // scroll editor to top
    if (doc.type === 'pages') {
      window.$('html, body').animate({
        scrollTop: 140
      }, 800)
    }
  },

  shouldComponentUpdate () {
    // make sure react does not update this component
    return false
  },

  componentWillUnmount () {
    // this is needed for correct behaviour, see
    // http://stackoverflow.com/questions/29169158/react-html-editor-tinymce
    const { doc } = this.props
    const instanceSelector = `#${doc._id}`
    window.tinymce.remove(instanceSelector)
  },

  render () {
    const { doc, articleDecoded } = this.props
    return (
      <textarea
        id={doc._id}
        defaultValue={articleDecoded} />
    )
  }
})
