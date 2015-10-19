'use strict'

// import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from './components/home.js'

export default Router.extend({
  routes: {
    '*path': 'home'
  },

  home () {
    ReactDOM.render(
      <Home />,
      document.body
    )
  }
})
