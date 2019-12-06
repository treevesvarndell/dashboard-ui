import { pairUpTrainData, timeDifference, timeDisplay, arrivalInfo, flattenArrivals } from './Functions';

describe('pair up arrivals and rest of train data', () => {
  it('takes raw train arrival and departure data and pairs it up into matching trains', () => {
    const departures = [
      { 'serviceIdPercentEncoded': '1', 'destination': [{ 'locationName': 'London Marylebone'}], 'std': '09:59', 'etd': '10:00'},
      { 'serviceIdPercentEncoded': '2', 'destination': [{ 'locationName': 'London Marylebone'}], 'std': '09:59', 'etd': '10:00'}
    ]
    const arrivals = {
      '1': { 'sta': '10:00', 'eta': '10:01'},
      '2': { 'sta': '10:00', 'eta': '10:01'}
    }

    expect(pairUpTrainData(departures, arrivals)).toEqual({
      '1': { 'duration': 1, 'eta': '10:01', 'etd': '10:00', 'sta': '10:01', 'std': '10:00', 'callingAt': undefined, "delayed": true},
      '2': { 'duration': 1, 'eta': '10:01', 'etd': '10:00', 'sta': '10:01', 'std': '10:00', 'callingAt': undefined, "delayed": true}
    });
  })
})

describe('trains without certain arrival information', () => {
  test('ignores trains without matching sta', () => {
    const departures = [{ 'serviceIdPercentEncoded': '1', 'destination': [{ 'locationName': 'London Marylebone'}], 'std': '09:59', 'etd': '10:00'}]
    const arrivals = {}
  
    expect(pairUpTrainData(departures, arrivals)).toEqual({});
  })
  
  test('only returns trains with a destination of london marylebone', () => {
    const departures = [{ 'serviceIdPercentEncoded': '1', 'destination': [{ 'locationName': 'London Euston' }] }]
    const arrivals = [{ 'serviceIdPercentEncoded': '1' }]
  
    expect(pairUpTrainData(departures, arrivals)).toEqual({});
  })
  
  test('only returns trains which have arrival information', () => {
    const departures = [{ 'serviceIdPercentEncoded': '1', 'destination': [{ 'locationName': 'London Marylebone' }], 'std': '10:00', 'etd': '10:01' }]
    const arrivals = [{ 'serviceIdPercentEncoded': '1' }]
  
    expect(pairUpTrainData(departures, arrivals)).toEqual({});
  })

  test('only returns trains which have matching id in arrivals', () => {
    const departures = [{ 'serviceIdPercentEncoded': '1', 'destination': [{ 'locationName': 'London Marylebone' }], 'std': '10:00', 'etd': '10:01' }]
    const arrivals = {
      '2': { 'sta': '10:00', 'eta': '10:01'},
    }
  
    expect(pairUpTrainData(departures, arrivals)).toEqual({});
  })
})

describe('time difference', () => {
  describe('given two numbers not overlapping with midnight', () => {
    it('calculates the estimate journey time in minutes', () => {
      expect(timeDifference('00:00', '23:59')).toEqual(1439)
    })
  })
  describe('given two times overlapping with midnight', () => {
    it('calculates the estimate journey time in minutes', () => {
      expect(timeDifference('23:59', '00:00')).toEqual(1)
    })
  })
})

describe('train time display', () => {
  it('displays both estimated and actual departure times', () => {
    expect(timeDisplay({'etd': '10:00', 'std': '10:01'})).toEqual('10:01')
  })
})

describe('service retrieves arrival information', () => {
  it('gets the eta and sta from the payload of the last element and returns a new object keyed on service id', () => {
    const examplePayload = {
      rsid: 'anArrivalTrain', 
      subsequentCallingPoints: [
        {
          callingPoint: [
            {
              locationName: 'Wembley Stadium',
              st: '23:39',
              et: 'On time'
            },
            {
              locationName: 'London Marylebone',
              st: '23:55',
              et: 'On time'
            }
          ]
        }
      ]
    }
    expect(arrivalInfo('1', examplePayload)).toEqual({ 
      '1': { sta: '23:55', eta: 'On time', 'callingAt': ['Wembley Stadium', 'London Marylebone'] }
    })
  })
})

describe('flatten arrivals', () => {
  it('takes an array of objects with their keys and makes a singleton', () => {
    expect(flattenArrivals([
      { '1': { sta: '09:59', eta: 'On time' } }, 
      { '2': { sta: '09:59', eta: 'On time' } }
    ])).toEqual({
       '1': { sta: '09:59', eta: 'On time' } ,
       '2': { sta: '09:59', eta: 'On time' } 
    })
  })
})