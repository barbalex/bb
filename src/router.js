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
    'aboutUs': 'aboutUs',
    'actors': 'actors',
    'european-union-publications': 'europeanUnionPublications',
    'io-and-ngo-publications': 'ioAndNgoPublications',
    'commentaries': 'commentaries',
    'commentaries/:year/:month/:day/:title': 'commentary',
    'monthlyEvents': 'monthlyEvents',
    'monthlyEvents/:year/:month': 'monthlyEvent',
    'publications': 'publications',
    'publications/:category': 'publicationCategory',
    'publications/:category/:title': 'publication',
    'sources': 'sources',
    'sources/:category': 'sourceCategory',
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

  actors () {
    const id = 'pages_actors'
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

  publicationCategory (category) {
    // TODO: need an active publicationsCategory state object to pass here
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
    app.Actions.getPage('pages_publications')
  },

  publication (category, title) {
    const id = `publications_${category}_${title}`
    this.render()
    app.Actions.getPage('pages_publications')
    app.Actions.getPublication(id)
  },

  sources () {
    const id = 'pages_sources'
    this.render(id)
  },

  sourceCategory (category) {
    const id = `sources_${category}`
    this.render()
    app.Actions.getPage('pages_sources')
    app.Actions.getSourceCategory(id)
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
