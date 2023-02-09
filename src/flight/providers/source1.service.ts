import { Injectable } from '@nestjs/common';
import { FlightBaseService } from './flight-base.service';

const URL = 'https://coding-challenge.powerus.de/flight/source1';

// Pattern Strategy

// TODO Petro Interface
@Injectable()
export class Source1Service extends FlightBaseService {
  protected url: string = URL;
}
