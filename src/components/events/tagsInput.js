'use strict'

import React from 'react'
import { Tokenizer } from 'react-typeahead'
import allTags from './tags.js'

export default React.createClass({
  displayName: 'EventTags',

  propTypes: {
    tags: React.PropTypes.array,
    onChangeTags: React.PropTypes.func
  },

  onTokenAdd (tag) {
    const { onChangeTags } = this.props
    let { tags } = this.props
    tags.push(tag)
    onChangeTags(tags)
  },

  onTokenRemove (tag) {
    const { onChangeTags } = this.props
    let { tags } = this.props
    tags = tags.filter((_tag) => _tag !== tag)
    onChangeTags(tags)
  },

  onFocus () {
    //TODO: open unfiltered list
  },

  filterOption (inputValue, option) {
    if (inputValue === '*') return true
    return option.includes(inputValue)
  },

  render () {
    const { tags } = this.props
    const labelStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    const customClasses = {
      input: 'form-control',
      token: 'btn btn-default',
      listItem: 'list-group-item',
      results: 'list-group'
    }
    const allTagOptions = allTags()
    const options = allTagOptions.filter((option) => !tags.includes(option))
    return (
      <div style={{marginBottom: 20}}>
        <div style={labelStyle}>Tags</div>
        <Tokenizer
          options={options}
          value={tags}
          // defaultValue='*'
          customClasses={customClasses}
          onTokenAdd={this.onTokenAdd}
          onTokenRemove={this.onTokenRemove}
          filterOption={this.filterOption}
          placeholder='Type * to show all tags. Type text to filter them'
          onFocus={this.onFocus} />
      </div>
    )
  }
})
