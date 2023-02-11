import { Logger } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flight } from '../interfaces/flight-interface';
import { FlightProvider } from '../interfaces/flight-provider.interface';

export abstract class SourceBase implements FlightProvider {
  protected url: string;
  protected readonly logger = new Logger();
  abstract getFlights(): Observable<Flight[]>;
  abstract flights$: BehaviorSubject<Flight[]>;
}
