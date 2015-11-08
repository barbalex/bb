'use strict'

import React from 'react'
import { Row, Col } from 'react-bootstrap'
import EventLink from './eventLink.js'
import NewEventLink from './newEventLink.js'

export default React.createClass({
  displayName: 'EventLinks',

  propTypes: {
    links: React.PropTypes.array,
    onChangeLinks: React.PropTypes.func
  },

  getInitialState () {
    const { links } = this.props
    return { links }
  },

  onRemoveLink (indexRemoved) {
    const { onChangeLinks } = this.props
    let { links } = this.state
    links = links.filter((link, index) => index !== indexRemoved)
    this.setState({ links })
    onChangeLinks(links)
  },

  onChangeLink (index, link) {
    const { onChangeLinks } = this.props
    let { links } = this.state
    const label = link.label
    const url = link.url
    links[index] = { label, url }
    this.setState({ links })
    onChangeLinks(links)
  },

  onNewLink (link) {
    const { onChangeLinks } = this.props
    let { links } = this.state
    links.push(link)
    this.setState({ links })
    onChangeLinks(links)
  },

  eventLinks () {
    const { links } = this.state
    return links.map((link, index) => <EventLink key={index} index={index} link={link} onChangeLink={this.onChangeLink} onRemoveLink={this.onRemoveLink} />)
  },

  render () {
    return (
      <div>
        <Row>
          <Col sm={3} lg={2}>
            <p>Label</p>
          </Col>
          <Col sm={7} lg={8}>
            <p>Url</p>
          </Col>
          <Col sm={1} lg={1} />
        </Row>
        {this.eventLinks()}
        <NewEventLink onNewLink={this.onNewLink} />
      </div>
    )
  }
})
