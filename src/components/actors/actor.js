import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from '../pages/pageMeta.js'

class Actor extends Component {
  static propTypes = {
    activeActor: PropTypes.object,
    editing: PropTypes.bool,
    showMeta: PropTypes.bool,
    onSaveActorArticle: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      showMeta: false
    }
    this.onClickMeta = this.onClickMeta.bind(this)
    this.onCloseMeta = this.onCloseMeta.bind(this)
  }

  onClickMeta() {
    const { showMeta } = this.state
    this.setState({
      showMeta: !showMeta
    })
  }

  onCloseMeta() {
    this.setState({
      showMeta: false
    })
  }

  render() {
    const {
      activeActor,
      editing,
      onSaveActorArticle,
    } = this.props
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
        <div className="actor">
          {
            showMeta &&
            <Meta
              doc={activeActor}
              onCloseMeta={this.onCloseMeta}
            />
          }
          <Editor
            doc={activeActor}
            articleDecoded={articleDecoded}
            onSaveActorArticle={onSaveActorArticle}
          />
          <Button
            style={metaButtonStyle}
            onClick={this.onClickMeta}
          >
            images
          </Button>
        </div>
      )
    }
    const createMarkup = () => ({ __html: articleDecoded })
    return (
      <div
        className="actor col500"
      >
        <div
          dangerouslySetInnerHTML={createMarkup()}
        />
      </div>
    )
  }
}

Actor.displayName = 'Actor'

export default Actor
