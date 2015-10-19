'use strict'

// import app from 'ampersand-app'
import React from 'react'
import NavHelper from '../components/navHelper.js'

export default React.createClass({
  displayName: 'Home',

  componentDidMount () {
    window.CKEDITOR.replace('document')
  },

  render () {
    return (
      <NavHelper>
        <p>Hello World</p>
        <textarea id='document' />
      </NavHelper>
    )
  }
})
