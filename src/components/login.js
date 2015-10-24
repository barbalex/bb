/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Alert, Button } from 'react-bootstrap'
import _ from 'lodash'
import validateEmail from '../modules/validateEmail.js'

export default React.createClass({
  displayName: 'Login',

  propTypes: {
    invalidEmail: React.PropTypes.bool,
    invalidPassword: React.PropTypes.bool,
    email: React.PropTypes.string,
    password: React.PropTypes.string,
    loginError: React.PropTypes.string
  },

  getInitialState () {
    return {
      invalidEmail: false,
      invalidPassword: false,
      email: null,
      password: null,
      loginError: null
    }
  },

  onHide () {
    // weird things happen if this is not here ???!!!
    // console.log('onHide')
  },

  onKeyDownEmail (event) {
    const { password } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const email = event.target.value
      console.log('email:', email)
      this.setState({ email })
      this.checkSignin(email, password)
    }
  },

  onKeyDownPassword (event) {
    const { email } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const password = event.target.value
      console.log('password:', password)
      this.setState({ password })
      this.checkSignin(email, password)
    }
  },

  checkSignin (email, password) {
    if (this.validSignin(email, password)) {
      app.db.login(email, password)
        .then((response) => {
          app.Actions.login(email)
        })
        .catch((error) => this.setState({ email: null, loginError: error }))
    }
  },

  onClickLogin () {
    const { email, password } = this.state
    this.checkSignin(email, password)
  },

  onBlurEmail (event) {
    const email = event.target.value
    this.setState({ email })
    this.validEmail(email)
  },

  onBlurPassword (event) {
    const password = event.target.value
    this.setState({ password })
  },

  onAlertDismiss () {
    this.setState({ loginError: null })
  },

  validEmail (email) {
    const validEmail = email && validateEmail(email)
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

  validSignin (email, password) {
    const validEmail = this.validEmail(email)
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
    if (_.isObject(loginError)) error = loginError.message
    const isError = error && error.length > 0

    return (
      <div>
        <h1>Login</h1>
        <form className={'form'} autoComplete='off'>
          <div className='formGroup'>
            <Input type='email' id='email' label={'Email'} bsSize='small' className={'controls'} placeholder='Email' bsStyle={emailInputBsStyle} onBlur={this.onBlurEmail} onKeyDown={this.onKeyDownEmail} required autoFocus />
            {invalidEmail ? <div className='validateDivAfterRBC'>Please check email</div> : ''}
          </div>
          <div className='formGroup'>
            <Input type='password' id='password' label={'Password'} className={'controls'} placeholder='Passwort' bsStyle={passwordInputBsStyle} onBlur={this.onBlurPassword} onKeyDown={this.onKeyDownPassword} required />
            {invalidPassword ? <div className='validateDivAfterRBC'>Please check password</div> : ''}
          </div>
          {isError ? <Alert bsStyle='danger' onDismiss={this.onAlertDismiss} style={styleAlert}>Error: {error}</Alert> : null}
        </form>
        <Button ref='anmeldenButton' className='btn-primary' onClick={this.onClickLogin}>anmelden</Button>
      </div>
    )
  }
})
