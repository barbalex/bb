'use strict'

import React from 'react'
import AttachedImgagesList from './attachedImgagesList.js'
import AttachImages from './attachImages.js'

export default React.createClass({
  displayName: 'AttachedImages',

  propTypes: {
    doc: React.PropTypes.object
  },

  render () {
    const { doc } = this.props
    return (
      <div>
        <AttachedImgagesList doc={doc} />
        <AttachImages doc={doc} />
      </div>
    )
  }
})
