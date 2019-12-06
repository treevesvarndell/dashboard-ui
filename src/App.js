import React, { Component } from 'react';
import './App.css';
import { pairUpTrainData, timeDisplay, getServiceInfo, flattenArrivals } from './Functions';

import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trainsToLondon: {},
      loaded: false,
      time: null
    };
  }

  async fetchTrainData() {
    this.setState({
      ...this.state,
      loaded: false
    })
    return axios.get(`http://localhost:8080/departures`)
      .then(departureData => {
        const departures = departureData.data.trainServices
        if (!!departures) {
          return axios.all(departures.map((d) => getServiceInfo(d.serviceIdPercentEncoded)))
            .then(arrivals => {
              this.setState({
                trainsToLondon: pairUpTrainData(departures, flattenArrivals(arrivals)),
                loaded: true
              })
            }).catch(e => {
              this.setState({ 
                loaded: true,
                error: true 
              })
            })
        }
    }).catch(e => {
      this.setState({ 
        loaded: true,
        error: true 
      })
    })
  }

  updateClock() {
    const date = new Date()
    const hours = date.getHours() + (date.getTimezoneOffset()) / 60
    const mins = date.getMinutes()
    const secs = date.getSeconds()
    this.setState({ time: `${(hours < 10 ? "0" : "") + hours}:${(mins < 10 ? "0" : "") + mins}:${(secs < 10 ? "0" : "") + secs}`})
  }

  componentDidMount() {
    this.fetchTrainData()
    this.updateClock()
    setInterval(() => this.fetchTrainData(), 60000)
    setInterval(() => this.updateClock(), 1000)
  }
  
  render() {
    return (
      <>
        <div className="App">
          <a className="weatherwidget-io" href="https://forecast7.com/en/51d51n0d13/london/" data-label_1="London" data-label_2="Weather" data-icons="Climacons" data-mode="Week" data-days="3" data-theme="pure" >LONDON WEATHER</a>
          <div className="App-header-clock">
            <div>
              {this.state.time}
            </div>
          </div>
          {this.state.loaded ? <div>
            { Object.values(this.state.trainsToLondon).map(t => {
            return <div>
              <div key={Object.keys(t)[0]} className={t.delayed ? "delay trainTime" : "trainTime"}>
            <div>{timeDisplay(t)}</div>
                <div className="callingAt">{t.callingAt.join(', ')}</div>
                <div className="durationTime">{t.duration} mins</div>
              </div>
            </div>
        })}</div> : <div className="loading-wrap">
          <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        }
        <div className="bottom">&nbsp;</div>
        </div>
      </>
    );
  }
}

export default App;