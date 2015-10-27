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
    urlCopied: React.PropTypes.bool
  },

  getInitialState () {
    return {
      urlCopied: false
    }
  },

  onCopy () {
    this.setState({ urlCopied: true })
  },

  render () {
    const { doc, attName } = this.props
    const { urlCopied } = this.state
    const id = doc._id
    const url = getCouchUrl() + '/' + id + '/' + attName
    const divStyle = {
      padding: 15
    }
    const urlCopiedButtonBsStyle = urlCopied ? 'success' : 'default'
    const innerButton = (
      <CopyToClipboard text={url} onCopy={this.onCopy}>
        <Button bsStyle={urlCopiedButtonBsStyle}>{urlCopied ? 'copied' : 'copy'}</Button>
      </CopyToClipboard>
    )
    return (
      <div key={id} style={divStyle}>
        <div className='media-left'>
          <img src={url} className='media-object' />
        </div>
        <div className='media-body'>
          <Input type='text' buttonAfter={innerButton} value={url} disabled />
        </div>
      </div>
    )
  }
})
