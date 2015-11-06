'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input, Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'NewMonthlyEvent',

  propTypes: {
    onCloseNewPublication: React.PropTypes.func,
    title: React.PropTypes.string,
    category: React.PropTypes.string,
    error: React.PropTypes.string
  },

  getInitialState () {
    return {
      title: null,
      category: null,
      error: null
    }
  },

  onChangeTitle (event) {
    const title = event.target.value
    this.setState({ title })
  },

  onChangeCategory (event) {
    const category = event.target.value
    this.setState({ category })
  },

  createNewPublication () {
    const { onCloseNewPublication } = this.props
    const { title, category } = this.state
    if (title && category) {
      app.Actions.newPublication(category, title)
      onCloseNewPublication()
    } else {
      let error = 'Please choose a category'
      if (!title) error = 'Please set a title'
      this.setState({ error })
    }
  },

  close () {
    const { onCloseNewPublication } = this.props
    onCloseNewPublication()
  },

  onHide () {
    // seems that this method is needed ???
  },

  categoryOptions () {
    const publicationCategories = app.publicationsStore.getPublicationCategories()
    let options = publicationCategories.map((category, index) => <option key={index + 1} value={category}>{category}</option>)
    options.unshift(<option key={0} value={null}></option>)
    return options
  },

  render () {
    const { title, category, error } = this.state
    const alertStyle = {
      marginBottom: 10
    }
    return (
      <Modal show={true} onHide={this.close} bsSize='large'>
        <Modal.Header>
          <Modal.Title>New publication</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input type='string' label='Title' value={title} onChange={this.onChangeTitle} autoFocus />
          <Input type='select' label='Category' value={category} onChange={this.onChangeCategory}>
            {this.categoryOptions()}
          </Input>
          {error ? <Alert bsStyle='danger' style={alertStyle}>{error}</Alert> : null}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.close}>discard input and close</Button>
          <Button bsStyle='primary' onClick={this.createNewPublication}>create new publication</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
