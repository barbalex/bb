'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
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
    this.setState({ docs })
  },

  commentaries () {
    let { docs } = this.state
    if (docs.length > 0) {
      docs = docs.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return docs.map((doc, index) => {
        const path = getPathFromDoc(doc)
        return (
          <ListGroupItem
            key={index}
            href={path}
          >
            {doc.title}
          </ListGroupItem>
        )
      })
    }
    return null
  },

  render () {
    return (
      <div>
        <h1>Commentaries</h1>
        <ListGroup>
          {this.commentaries()}
        </ListGroup>
      </div>
    )
  }
})
