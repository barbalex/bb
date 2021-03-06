/*
 * receives an object with two keys: title, msg
 * displays it while the object is present
 *
 * if a view wants to inform of an error it
 * calls action showError and passes the object
 * the errorStore triggers, passing the error
 * ...then triggers again some time later, passing an empty error object
 */

import app from 'ampersand-app'
import React from 'react'
import { Overlay, Glyphicon } from 'react-bootstrap'

const errorMessages = (errors) =>
  errors.map((error, index) =>
    <div
      className="errorContainer"
      key={index}
    >
      <div className="error">
        {
          error.title &&
          <p>
            {error.title}
          </p>
        }
        <p>
          <em>
            {error.msg}
          </em>
        </p>
      </div>
      {
        index + 1 < errors.length &&
        <hr />
      }
    </div>
  )

const glyphStyle = {
  position: 'absolute',
  top: 3,
  right: 3,
  fontSize: 18,
  cursor: 'pointer'
}

const Errors = ({ errors }) =>
  <Overlay
    show={errors.length > 0}
  >
    <div
      id="errors"
    >
      <Glyphicon
        glyph="remove-circle"
        style={glyphStyle}
        onClick={() =>
          app.Actions.showError()
        }
      />
      {errorMessages(errors)}
    </div>
  </Overlay>

Errors.displayName = 'Errors'

Errors.propTypes = {
  errors: React.PropTypes.array
}

export default Errors
