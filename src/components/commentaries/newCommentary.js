import app from 'ampersand-app'
import React from 'react'
import {
  Modal,
  Button,
  Alert,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'
import moment from 'moment'
import DateInput from '../events/dateInput.js'

export default React.createClass({
  displayName: 'NewCommentary',

  propTypes: {
    onCloseNewCommentary: React.PropTypes.func,
    title: React.PropTypes.string,
    date: React.PropTypes.number,
    error: React.PropTypes.string
  },

  getInitialState() {
    return {
      title: '',
      date: moment(),
      error: null
    }
  },

  onChangeTitle(event) {
    const title = event.target.value
    this.setState({ title })
  },

  onChangeDate(event, picker) {
    const date = moment(picker.startDate, 'DD.MM.YYYY')
    this.setState({ date })
  },

  createNewCommentary() {
    const { onCloseNewCommentary } = this.props
    const { title, date } = this.state
    if (title && date) {
      app.Actions.newCommentary(title, date)
      onCloseNewCommentary()
    } else {
      let error = 'Please choose a date'
      if (!title) error = 'Please add a title'
      this.setState({ error })
    }
  },

  render() {
    const { onCloseNewCommentary } = this.props
    const { title, date, error } = this.state
    const alertStyle = {
      marginBottom: 10
    }
    return (
      <Modal
        show
        bsSize="large"
      >
        <Modal.Header>
          <Modal.Title>
            New commentary
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="commentaryTitle"
          >
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={title}
              onChange={this.onChangeTitle}
              autoFocus
              tabIndex={1}
            />
          </FormGroup>
          <DateInput
            date={date}
            onChangeDatePicker={this.onChangeDate}
          />
          {
            error &&
            <Alert
              bsStyle="danger"
              style={alertStyle}
            >
              {error}
            </Alert>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => onCloseNewCommentary()}
          >
            discard input and close
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.createNewCommentary}
          >
            create new commentary
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
