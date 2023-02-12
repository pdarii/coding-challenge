import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { FlightsResilienceService } from '../flights-resilience/flights-resilience.service';
import { SourcesTypeEnum } from '../enums/sources-enum';
import { Source1 } from './source1';
import { Source2 } from './source2';
import { FlightProvider } from '../interfaces/flight-provider.interface';

@Injectable()
export class SourceFactory {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
  ) {}

  createSource(type: SourcesTypeEnum, url: string): FlightProvider {
    const flightsResilienceService = new FlightsResilienceService(
      this.schedulerRegistry,
      this.httpService,
      url,
      type,
    );
    switch (type) {
      case SourcesTypeEnum.source1:
        return new Source1(url, type, flightsResilienceService);
      case SourcesTypeEnum.source2:
        return new Source2(url, type, flightsResilienceService);
    }
  }
}
