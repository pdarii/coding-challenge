import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Flight } from '../interfaces/flight-interface';
import { FlightProvider } from '../interfaces/flight-provider.interface';

// TODO interface

export abstract class SourceBase {
  protected url: string;
  abstract getFlights(): Observable<Flight[]>;
}
