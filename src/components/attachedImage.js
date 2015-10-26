'use strict'

import React from 'react'
import { Row, Col, Image, Button } from 'react-bootstrap'
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
    const divStyle = {
      padding: 15
    }
    return (
      <div key={id} style={divStyle}>
        <div className='media-left'>
          <img src={url} className='media-object' />
        </div>
        <div className='media-body'>
          <p>{url}</p>
        </div>
      </div>
    )
  }
})
