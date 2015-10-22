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
    app.Actions.loadPath('home')
    ReactDOM.render(
      <Main page='home' />, document.getElementById('content')
    )
  },

  sources () {
    app.Actions.loadPath('sources')
    ReactDOM.render(
      <Main page='sources' />, document.getElementById('content')
    )
  }
})
