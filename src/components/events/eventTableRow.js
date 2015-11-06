'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

export default React.createClass({
  displayName: 'EventTableRow',

  propTypes: {
    event: React.PropTypes.object
  },

  render () {
    const { event } = this.props
    return (
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    )
  }
})
