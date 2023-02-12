import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { SourcesTypeEnum } from '../enums/sources-enum';

// In real life constants should be moved somewhere / .env / db / etc
const FAILURE_TIMEOUT = 5000; // milliseconds
const SUCCESS_TIMEOUT = 10000; // milliseconds

export class FlightsResilienceService {
  private failureTimeout: number = FAILURE_TIMEOUT;
  private successTimeout: number = SUCCESS_TIMEOUT;
  private failedAttempts = 0;

  private flights$: BehaviorSubject<AxiosResponse> =
    new BehaviorSubject<AxiosResponse>({} as AxiosResponse);

  private readonly logger = new Logger();

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
    private url: string,
    private type: SourcesTypeEnum,
  ) {}

  getFlights(): Observable<AxiosResponse> {
    return this.flights$;
  }

  startPolling(timeInterval = 0) {
    const timeout = setTimeout(() => {
      this.stopPolling();
      this.executeHttpCall();
    }, timeInterval);

    this.schedulerRegistry.addTimeout(this.type, timeout);
  }

  stopPolling() {
    this.schedulerRegistry.deleteTimeout(this.type);
  }

  private async executeHttpCall() {
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        this.url,
      );
      if (response.status === 200) {
        this.success(response);
      } else {
        this.failure();
      }
    } catch (err) {
      this.failure();
    }
  }

  private success(res: AxiosResponse) {
    this.failedAttempts = 0;
    this.flights$.next(res);
    this.logger.log(`Success call to ${this.url}`);
    this.startPolling(this.successTimeout);
  }

  private failure() {
    this.failedAttempts++;

    const newInterval = Math.min(
      this.failureTimeout * Math.pow(this.failedAttempts, 2),
      this.successTimeout,
    );

    this.startPolling(newInterval);

    this.logger.warn(
      `Failed call to ${this.url}, next call after ${newInterval} milliseconds `,
    );
  }
}
