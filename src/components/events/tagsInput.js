'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Tokenizer } from 'react-typeahead'
import allTags from './tags.js'

export default React.createClass({
  displayName: 'EventTags',

  propTypes: {
    activeEvent: React.PropTypes.object
  },

  onTokenAdd (tag) {
    let { activeEvent } = this.props
    activeEvent.tags.push(tag)
    app.Actions.saveEvent(activeEvent)
  },

  onTokenRemove (tag) {
    let { activeEvent } = this.props
    activeEvent.tags = activeEvent.tags.filter((_tag) => _tag !== tag)
    app.Actions.saveEvent(activeEvent)
  },

  onFocus () {
    //TODO: open unfiltered list
  },

  filterOption (inputValue, option) {
    if (inputValue === '*') return true
    return option.includes(inputValue)
  },

  render () {
    const { activeEvent } = this.props
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
    const options = allTagOptions.filter((option) => !activeEvent.tags.includes(option))
    return (
      <div style={{marginBottom: 20}}>
        <div style={labelStyle}>Tags</div>
        <Tokenizer
          options={options}
          defaultSelected={activeEvent.tags}
          value={activeEvent.tags}
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
