'use strict'

import React from 'react'
import styles from './styles/main.styl'

const Hello = React.createClass({
  displayName: 'Hello',

  render () {
    return <div>Hello {this.props.name}</div>
  }
})

React.render(<Hello name='World'/>, document.body)
