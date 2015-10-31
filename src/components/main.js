'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import DocumentTitle from 'react-document-title'
import NavHelper from '../components/navHelper.js'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'
import Page from './page.js'
import Commentaries from './commentaries/commentaries.js'
import MonthlyEvents from './monthlyEvents/monthlyEvents.js'
import Login from './login/login.js'
import Errors from './errors.js'
import getPageNameFromDoc from '../modules/getPageNameFromDoc.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    activePage: React.PropTypes.object,
    activeMonthlyEvent: React.PropTypes.object,
    commentary: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showNewCommentary: React.PropTypes.bool,
    showNewMonthlyEvent: React.PropTypes.bool,
    login: React.PropTypes.bool,
    email: React.PropTypes.string,
    errors: React.PropTypes.array
  },

  getInitialState () {
    const email = window.localStorage.email
    return {
      activePage: {},
      activeMonthlyEvent: {},
      commentary: {},
      editing: false,
      showNewCommentary: false,
      showNewMonthlyEvent: false,
      email: email,
      errors: []
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.pageStore, this.onPageStoreChange)
    this.listenTo(app.monthlyEventStore, this.onMonthlyEventStoreChange)
    this.listenTo(app.commentaryStore, this.onCommentaryStoreChange)
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.errorStore, this.onError)
  },

  onPageStoreChange (activePage) {
    this.setState({ activePage })
  },

  onMonthlyEventStoreChange (activeMonthlyEvent) {
    this.setState({ activeMonthlyEvent })
  },

  onCommentaryStoreChange (commentary) {
    this.setState({ commentary })
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

  onClickNewMonthlyEvent () {
    this.setState({ showNewMonthlyEvent: true })
  },

  onCloseNewCommentary () {
    this.setState({ showNewCommentary: false })
  },

  onCloseNewMonthlyEvent () {
    this.setState({ showNewMonthlyEvent: false })
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

  onSaveCommentaryArticle (articleEncoded) {
    let { commentary } = this.state
    commentary.article = articleEncoded
    app.Actions.saveCommentary(commentary)
  },

  render () {
    const { login } = this.props
    const { activePage, activeMonthlyEvent, commentary, editing, showNewCommentary, showNewMonthlyEvent, email, errors } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents']
    const isSimplePage = activePage.type && activePage.type === 'pages' && !_.includes(nonSimplePages, activePage._id)
    const isCommentariesPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_commentaries'
    const isMonthlyEventsPage = activePage.type && activePage.type === 'pages' && activePage._id === 'pages_monthlyEvents'
    const isCommentary = activePage.type && activePage.type === 'commentaries'
    const showCommentaryPage = isCommentariesPage || isCommentary
    const isMonthlyEvent = activePage.type && activePage.type === 'monthlyEvents'
    const showMonthlyEventsPage = isMonthlyEventsPage || isMonthlyEvent
    const pageName = getPageNameFromDoc(activePage)
    const pageTitle = `blue-borders | ${pageName}`

    return (
      <DocumentTitle title={pageTitle}>
        <NavHelper>
          <Header />
          <Navbar
            activePage={activePage}
            activeMonthlyEvent={activeMonthlyEvent}
            commentary={commentary}
            email={email}
            editing={editing}
            onClickEdit={this.onClickEdit}
            onClickNewCommentary={this.onClickNewCommentary}
            onClickNewMonthlyEvent={this.onClickNewMonthlyEvent} />
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
                commentary={commentary}
                editing={editing}
                email={email}
                onSaveCommentaryArticle={this.onSaveCommentaryArticle}
                showNewCommentary={showNewCommentary}
                onCloseNewCommentary={this.onCloseNewCommentary} />
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
            {login ? <Login email={email} /> : null}
            <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
          </div>
        </NavHelper>
      </DocumentTitle>
    )
  }
})
