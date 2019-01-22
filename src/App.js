import React, { Component } from 'react';
import './App.css';
import train from './train.svg';
import { pairUpTrainData, timeDifference } from './Functions';

const axios = require('axios');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trainsToLondon: {}
    };
    this.updateClock();  
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
    return (
      <div className="App">
      <h1>Current Time: {this.state.time}</h1>
          <ul>
            <div className="titleText">
              <img src={train} alt="train.svg" />Next trains from Gerrards Cross<img src={train} alt="train.svg" />
            </div>
            <div className="trainTimeWrap">{Object.values(this.state.trainsToLondon).map(t => {
              return <div>{t.sta && 
                <div key={t.rsid} className="trainTime">
                  <h2>{t.std} {(t.etd === "On time") ? "" : `(${t.etd})`} => {t.sta} ({timeDifference(t.sta, t.std)} minutes)</h2>
                </div>
              }</div>
          })}</div>
          </ul>
      </div>
    );
  }
}

export default App;