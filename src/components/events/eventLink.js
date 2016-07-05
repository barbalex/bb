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
  FormControl,
} from 'react-bootstrap'

export default React.createClass({
  displayName: 'EventLink',

  propTypes: {
    activeEvent: React.PropTypes.object,
    link: React.PropTypes.object,
    focus: React.PropTypes.bool,
    index: React.PropTypes.number
  },

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      link: this.props.link
    }
  },

  componentDidMount() {
    this.listenTo(app.eventsStore, this.onEventsStoreChange)
  },

  onEventsStoreChange() {
    // this is a bad hack
    // without it state is not changed when activeEvent changes
    // > if a link is deleted, the wrong one keeps being shown
    this.state.link = this.props.link
  },

  onChangeUrl(e) {
    const { link } = this.state
    link.url = e.target.value
    this.setState({ link })
  },

  onBlurUrl() {
    const { activeEvent, link: oldLink } = this.props
    const { link: newLink } = this.state
    const index = activeEvent.links.findIndex((link) =>
      link.label === oldLink.label && link.url === oldLink.url
    )
    activeEvent.links[index] = newLink
    app.Actions.saveEvent(activeEvent)
  },

  onChangeLabel(e) {
    const { link } = this.state
    link.label = e.target.value
    this.setState({ link })
  },

  onBlurLabel() {
    const { activeEvent, link: oldLink } = this.props
    const { link: newLink } = this.state
    const index = activeEvent.links.findIndex((link) =>
      link.url === oldLink.url && link.label === oldLink.label
    )
    activeEvent.links[index] = newLink
    app.Actions.saveEvent(activeEvent)
  },

  onRemoveLink() {
    const { activeEvent } = this.props
    const { link: linkToRemove } = this.props
    activeEvent.links = activeEvent.links.filter((link) =>
      link.label !== linkToRemove.label && link.url !== linkToRemove.url
    )
    app.Actions.saveEvent(activeEvent)
  },

  removeLinkGlyph() {
    const glyphStyle = {
      fontSize: '1.5em',
      color: 'red',
      cursor: 'pointer'
    }
    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id="removeLink">
            remove
          </Tooltip>
        }
      >
        <Glyphicon
          glyph="remove-circle"
          style={glyphStyle}
          onClick={this.onRemoveLink}
        />
      </OverlayTrigger>
    )
  },

  render() {
    const { focus, index } = this.props
    const { link } = this.state
    const focusLabel = focus && !link.label

    return (
      <Row
        key={index}
      >
        <Col
          sm={3}
          lg={2}
        >
          <FormGroup
            controlId="eventLink"
          >
            <FormControl
              type="text"
              bsSize="small"
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
              type="url"
              bsSize="small"
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
