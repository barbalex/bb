import React from 'react'
import { Base64 } from 'js-base64'

export default React.createClass({
  displayName: 'Editor',

  propTypes: {
    doc: React.PropTypes.object,
    articleDecoded: React.PropTypes.string,
    onSavePageArticle: React.PropTypes.func,
    onSaveMonthlyEventArticle: React.PropTypes.func,
    onSavePublicationArticle: React.PropTypes.func,
    onSaveCommentaryArticle: React.PropTypes.func,
    onSaveActorArticle: React.PropTypes.func
  },

  componentDidMount() {
    const {
      doc,
      onSavePageArticle,
      onSaveMonthlyEventArticle,
      onSavePublicationArticle,
      onSaveCommentaryArticle,
      onSaveActorArticle
    } = this.props
    // height = window - menu height - (menubar + iconbar)
    let height = window.innerHeight - 52 - 74
    if (onSaveMonthlyEventArticle || onSavePublicationArticle) {
      height = window.innerHeight - 52 - 74 - 76
    }
    if (onSaveCommentaryArticle || onSaveActorArticle) {
      height = window.innerHeight - 52 - 74 - 90
    }
    const instanceSelector = `#${doc._id}`
    // need to add specific classes to the iframe body because my css will not apply otherwise
    let bodyClass = ''
    if (onSavePageArticle) bodyClass = ''
    if (onSaveMonthlyEventArticle) bodyClass = 'monthlyEvent'
    if (onSavePublicationArticle) bodyClass = 'publication'
    if (onSaveCommentaryArticle) bodyClass = 'commentary'
    if (onSaveActorArticle) bodyClass = 'actor'

    window.tinymce.init({
      selector: instanceSelector,
      plugins: [
        'advlist autolink link image lists charmap print hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking',
        'save table contextmenu directionality template paste textcolor autosave codemirror'
      ],
      menubar: 'edit insert view format table tools',
      toolbar: 'insertfile undo redo | styleselect | bold italic underline forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print code fullscreen',
      height,
      browser_spellcheck: true,
      automatic_uploads: false,
      statusbar: false,
      body_class: bodyClass,
      content_css: '/tinymce.css',
      // try to stop tinymce from changing html on the server
      // sadly did not work
      /*
      entity_encoding: 'raw',
      verify_html: false,
      cleanup_on_startup: false,
      cleanup_on_save: false,
      trim_span_elements: false,
      convert_urls: false,
      extended_valid_elements: 'table[th]',
      valid_elements: '*[*]',
      */
      // enable auto-saving
      setup(editor) {
        editor.on('change undo redo', () => {
          const articleDecoded = editor.getContent()
          const articleEncoded = Base64.encode(articleDecoded)
          if (onSavePageArticle) onSavePageArticle(articleEncoded)
          if (onSaveMonthlyEventArticle) onSaveMonthlyEventArticle(articleEncoded)
          if (onSavePublicationArticle) onSavePublicationArticle(articleEncoded)
          if (onSaveCommentaryArticle) onSaveCommentaryArticle(articleEncoded)
          if (onSaveActorArticle) onSaveActorArticle(articleEncoded)
        })
      },
      // options for http://www.avoid.org/codemirror-for-tinymce4
      codemirror: {
        path: 'http://46.101.159.23/tinymce/plugins/codemirror/codemirror-5.15',
        indentOnInit: true
      }
    })
    // scroll editor to top in pages
    if (doc.type === 'pages') {
      window.$('html, body').animate({
        scrollTop: 140
      }, 800)
    }
  },

  shouldComponentUpdate() {
    // make sure react does not update this component
    return false
  },

  componentWillUnmount() {
    // this is needed for correct behaviour, see
    // http://stackoverflow.com/questions/29169158/react-html-editor-tinymce
    const { doc } = this.props
    const instanceSelector = `#${doc._id}`
    window.tinymce.remove(instanceSelector)
  },

  render() {
    const { doc, articleDecoded } = this.props
    return (
      <textarea
        id={doc._id}
        defaultValue={articleDecoded}
      />
    )
  }
})
