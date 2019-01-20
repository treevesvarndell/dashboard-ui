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
        },
        {
          'rsid': '2',
          'destination': [{ 'locationName': 'London Marylebone' }],
          'std': '10:02',
          'etd': '10:03'
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
        },
        {
          'rsid': '2',
          'sta': '10:04',
          'eta': '10:05'
        }
      ]
    }
  }

  expect(pairUpTrainData(departures, arrivals)).toEqual(
    {
      "1": {"eta": "10:01", "etd": "10:01", "sta": "10:00", "std": "10:00"}, 
      "2": {"eta": "10:05", "etd": "10:03", "sta": "10:04", "std": "10:02"}
    }
  );
  
})
