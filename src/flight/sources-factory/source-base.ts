import { Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { FlightsResilienceService } from '../flights-resilience/flights-resilience.service';
import { SourcesTypeEnum } from '../enums/sources-enum';
import { Flight } from '../interfaces/flight-interface';
import { FlightProvider } from '../interfaces/flight-provider.interface';

export abstract class SourceBase implements FlightProvider {
  constructor(
    private flightsResilienceService: FlightsResilienceService,
    url: string,
    type: SourcesTypeEnum,
  ) {
    this.url = url;
    this.type = type;
    this.startPolling();
  }

  protected url: string;
  protected type: SourcesTypeEnum;
  protected readonly logger = new Logger();

  protected abstract mapResponseData(response: AxiosResponse): Flight[];

  public getFlights(): Observable<Flight[]> {
    return this.flightsResilienceService.getFlights().pipe(
      map((flights) => {
        return this.mapResponseData(flights);
      }),
    );
  }

  public startPolling() {
    this.flightsResilienceService.startPolling();
  }

  public stopPolling() {
    this.flightsResilienceService.stopPolling();
  }
}
