import { FlightSlice } from '../interfaces/flight-slice-interface';

export const MOCK_SLICE: FlightSlice = {
  origin_name: 'Schonefeld',
  destination_name: 'Stansted',
  departure_date_time_utc: '2019-08-08T04:30:00.000Z',
  arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
  flight_number: '144',
  duration: 115,
};
