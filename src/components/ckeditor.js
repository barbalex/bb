'use strict'

// import app from 'ampersand-app'
import React from 'react'

export default React.createClass({
  displayName: 'CkEditor',

  propTypes: {
    value: React.PropTypes.string
  },

  componentDidMount () {
    window.CKEDITOR.replace('document', {
      // allow Content that ckeditor can not build itself
      allowedContent: false
    })
  },

  render () {
    const { value } = this.props
    return (
      <textarea id='document' value={value} />
    )
  }
})
