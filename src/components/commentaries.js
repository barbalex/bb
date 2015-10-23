'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import getPathFromDoc from '../modules/getPathFromDoc.js'

export default React.createClass({
  displayName: 'Commentaries',

  mixins: [ListenerMixin],

  propTypes: {
    docs: React.PropTypes.array
  },

  getInitialState () {
    return {
      docs: []
    }
  },

  componentDidMount () {
    this.listenTo(app.commentariesStore, this.onCommentariesStoreChange)
    app.Actions.getCommentaries()
  },

  onCommentariesStoreChange (docs) {
    console.log('commentaries arrived:', docs)
    this.setState({ docs })
  },

  commentaries () {
    const { docs } = this.state
    if (docs.length > 0) {
      return docs.map((doc) => {
        const path = getPathFromDoc(doc)
        return (
          <li>
            <a href={path}>doc.title</a>
          </li>
        )
      })
    }
    return null
  },

  render () {
    return (
      <ul>
        {this.commentaries()}
      </ul>
    )
  }
})
