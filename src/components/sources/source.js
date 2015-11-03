'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

export default React.createClass({
  displayName: 'Source',

  propTypes: {
    activeSource: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveSourceArticle: React.PropTypes.func
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
    const { activeSource, editing, onSaveSourceArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = activeSource.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div className='source'>
          {showMeta ? <Meta doc={activeSource} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={activeSource} articleDecoded={articleDecoded} onSaveSourceArticle={onSaveSourceArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div className='source col400'>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
