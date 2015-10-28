'use strict'

import React from 'react'
import { Base64 } from 'js-base64'
import Editor from './editor.js'

export default React.createClass({
  displayName: 'MonthlyEvent',

  propTypes: {
    monthlyEvent: React.PropTypes.object,
    editing: React.PropTypes.bool,
    onSaveMonthlyEvent: React.PropTypes.func
  },

  render () {
    const { monthlyEvent, editing, onSaveMonthlyEvent } = this.props
    const articleEncoded = monthlyEvent.article
    const articleDecoded = Base64.decode(articleEncoded)
    if (editing) {
      return (
        <div>
          <Editor docId={monthlyEvent._id} articleDecoded={articleDecoded} onSaveMonthlyEvent={onSaveMonthlyEvent} />
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
