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

  onRemoveLink (linkToRemove) {
    const { onChangeLinks } = this.props
    let { links } = this.props
    console.log('eventLinks.js, onRemoveLink, linkToRemove', linkToRemove)
    console.log('eventLinks.js, onRemoveLink, links before filtering', links)
    links = links.filter((link, index) => link.label !== linkToRemove.label && link.url !== linkToRemove.url)
    console.log('eventLinks.js, onRemoveLink, links after filtering', links)
    onChangeLinks(links)
  },

  onChangeLink (index, link) {
    const { onChangeLinks } = this.props
    let { links } = this.props
    const label = link.label
    const url = link.url
    links[index] = { label, url }
    onChangeLinks(links)
  },

  onNewLink () {
    const { onChangeLinks } = this.props
    let { links } = this.props
    const newLink = {
      url: '',
      label: ''
    }
    links.push(newLink)
    onChangeLinks(links)
  },

  eventLinks () {
    const { links } = this.props
    return links.map((link, index) => <EventLink key={index} index={index} links={links} link={link} focus={index === links.length - 1} onChangeLink={this.onChangeLink} onRemoveLink={this.onRemoveLink} />)
  },

  render () {
    const { links } = this.props
    const labelText = links.length > 0 ? 'Label' : null
    const urlText = links.length > 0 ? 'Url' : null
    const titleStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    const labelStyle = {
      marginBottom: 0
    }
    return (
      <div>
        <div style={titleStyle}>Links</div>
        <Row>
          <Col sm={3} lg={2}>
            <p style={labelStyle}>{labelText}</p>
          </Col>
          <Col sm={7} lg={8}>
            <p style={labelStyle}>{urlText}</p>
          </Col>
          <Col sm={1} lg={1} />
        </Row>
        {this.eventLinks()}
        <Button onClick={this.onNewLink}>new link</Button>
      </div>
    )
  }
})
