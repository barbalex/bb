/*
 * contains ui for login
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Alert, Button } from 'react-bootstrap'
import { isObject } from 'lodash'
import validateEmail from './validateEmail.js'

export default React.createClass({
  displayName: 'LoginForm',

  propTypes: {
    invalidEmail: React.PropTypes.bool,
    invalidPassword: React.PropTypes.bool,
    newEmail: React.PropTypes.string,
    password: React.PropTypes.string,
    loginError: React.PropTypes.string
  },

  getInitialState () {
    return {
      invalidEmail: false,
      invalidPassword: false,
      newEmail: null,
      password: null,
      loginError: null
    }
  },

  onKeyDownEmail (event) {
    const { password } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const newEmail = event.target.value
      this.setState({ newEmail })
      this.checkSignin(newEmail, password)
    }
  },

  onKeyDownPassword (event) {
    const { newEmail } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const password = event.target.value
      this.setState({ password })
      this.checkSignin(newEmail, password)
    }
  },

  checkSignin (newEmail, password) {
    if (this.validSignin(newEmail, password)) {
      app.db.login(newEmail, password)
        .then((response) => app.Actions.login(newEmail))
        .catch((error) => this.setState({ newEmail: null, loginError: error }))
    }
  },

  onBlurEmail (event) {
    const newEmail = event.target.value
    this.setState({ newEmail })
    this.validEmail(newEmail)
  },

  onBlurPassword (event) {
    const password = event.target.value
    this.setState({ password })
  },

  onAlertDismiss () {
    this.setState({ loginError: null })
  },

  onClickLogin () {
    const { newEmail, password } = this.state
    this.checkSignin(newEmail, password)
  },

  validEmail (newEmail) {
    const validEmail = newEmail && validateEmail(newEmail)
    const invalidEmail = !validEmail
    this.setState({ invalidEmail })
    return validEmail
  },

  validPassword (password) {
    const validPassword = !!password
    const invalidPassword = !validPassword
    this.setState({ invalidPassword })
    return validPassword
  },

  validSignin (newEmail, password) {
    const validEmail = this.validEmail(newEmail)
    const validPassword = this.validPassword(password)
    return validEmail && validPassword
  },

  render () {
    const { invalidEmail, invalidPassword, loginError } = this.state
    const emailInputBsStyle = invalidEmail ? 'error' : null
    const passwordInputBsStyle = invalidPassword ? 'error' : null
    const styleAlert = {
      marginBottom: 8
    }
    let error = loginError
    if (isObject(loginError)) error = loginError.message
    const isError = error && error.length > 0

    return (
      <form
        className='form'
        autoComplete='off'>
        <div
          className='formGroup'>
          <Input
            type='email'
            id='email'
            label='Email'
            bsSize='small'
            className='controls'
            bsStyle={emailInputBsStyle}
            onBlur={this.onBlurEmail}
            onKeyDown={this.onKeyDownEmail}
            required
            autoFocus />
          {
            invalidEmail &&
            <div
              className='validateDivAfterRBC'>
              Please check email
            </div>
          }
        </div>
        <div
          className='formGroup'>
          <Input
            type='password'
            id='password'
            label='Password'
            className='controls'
            bsStyle={passwordInputBsStyle}
            onBlur={this.onBlurPassword}
            onKeyDown={this.onKeyDownPassword}
            required />
          {
            invalidPassword &&
            <div
              className='validateDivAfterRBC'>
              Please check password
            </div>
          }
        </div>
        {
          isError &&
          <Alert
            bsStyle='danger'
            onDismiss={this.onAlertDismiss}
            style={styleAlert}>
            Error: {error}
          </Alert>
        }
        <Button
          className='btn-primary'
          onClick={this.onClickLogin}>
          log in
        </Button>
      </form>
    )
  }
})
