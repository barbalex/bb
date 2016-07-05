import app from 'ampersand-app'
import React from 'react'
import {
  Button,
  Glyphicon,
  FormGroup,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import getCouchUrl from '../modules/getCouchUrl.js'

const AttachedImage = ({
  doc,
  attName,
  urlCopied,
  onCopyUrl,
}) => {
  const id = doc._id
  const url = `${getCouchUrl()}/${id}/${attName}`
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
    fontSize: '2em',
    color: 'red',
    cursor: 'pointer'
  }
  const mediaLeftStyle = {
    position: 'relative'
  }
  const urlCopiedButtonBsStyle = (
    urlCopied === url ?
    'success' :
    'default'
  )
  const innerButton = (
    <CopyToClipboard
      text={url}
      onCopy={() => onCopyUrl(url)}
    >
      <Button
        bsStyle={urlCopiedButtonBsStyle}
      >
        {urlCopied === url ? 'copied' : 'copy'}
      </Button>
    </CopyToClipboard>
  )
  return (
    <div
      key={id}
      style={divStyle}
    >
      <div
        className="media-left"
        style={mediaLeftStyle}
      >
        <img
          src={url}
          className="media-object"
          alt={attName}
          style={imgStyle}
        />
        <Glyphicon
          glyph="remove-circle"
          style={glyphStyle}
          onClick={() =>
            app.Actions.removePageAttachment(doc, attName)
          }
        />
      </div>
      <div
        className="media-body media-middle"
      >
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              value={url}
              disabled
            />
            <InputGroup.Button>
              {innerButton}
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </div>
    </div>
  )
}

AttachedImage.displayName = 'AttachedImage'

AttachedImage.propTypes = {
  doc: React.PropTypes.object,
  attName: React.PropTypes.string,
  urlCopied: React.PropTypes.string,
  onCopyUrl: React.PropTypes.func
}

export default AttachedImage
