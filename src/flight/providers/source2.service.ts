import { Injectable } from '@nestjs/common';
import { FlightBaseService } from './flight-base.service';

const URL = 'https://coding-challenge.powerus.de/flight/source2';

@Injectable()
export class Source2Service extends FlightBaseService {
  protected url: string = URL;
}
