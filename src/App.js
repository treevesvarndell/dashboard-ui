import React, { Component } from 'react';
import './App.css';
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
      axios.get(`http://localhost:8080/departures`), 
      axios.get(`http://localhost:8080/arrivals`)
    ])
    .then(axios.spread((departureData, arrivalData) => {
      if (!!departureData.data.trainServices && !!arrivalData.data.trainServices) {
        this.setState({
          trainsToLondon: pairUpTrainData(departureData.data.trainServices, arrivalData.data.trainServices),
        })
      }
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
        <div className="App-header-clock">
          <div>
            {this.state.time}
          </div>
        </div>
        <div className="App-header-centre">
            <div className="">
              Gerrards Cross Timetable
            </div>
        </div>
        <div className="trainTimeWrap">{Object.values(this.state.trainsToLondon).map(t => {
          return <div>{t.sta && 
            <div key={t.rsid} className="trainTime">
              <div>{t.std} {(t.etd === "On time") ? "" : `(${t.etd})`} => {t.sta} ({timeDifference(t.std, t.sta)} minutes)</div>
            </div>
          }</div>
    })}</div>
      <div className="footer"></div>
      </div>
    );
  }
}

export default App;