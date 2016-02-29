'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import EventLink from './eventLink.js'

export default React.createClass({
  displayName: 'EventLinks',

  propTypes: {
    activeEvent: React.PropTypes.object
  },

  onNewLink () {
    const { activeEvent } = this.props
    const newLink = {
      url: '',
      label: ''
    }
    activeEvent.links.push(newLink)
    app.Actions.saveEvent(activeEvent)
  },

  eventLinks () {
    const { activeEvent } = this.props

    // TODO: for unknown reason when deleting link
    // this renders with correct props but shows wrong data!!!!????
    console.log('eventLinks, rendering links', activeEvent.links)

    return activeEvent.links.map((link, index) => (
        <EventLink
          activeEvent={activeEvent}
          link={link}
          focus={index === activeEvent.links.length - 1}
          key={index}
        />
      )
    )
  },

  render () {
    const { activeEvent } = this.props
    const labelText = activeEvent.links.length > 0 ? 'Label' : null
    const urlText = activeEvent.links.length > 0 ? 'Url' : null
    const titleStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    const labelStyle = {
      marginBottom: 0
    }

    return (
      <div>
        <div
          style={titleStyle}
        >
          Links
        </div>
        <Row>
          <Col
            sm={3}
            lg={2}
          >
            <p
              style={labelStyle}
            >
              {labelText}
            </p>
          </Col>
          <Col
            sm={7}
            lg={8}
          >
            <p
              style={labelStyle}
            >
              {urlText}
            </p>
          </Col>
          <Col
            sm={1}
            lg={1}
          />
        </Row>
        {this.eventLinks()}
        <Button
          onClick={this.onNewLink}
        >
          new link
        </Button>
      </div>
    )
  }
})
