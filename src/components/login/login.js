/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Button } from 'react-bootstrap'
import LoginForm from './loginForm.js'

export default React.createClass({
  displayName: 'Login',

  propTypes: {
    email: React.PropTypes.string
  },

  onClickLogout () {
    app.Actions.logout()
  },

  render () {
    const { email } = this.props
    return (
      <div>
        <h1>Login</h1>
        {!email ? <LoginForm /> : null}
        {email ? <Button className='btn-primary' onClick={this.onClickLogout}>log out</Button> : null}
      </div>
    )
  }
})
