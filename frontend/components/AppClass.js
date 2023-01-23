import React from 'react';
import * as yup from 'yup';
import { formSchema } from '../validation/formSchema';
import axios from 'axios';

const URL = 'http://localhost:9000/api/result';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialX = 2
const initialY = 2

const initialState = {
  message: initialMessage,
  email: initialEmail,
  x: initialX,
  y: initialY,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state = {...initialState};
  } 

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${this.state.x}, ${this.state.y})`);
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return (`Coordinates ${this.getXY}`);
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      ...initialState
    });
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left') {
      if (this.state.x - 1 === 0) {
        return ({
          x: this.state.x, 
          y: this.state.y
        })
      } else {
          return ({
            x: this.state.x - 1,
            y: this.state.y,
            index: this.state.index - 1,
            steps: this.state.steps + 1
          })
      }
    };

    if (direction === 'right') {
      if (this.state.x + 1 === 4) {
        return ({
          x: this.state.x,
          y: this.state.y
        })
      } else {
          return ({
            x: this.state.x + 1,
            y: this.state.y,
            index: this.state.index + 1,
            steps: this.state.steps + 1
          })
      }
    };

    if (direction === 'up') {
      if (this.state.y - 1 === 0) {
        return ({
          x: this.state.x,
          y: this.state.y
        })
      } else {
          return ({
            x: this.state.x,
            y: this.state.y - 1,
            index: this.state.index - 3,
            steps: this.state.steps + 1
          })
      }
    };

    if (direction === 'down') {
      if (this.state.y + 1 === 4) {
        return ({
          x: this.state.x,
          y: this.state.y
        })
      } else {
          return ({
            x: this.state.x,
            y: this.state.y + 1,
            index: this.state.index + 3,
            steps: this.state.steps + 1
          })
      }
    };
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let nextMove = this.getNextIndex(evt.target.id)

    if (`(${nextMove.x}, ${nextMove.y})` === this.getXY()) {
      return (
        this.setState({
          message: `You can't go ${evt.target.id}`
        })
      )
    } else {
      return (
        this.setState({
          message: initialMessage,
          x: nextMove.x,
          y: nextMove.y,
          index: nextMove.index,
          steps: nextMove.steps
        })
      )
    }
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      ...this.state,
      email: evt.target.value
    });
  }

  validate = (name, value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(this.onSubmit())
      .catch(err => this.setState({
        message: err.errors[0]
      }))
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    axios.post(URL, {
      'x': this.state.x,
      'y': this.state.y,
      'steps': this.state.steps,
      'email': this.state.email
    })
      .then(res => {
        this.setState({
          ...this.state,
          message: res.data.message,
          email: ''
        })
      })
      .catch(err => {
        this.setState({
          ...this.state,
          message: err.response.data.message
        })
      })
      .finally(this.setState({
        email: ''
      }))
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{`Coordinates ${this.getXY()}`}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(evt) => this.move(evt)}>LEFT</button>
          <button id="up" onClick={(evt) => this.move(evt)}>UP</button>
          <button id="right" onClick={(evt) => this.move(evt)}>RIGHT</button>
          <button id="down" onClick={(evt) => this.move(evt)}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={(evt) => this.onChange(evt)}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
