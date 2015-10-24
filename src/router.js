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
    'commentaries': 'commentaries',
    'commentaries/:year/:month/:day/:title': 'commentary',
    'monthlyEvents': 'monthlyEvents',
    'login': 'login',
    '*path': 'home'
  },

  home () {
    const id = 'pages_home'
    this.render(id)
  },

  sources () {
    const id = 'pages_sources'
    this.render(id)
  },

  aboutUs () {
    const id = 'pages_aboutUs'
    this.render(id)
  },

  actors () {
    const id = 'pages_actors'
    this.render(id)
  },

  academicPublications () {
    const id = 'pages_academic-publications'
    this.render(id)
  },

  europeanUnionPublications () {
    const id = 'pages_european-union-publications'
    this.render(id)
  },

  ioAndNgoPublications () {
    const id = 'pages_io-and-ngo-publications'
    this.render(id)
  },

  commentaries () {
    const id = 'pages_commentaries'
    this.render(id)
  },

  commentary (year, month, day, title) {
    const id = `commentaries_${year}_${month}_${day}_${title}`
    this.render(id)
  },

  monthlyEvents () {
    const id = 'pages_monthlyEvents'
    this.render(id)
  },

  login () {
    ReactDOM.render(
      <Main login={true} />, document.getElementById('content')
    )
  },

  render (id) {
    console.log('router.js rendering id', id)
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
    if (id) app.Actions.getDoc(id)
  }
})
