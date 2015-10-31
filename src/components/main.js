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
    doc: React.PropTypes.object,
    monthlyEvent: React.PropTypes.object,
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
      doc: {},
      monthlyEvent: {},
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

  onPageStoreChange (doc) {
    this.setState({ doc })
  },

  onMonthlyEventStoreChange (monthlyEvent) {
    this.setState({ monthlyEvent })
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

  onSavePage (doc) {
    app.Actions.savePage(doc)
  },

  onSavePageArticle (articleEncoded) {
    let { doc } = this.state
    doc.article = articleEncoded
    app.Actions.savePage(doc)
  },

  onSaveMonthlyEventArticle (articleEncoded) {
    let { monthlyEvent } = this.state
    monthlyEvent.article = articleEncoded
    app.Actions.saveMonthlyEvent(monthlyEvent)
  },

  onSaveCommentaryArticle (articleEncoded) {
    let { commentary } = this.state
    commentary.article = articleEncoded
    app.Actions.saveCommentary(commentary)
  },

  render () {
    const { login } = this.props
    const { doc, monthlyEvent, commentary, editing, showNewCommentary, showNewMonthlyEvent, email, errors } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents']
    const isSimplePage = doc.type && doc.type === 'pages' && !_.includes(nonSimplePages, doc._id)
    const isCommentariesPage = doc.type && doc.type === 'pages' && doc._id === 'pages_commentaries'
    const isMonthlyEventsPage = doc.type && doc.type === 'pages' && doc._id === 'pages_monthlyEvents'
    const isCommentary = doc.type && doc.type === 'commentaries'
    const showCommentaryPage = isCommentariesPage || isCommentary
    const isMonthlyEvent = doc.type && doc.type === 'monthlyEvents'
    const showMonthlyEventsPage = isMonthlyEventsPage || isMonthlyEvent
    const pageName = getPageNameFromDoc(doc)
    const pageTitle = `blue-borders | ${pageName}`

    return (
      <DocumentTitle title={pageTitle}>
        <NavHelper>
          <Header />
          <Navbar
            doc={doc}
            monthlyEvent={monthlyEvent}
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
                doc={doc}
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
                monthlyEvent={monthlyEvent}
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
