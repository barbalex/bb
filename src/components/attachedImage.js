'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Button, Glyphicon } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import getCouchUrl from '../modules/getCouchUrl.js'

export default React.createClass({
  displayName: 'AttachedImage',

  propTypes: {
    doc: React.PropTypes.object,
    attName: React.PropTypes.string,
    urlCopied: React.PropTypes.string,
    onCopyUrl: React.PropTypes.func
  },

  copyUrl (url) {
    const { onCopyUrl } = this.props
    onCopyUrl(url)
  },

  removeImage () {
    const { doc, attName } = this.props
    app.Actions.removeActivePageAttachment(doc, attName)
  },

  render () {
    const { doc, attName, urlCopied } = this.props
    const id = doc._id
    const url = getCouchUrl() + '/' + id + '/' + attName
    const divStyle = {
      padding: 5
    }
    const imgStyle = {
      width: 220
    }
    const glyphStyle = {
      position: 'absolute',
      top: 10,
      left: 175,
      fontSize: 2 + 'em',
      color: 'red',
      cursor: 'pointer'
    }
    const mediaLeftStyle = {
      position: 'relative'
    }
    const urlCopiedButtonBsStyle = urlCopied === url ? 'success' : 'default'
    const innerButton = (
      <CopyToClipboard text={url} onCopy={this.copyUrl.bind(this, url)}>
        <Button bsStyle={urlCopiedButtonBsStyle}>{urlCopied === url ? 'copied' : 'copy'}</Button>
      </CopyToClipboard>
    )
    return (
      <div key={id} style={divStyle}>
        <div className='media-left' style={mediaLeftStyle}>
          <img src={url} className='media-object' style={imgStyle} />
          <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.removeImage} />
        </div>
        <div className='media-body media-middle'>
          <Input type='text' buttonAfter={innerButton} value={url} disabled />
        </div>
      </div>
    )
  }
})
