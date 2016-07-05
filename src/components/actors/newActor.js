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

export default React.createClass({
  displayName: 'NewActorCategory',

  propTypes: {
    onCloseNewActor: React.PropTypes.func,
    category: React.PropTypes.string,
    error: React.PropTypes.string
  },

  getInitialState() {
    return {
      category: '',
      error: null
    }
  },

  onChangeCategory(event) {
    const category = event.target.value
    this.setState({ category })
  },

  createNewActor() {
    const { onCloseNewActor } = this.props
    const { category } = this.state
    if (category) {
      app.Actions.newActor(category)
      onCloseNewActor()
    } else {
      const error = 'Please choose a category'
      this.setState({ error })
    }
  },

  render() {
    const { onCloseNewActor } = this.props
    const { category, error } = this.state
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
            New actor category
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="actorCategory"
          >
            <ControlLabel>Category</ControlLabel>
            <FormControl
              type="text"
              value={category}
              onChange={this.onChangeCategory}
              autoFocus
            />
          </FormGroup>
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
            onClick={() => onCloseNewActor()}
          >
            discard input and close
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.createNewActor}
          >
            create new actor
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
