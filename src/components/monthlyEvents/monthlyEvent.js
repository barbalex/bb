'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import MonthlyEventMeta from './monthlyEventMeta.js'

export default React.createClass({
  displayName: 'MonthlyEvent',

  propTypes: {
    monthlyEvent: React.PropTypes.object,
    year: React.PropTypes.string,
    month: React.PropTypes.string,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveMonthlyEventArticle: React.PropTypes.func
  },

  getInitialState () {
    return {
      showMeta: false
    }
  },

  onClickMeta () {
    const { showMeta } = this.state
    this.setState({
      showMeta: !showMeta
    })
  },

  onCloseMeta () {
    this.setState({
      showMeta: false
    })
  },

  render () {
    const { monthlyEvent, year, month, editing, onSaveMonthlyEventArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = monthlyEvent.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div className='monthlyEvent'>
          {showMeta ? <MonthlyEventMeta monthlyEvent={monthlyEvent} year={year} month={month} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={monthlyEvent} articleDecoded={articleDecoded} onSaveMonthlyEventArticle={onSaveMonthlyEventArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>arrivals & victims</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div className='monthlyEvent'>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
