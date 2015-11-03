'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

export default React.createClass({
  displayName: 'Actor',

  propTypes: {
    activeActor: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveActorArticle: React.PropTypes.func
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
    const { activeActor, editing, onSaveActorArticle } = this.props
    const { showMeta } = this.state
    const articleEncoded = activeActor.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div className='actor'>
          {showMeta ? <Meta doc={activeActor} onCloseMeta={this.onCloseMeta} /> : null}
          <Editor doc={activeActor} articleDecoded={articleDecoded} onSaveActorArticle={onSaveActorArticle} />
          <Button style={metaButtonStyle} onClick={this.onClickMeta}>images</Button>
        </div>
      )
    }
    const createMarkup = () => ({__html: articleDecoded})
    return (
      <div className='actor'>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
  }
})
