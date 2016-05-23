/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Button } from 'react-bootstrap'
import LoginForm from './loginForm.js'

const Login = ({ email }) =>
  {
    console.log('login.js, email', email)
    return (
      <div>
        <h1>Login</h1>
        {
          !email &&
          <LoginForm />
        }
        {
          email &&
          <Button
            className='btn-primary'
            onClick={() => app.Actions.logout()}
          >
            log out
          </Button>
        }
      </div>
    )
  }

Login.displayName = 'Login'

Login.propTypes = {
  email: React.PropTypes.string
}

export default Login
