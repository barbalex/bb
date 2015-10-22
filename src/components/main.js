'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import NavHelper from '../components/navHelper.js'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'
import Page from './page.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    page: React.PropTypes.string,
    pageDoc: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  getInitialState () {
    return {
      pageDoc: {},
      editing: false
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.pageDocStore, this.onPageDocStoreChange)
  },

  onPageDocStoreChange (pageDoc) {
    this.setState({ pageDoc })
  },

  onClickEdit () {
    let { editing } = this.state
    editing = !editing
    this.setState({ editing })
  },

  onSaveArticle (articleEncoded) {
    let { pageDoc } = this.state
    pageDoc.article = articleEncoded
    app.Actions.saveDoc(pageDoc)
  },

  render () {
    const { page, pageDoc, editing } = this.state
    return (
      <NavHelper>
        <Header />
        <Navbar page={page} editing={editing} onClickEdit={this.onClickEdit} />
        <div className='container'>
          <Page pageDoc={pageDoc} editing={editing} onSaveArticle={this.onSaveArticle} />
          <p style={{marginTop: 70}}>&copy; Jürg Martin Gabriel. All Rights Reserved.</p>
        </div>
      </NavHelper>
    )
  }
})
