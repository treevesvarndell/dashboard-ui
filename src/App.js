import React, { Component } from 'react';
import './App.css';
import { pairUpTrainData, timeDisplay, timeDifference, getServiceInfo, flattenArrivals } from './Functions';

import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eastboundTrains: {},
      westboundTrains: {},
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
                eastboundTrains: pairUpTrainData(this.props.eastboundDestinations, departures, flattenArrivals(arrivals)),
                westboundTrains: pairUpTrainData(this.props.westboundDestinations, departures, flattenArrivals(arrivals)),
                error: false
              })
            }).catch(e => {
              this.setState({ 
                error: true 
              })
            })
        } else {
          this.setState({
            eastboundTrains: [{
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
    this.setState({ 
      time: `${(hours < 10 ? "0" : "") + hours}:${(mins < 10 ? "0" : "") + mins}:${(secs < 10 ? "0" : "") + secs}`
    })
  }

  componentDidMount() {
    this.fetchTrainData()
    this.updateClock()
    setInterval(() => this.fetchTrainData(), 5000)
    setInterval(() => this.updateClock(), 1000)
  }

  columnFormat(direction, trainsToDisplay) {
    return <div className="column">
      <div className="trainTime header">{direction}</div>
      { Object.values(trainsToDisplay).map(t => {
        const time = timeDisplay(t)
        const key = direction + "_" + time
        return <div id={key} key={key} className={t.delayed ? "delay trainTime" : "trainTime"}>
      <div className="trainHeader">{t.destination} (Departs {t.timeLeft} mins)</div>
          <div className="time">{time}</div>
          <div className="durationTime header">{t.duration} mins</div>
          <div className="callingAt">Calling at: {t.callingAt.join(", ")}</div>
        </div>
      })}
    </div>
  }
  
  render() {
    return (
      <>
        <div className="App">
          <a className="weatherwidget-io" href="https://forecast7.com/en/51d51n0d13/london/" data-font="Noto Sans" data-icons="Climacons Animated" data-days="5" data-theme="original">LONDON WEATHER</a>
          <div className="App-header-clock">
            {this.state.time}
          </div>
          { !this.state.loaded && 
            <div className="loading-wrap"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
          }
          <div className="two-columns">
            { this.state.loaded && <>
              { this.columnFormat('Eastbound', this.state.eastboundTrains) }
              { this.columnFormat('Westbound', this.state.westboundTrains) }
             </>
            }
          </div>
        { this.state.error && 
          <div className={"error trainTime"}>
            Trains could not be loaded
          </div> 
        }
        <div className="bottom">&nbsp;</div>
        </div>
      </>
    );
  }
}

App.defaultProps = {
  eastboundDestinations: ['London Marylebone'],
  westboundDestinations: ['High Wycombe', 'Bicester North', 'Stratford-upon-Avon', 'Aylesbury'],
  server: "http://192.168.2.11:8082",
  departureUrl: "departures",
  serviceUrl: "service"
}

export default App;