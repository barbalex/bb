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
import Events from './events/events.js'
import Commentaries from './commentaries/commentaries.js'
import Statistics from './statistics/statistics.js'
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
    activePublicationCategory: React.PropTypes.string,
    activePublication: React.PropTypes.object,
    commentaries: React.PropTypes.array,
    activeCommentary: React.PropTypes.object,
    events: React.PropTypes.array,
    activeEvent: React.PropTypes.object,
    statistics: React.PropTypes.array,
    activeStatistic: React.PropTypes.object,
    actors: React.PropTypes.array,
    activeActor: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showNewCommentary: React.PropTypes.bool,
    showNewEvent: React.PropTypes.bool,
    showNewStatistic: React.PropTypes.bool,
    showNewActor: React.PropTypes.bool,
    showNewMonthlyEvent: React.PropTypes.bool,
    showNewPublication: React.PropTypes.bool,
    login: React.PropTypes.bool,
    email: React.PropTypes.string,
    errors: React.PropTypes.array,
    showArchiveMessage: React.PropTypes.bool
  },

  getInitialState () {
    const email = window.localStorage.email
    return {
      activePage: {},
      activeMonthlyEvent: null,
      monthlyEvents: [],
      activePublication: null,
      publications: [],
      activePublicationCategory: null,
      activeCommentary: null,
      commentaries: [],
      activeEvent: null,
      events: [],
      activeStatistic: null,
      statistics: [],
      activeActor: null,
      actors: [],
      editing: false,
      showNewCommentary: false,
      showNewEvent: false,
      showNewStatistic: false,
      showNewActor: false,
      showNewMonthlyEvent: false,
      showNewPublication: false,
      email: email,
      errors: [],
      showArchiveMessage: false
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.activePageStore, this.onActivePageStoreChange)
    this.listenTo(app.monthlyEventsStore, this.onMonthlyEventsStoreChange)
    this.listenTo(app.publicationsStore, this.onPublicationsStoreChange)
    this.listenTo(app.commentariesStore, this.onCommentariesStoreChange)
    this.listenTo(app.eventsStore, this.onEventsStoreChange)
    this.listenTo(app.statisticsStore, this.onStatisticsStoreChange)
    this.listenTo(app.actorsStore, this.onActorsStoreChange)
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.errorStore, this.onErrorStoreChange)
    this.manageArchiveMessage()
  },

  manageArchiveMessage () {
    this.setState({ showArchiveMessage: true })
    setTimeout(() => {
      this.setState({ showArchiveMessage: false })
    }, 10000)
  },

  onActivePageStoreChange (activePage) {
    this.setState({ activePage })
  },

  onMonthlyEventsStoreChange (monthlyEvents, activeMonthlyEvent) {
    const { email } = this.state
    if (!email) monthlyEvents = monthlyEvents.filter((monthlyEvent) => !monthlyEvent.draft)
    this.setState({ monthlyEvents, activeMonthlyEvent })
  },

  onPublicationsStoreChange (publications, activePublicationCategory, activePublication) {
    const { email } = this.state
    if (!email) publications = publications.filter((publication) => !publication.draft)
    this.setState({ publications, activePublicationCategory, activePublication })
  },

  onCommentariesStoreChange (commentaries, activeCommentary) {
    const { email } = this.state
    if (!email) commentaries = commentaries.filter((commentary) => !commentary.draft)
    this.setState({ commentaries, activeCommentary })
  },

  onEventsStoreChange (events, activeEvent) {
    let state = { events, activeEvent }
    // when new event was saved, hide component
    if (activeEvent) Object.assign(state, { showNewEvent: false })
    this.setState(state)
  },

  onStatisticsStoreChange (statistics, activeStatistic) {
    const { email } = this.state
    if (!email) statistics = statistics.filter((statistic) => !statistic.draft)
    this.setState({ statistics, activeStatistic })
  },

  onActorsStoreChange (actors, activeActor) {
    const { email } = this.state
    if (!email) actors = actors.filter((actor) => !actor.draft)
    this.setState({ actors, activeActor })
  },

  onLoginStoreChange (email) {
    this.setState({ email })
    if (email) app.Actions.getPage('pages_events')
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

  onClickNewEvent () {
    this.setState({ showNewEvent: true })
  },

  onClickNewStatistic () {
    this.setState({ showNewStatistic: true })
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

  onCloseNewEvent () {
    this.setState({ showNewEvent: false })
  },

  onCloseNewStatistic () {
    this.setState({ showNewStatistic: false })
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

  onSaveStatisticArticle (articleEncoded) {
    let { activeStatistic } = this.state
    activeStatistic.article = articleEncoded
    app.Actions.saveStatistic(activeStatistic)
  },

  onSaveActorArticle (articleEncoded) {
    let { activeActor } = this.state
    activeActor.article = articleEncoded
    app.Actions.saveActor(activeActor)
  },

  onChangeActiveEvent (activeEvent) {
    this.setState({ activeEvent })
  },

  render () {
    const { login } = this.props
    const { activePage, monthlyEvents, activeMonthlyEvent, publications, activePublicationCategory, activePublication, events, activeEvent, commentaries, activeCommentary, statistics, activeStatistic, actors, activeActor, editing, showNewCommentary, showNewEvent, showNewStatistic, showNewActor, showNewMonthlyEvent, showNewPublication, email, errors, showArchiveMessage } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents', 'pages_publications', 'pages_events', 'pages_statistics']
    const isSimplePage = activePage.type && activePage.type === 'pages' && !_.includes(nonSimplePages, activePage._id)
    const isCommentariesPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_commentaries'
    const isStatisticPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_statistics'
    const isEventsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_events'
    const isActorPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_actors'
    const isMonthlyEventsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_monthlyEvents'
    const isPublicationsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_publications'
    const isCommentary = activePage.type && activePage.type === 'commentaries'
    const isStatistic = activePage.type && activePage.type === 'statistics'
    const isActor = activePage.type && activePage.type === 'actors'
    const showCommentaryPage = isCommentariesPage || isCommentary
    const showStatisticPage = isStatisticPage || isStatistic
    const showEventsPage = isEventsPage
    const showActorPage = isActorPage || isActor
    const isMonthlyEvent = activePage.type && activePage.type === 'monthlyEvents'
    const showMonthlyEventsPage = isMonthlyEventsPage || isMonthlyEvent
    const isPublication = activePage.type && activePage.type === 'publications'
    const showPublicationsPage = isPublicationsPage || isPublication
    const pageName = getPageNameFromDoc(activePage)
    const pageTitle = `blue-borders | ${pageName}`
    const pagesWitCopyright = ['pages_commentaries']
    const showCopyright = activePage.type && activePage.type === 'pages' && _.includes(pagesWitCopyright, activePage._id)

    return (
      <DocumentTitle title={pageTitle}>
        <NavHelper>
          <Header />
          <Navbar
            activePage={activePage}
            activeMonthlyEvent={activeMonthlyEvent}
            activePublication={activePublication}
            activeCommentary={activeCommentary}
            activeStatistic={activeStatistic}
            activeActor={activeActor}
            email={email}
            editing={editing}
            onClickEdit={this.onClickEdit}
            onClickNewCommentary={this.onClickNewCommentary}
            onClickNewStatistic={this.onClickNewStatistic}
            onClickNewEvent={this.onClickNewEvent}
            onClickNewActor={this.onClickNewActor}
            onClickNewMonthlyEvent={this.onClickNewMonthlyEvent}
            onClickNewPublication={this.onClickNewPublication} />
          <div className='container'>
            <Errors errors={errors} />
            {
              isSimplePage
              ? <Page
                  activePage={activePage}
                  editing={editing}
                  onSavePageArticle={this.onSavePageArticle}
                  onSavePage={this.onSavePage} />
              : null
            }
            {
              showEventsPage
              ? <Events
                  events={events}
                  editing={editing}
                  email={email}
                  activeEvent={activeEvent}
                  showNewEvent={showNewEvent}
                  onChangeActiveEvent={this.onChangeActiveEvent}
                  onCloseNewEvent={this.onCloseNewEvent}
                  showArchiveMessage={showArchiveMessage} />
              : null
            }
            {
              showCommentaryPage
              ? <Commentaries
                  commentaries={commentaries}
                  activeCommentary={activeCommentary}
                  editing={editing}
                  email={email}
                  onSaveCommentaryArticle={this.onSaveCommentaryArticle}
                  showNewCommentary={showNewCommentary}
                  onCloseNewCommentary={this.onCloseNewCommentary} />
              : null
            }
            {
              showStatisticPage
              ? <Statistics
                  statistics={statistics}
                  activeStatistic={activeStatistic}
                  editing={editing}
                  email={email}
                  onSaveStatisticArticle={this.onSaveStatisticArticle}
                  showNewStatistic={showNewStatistic}
                  onCloseNewStatistic={this.onCloseNewStatistic} />
              : null
            }
            {
              showActorPage
              ? <Actors
                  actors={actors}
                  activeActor={activeActor}
                  editing={editing}
                  email={email}
                  onSaveActorArticle={this.onSaveActorArticle}
                  showNewActor={showNewActor}
                  onCloseNewActor={this.onCloseNewActor} />
              : null
            }
            {
              showMonthlyEventsPage
              ? <MonthlyEvents
                  monthlyEvents={monthlyEvents}
                  activeMonthlyEvent={activeMonthlyEvent}
                  editing={editing}
                  email={email}
                  onSaveMonthlyEventArticle={this.onSaveMonthlyEventArticle}
                  showNewMonthlyEvent={showNewMonthlyEvent}
                  onCloseNewMonthlyEvent={this.onCloseNewMonthlyEvent} />
              : null
            }
            {
              showPublicationsPage
              ? <Publications
                  publications={publications}
                  activePublicationCategory={activePublicationCategory}
                  activePublication={activePublication}
                  editing={editing}
                  email={email}
                  onSavePublicationArticle={this.onSavePublicationArticle}
                  showNewPublication={showNewPublication}
                  onCloseNewPublication={this.onCloseNewPublication} />
              : null
            }
            {
              login
              ? <Login email={email} />
              : null
            }
            {
              showCopyright
              ? <p style={{marginTop: 70}}>
                  &copy; Jürg Martin Gabriel. All Rights Reserved.
                </p>
              : null
            }
          </div>
        </NavHelper>
      </DocumentTitle>
    )
  }
})
