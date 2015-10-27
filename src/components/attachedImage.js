'use strict'

import React from 'react'
import { Input, Button } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import getCouchUrl from '../modules/getCouchUrl.js'

export default React.createClass({
  displayName: 'AttachedImage',

  propTypes: {
    doc: React.PropTypes.object,
    attName: React.PropTypes.string,
    onSaveDoc: React.PropTypes.func,
    urlCopied: React.PropTypes.string,
    onCopyUrl: React.PropTypes.func
  },

  onCopy (url) {
    const { onCopyUrl } = this.props
    onCopyUrl(url)
  },

  render () {
    const { doc, attName, urlCopied } = this.props
    const id = doc._id
    const url = getCouchUrl() + '/' + id + '/' + attName
    const divStyle = {
      paddingTop: 15,
      paddingBottom: 15
    }
    const imgStyle = {
      width: 250
    }
    const urlCopiedButtonBsStyle = urlCopied === url ? 'success' : 'default'
    const innerButton = (
      <CopyToClipboard text={url} onCopy={this.onCopy.bind(this, url)}>
        <Button bsStyle={urlCopiedButtonBsStyle}>{urlCopied === url ? 'copied' : 'copy'}</Button>
      </CopyToClipboard>
    )
    return (
      <div key={id} style={divStyle}>
        <div className='media-left'>
          <img src={url} className='media-object' style={imgStyle} />
        </div>
        <div className='media-body'>
          <Input type='text' buttonAfter={innerButton} value={url} disabled />
        </div>
      </div>
    )
  }
})
