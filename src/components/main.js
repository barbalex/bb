'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import NavHelper from '../components/navHelper.js'
import Header from '../components/header.js'
import Page from './page.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
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

  onClickSaveCkeditor () {
    app.Actions.requestSaveCkeditor()
  },

  onSaveArticle (articleEncoded) {
    let { pageDoc } = this.state
    pageDoc.article = articleEncoded
    app.Actions.saveDoc(pageDoc)
  },

  render () {
    const { pageDoc, editing } = this.state
    return (
      <NavHelper>
        <Header editing={editing} onClickEdit={this.onClickEdit} onClickSaveCkeditor={this.onClickSaveCkeditor}/>
        <Page pageDoc={pageDoc} editing={editing} onSaveArticle={this.onSaveArticle} />
      </NavHelper>
    )
  }
})
