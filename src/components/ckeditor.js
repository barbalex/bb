'use strict'

// import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'

export default React.createClass({
  displayName: 'CkEditor',

  mixins: [ListenerMixin],

  propTypes: {
    value: React.PropTypes.string
  },

  componentDidMount () {
    this.listenTo(app.requestSaveCkeditorStore, this.onRequestSaveCkeditor)
    window.CKEDITOR.replace('document', {
      // allow Content that ckeditor can not build itself
      allowedContent: false
    })
  },

  onRequestSaveCkeditor () {
    console.log('fetch data')
    const article = CKEDITOR.instances.editor1.getData()
    app.saveArticle(article)
  },

  shouldComponentUpdate () {
    return false
  },

  render () {
    const { value } = this.props
    return (
      <textarea id='document' defaultValue={value} />
    )
  }
})
