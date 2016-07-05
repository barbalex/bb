import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import Meta from './pageMeta.js'

export default React.createClass({
  displayName: 'Page',

  propTypes: {
    activePage: React.PropTypes.object,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSavePageArticle: React.PropTypes.func,
    onSavePage: React.PropTypes.func
  },

  getInitialState() {
    return {
      showMeta: false
    }
  },

  onClickMeta() {
    const { showMeta } = this.state
    this.setState({
      showMeta: !showMeta
    })
  },

  onCloseMeta() {
    this.setState({
      showMeta: false
    })
  },

  render() {
    const {
      activePage,
      editing,
      onSavePageArticle,
    } = this.props
    const { showMeta } = this.state
    const articleEncoded = activePage.article
    const articleDecoded = Base64.decode(articleEncoded)
    let title = activePage.title ? activePage.title : activePage.category
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing && activePage._id !== 'pages_actors') {
      return (
        <div
          className="page"
        >
          {
            showMeta &&
            <Meta
              doc={activePage}
              onCloseMeta={this.onCloseMeta}
            />
          }
          <Editor
            doc={activePage}
            articleDecoded={articleDecoded}
            onSavePageArticle={onSavePageArticle}
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
      <div className="page">
        <h1>
          {title}
        </h1>
        <div
          dangerouslySetInnerHTML={createMarkup()}
        />
      </div>
    )
  }
})
