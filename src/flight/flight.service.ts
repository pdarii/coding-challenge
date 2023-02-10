import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { Flight } from './interfaces/flight-interface';
import { Cache } from 'cache-manager';

import * as configs from './configs';
import { SourceConfig } from './interfaces/source-config.interface';
import { HttpService } from '@nestjs/axios';
import { SourceFactory } from './sources-factory/source-factory';
import { SourceBase } from './sources-factory/source-base';
@Injectable()
export class FlightService {
  private dataSources: SourceBase[];

  private flights$ = new BehaviorSubject([]);

  constructor(
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly httpService: HttpService,
  ) {
    this.dataSources = this.initDataSources(configs);
  }

  private initDataSources(configs: {
    [key: string]: SourceConfig;
  }): SourceBase[] {
    const factory = new SourceFactory();
    return Object.values(configs).map((config: SourceConfig) => {
      return factory.create(config.type, config.url);
    });
  }

  getFlights(): Observable<Flight[]> {
    console.log('----- Cache Updated -----');
    const flightsObservables = this.getFlightsObservables(this.dataSources);
    return combineLatest(flightsObservables).pipe(
      map((aggregatedResults: Flight[][]) => aggregatedResults.flat(1)),
      map((results) => this.removeDuplicated(results)),
    );
  }

  private removeDuplicated(aggregatedResults: Flight[]): Flight[] {
    // TODO double check performance
    return aggregatedResults.filter((val: Flight, i, arr) => {
      return arr.findIndex((val2) => this.findDuplicated(val, val2)) === i;
    });
  }

  private findDuplicated(val: Flight, val2: Flight): boolean {
    return [
      'flight_number',
      'departure_date_time_utc',
      'arrival_date_time_utc',
    ].every(
      (k) =>
        val2['slices'][0][k] === val['slices'][0][k] &&
        val2['slices'][1][k] === val['slices'][1][k],
    );
  }

  private getFlightsObservables(
    dataSources: SourceBase[],
  ): Observable<Flight[]>[] {
    return dataSources.map((dataSource: SourceBase) => {
      return dataSource.getFlights();
    });
  }
}
