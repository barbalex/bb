'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import { Base64 } from 'js-base64'

export default React.createClass({
  displayName: 'CkEditor',

  mixins: [ListenerMixin],

  propTypes: {
    articleDecoded: React.PropTypes.string,
    onSaveArticle: React.PropTypes.func
  },

  componentDidMount () {
    this.listenTo(app.requestSaveCkeditorStore, this.onRequestSaveCkeditor)
    window.CKEDITOR.replace('article', {
      // allow Content that ckeditor can not build itself
      allowedContent: false
    })
  },

  onRequestSaveCkeditor () {
    const { onSaveArticle } = this.props
    // TODO: how get the right instance?
    const articleDecoded = window.CKEDITOR.instances.article.getData()
    console.log('ckeditor.js, onRequestSaveCkeditor, articleDecoded', articleDecoded)
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
