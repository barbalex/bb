import React from 'react'
import { Button } from 'react-bootstrap'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'
import MonthlyEventMeta from './monthlyEventMeta.js'

export default React.createClass({
  displayName: 'MonthlyEvent',

  propTypes: {
    activeMonthlyEvent: React.PropTypes.object,
    year: React.PropTypes.string,
    month: React.PropTypes.string,
    editing: React.PropTypes.bool,
    showMeta: React.PropTypes.bool,
    onSaveMonthlyEventArticle: React.PropTypes.func
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
      activeMonthlyEvent,
      year,
      month,
      editing,
      onSaveMonthlyEventArticle
    } = this.props
    const { showMeta } = this.state
    const articleEncoded = activeMonthlyEvent.article
    const articleDecoded = Base64.decode(articleEncoded)
    const metaButtonStyle = {
      position: 'fixed',
      bottom: 10,
      right: 10
    }
    if (editing) {
      return (
        <div
          className="monthlyEvent"
        >
          {
            showMeta &&
            <MonthlyEventMeta
              activeMonthlyEvent={activeMonthlyEvent}
              year={year}
              month={month}
              onCloseMeta={this.onCloseMeta}
            />
          }
          <Editor
            doc={activeMonthlyEvent}
            articleDecoded={articleDecoded}
            onSaveMonthlyEventArticle={onSaveMonthlyEventArticle}
          />
          <Button
            style={metaButtonStyle}
            onClick={this.onClickMeta}
          >
            arrivals & victims
          </Button>
        </div>
      )
    }
    const createMarkup = () => ({ __html: articleDecoded })
    return (
      <div
        className="monthlyEvent"
      >
        <div
          dangerouslySetInnerHTML={createMarkup()}
        />
      </div>
    )
  }
})
