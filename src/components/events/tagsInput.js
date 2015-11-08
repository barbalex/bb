'use strict'

import React from 'react'
import { Tokenizer } from 'react-typeahead'
import tags from './tags.js'

export default React.createClass({
  displayName: 'EventTags',

  propTypes: {
    tags: React.PropTypes.array,
    onChangeTags: React.PropTypes.func
  },

  onTokenAdd (tag) {
    const { tags, onChangeTags } = this.props
    tags.push(tag)
    onChangeTags(tags)
  },

  render () {
    const labelStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    return (
      <div style={{marginBottom: 20}}>
        <div style={labelStyle}>Tags</div>
        <Tokenizer
          options={tags()}
          onTokenAdd={this.onTokenAdd} />
      </div>
    )
  }
})
