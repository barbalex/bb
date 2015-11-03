'use strict'

import app from 'ampersand-app'
import React from 'react'
import Dropzone from 'react-dropzone'

export default React.createClass({
  displayName: 'AttachImages',

  propTypes: {
    doc: React.PropTypes.object
  },

  onDrop (files) {
    const { doc } = this.props
    let attachments = {}
    files.forEach((file) => {
      /**
       * create an attachments object of this form:
       * {
       *   "att.txt": {
       *     "content_type": "image/png",
       *     "data": new Blob(
       *       ["And she's hooked to the silver screen"],
       *       {type: 'text/plain'})
       *   },
       *   "att2.txt": {
       *     "content_type": "text/plain",
       *     "data": new Blob(
       *       ["But the film is a saddening bore"],
       *       {type: 'text/plain'})
       *   }
       * }
       * note: react-dropzone built the blob itself! It is file
       */
      const name = file.name
      const type = file.type
      attachments[name] = {
        content_type: type,
        data: file
      }
    })
    app.Actions.addPageAttachments(doc, attachments)
  },

  render () {
    return (
      <div className='dropzone'>
        <Dropzone onDrop={this.onDrop}>
          <div>Drop some files here.<br/>Or click to select files to upload.</div>
        </Dropzone>
      </div>
    )
  }
})
