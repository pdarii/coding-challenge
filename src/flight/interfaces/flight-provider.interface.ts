import { Observable } from 'rxjs';
import { Flight } from './flight-interface';

// TODO delete
export interface FlightProvider {
  getFlights: Observable<Flight[]>;
}
