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
    'actors': 'actors',
    'academic-publications': 'academicPublications',
    'european-union-publications': 'europeanUnionPublications',
    'io-and-ngo-publications': 'ioAndNgoPublications',
    '*path': 'home'
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

  academicPublications () {
    console.log('router.js rendering academic-publications')
    this.render()
    app.Actions.getDoc('pages_academic-publications')
  },

  europeanUnionPublications () {
    console.log('router.js rendering european-union-publications')
    this.render()
    app.Actions.getDoc('pages_european-union-publications')
  },

  ioAndNgoPublications () {
    console.log('router.js rendering io-and-ngo-publications')
    this.render()
    app.Actions.getDoc('pages_io-and-ngo-publications')
  },

  render () {
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
  }
})
