'use strict'

import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/main.js'

export default Router.extend({
  routes: {
    '/': 'home',
    '/home': 'home',
    '*path': 'home',
    '/sources': 'sources'
  },

  home () {
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
    app.Actions.getDoc('pages_home')
  },

  sources () {
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
    app.Actions.getDoc('pages_sources')
  }
})
