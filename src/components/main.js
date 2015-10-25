'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import NavHelper from '../components/navHelper.js'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'
import Page from './page.js'
import Commentaries from './commentaries.js'
import Commentary from './commentary.js'
import MonthlyEvents from './monthlyEvents.js'
import Login from './login.js'
import Errors from './errors.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    doc: React.PropTypes.object,
    event: React.PropTypes.object,
    editing: React.PropTypes.bool,
    login: React.PropTypes.bool,
    email: React.PropTypes.string,
    errors: React.PropTypes.array
  },

  getInitialState () {
    const email = window.localStorage.email
    return {
      doc: {},
      event: {},
      editing: false,
      email: email,
      errors: []
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.pageStore, this.onPageStoreChange)
    this.listenTo(app.eventStore, this.onEventStoreChange)
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.errorStore, this.onError)
  },

  onPageStoreChange (doc) {
    this.setState({ doc })
  },

  onEventStoreChange (event) {
    this.setState({ event })
  },

  onLoginStoreChange (email) {
    this.setState({ email })
    console.log('user ' + email + ' logged in')
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

  onSaveArticle (articleEncoded) {
    let { doc } = this.state
    doc.article = articleEncoded
    app.Actions.savePage(doc)
  },

  render () {
    const { login } = this.props
    const { doc, event, editing, email, errors } = this.state
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
        <Navbar doc={doc} event={event} email={email} editing={editing} onClickEdit={this.onClickEdit} />
        <div className='container'>
          <Errors errors={errors} />
          {isSimplePage ? <Page doc={doc} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {isCommentariesPage ? <Commentaries /> : null}
          {showMonthlyEventsPage ? <MonthlyEvents event={event} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {isCommentary ? <Commentary doc={doc} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {login ? <Login /> : null}
          <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
        </div>
      </NavHelper>
    )
  }
})
