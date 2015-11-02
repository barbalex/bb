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
import SourceCategories from './sources/sourceCategories.js'
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
    activeMonthlyEvent: React.PropTypes.object,
    activePublication: React.PropTypes.object,
    activeCommentary: React.PropTypes.object,
    activeSourceCategory: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showNewCommentary: React.PropTypes.bool,
    showNewSourceCategory: React.PropTypes.bool,
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
      activeMonthlyEvent: {},
      activePublication: {},
      activeCommentary: {},
      activeSourceCategory: {},
      editing: false,
      showNewCommentary: false,
      showNewSourceCategory: false,
      showNewMonthlyEvent: false,
      showNewPublication: false,
      email: email,
      errors: []
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.pageStore, this.onPageStoreChange)
    this.listenTo(app.monthlyEventStore, this.onMonthlyEventStoreChange)
    this.listenTo(app.publicationStore, this.onPublicationStoreChange)
    this.listenTo(app.commentaryStore, this.onCommentaryStoreChange)
    this.listenTo(app.sourceCategoryStore, this.onSourceCategoryStoreChange)
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.errorStore, this.onError)
  },

  onPageStoreChange (activePage) {
    this.setState({ activePage })
  },

  onMonthlyEventStoreChange (activeMonthlyEvent) {
    this.setState({ activeMonthlyEvent })
  },

  onPublicationStoreChange (activePublication) {
    this.setState({ activePublication })
  },

  onCommentaryStoreChange (activeCommentary) {
    this.setState({ activeCommentary })
  },

  onSourceCategoryStoreChange (activeSourceCategory) {
    this.setState({ activeSourceCategory })
  },

  onLoginStoreChange (email) {
    this.setState({ email })
    if (email) app.Actions.getPage('pages_home')
  },

  onError (errors) {
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

  onClickNewSourceCategory () {
    this.setState({ showNewSourceCategory: true })
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

  onCloseNewSourceCategory () {
    this.setState({ showNewSourceCategory: false })
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

  onSaveSourceCategoryArticle (articleEncoded) {
    let { activeSourceCategory } = this.state
    activeSourceCategory.article = articleEncoded
    app.Actions.saveSourceCategory(activeSourceCategory)
  },

  render () {
    const { login } = this.props
    const { activePage, activeMonthlyEvent, activePublication, activeCommentary, activeSourceCategory, editing, showNewCommentary, showNewSourceCategory, showNewMonthlyEvent, showNewPublication, email, errors } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents', 'pages_publications']
    const isSimplePage = activePage.type && activePage.type === 'pages' && !_.includes(nonSimplePages, activePage._id)
    const isCommentariesPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_commentaries'
    const isSourceCategoryPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_sources'
    const isMonthlyEventsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_monthlyEvents'
    const isPublicationsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_publications'
    const isCommentary = activePage.type && activePage.type === 'commentaries'
    const isSourceCategory = activePage.type && activePage.type === 'sources'
    const showCommentaryPage = isCommentariesPage || isCommentary
    const showSourceCategoryPage = isSourceCategoryPage || isSourceCategory
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
            activeSourceCategory={activeSourceCategory}
            email={email}
            editing={editing}
            onClickEdit={this.onClickEdit}
            onClickNewCommentary={this.onClickNewCommentary}
            onClickNewSourceCategory={this.onClickNewSourceCategory}
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
                activeCommentary={activeCommentary}
                editing={editing}
                email={email}
                onSaveCommentaryArticle={this.onSaveCommentaryArticle}
                showNewCommentary={showNewCommentary}
                onCloseNewCommentary={this.onCloseNewCommentary} />
              : null
            }
            {showSourceCategoryPage ?
              <SourceCategories
                activeSourceCategory={activeSourceCategory}
                editing={editing}
                email={email}
                onSaveSourceCategoryArticle={this.onSaveSourceCategoryArticle}
                showNewSourceCategory={showNewSourceCategory}
                onCloseNewSourceCategory={this.onCloseNewSourceCategory} />
              : null
            }
            {showMonthlyEventsPage ?
              <MonthlyEvents
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
