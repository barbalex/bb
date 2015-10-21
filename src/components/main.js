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
    pageDoc: React.PropTypes.object
  },

  getInitialState () {
    return {
      pageDoc: {}
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.pageStore, this.onPageStoreChange)
  },

  onPageStoreChange (pageDoc) {
    this.setState({ pageDoc })
  },

  render () {
    const { pageDoc } = this.state
    return (
      <NavHelper>
        <Header />
        <Page pageDoc={pageDoc} />
      </NavHelper>
    )
  }
})
