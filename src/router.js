'use strict'

import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/main.js'

export default Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'sources': 'sources',
    'aboutUs': 'aboutUs',
    'actors': 'actors'/*,
    '*path': 'home'*/
  },

  home () {
    console.log('router.js rendering home')
    this.render()
    app.Actions.getDoc('pages_home')
  },

  sources () {
    console.log('router.js rendering sources')
    this.render()
    app.Actions.getDoc('pages_sources')
  },

  aboutUs () {
    console.log('router.js rendering aboutUs')
    this.render()
    app.Actions.getDoc('pages_aboutUs')
  },

  actors () {
    console.log('router.js rendering actors')
    this.render()
    app.Actions.getDoc('pages_actors')
  },

  render () {
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
  }
})
