import React, { useState } from 'react';
import axios from 'axios';

const URL = 'http://localhost:9000/api/result';

// Suggested initial states
  const initialMessage = '';
  const initialX = 2;
  const initialY = 2;
  const initialIndex = 4; // the index the "B" is at
  const initialSteps = 0;
  const initialEmail = '';

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [email, setEmail] = useState(initialEmail);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${x}, ${y})`);
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return (`Coordinates ${getXY()}`);
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setX(initialX);
    setY(initialY);
    setIndex(initialIndex);
    setSteps(initialSteps);
    setEmail(initialEmail);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left') {
      if (x - 1 === 0) {
        return {
          x,
          y
        }
      } else {
          return {
            x: x - 1,
            y,
            index: index - 1,
            steps: steps + 1
          }
      }
    } 

    if (direction === 'right') {
      if (x + 1 === 4) {
        return {
          x,
          y
        }
      } else {
          return {
            x: x + 1,
            y,
            index: index + 1,
            steps: steps + 1
          }
      }
    }

    if (direction === 'up') {
      if (y - 1 === 0) {
        return {
          x,
          y
        }
      } else {
          return {
            x,
            y: y - 1,
            index: index - 3,
            steps: steps + 1
          }
      }
    }

    if (direction === 'down') {
      if (y + 1 === 4) {
        return {
          x,
          y
        }
      } else {
          return {
            x,
            y: y + 1,
            index: index + 3,
            steps: steps + 1
          }
      }
    }

  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let nextMove = getNextIndex(evt.target.id);

    if (`(${nextMove.x}, ${nextMove.y})` === getXY()) {
          setMessage(`You can't go ${evt.target.id}`)
    } else {
          setMessage(initialMessage);
          setX(nextMove.x);
          setY(nextMove.y);
          setIndex(nextMove.index);
          setSteps(nextMove.steps);
      }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
      setEmail(evt.target.value);
  }

  function post() {
    const sendData = {
      'x': x,
      'y': y,
      'steps': steps,
      'email': email
    }
    axios.post(URL, sendData)
      .then(res => {
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(
        setEmail('')
      )
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    post();
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} ${steps === 1 ? 'time' : 'times'}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
