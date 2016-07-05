import React from 'react'
import AttachedImage from './attachedImage.js'

export default React.createClass({
  displayName: 'AttachedImagesList',

  propTypes: {
    doc: React.PropTypes.object,
    urlCopied: React.PropTypes.string
  },

  getInitialState() {
    return {
      urlCopied: null
    }
  },

  onCopyUrl(urlCopied) {
    this.setState({ urlCopied })
  },

  images() {
    const { doc } = this.props
    const { urlCopied } = this.state
    const wantedContentTypes = ['image/jpeg', 'image/png']
    const imageNameArray = []
    if (
      !doc._attachments ||
      Object.keys(doc._attachments).length === 0
    ) {
      return []
    }
    Object.keys(doc._attachments).forEach((key) => {
      if (wantedContentTypes.includes(doc._attachments[key].content_type)) {
        imageNameArray.push(key)
      }
    })
    const images = imageNameArray.map((imageName, index) =>
      <AttachedImage
        key={index}
        doc={doc}
        attName={imageName}
        urlCopied={urlCopied}
        onCopyUrl={this.onCopyUrl}
      />
    )
    return images
  },

  render() {
    const divStyle = {
      overflow: 'auto',
      maxHeight: 400,
      paddingBottom: 5
    }
    return (
      <div
        className="media"
        style={divStyle}
      >
        {this.images()}
      </div>
    )
  }
})
