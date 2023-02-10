import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { Flight } from './interfaces/flight-interface';
import { Cache } from 'cache-manager';

import * as configs from './configs';
import { SourceConfig } from './interfaces/source-config.interface';
import { HttpService } from '@nestjs/axios';
import { toArray } from 'rxjs/operators';
import { FlightAggregated } from './interfaces/flight-aggregated.interface';
@Injectable()
export class FlightService {
  private dataSources: SourceConfig[];

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly httpService: HttpService,
  ) {
    this.dataSources = this.initDataSources(configs);
    // get configs create fabric objects
  }

  private initDataSources(configs: {
    [key: string]: SourceConfig;
  }): SourceConfig[] {
    return Object.values(configs);
  }

  getFlights(): Observable<Flight[]> {
    const flightsObservables = this.getFlightsObservables(this.dataSources);

    return combineLatest(flightsObservables).pipe(
      map((aggregatedResults: AxiosResponse[]) =>
        aggregatedResults.map((sourceResult) => sourceResult.data),
      ),
      map((results: FlightAggregated[]) => this.removeDuplicated(results)),
    );
  }

  private removeDuplicated(results: FlightAggregated[]) {
    console.log('----------');
    console.dir(results);
    console.log('----------');
    return of([]) as any;
  }

  private getFlightsObservables(
    dataSources: SourceConfig[],
  ): Observable<AxiosResponse<Flight[]>>[] {
    return dataSources.map((dataSource) => {
      return this.httpService.get(dataSource.url).pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      );
    });
  }
}
