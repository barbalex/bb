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
      editing: true
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.pageStore, this.onPageStoreChange)
  },

  onPageStoreChange (pageDoc) {
    this.setState({ pageDoc })
  },

  onClickEdit () {
    let { editing } = this.state
    editing = !editing
    this.setState({ editing })
  },

  render () {
    const { pageDoc, editing } = this.state
    return (
      <NavHelper>
        <Header editing={editing} onClickEdit={this.onClickEdit}/>
        <Page pageDoc={pageDoc} editing={editing} />
      </NavHelper>
    )
  }
})
