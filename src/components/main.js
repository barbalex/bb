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

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    doc: React.PropTypes.object,
    editing: React.PropTypes.bool,
    login: React.PropTypes.bool,
    email: React.PropTypes.string
  },

  getInitialState () {
    return {
      doc: {},
      editing: false,
      email: null
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.docStore, this.onDocStoreChange)
    this.listenTo(app.loginStore, this.onLoginStoreChange)
  },

  onDocStoreChange (doc) {
    this.setState({ doc })
  },

  onLoginStoreChange (email) {
    this.setState({ email })
  },

  onClickEdit () {
    let { editing } = this.state
    editing = !editing
    this.setState({ editing })
  },

  onSaveArticle (articleEncoded) {
    let { doc } = this.state
    doc.article = articleEncoded
    app.Actions.saveDoc(doc)
  },

  render () {
    const { login } = this.props
    const { doc, editing, email } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents']
    const isSimplePage = doc.type && doc.type === 'pages' && !_.includes(nonSimplePages, doc._id)
    const isCommentariesPage = doc.type && doc.type === 'pages' && doc._id === 'pages_commentaries'
    const isMonthlyEventsPage = doc.type && doc.type === 'pages' && doc._id === 'pages_monthlyEvents'
    const isCommentary = doc.type && doc.type === 'commentaries'
    return (
      <NavHelper>
        <Header />
        <Navbar doc={doc} email={email} editing={editing} onClickEdit={this.onClickEdit} />
        <div className='container'>
          {isSimplePage ? <Page doc={doc} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {isCommentariesPage ? <Commentaries /> : null}
          {isMonthlyEventsPage ? <MonthlyEvents editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {isCommentary ? <Commentary doc={doc} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {login ? <Login /> : null}
          <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
        </div>
      </NavHelper>
    )
  }
})
