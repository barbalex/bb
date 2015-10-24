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

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    doc: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  getInitialState () {
    return {
      doc: {},
      editing: false
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.docStore, this.onDocStoreChange)
  },

  onDocStoreChange (doc) {
    this.setState({ doc })
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
    const { doc, editing } = this.state
    const nonSimplePages = ['pages_commentaries', 'pages_monthlyEvents']
    const isSimplePage = doc.type && doc.type === 'pages' && !_.includes(nonSimplePages, doc._id)
    const isCommentariesPage = doc.type && doc.type === 'pages' && doc._id === 'pages_commentaries'
    const isMonthlyEventsPage = doc.type && doc.type === 'pages' && doc._id === 'pages_monthlyEvents'
    const isCommentary = doc.type && doc.type === 'commentaries'
    return (
      <NavHelper>
        <Header />
        <Navbar doc={doc} editing={editing} onClickEdit={this.onClickEdit} />
        <div className='container'>
          {isSimplePage ? <Page doc={doc} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          {isCommentariesPage ? <Commentaries /> : null}
          {isMonthlyEventsPage ? <MonthlyEvents /> : null}
          {isCommentary ? <Commentary doc={doc} editing={editing} onSaveArticle={this.onSaveArticle} /> : null}
          <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
        </div>
      </NavHelper>
    )
  }
})
