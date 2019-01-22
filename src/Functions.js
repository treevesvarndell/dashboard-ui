import moment from "moment";

export const pairUpTrainData = (dep, arr) => {
    const trainsToLondon = dep.data.trainServices.filter(
      (train) => train.destination[0].locationName === "London Marylebone"
    ).reduce((obj, item) => {
      obj[item.rsid] = {
        'std': item.std,
        'etd': item.etd
      }
      return obj
    }, {})
    
    const arrivalsAtLondon = arr.data.trainServices.filter(train => 
        Object.keys(trainsToLondon).includes(train.rsid)
      ).reduce((trainsToLondon, train) => {
        trainsToLondon[train.rsid]['sta'] = train.sta
        trainsToLondon[train.rsid]['eta'] = train.eta
        return trainsToLondon
      }, trainsToLondon)

    return arrivalsAtLondon
};

export const timeDifference = (arrival, departure) => {
  return moment(arrival, "HH:mm").diff(moment(departure, "HH:mm"), 'minutes')
}