'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

export default React.createClass({
  displayName: 'SourceCategory',

  propTypes: {
    activeSourceCategory: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveSourceCategoryArticle: React.PropTypes.func
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
    const { activeSourceCategory, editing, onSaveSourceCategoryArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = activeSourceCategory.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div className='sourceCategory'>
          {showMeta ? <Meta doc={activeSourceCategory} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={activeSourceCategory} articleDecoded={articleDecoded} onSaveSourceCategoryArticle={onSaveSourceCategoryArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div className='sourceCategory col400'>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
