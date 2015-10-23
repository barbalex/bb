'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
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

  onClickCommentary (id) {
    // TODO: remove when it works with link only
    console.log('commentaries.js getting id', id)
    //app.Actions.getDoc(id)
  },

  commentaries () {
    const { docs } = this.state
    if (docs.length > 0) {
      return docs.map((doc, index) => {
        const path = getPathFromDoc(doc)
        console.log('doc', doc)
        return (
          <li key={index}>
            <a href={path} onClick={this.onClickCommentary.bind(this, doc._id)}>{doc.title}</a>
          </li>
        )
      })
    }
    return null
  },

  render () {
    return (
      <div>
        <h1>Commentaries</h1> 
        <ul>
          {this.commentaries()}
        </ul>
      </div>
    )
  }
})
