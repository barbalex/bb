import React from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EventType',

  propTypes: {
    eventType: React.PropTypes.string,
    onChangeEventType: React.PropTypes.func
  },

  componentDidMount() {
    const { eventType, onChangeEventType } = this.props
    // if no eventType, set migration
    if (!eventType) onChangeEventType('migration')
  },

  onChangeEventType(eventType) {
    const { onChangeEventType } = this.props
    onChangeEventType(eventType)
  },

  render() {
    const { eventType } = this.props
    const labelStyle = {
      fontWeight: 'bold',
      marginBottom: 5
    }
    return (
      <div
        style={{ marginBottom: 20 }}
      >
        <div
          style={labelStyle}
        >
          Column
        </div>
        <ButtonGroup>
          <Button
            className={eventType === 'migration' ? 'active' : ''}
            onClick={this.onChangeEventType.bind(this, 'migration')}
          >
            maritime events / monthly statistics
          </Button>
          <Button
            className={eventType === 'politics' ? 'active' : ''}
            onClick={this.onChangeEventType.bind(this, 'politics')}
          >
            political events / total statistics
          </Button>
        </ButtonGroup>
      </div>
    )
  }
})
