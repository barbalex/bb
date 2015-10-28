'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import NavHelper from '../components/navHelper.js'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'
import Page from './page.js'
import Commentaries from './commentaries/commentaries.js'
import Commentary from './commentaries/commentary.js'
import MonthlyEvents from './monthlyEvents/monthlyEvents.js'
import Login from './login.js'
import Errors from './errors.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    doc: React.PropTypes.object,
    monthlyEvent: React.PropTypes.object,
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
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.errorStore, this.onError)
  },

  onPageStoreChange (doc) {
    this.setState({ doc })
  },

  onMonthlyEventStoreChange (monthlyEvent) {
    this.setState({ monthlyEvent })
  },

  onLoginStoreChange (email) {
    this.setState({ email })
    app.Actions.getPage('pages_home')
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

  onSaveArticle (articleEncoded) {
    let { doc } = this.state
    doc.article = articleEncoded
    app.Actions.savePage(doc)
  },

  onSaveMonthlyEvent (articleEncoded) {
    let { monthlyEvent } = this.state
    monthlyEvent.article = articleEncoded
    app.Actions.saveMonthlyEvent(monthlyEvent)
  },

  render () {
    const { login } = this.props
    const { doc, monthlyEvent, editing, showNewCommentary, showNewMonthlyEvent, email, errors } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents']
    const isSimplePage = doc.type && doc.type === 'pages' && !_.includes(nonSimplePages, doc._id)
    const isCommentariesPage = doc.type && doc.type === 'pages' && doc._id === 'pages_commentaries'
    const isMonthlyEventsPage = doc.type && doc.type === 'pages' && doc._id === 'pages_monthlyEvents'
    const isCommentary = doc.type && doc.type === 'commentaries'
    const isMonthlyEvent = doc.type && doc.type === 'monthlyEvents'
    const showMonthlyEventsPage = isMonthlyEventsPage || isMonthlyEvent

    return (
      <NavHelper>
        <Header />
        <Navbar
          doc={doc}
          monthlyEvent={monthlyEvent}
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
              onSaveArticle={this.onSaveArticle}
              onSavePage={this.onSavePage} />
            : null
          }
          {isCommentariesPage ?
            <Commentaries
              showNewCommentary={showNewCommentary}
              onCloseNewCommentary={this.onCloseNewCommentary} />
            : null
          }
          {showMonthlyEventsPage ?
            <MonthlyEvents
              monthlyEvent={monthlyEvent}
              editing={editing}
              onSaveMonthlyEvent={this.onSaveMonthlyEvent}
              showNewMonthlyEvent={showNewMonthlyEvent}
              onCloseNewMonthlyEvent={this.onCloseNewMonthlyEvent} />
            : null
          }
          {isCommentary ?
            <Commentary
              doc={doc}
              editing={editing}
              onSaveArticle={this.onSaveArticle} />
            : null
          }
          {login ? <Login /> : null}
          <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
        </div>
      </NavHelper>
    )
  }
})
