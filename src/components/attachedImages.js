import React from 'react'
import AttachedImgagesList from './attachedImgagesList.js'
import AttachImages from './attachImages.js'

const AttachedImages = ({ doc }) =>
  <div>
    <AttachedImgagesList doc={doc} />
    <AttachImages doc={doc} />
  </div>

AttachedImages.displayName = 'AttachedImages'

AttachedImages.propTypes = {
  doc: React.PropTypes.object
}

export default AttachedImages
