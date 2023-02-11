import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { CircuitBreaker } from '../circuit-breaker/circuit-breaker';
import { Flight } from '../interfaces/flight-interface';
import { FlightProvider } from '../interfaces/flight-provider.interface';

export abstract class SourceBase implements FlightProvider {
  constructor(private httpService: HttpService, url: string) {
    this.url = url;
    this.circuitBreaker = new CircuitBreaker(this.httpService, this.url);
    this.runBreakerIteration(this.circuitBreaker);
  }

  private circuitBreaker: CircuitBreaker;
  protected url: string;
  protected readonly logger = new Logger();
  protected flights$: BehaviorSubject<Flight[]> = new BehaviorSubject([]);
  protected abstract mapResponseData(response: AxiosResponse): Flight[];

  public getFlights(): Observable<Flight[]> {
    return this.flights$;
  }

  protected runBreakerIteration(circuitBreaker: CircuitBreaker) {
    setImmediate(() => {
      circuitBreaker
        .exec()
        .then((res: AxiosResponse) => {
          this.flights$.next(this.mapResponseData(res));
          this.runBreakerIteration(circuitBreaker);
        })
        .catch(() => {
          this.runBreakerIteration(circuitBreaker);
        });
    });
  }
}
