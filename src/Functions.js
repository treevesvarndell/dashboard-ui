import moment from 'moment';

export const pairUpTrainData = (departures, arrivals) => {
    const trainsToLondon = departures.filter(train => 
      train.destination[0].locationName === 'London Marylebone'
    ).reduce((obj, item) => {
      obj[item.rsid] = {
        'std': item.std,
        'etd': item.etd
      }
      return obj
    }, {})
    
    const arrivalsAtLondon = arrivals.filter(train => 
        Object.keys(trainsToLondon).includes(train.rsid)
      ).reduce((trainsToLondon, train) => {
        if (!train.sta || !train.eta) { 
          delete trainsToLondon[train.rsid]
        } else {
          trainsToLondon[train.rsid]['sta'] = train.sta
          trainsToLondon[train.rsid]['eta'] = train.eta
        }
        return trainsToLondon
      }, trainsToLondon)

    return arrivalsAtLondon
};

export const timeDifference = (departure, arrival) => {
  if(moment(arrival, 'HH:mm').get('hour') === 0) {
    return moment(`1970-01-02 ${arrival}`, 'YYYY-MM-DD HH:mm').diff(moment(`1970-01-01 ${departure}`, 'YYYY-MM-DD HH:mm'), 'minutes')
  }
  return moment(arrival, 'HH:mm').diff(moment(departure, 'HH:mm'), 'minutes')
}

export const timeDisplay = (train) => {
  return `${train.std} ➜ ${train.sta}`
}