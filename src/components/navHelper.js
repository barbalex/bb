/*
 * this component converts links that would create a full page load
 * to internal links thant transition without a full page load
 * if the link is local
 */

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

const NavHelper = (props) =>
  <div
    {...props}
    onClick={(event) => onClick(event)}
  >
    {props.children}
  </div>

NavHelper.displayName = 'NavHelper'

NavHelper.propTypes = {
  children: React.PropTypes.node
}

export default NavHelper
