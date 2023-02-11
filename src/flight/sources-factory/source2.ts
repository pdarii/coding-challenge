import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Flight } from '../interfaces/flight-interface';
import { SourceBase } from './source-base';

export class Source2 extends SourceBase {
  constructor(protected readonly url: string, httpService: HttpService) {
    super(httpService, url);
  }

  protected mapResponseData(response: AxiosResponse): Flight[] {
    return response?.data?.flights || [];
  }
}
