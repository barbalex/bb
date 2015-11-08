'use strict'

import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import EventLink from './eventLink.js'

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
    console.log('eventLinks.js, onChangeLink, index', index)
    console.log('eventLinks.js, onChangeLink, link', link)
    const { onChangeLinks } = this.props
    let { links } = this.state
    const label = link.label
    const url = link.url
    links[index] = { label, url }
    this.setState({ links })
    onChangeLinks(links)
  },

  onNewLink () {
    const { onChangeLinks } = this.props
    let { links } = this.state
    const newLink = {
      url: '',
      label: ''
    }
    links.push(newLink)
    this.setState({ links })
    onChangeLinks(links)
  },

  eventLinks () {
    const { links } = this.state
    return links.map((link, index) => <EventLink key={index} index={index} links={links} link={link} onChangeLink={this.onChangeLink} onRemoveLink={this.onRemoveLink} />)
  },

  render () {
    const labelStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    return (
      <div>
        <div style={labelStyle}>Links</div>
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
        <Button onClick={this.onNewLink}>new link</Button>
      </div>
    )
  }
})
