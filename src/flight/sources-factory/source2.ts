import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { CircuitBreaker } from '../circuit-breaker/circuit-breaker';
import { Flight } from '../interfaces/flight-interface';
import { SourceBase } from './source-base';

// TODO Stop breaker polling method
export class Source2 extends SourceBase {
  flights$: BehaviorSubject<Flight[]> = new BehaviorSubject([]);

  private circuitBreaker: CircuitBreaker;

  constructor(
    protected readonly url: string,
    private readonly httpService: HttpService,
  ) {
    super();
    this.url = url;
    this.circuitBreaker = new CircuitBreaker(this.httpService, this.url);
    this.runBreakerIteration(this.circuitBreaker);
  }

  getFlights(): Observable<Flight[]> {
    return this.httpService.get(this.url).pipe(
      map((response) => this.mapResponseData(response)),
      catchError((err) => {
        this.logger.error(`${err?.code} ${this.url}`);
        return of([]);
      }),
    );
  }

  private runBreakerIteration(circuitBreaker: CircuitBreaker) {
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

  private mapResponseData(response: AxiosResponse): Flight[] {
    return response?.data?.flights || [];
  }
}
