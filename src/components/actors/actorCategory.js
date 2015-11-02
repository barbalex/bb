'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

export default React.createClass({
  displayName: 'ActorCategory',

  propTypes: {
    activeActorCategory: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveActorCategoryArticle: React.PropTypes.func
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
    const { activeActorCategory, editing, onSaveActorCategoryArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = activeActorCategory.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div className='actorCategory'>
          {showMeta ? <Meta doc={activeActorCategory} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={activeActorCategory} articleDecoded={articleDecoded} onSaveActorCategoryArticle={onSaveActorCategoryArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div className='actorCategory col500'>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
