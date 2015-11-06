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
    'events': 'events',
    'aboutUs': 'aboutUs',
    'european-union-publications': 'europeanUnionPublications',
    'io-and-ngo-publications': 'ioAndNgoPublications',
    'commentaries': 'commentaries',
    'commentaries/:year/:month/:day/:title': 'commentary',
    'monthlyEvents': 'monthlyEvents',
    'monthlyEvents/:year/:month': 'monthlyEvent',
    'publications': 'publications',
    'publications/:category/:title': 'publication',
    'sources': 'sources',
    'sources/:category': 'source',
    'actors': 'actors',
    'actors/:category': 'actor',
    'login': 'login',
    '*path': 'home'
  },

  home () {
    const id = 'pages_home'
    this.render(id)
  },

  aboutUs () {
    const id = 'pages_aboutUs'
    this.render(id)
  },

  commentaries () {
    const id = 'pages_commentaries'
    this.render(id)
  },

  commentary (year, month, day, title) {
    const id = `commentaries_${year}_${month}_${day}_${title}`
    this.render()
    app.Actions.getPage('pages_commentaries')
    app.Actions.getCommentary(id)
  },

  monthlyEvents () {
    const id = 'pages_monthlyEvents'
    this.render(id)
  },

  monthlyEvent (year, month, day, title) {
    const id = `monthlyEvents_${year}_${month}`
    this.render()
    app.Actions.getPage('pages_monthlyEvents')
    app.Actions.getMonthlyEvent(id)
  },

  publications () {
    const id = 'pages_publications'
    this.render(id)
  },

  publication (category, title) {

    console.log('router.js, publication')

    const id = `publications_${category}_${title}`
    this.render()
    app.Actions.getPage('pages_publications')
    app.Actions.getPublication(id)
  },

  sources () {
    const id = 'pages_sources'
    this.render(id)
  },

  events () {
    const id = 'pages_events'
    this.render(id)
  },

  source (category) {
    const id = `sources_${category}`
    this.render()
    app.Actions.getPage('pages_sources')
    app.Actions.getSource(id)
  },

  actors () {
    const id = 'pages_actors'
    this.render(id)
  },

  actor (category) {
    const id = `actors_${category}`
    this.render()
    app.Actions.getPage('pages_actors')
    app.Actions.getActor(id)
  },

  login () {
    ReactDOM.render(
      <Main login={true} />, document.getElementById('content')
    )
  },

  render (id) {
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
    if (id) app.Actions.getPage(id)
  }
})
