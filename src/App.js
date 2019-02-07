import React, { Component } from 'react';
import './App.css';
import { pairUpTrainData, timeDifference, timeDisplay } from './Functions';

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
        <a class="weatherwidget-io" href="https://forecast7.com/en/51d51n0d13/london/" data-label_1="London" data-label_2="Weather" data-icons="Climacons" data-mode="Current" data-days="3" data-theme="pure" >NEW YORK WEATHER</a>
        <div>{Object.values(this.state.trainsToLondon).map(t => {
          return <div>{t.sta && 
            <div key={t.rsid} className="trainTime">
              <div>{timeDisplay(t)}</div>
              <div className="durationTime">{timeDifference(t.std, t.sta)} minutes</div>
            </div>
          }</div>
      })}</div>
      <div className="bottom">&nbsp;</div>
      </div>
    );
  }
}

export default App;