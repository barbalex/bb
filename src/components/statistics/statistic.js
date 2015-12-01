'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

export default React.createClass({
  displayName: 'Statistic',

  propTypes: {
    activeStatistic: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveStatisticArticle: React.PropTypes.func
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
    const { activeStatistic, editing, onSaveStatisticArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = activeStatistic.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div className='statistic'>
          {showMeta ? <Meta doc={activeStatistic} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={activeStatistic} articleDecoded={articleDecoded} onSaveStatisticArticle={onSaveStatisticArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div className='statistic col400'>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
