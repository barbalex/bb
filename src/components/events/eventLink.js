'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import {
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  Glyphicon,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

export default React.createClass({
  displayName: 'EventLink',

  mixins: [ListenerMixin],

  propTypes: {
    activeEvent: React.PropTypes.object,
    link: React.PropTypes.object,
    focus: React.PropTypes.bool,
    key: React.PropTypes.number
  },

  componentDidMount () {
    this.listenTo(app.eventsStore, this.onEventsStoreChange)
  },

  getInitialState () {
    return {
      link: this.props.link
    }
  },

  onEventsStoreChange () {
    // this is a bad hack
    // without it state is not changed when activeEvent changes
    // > if a link is deleted, the wrong one keeps being shown
    this.state.link = this.props.link
  },

  onChangeUrl (e) {
    let { link } = this.state
    link.url = e.target.value
    this.setState({ link })
  },

  onBlurUrl () {
    let { activeEvent } = this.props
    const { link: oldLink } = this.props
    const { link: newLink } = this.state
    const index = activeEvent.links.findIndex((link) =>
      link.label === oldLink.label && link.url === oldLink.url
    )
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
    const { link: oldLink } = this.props
    const { link: newLink } = this.state
    const index = activeEvent.links.findIndex((link) =>
      link.url === oldLink.url && link.label === oldLink.label
    )
    activeEvent.links[index] = newLink
    app.Actions.saveEvent(activeEvent)
  },

  onRemoveLink () {
    let { activeEvent } = this.props
    const { link: linkToRemove } = this.props
    activeEvent.links = activeEvent.links.filter((link) =>
      link.label !== linkToRemove.label && link.url !== linkToRemove.url
    )
    app.Actions.saveEvent(activeEvent)
  },

  removeLinkTooltip () {
    return <Tooltip id='removeLink'>remove</Tooltip>
  },

  removeLinkGlyph () {
    const glyphStyle = {
      fontSize: 1.5 + 'em',
      color: 'red',
      cursor: 'pointer'
    }
    return (
      <OverlayTrigger
        placement='right'
        overlay={this.removeLinkTooltip()}
      >
        <Glyphicon
          glyph='remove-circle'
          style={glyphStyle}
          onClick={this.onRemoveLink}
        />
      </OverlayTrigger>
    )
  },

  render () {
    const { focus, key } = this.props
    const { link } = this.state
    const focusLabel = focus && !link.label

    return (
      <Row
        key={key}
      >
        <Col
          sm={3}
          lg={2}
        >
          <FormGroup
            controlId="eventLink"
          >
            <FormControl
              type='text'
              bsSize='small'
              value={link.label}
              onChange={(event) => this.onChangeLabel(event)}
              onBlur={() => this.onBlurLabel()}
              autoFocus={focusLabel}
            />
          </FormGroup>
        </Col>
        <Col
          sm={8}
          lg={9}
        >
          <FormGroup
            controlId="eventUrl"
          >
            <FormControl
              type='url'
              bsSize='small'
              value={link.url}
              onChange={(event) => this.onChangeUrl(event)}
              onBlur={() => this.onBlurUrl()}
            />
          </FormGroup>
        </Col>
        <Col
          sm={1}
          lg={1}
        >
          {this.removeLinkGlyph()}
        </Col>
      </Row>
    )
  }
})
