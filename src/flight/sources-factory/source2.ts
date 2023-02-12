import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { FlightsResilienceService } from '../flights-resilience/flights-resilience.service';
import { SourcesTypeEnum } from '../enums/sources-enum';
import { Flight } from '../interfaces/flight-interface';
import { SourceBase } from './source-base';

export class Source2 extends SourceBase {
  constructor(
    protected readonly url: string,
    protected readonly type: SourcesTypeEnum,
    FlightsResilienceService: FlightsResilienceService,
  ) {
    super(FlightsResilienceService, url, type);
  }

  protected mapResponseData(response: AxiosResponse): Flight[] {
    return response?.data?.flights || [];
  }
}
