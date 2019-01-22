import { pairUpTrainData } from './Functions';

test('takes raw train arrival and departure data and pairs it up into matching trains', () => {
  const departures = {
    'data': {
      'trainServices': [
        {
          'rsid': '1',
          'destination': [{ 'locationName': 'London Marylebone' }],
          'std': '10:00',
          'etd': '10:01'
        }
      ]
    }
  } 
  const arrivals = {
    'data': {
      'trainServices': [
        {
          'rsid': '1',
          'sta': '10:00',
          'eta': '10:01'
        }
      ]
    }
  }

  expect(pairUpTrainData(departures, arrivals)).toEqual(
    {
      "1": {"eta": "10:01", "etd": "10:01", "sta": "10:00", "std": "10:00"}
    }
  );
  
})

test('only returns trains with a destination of london marylebone', () => {
  const departures = {
    'data': {
      'trainServices': [
        {
          'rsid': '1',
          'destination': [{ 'locationName': 'London Euston' }],
          'std': '10:00',
          'etd': '10:01'
        }
      ]
    }
  } 
  const arrivals = {
    'data': {
      'trainServices': [
        {
          'rsid': '1',
          'sta': '10:00',
          'eta': '10:01'
        }
      ]
    }
  }

  expect(pairUpTrainData(departures, arrivals)).toEqual({});
  
})

test('only returns trains which have arrival information', () => {
  const departures = {
    'data': {
      'trainServices': [
        {
          'rsid': '1',
          'destination': [{ 'locationName': 'London Euston' }],
          'std': '10:00',
          'etd': '10:01'
        }
      ]
    }
  } 
  const arrivals = {
    'data': {
      'trainServices': [
        {
          'rsid': '2',
          'sta': '10:00',
          'eta': '10:01'
        }
      ]
    }
  }

  expect(pairUpTrainData(departures, arrivals)).toEqual({});
  
})

test('only returns trains which have standard arrival time and estimated arrival time', () => {
  const departures = {
    'data': {
      'trainServices': [
        {
          'rsid': '1',
          'destination': [{ 'locationName': 'London Euston' }],
          'std': '10:00',
          'etd': '10:01'
        }
      ]
    }
  } 
  const arrivals = {
    'data': {
      'trainServices': [
        {
          'rsid': '1'
        }
      ]
    }
  }

  expect(pairUpTrainData(departures, arrivals)).toEqual({});
  
})