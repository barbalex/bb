'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Grid } from 'react-bootstrap'
import AttachedImage from './attachedImage.js'

export default React.createClass({
  displayName: 'AttachedImagesList',

  propTypes: {
    doc: React.PropTypes.object,
    onSaveDoc: React.PropTypes.func,
    images: React.PropTypes.array
  },

  getInitialState () {
    return {
      images: []
    }
  },

  componentDidMount () {
    this.getImages()
  },

  getImages () {
    const { doc, onSaveDoc } = this.props
    const { images } = this.state

    if (!doc._attachments || Object.keys(doc._attachments).length === 0) return []
    Object.keys(doc._attachments).forEach((key) => {
      console.log('getting images, key', key)
      console.log('getting images, key.content_type === image', doc._attachments[key].content_type === 'image/jpeg')
      if (doc._attachments[key].content_type === 'image/jpeg') {
        images.push(<AttachedImage doc={doc} attName={key} onSaveDoc={onSaveDoc} />)
      }
    })
  },

  render () {
    const { images } = this.state
    return (
      <div>
        <Grid>
          {images}
        </Grid>
      </div>
    )
  }
})
