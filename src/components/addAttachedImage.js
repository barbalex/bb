'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Grid } from 'react-bootstrap'
import AttachedImage from './attachedImage.js'

export default React.createClass({
  displayName: 'AttachedImagesList',

  propTypes: {
    doc: React.PropTypes.object,
    onSavePage: React.PropTypes.func,
    urlCopied: React.PropTypes.string
  },

  getInitialState () {
    return {
      urlCopied: null
    }
  },

  onCopyUrl (urlCopied) {
    this.setState({ urlCopied })
  },

  images () {
    const { doc, onSavePage } = this.props
    const { urlCopied } = this.state
    const imageNameArray = []
    if (!doc._attachments || Object.keys(doc._attachments).length === 0) return []
    Object.keys(doc._attachments).forEach((key) => {
      if (doc._attachments[key].content_type === 'image/jpeg') {
        imageNameArray.push(key)
      }
    })
    const images = imageNameArray.map((imageName, index) => {
      return <AttachedImage key={index} doc={doc} attName={imageName} urlCopied={urlCopied} onSavePage={onSavePage} onCopyUrl={this.onCopyUrl} />
    })
    return images
  },

  render () {
    return (
      <div className='media'>
        {this.images()}
      </div>
    )
  }
})
