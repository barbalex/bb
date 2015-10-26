'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Grid } from 'react-bootstrap'
import AttachedImage from './attachedImage.js'

export default React.createClass({
  displayName: 'AttachedImagesList',

  propTypes: {
    doc: React.PropTypes.object,
    onSaveDoc: React.PropTypes.func
  },

  images () {
    const { doc, onSaveDoc } = this.props
    const imageNameArray = []
    if (!doc._attachments || Object.keys(doc._attachments).length === 0) return []
    Object.keys(doc._attachments).forEach((key) => {
      console.log('getting images, key', key)
      console.log('getting images, key.content_type === image', doc._attachments[key].content_type === 'image/jpeg')
      if (doc._attachments[key].content_type === 'image/jpeg') {
        imageNameArray.push(key)
      }
    })
    const images = imageNameArray.map((imageName, index) => {
      return <AttachedImage key={index} doc={doc} attName={imageName} onSaveDoc={onSaveDoc} />
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
