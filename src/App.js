import React, { Component } from 'react';
import './App.css';
import train from './train.svg';
import { pairUpTrainData } from './Functions';

const axios = require('axios');

class App extends Component {

  constructor(props) {
    super(props);
    this.updateClock();
    this.state = {
      trainsToLondon: {}
    };
  }

  fetchTrainData() {
    return axios.all([
      axios.get(`http://zed.local:8080/departures`), 
      axios.get(`http://zed.local:8080/arrivals`)
    ])
    .then(axios.spread((departureData, arrivalData) => {
      this.setState({
        trainsToLondon: pairUpTrainData(departureData, arrivalData),
      })
    }))
  }

  updateClock() {
    const date = new Date()
    const hours = date.getHours()
    const mins = date.getMinutes()
    const secs = date.getSeconds()
    this.setState({ time: `${(hours < 10 ? "0" : "") + hours}:${(mins < 10 ? "0" : "") + mins}:${(secs < 10 ? "0" : "") + secs}` })
  }

  componentDidMount() {
    this.fetchTrainData()
    setInterval(() => this.fetchTrainData(), 60000)
    setInterval(() => this.updateClock(), 1000)
  }
  
  render() {
    console.log(this.state.trainsToLondon)
    return (
      <div className="App">
      <h1>Current Time: {this.state.time}</h1>
          <ul>
          <h2><img src={train} alt="train.svg"/>To London</h2>
          {Object.values(this.state.trainsToLondon).map(t => {
            return <div>
              <h2>{t.std} ({t.etd})</h2>
            </div>
          })}</ul>
      </div>
    );
  }
}

export default App;