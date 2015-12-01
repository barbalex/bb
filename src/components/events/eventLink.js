'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Row, Col, Tooltip, OverlayTrigger, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EventLink',

  propTypes: {
    activeEvent: React.PropTypes.object,
    link: React.PropTypes.object,
    focus: React.PropTypes.bool
  },

  getInitialState () {
    return {
      link: this.props.link
    }
  },

  onChangeUrl (e) {
    let { link } = this.state
    link.url = e.target.value
    this.setState({ link })
  },

  onBlurUrl () {
    let { activeEvent } = this.props
    const { link: newLink } = this.state
    const index = activeEvent.links.findIndex((link) => link.label === newLink.label)
    activeEvent.links[index] = newLink
    app.Actions.saveEvent(activeEvent)
  },

  onChangeLabel (e) {
    let { link } = this.state
    link.label = e.target.value
    this.setState({ link })
  },

  onBlurLabel () {
    let { activeEvent } = this.props
    const { link: newLink } = this.state
    const index = activeEvent.links.findIndex((link) => link.Url === newLink.url)
    activeEvent.links[index] = newLink
    app.Actions.saveEvent(activeEvent)
  },

  onRemoveLink () {
    let { activeEvent } = this.props
    const { link: linkToRemove } = this.state
    console.log('activeEvent.links before removing', activeEvent.links)
    console.log('linkToRemove', linkToRemove)
    activeEvent.links = activeEvent.links.filter((link) => link.label !== linkToRemove.label && link.url !== linkToRemove.url)
    console.log('activeEvent.links after removing', activeEvent.links)
    app.Actions.saveEvent(activeEvent)
  },

  removeLinkTooltip () {
    return <Tooltip id='removeLink'>remove</Tooltip>
  },

  removeLinkGlyph () {
    const glyphStyle = {
      fontSize: 1.5 + 'em',
      color: 'red'
    }
    return (
      <OverlayTrigger placement='right' overlay={this.removeLinkTooltip()}>
        <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onRemoveLink} />
      </OverlayTrigger>
    )
  },

  render () {
    const { focus } = this.props
    const { link } = this.state
    const focusLabel = focus && !link.label

    console.log('eventLink.js, render, link', link)

    return (
      <Row>
        <Col sm={3} lg={2}>
          <Input type='text' value={link.label} bsSize='small' onChange={this.onChangeLabel} onBlur={this.onBlurLabel} autoFocus={focusLabel} />
        </Col>
        <Col sm={8} lg={9}>
          <Input type='url' value={link.url} bsSize='small' onChange={this.onChangeUrl} onBlur={this.onBlurUrl} />
        </Col>
        <Col sm={1} lg={1}>
          {this.removeLinkGlyph()}
        </Col>
      </Row>
    )
  }
})
