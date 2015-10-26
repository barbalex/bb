'use strict'

import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import getCouchUrl from '../modules/getCouchUrl.js'

export default React.createClass({
  displayName: 'AttachedImage',

  propTypes: {
    doc: React.PropTypes.object,
    attName: React.PropTypes.string,
    onSaveDoc: React.PropTypes.func
  },

  render () {
    const { doc, attName } = this.props
    const id = doc._id
    const url = getCouchUrl() + '/' + id + '/' + attName
    return (
      <Row key={id}>
        <Col xs={5} md={5}>
          <Image src={url} rounded responsive />
        </Col>
        <Col xs={5} md={5}>
          <p>url: {url}</p>
        </Col>
        <Col xs={2} md={2}>
          {/*delete button*/}
        </Col>
      </Row>
    )
  }
})
