import { pairUpTrainData, timeDifference, timeDisplay } from './Functions';

describe('pair up of arrival and departure train data', () => {
  it('takes raw train arrival and departure data and pairs it up into matching trains', () => {
    const departures = [{ 'rsid': '1', 'destination': [{ 'locationName': 'London Marylebone'}], 'std': '09:59', 'etd': '10:00'}]
    const arrivals = [{ 'rsid': '1', 'sta': '10:00', 'eta': '10:01'}]
  
    expect(pairUpTrainData(departures, arrivals)).toEqual({"1": {"eta": "10:01", "etd": "10:00", "sta": "10:00", "std": "09:59"}});
  })
})

test('only returns trains which have standard arrival time and estimated arrival time', () => {
  const departures = [{ 'rsid': '1', 'destination': [{ 'locationName': 'London Marylebone' }], 'std': '10:00', 'etd': '10:01' }]
  const arrivals = [{ 'rsid': '1' }]

  expect(pairUpTrainData(departures, arrivals)).toEqual({});
  
})

test('only returns trains with a destination of london marylebone', () => {
  const departures = [{ 'rsid': '1', 'destination': [{ 'locationName': 'London Euston' }] }]
  const arrivals = [{ 'rsid': '1' }]

  expect(pairUpTrainData(departures, arrivals)).toEqual({});
})

test('only returns trains which have arrival information', () => {
  const departures = [{ 'rsid': '1', 'destination': [{ 'locationName': 'London Marylebone' }], 'std': '10:00', 'etd': '10:01' }]
  const arrivals = [{ 'rsid': '1' }]

  expect(pairUpTrainData(departures, arrivals)).toEqual({});
})



describe('time difference', () => {
  describe('given two numbers not overlapping with midnight', () => {
    it('calculates the estimate journey time in minutes', () => {
      expect(timeDifference('00:00', '23:59')).toEqual(1439)
    })
  })
  describe('given two times overlapping with midnight', () => {
    it('calculates the estimate journey time in minutes correctly', () => {
      expect(timeDifference('23:59', '00:01')).toEqual(2)
    })
  })
})

describe('train time display', () => {
  it('takes the later of etd and std for the departure', () => {
    expect(timeDisplay({"etd": "10:00", "std": "09:59", "sta": "11:00"})).toEqual("10:00 => 11:00")
  })
})