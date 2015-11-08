'use strict'

import React from 'react'
import { Input, Row, Col, Tooltip, OverlayTrigger, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EventLink',

  propTypes: {
    index: React.PropTypes.number,
    link: React.PropTypes.object,
    onChangeLink: React.PropTypes.func,
    onRemoveLink: React.PropTypes.func
  },

  getInitialState () {
    const { link } = this.props
    return { link }
  },

  onChangeUrl (url) {
    const { index, onChangeLink } = this.props
    let { link } = this.state
    link.url = url
    this.setState({ link })
    onChangeLink(index, link)
  },

  onChangeLabel (label) {
    const { index, onChangeLink } = this.props
    let { link } = this.state
    link.label = label
    this.setState({ link })
    onChangeLink(index, link)
  },

  onRemoveLink () {
    const { index, onRemoveLink } = this.props
    onRemoveLink(index)
  },

  removeLinkTooltip () {
    return <Tooltip id='removeLink'>remove</Tooltip>
  },

  removeLinkGlyph (doc) {
    const { index } = this.props
    const glyphStyle = {
      fontSize: 1.5 + 'em'
    }
    return (
      <OverlayTrigger placement='right' overlay={this.removeLinkTooltip()}>
        <Glyphicon glyph='remove' style={glyphStyle} onClick={this.onRemoveLink.bind(this, index)} />
      </OverlayTrigger>
    )
  },

  render () {
    const { link } = this.state
    return (
      <Row>
        <Col sm={3} lg={2}>
          <Input type='text' value={link.label} bsSize='small' onChange={this.onChangeLabel} />
        </Col>
        <Col sm={7} lg={8}>
          <Input type='url' value={link.url} bsSize='small' onChange={this.onChangeUrl} />
        </Col>
        <Col sm={1} lg={1}>
          <removeLinkGlyph onClick={this.onRemoveLink} />
        </Col>
      </Row>
    )
  }
})
