import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import ReactDOM from 'react-dom'
// import { whyDidYouUpdate } from 'why-did-you-update'
import Main from './components/main.js'

// whyDidYouUpdate(React)

export default Router.extend({
  routes: {
    '': 'home',
    home: 'home',
    aboutUs: 'aboutUs',
    links: 'links',
    'european-union-publications': 'europeanUnionPublications',
    'io-and-ngo-publications': 'ioAndNgoPublications',
    commentaries: 'commentaries',
    'commentaries/:year/:month/:day/:title': 'commentary',
    monthlyEvents: 'monthlyEvents',
    'monthlyEvents/:year/:month': 'monthlyEvent',
    publications: 'publications',
    'publications/:category': 'publicationCategory',
    'publications/:category/:title': 'publication',
    actors: 'actors',
    'actors/:category': 'actor',
    login: 'login',
    '*path': 'home'
  },

  home() {
    const id = 'pages_events'
    this.render(id)
  },

  aboutUs() {
    const id = 'pages_aboutUs'
    this.render(id)
  },

  links() {
    const id = 'pages_links'
    this.render(id)
  },

  commentaries() {
    const id = 'pages_commentaries'
    this.render(id)
  },

  commentary(year, month, day, title) {
    const id = `commentaries_${year}_${month}_${day}_${title}`
    this.render()
    app.Actions.getPage('pages_commentaries')
    app.Actions.getCommentary(id)
  },

  monthlyEvents() {
    const id = 'pages_monthlyEvents'
    this.render(id)
  },

  monthlyEvent(year, month) {
    const id = `monthlyEvents_${year}_${month}`
    this.render()
    app.Actions.getPage('pages_monthlyEvents')
    app.Actions.getMonthlyEvent(id)
  },

  publications() {
    const id = 'pages_publications'
    this.render(id)
  },

  publicationCategory() {
    // we dont first load categories - just load publications
    const id = 'pages_publications'
    this.render(id)
  },

  publication(category, title) {
    const id = `publications_${category}_${title}`
    this.render()
    app.Actions.getPage('pages_publications')
    app.Actions.getPublication(id)
  },

  actors() {
    const id = 'pages_actors'
    this.render(id)
  },

  actor(category) {
    const id = `actors_${category}`
    this.render()
    app.Actions.getPage('pages_actors')
    app.Actions.getActor(id)
  },

  login() {
    ReactDOM.render(
      <Main login />, document.getElementById('content')
    )
  },

  render(id) {
    ReactDOM.render(
      <Main />, document.getElementById('content')
    )
    if (id) app.Actions.getPage(id)
  }
})
