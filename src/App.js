import React, { Component } from 'react';
import './App.css';
import { pairUpTrainData, timeDisplay, getServiceInfo, flattenArrivals } from './Functions';

import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trainsToLondon: {},
      trainsToWycombe: {},
      loaded: false
    };
  }

  async fetchTrainData() {
    this.setState({
      ...this.state,
      loaded: false
    })
    axios.get(`${this.props.server}/${this.props.departureUrl}`)
      .then(departureData => {
        const departures = departureData.data.trainServices
        if (!!departures && departures.length > 0) {
          return axios.all(departures.map((d) => getServiceInfo(this.props.server, this.props.serviceUrl, d.serviceIdPercentEncoded)))
            .then(arrivals => {
              this.setState({
                trainsToLondon: pairUpTrainData(['London Marylebone'], departures, flattenArrivals(arrivals)),
                trainsToWycombe: pairUpTrainData(['High Wycombe', 'Bicester North'], departures, flattenArrivals(arrivals)),
                error: false
              })
            }).catch(e => {
              this.setState({ 
                error: true 
              })
            })
        } else {
          this.setState({
            trainsToLondon: [{
              std: "No trains found",
              callingAt: [""],
              duration: 0
            }]
        })
      }
    }).catch(e => {
      this.setState({ 
        error: true 
      })
    })

    this.setState({
      loaded: true
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

  columnFormat(direction, trainsToDisplay) {
    return <div className="column">
      <div className="trainTime header">{direction}</div>
      { Object.values(trainsToDisplay).map(t => {
        const time = timeDisplay(t)
        return <div key={"eastBound_" + time} className={t.delayed ? "delay trainTime" : "trainTime"}>
          <div className="trainHeader">{t.destination}</div>
          <div className="time">{time}</div>
          <div className="callingAt">{t.callingAt} ({t.duration} mins)</div>
          <div className="durationTime"></div>
        </div>
      })}
    </div>
  }
  
  render() {
    return (
      <>
        <div className="App">
          <a className="weatherwidget-io border" href="https://forecast7.com/en/51d51n0d13/london/" data-font="Noto Sans" data-icons="Climacons Animated" data-days="5" data-theme="original">LONDON WEATHER</a>
          <div className="App-header-clock border">
            <div>
              {this.state.time}
            </div>
          </div>
          { !this.state.loaded && 
            <div className="loading-wrap">
              <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
          }
          <div className="two-columns">
            { this.state.loaded && <>
              { this.columnFormat('Eastbound', this.state.trainsToLondon) }
              { this.columnFormat('Westbound', this.state.trainsToWycombe) }
             </>
            }
          </div>
        { this.state.error && 
          <div className={"error trainTime"}>Trains could not be loaded</div> 
        }
        <div className="bottom">&nbsp;</div>
        </div>
      </>
    );
  }
}

App.defaultProps = {
  server: "http://localhost:8082",
  departureUrl: "departures",
  serviceUrl: "service"
}

export default App;