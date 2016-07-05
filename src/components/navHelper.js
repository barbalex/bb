/*
 * this component converts links that would create a full page load
 * to internal links thant transition without a full page load
 * if the link is local
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import localLinks from 'local-links'

const onClick = (event) => {
  const pathname = localLinks.getLocalPathname(event)
  if (pathname) {
    event.preventDefault()
    app.router.history.navigate(pathname)
  }
}

export default React.createClass({
  displayName: 'NavHelper',

  propTypes: {
    children: React.PropTypes.node
  },

  render() {
    return (
      <div
        {...this.props}
        onClick={(event) => onClick(event)}
      >
        {this.props.children}
      </div>
    )
  }
})
