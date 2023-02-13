import { Injectable, Logger } from '@nestjs/common';

import { combineLatest, firstValueFrom, map, Observable, tap } from 'rxjs';
import { Flight } from './interfaces/flight-interface';
import { SourceConfig } from './interfaces/source-config.interface';
import { SourceFactory } from './sources-factory/source-factory';
import { FlightProvider } from './interfaces/flight-provider.interface';
import { FlightSlice } from './interfaces/flight-slice-interface';

import * as configs from './configs';

@Injectable()
export class FlightService {
  private dataSources: FlightProvider[];
  private flights$: Observable<Flight[]>;

  protected readonly logger = new Logger();

  constructor(private sourceFactory: SourceFactory) {
    this.dataSources = this.getDataSources(configs);
    this.flights$ = this.getFlightsAggregatedObservable(this.dataSources);
  }

  getFlights(): Promise<Flight[]> {
    return firstValueFrom(this.flights$);
  }

  private getDataSources(configs: {
    [key: string]: SourceConfig;
  }): FlightProvider[] {
    return Object.values(configs).map((config: SourceConfig) => {
      return this.sourceFactory.createSource(config.type, config.url);
    });
  }

  private getFlightsAggregatedObservable(
    dataSources: FlightProvider[],
  ): Observable<Flight[]> {
    const flightsObservables = this.getFlightsObservables(dataSources);
    return combineLatest(flightsObservables).pipe(
      map((aggregatedResults: Flight[][]) => [].concat(...aggregatedResults)), // used concat because it's much faster then flat()
      map((results) => this.removeDuplicates(results)),
    );
  }

  private removeDuplicates(aggregatedResults: Flight[]): Flight[] {
    const seenFlights = new Set();

    const filteredArr = aggregatedResults.filter((el) => {
      const flightFromUniqId = this.getFlightUniqId(el.slices[0]);
      const flightToUniqId = this.getFlightUniqId(el.slices[1]);

      const uniqFlightCombination = `${flightFromUniqId}${flightToUniqId}`;

      const duplicate = seenFlights.has(uniqFlightCombination);
      seenFlights.add(uniqFlightCombination);

      return !duplicate;
    });

    return filteredArr;
  }

  private getFlightUniqId(slice: FlightSlice): string {
    return `${slice.flight_number}-${slice.departure_date_time_utc}-${slice.arrival_date_time_utc}`;
  }

  private getFlightsObservables(
    dataSources: FlightProvider[],
  ): Observable<Flight[]>[] {
    return dataSources.map((dataSource: FlightProvider) => {
      return dataSource.getFlights();
    });
  }
}
