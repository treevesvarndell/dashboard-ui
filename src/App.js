import React, { Component } from 'react';
import './App.css';
import train from './train.svg';

const axios = require('axios');

class App extends Component {

  constructor(props) {
    super(props);
    this.updateClock();
    this.state = {
      trainsToLondon: [],
      arrivalsAtMarylebone: []
    };
  }

  fetchTrainData() {
    return axios.all([
      axios.get(`http://zed.local:8080/departures`), 
      axios.get(`http://zed.local:8080/arrivals`)
    ])
    .then(axios.spread((departureData, arrivalData) => {
      const trainsToLondon = departureData.data.trainServices.filter((train) => train.destination[0].locationName === "London Marylebone")
      const relevantTrains = trainsToLondon.map(t => t.rsid)
      const arrivalsAtMarylebone = arrivalData.data.trainServices.filter((train) => relevantTrains.includes(train.rsid))
      this.setState({
        trainsToLondon: trainsToLondon,
        arrivalsAtMarylebone: arrivalsAtMarylebone
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
    console.log(this.state.arrivalsAtMarylebone)
    console.log(this.state.trainsToLondon)
    return (
      <div className="App">
      <h1>Current Time: {this.state.time}</h1>
          <ul style={{"float": "left"}}>
          <h2><img src={train} alt="train.svg"/> GER</h2>
          {this.state.trainsToLondon.map(t => {
            return <div>
              <h2>{t.std} ({t.etd})</h2>
            </div>
          })}</ul>
          <ul style={{"float": "right"}}>
          <h2><img src={train} alt="train.svg"/> MYB</h2>
          {this.state.arrivalsAtMarylebone.map(t => {
            return <h2>{t.sta} ({t.eta})</h2>
          })}</ul>
      </div>
    );
  }
}

export default App;
