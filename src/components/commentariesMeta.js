'use strict'

import React from 'react'
import { Modal, Button, Input } from 'react-bootstrap'
import Calendar from 'react-input-calendar'
import AttachedImages from './attachedImages.js'
import getDatestringFromCommentaryId from '../modules/getDatestringFromCommentaryId.js'

export default React.createClass({
  displayName: 'CommentariesMeta',

  propTypes: {
    doc: React.PropTypes.object,
    onSavePage: React.PropTypes.func,
    onCloseMeta: React.PropTypes.func,
    title: React.PropTypes.text,
    date: React.PropTypes.number
  },

  getInitialState () {
    const { doc } = this.props
    const date = doc._id ? getDatestringFromCommentaryId(doc._id) : null
    return {
      title: null,
      date: date
    }
  },

  onChangeTitle (event) {
    const title = event.target.value
    this.setState({ title })
    this.setId()
  },

  onChangeDate (date) {
    // TODO
    console.log('date', date)

    this.setId()
  },

  setId () {
    const { doc } = this.props
    const { title, date } = this.state
    if (!doc._id && title && date) {
      // action creates new commentary
    }
  },

  close () {
    const { onCloseMeta } = this.props
    onCloseMeta()
  },

  onHide () {
    // seems that this method is needed ???
  },

  render () {
    const { doc } = this.props
    const { title, date } = this.state
    const showAttachments = !!doc._id
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>Metadaten für {doc.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='text' label='title' value={title} onChange={this.onChangeTitle} />
          <Calendar
            format='DD.MM.YYYY'
            computableFormat='DD.MM.YYYY'
            date={date}
            onChange={this.onChangeDate} />
          {showAttachments ?
            <AttachedImages doc={doc} />
            : null
          }
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.close}>schliessen</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
