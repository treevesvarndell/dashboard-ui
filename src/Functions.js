import moment from 'moment';
import { Object } from 'core-js';

import axios from 'axios';

export const pairUpTrainData = (departures, arrivals) => {
  const trainsToLondon = departures.filter(train =>
    train.destination[0].locationName === 'London Marylebone'
  ).reduce((obj, depart) => {
    const arrival = arrivals[depart.serviceIdPercentEncoded]
    if(!!arrival && !!arrival.sta) {
      const estimatedDeparture = (depart.etd === "On time" || depart.etd === "Delayed") ? null : depart.etd
      const estimatedArrival = (arrival.eta === "On time" || arrival.eta === "Delayed") ? null : arrival.eta
      const standardDeparture = depart.std;
      const standardArrival = arrival.sta;

      obj[depart.serviceIdPercentEncoded] = {
        'std': estimatedDeparture ? estimatedDeparture : standardDeparture,
        'etd': estimatedDeparture,
        'sta': estimatedArrival ? estimatedArrival : standardArrival,
        'eta': estimatedArrival,
        'duration': timeDifference(depart.std, arrival.sta, estimatedDeparture, estimatedArrival),
        'callingAt': arrival.callingAt,
        'delayed': estimatedDeparture || estimatedArrival ? true : false
      }
    }
    return obj
  }, {})
  return trainsToLondon
};

export const arrivalInfo = (id, serviceInfo) => {
  const stops = serviceInfo.subsequentCallingPoints[0].callingPoint
  const callingAt = stops.map(s => s.locationName);
  return Array.of(stops[stops.length - 1]).map(c => { return { [id]: {eta: c.et, sta: c.st, callingAt: callingAt} } })[0]
}

export const flattenArrivals = (listOfArrivals) => {
  return listOfArrivals.reduce((obj, item) => {
    const arrivalId = Object.keys(item)[0];
    obj[arrivalId] = {
      'sta': item[arrivalId].sta,
      'eta': item[arrivalId].eta,
      'callingAt': item[arrivalId].callingAt
    }
    return obj
  }, {})
}

export const getServiceInfo = (id) => {
  return axios.get(`http://localhost:8080/service/${id}`).then(response => {
    return arrivalInfo(id, response.data)
  })
}

export const timeDifference = (scheduledDeparture, scheduledArrival, estimatedDeparture, estimatedArrival) => {
  const arrival = estimatedArrival ? estimatedArrival : scheduledArrival
  const departure = estimatedDeparture ? estimatedDeparture : scheduledDeparture
  
  if (moment(arrival, 'HH:mm').get('hour') === 0) {
    return moment(`1970-01-02 ${arrival}`, 'YYYY-MM-DD HH:mm').diff(
           moment(`1970-01-01 ${departure}`, 'YYYY-MM-DD HH:mm'), 
           'minutes'
    )
  }
  return moment(arrival, 'HH:mm').diff(moment(departure, 'HH:mm'), 'minutes')
}

export const timeDisplay = (train) => {
  let formattedStr = ""
  formattedStr += `${train.std}`
  // formattedStr += ` ➜ ${train.sta}`
  return formattedStr
}