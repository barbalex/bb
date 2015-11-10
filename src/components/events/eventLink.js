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

  onChangeUrl (event) {
    const { index, onChangeLink } = this.props
    let { link } = this.state
    link.url = event.target.value
    this.setState({ link })
    onChangeLink(index, link)
  },

  onChangeLabel (event) {
    const { index, onChangeLink } = this.props
    let { link } = this.state
    link.label = event.target.value
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

  removeLinkGlyph () {
    const { index } = this.props
    const glyphStyle = {
      fontSize: 1.5 + 'em'
    }
    return (
      <OverlayTrigger placement='right' overlay={this.removeLinkTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveLink.bind(this, index)} />
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
        <Col sm={8} lg={9}>
          <Input type='url' value={link.url} bsSize='small' onChange={this.onChangeUrl} />
        </Col>
        <Col sm={1} lg={1}>
          {this.removeLinkGlyph()}
        </Col>
      </Row>
    )
  }
})
