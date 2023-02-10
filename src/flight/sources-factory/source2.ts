import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { catchError, map, Observable, of } from 'rxjs';
import { Flight } from '../interfaces/flight-interface';
import { SourceBase } from './source-base';

export class Source2 extends SourceBase {
  constructor(
    protected readonly url: string,
    private readonly httpService: HttpService,
  ) {
    super();
    this.url = url;
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

  private mapResponseData(response: AxiosResponse): Flight[] {
    return response?.data?.flights || [];
  }
}
