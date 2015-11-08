'use strict'

import React from 'react'
import { Input, Row, Col } from 'react-bootstrap'

export default React.createClass({
  displayName: 'NewEventLink',

  propTypes: {
    onNewLink: React.PropTypes.func
  },

  onBlurUrl (url) {
    const { onNewLink } = this.props
    const link = {
      label: '',
      url: url
    }
    onNewLink(link)
  },

  onBlurLabel (label) {
    const { onNewLink } = this.props
    const link = {
      label: label,
      url: ''
    }
    onNewLink(link)
  },

  render () {
    return (
      <Row>
        <Col sm={3} lg={2}>
          <Input type='text' bsSize='small' onBlur={this.onBlurLabel} />
        </Col>
        <Col sm={7} lg={8}>
          <Input type='url' bsSize='small' onChange={this.onBlurUrl} />
        </Col>
        <Col sm={1} lg={1} />
      </Row>
    )
  }
})
