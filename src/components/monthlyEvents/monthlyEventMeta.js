'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'MonthlyEventMeta',

  propTypes: {
    activeMonthlyEvent: React.PropTypes.object,
    year: React.PropTypes.string,
    month: React.PropTypes.string,
    onCloseMeta: React.PropTypes.func,
    arrivals: React.PropTypes.number,
    victims: React.PropTypes.number
  },

  getInitialState () {
    const { activeMonthlyEvent } = this.props
    return {
      arrivals: activeMonthlyEvent.arrivals,
      victims: activeMonthlyEvent.victims
    }
  },

  onChangeValue (property, event) {
    let { activeMonthlyEvent } = this.props
    const value = parseInt(event.target.value, 10)
    activeMonthlyEvent[property] = value
    app.Actions.saveMonthlyEvent(activeMonthlyEvent)
    this.setState({ [property]: value })
  },

  close () {
    const { onCloseMeta } = this.props
    onCloseMeta()
  },

  onHide () {
    // seems that this method is needed ???
  },

  render () {
    const { year, month } = this.props
    const { arrivals, victims } = this.state
    return (
      <Modal
        show
        onHide={this.close}
        bsSize='medium'
      >
        <Modal.Header>
          <Modal.Title>
            Arrivals & Victims in {month} {year}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Input
            type='number'
            label='Arrivals'
            defaultValue={arrivals}
            onBlur={this.onChangeValue.bind(this, 'arrivals')}
            autoFocus
          />
          <Input
            type='number'
            label='Victims'
            defaultValue={victims}
            onBlur={this.onChangeValue.bind(this, 'victims')}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle='primary'
            onClick={this.close}
          >
            close
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
