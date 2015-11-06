'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import DocumentTitle from 'react-document-title'
import NavHelper from '../components/navHelper.js'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'
import Page from './pages/page.js'
import Commentaries from './commentaries/commentaries.js'
import Sources from './sources/sources.js'
import Actors from './actors/actors.js'
import MonthlyEvents from './monthlyEvents/monthlyEvents.js'
import Publications from './publications/publications.js'
import Login from './login/login.js'
import Errors from './errors.js'
import getPageNameFromDoc from '../modules/getPageNameFromDoc.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    activePage: React.PropTypes.object,
    monthlyEvents: React.PropTypes.array,
    activeMonthlyEvent: React.PropTypes.object,
    publications: React.PropTypes.array,
    activePublication: React.PropTypes.object,
    commentaries: React.PropTypes.array,
    activeCommentary: React.PropTypes.object,
    activeSource: React.PropTypes.object,
    activeActor: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showNewCommentary: React.PropTypes.bool,
    showNewSource: React.PropTypes.bool,
    showNewActor: React.PropTypes.bool,
    showNewMonthlyEvent: React.PropTypes.bool,
    showNewPublication: React.PropTypes.bool,
    login: React.PropTypes.bool,
    email: React.PropTypes.string,
    errors: React.PropTypes.array
  },

  getInitialState () {
    const email = window.localStorage.email
    return {
      activePage: {},
      activeMonthlyEvent: null,
      monthlyEvents: [],
      activePublication: null,
      publications: [],
      activeCommentary: null,
      commentaries: [],
      activeSource: {},
      activeActor: {},
      editing: false,
      showNewCommentary: false,
      showNewSource: false,
      showNewActor: false,
      showNewMonthlyEvent: false,
      showNewPublication: false,
      email: email,
      errors: []
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.activePageStore, this.onActivePageStoreChange)
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    this.listenTo(app.publicationsStore, this.onPublicationsStoreChange)
    this.listenTo(app.commentariesStore, this.onCommentariesStoreChange)
    this.listenTo(app.activeSourceStore, this.onActiveSourceStoreChange)
    this.listenTo(app.activeActorStore, this.onActiveActorStoreChange)
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.errorStore, this.onErrorStoreChange)
  },

  onActivePageStoreChange (activePage) {
    this.setState({ activePage })
  },

  onMonthlyEventsStoreChange (monthlyEvents, activeMonthlyEvent) {
    const { email } = this.state
    if (!email) monthlyEvents = monthlyEvents.filter((monthlyEvent) => !monthlyEvent.draft)
    this.setState({ monthlyEvents, activeMonthlyEvent })
  },

  onPublicationsStoreChange (publications, activePublication) {
    const { email } = this.state
    if (!email) publications = publications.filter((publication) => !publication.draft)
    this.setState({ publications, activePublication })
  },

  onCommentariesStoreChange (commentaries, activeCommentary) {
    const { email } = this.state
    if (!email) commentaries = commentaries.filter((commentary) => !commentary.draft)
    this.setState({ commentaries, activeCommentary })
  },

  onActiveSourceStoreChange (activeSource) {
    this.setState({ activeSource })
  },

  onActiveActorStoreChange (activeActor) {
    this.setState({ activeActor })
  },

  onLoginStoreChange (email) {
    this.setState({ email })
    if (email) app.Actions.getPage('pages_home')
  },

  onErrorStoreChange (errors) {
    this.setState({ errors })
  },

  onClickEdit () {
    let { editing } = this.state
    editing = !editing
    this.setState({ editing })
  },

  onClickNewCommentary () {
    this.setState({ showNewCommentary: true })
  },

  onClickNewSource () {
    this.setState({ showNewSource: true })
  },

  onClickNewActor () {
    this.setState({ showNewActor: true })
  },

  onClickNewMonthlyEvent () {
    this.setState({ showNewMonthlyEvent: true })
  },

  onClickNewPublication () {
    this.setState({ showNewPublication: true })
  },

  onCloseNewCommentary () {
    this.setState({ showNewCommentary: false })
  },

  onCloseNewSource () {
    this.setState({ showNewSource: false })
  },

  onCloseNewActor () {
    this.setState({ showNewActor: false })
  },

  onCloseNewMonthlyEvent () {
    this.setState({ showNewMonthlyEvent: false })
  },

  onCloseNewPublication () {
    this.setState({ showNewPublication: false })
  },

  onSavePage (activePage) {
    app.Actions.savePage(activePage)
  },

  onSavePageArticle (articleEncoded) {
    let { activePage } = this.state
    activePage.article = articleEncoded
    app.Actions.savePage(activePage)
  },

  onSaveMonthlyEventArticle (articleEncoded) {
    let { activeMonthlyEvent } = this.state
    activeMonthlyEvent.article = articleEncoded
    app.Actions.saveMonthlyEvent(activeMonthlyEvent)
  },

  onSavePublicationArticle (articleEncoded) {
    let { activePublication } = this.state
    activePublication.article = articleEncoded
    app.Actions.savePublication(activePublication)
  },

  onSaveCommentaryArticle (articleEncoded) {
    let { activeCommentary } = this.state
    activeCommentary.article = articleEncoded
    app.Actions.saveCommentary(activeCommentary)
  },

  onSaveSourceArticle (articleEncoded) {
    let { activeSource } = this.state
    activeSource.article = articleEncoded
    app.Actions.saveSource(activeSource)
  },

  onSaveActorArticle (articleEncoded) {
    let { activeActor } = this.state
    activeActor.article = articleEncoded
    app.Actions.saveActor(activeActor)
  },

  render () {
    const { login } = this.props
    const { activePage, monthlyEvents, activeMonthlyEvent, publications, activePublication, commentaries, activeCommentary, activeSource, activeActor, editing, showNewCommentary, showNewSource, showNewActor, showNewMonthlyEvent, showNewPublication, email, errors } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents', 'pages_publications']
    const isSimplePage = activePage.type && activePage.type === 'pages' && !_.includes(nonSimplePages, activePage._id)
    const isCommentariesPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_commentaries'
    const isSourcePage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_sources'
    const isActorPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_actors'
    const isMonthlyEventsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_monthlyEvents'
    const isPublicationsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_publications'
    const isCommentary = activePage.type && activePage.type === 'commentaries'
    const isSource = activePage.type && activePage.type === 'sources'
    const isActor = activePage.type && activePage.type === 'actors'
    const showCommentaryPage = isCommentariesPage || isCommentary
    const showSourcePage = isSourcePage || isSource
    const showActorPage = isActorPage || isActor
    const isMonthlyEvent = activePage.type && activePage.type === 'monthlyEvents'
    const showMonthlyEventsPage = isMonthlyEventsPage || isMonthlyEvent
    const isPublication = activePage.type && activePage.type === 'publications'
    const showPublicationsPage = isPublicationsPage || isPublication
    const pageName = getPageNameFromDoc(activePage)
    const pageTitle = `blue-borders | ${pageName}`

    return (
      <DocumentTitle title={pageTitle}>
        <NavHelper>
          <Header />
          <Navbar
            activePage={activePage}
            activeMonthlyEvent={activeMonthlyEvent}
            activePublication={activePublication}
            activeCommentary={activeCommentary}
            activeSource={activeSource}
            activeActor={activeActor}
            email={email}
            editing={editing}
            onClickEdit={this.onClickEdit}
            onClickNewCommentary={this.onClickNewCommentary}
            onClickNewSource={this.onClickNewSource}
            onClickNewActor={this.onClickNewActor}
            onClickNewMonthlyEvent={this.onClickNewMonthlyEvent}
            onClickNewPublication={this.onClickNewPublication} />
          <div className='container'>
            <Errors errors={errors} />
            {isSimplePage ?
              <Page
                activePage={activePage}
                editing={editing}
                onSavePageArticle={this.onSavePageArticle}
                onSavePage={this.onSavePage} />
              : null
            }
            {showCommentaryPage ?
              <Commentaries
                commentaries={commentaries}
                activeCommentary={activeCommentary}
                editing={editing}
                email={email}
                onSaveCommentaryArticle={this.onSaveCommentaryArticle}
                showNewCommentary={showNewCommentary}
                onCloseNewCommentary={this.onCloseNewCommentary} />
              : null
            }
            {showSourcePage ?
              <Sources
                activeSource={activeSource}
                editing={editing}
                email={email}
                onSaveSourceArticle={this.onSaveSourceArticle}
                showNewSource={showNewSource}
                onCloseNewSource={this.onCloseNewSource} />
              : null
            }
            {showActorPage ?
              <Actors
                activeActor={activeActor}
                editing={editing}
                email={email}
                onSaveActorArticle={this.onSaveActorArticle}
                showNewActor={showNewActor}
                onCloseNewActor={this.onCloseNewActor} />
              : null
            }
            {showMonthlyEventsPage ?
              <MonthlyEvents
                monthlyEvents={monthlyEvents}
                activeMonthlyEvent={activeMonthlyEvent}
                editing={editing}
                email={email}
                onSaveMonthlyEventArticle={this.onSaveMonthlyEventArticle}
                showNewMonthlyEvent={showNewMonthlyEvent}
                onCloseNewMonthlyEvent={this.onCloseNewMonthlyEvent} />
              : null
            }
            {showPublicationsPage ?
              <Publications
                publications={publications}
                activePublication={activePublication}
                editing={editing}
                email={email}
                onSavePublicationArticle={this.onSavePublicationArticle}
                showNewPublication={showNewPublication}
                onCloseNewPublication={this.onCloseNewPublication} />
              : null
            }
            {login ? <Login email={email} /> : null}
            <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
          </div>
        </NavHelper>
      </DocumentTitle>
    )
  }
})
