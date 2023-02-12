import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { SourcesTypeEnum } from './../../enums/sources-enum';
import { FakeSchedulerRegistry } from './../../mocks/fake-scheduler-registry.mock';
import { SourceFactory } from '../source-factory';

class FakeHttpService {}

describe('SourceFactory', () => {
  let service: SourceFactory;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SourceFactory,
        { provide: SchedulerRegistry, useClass: FakeSchedulerRegistry },
        { provide: HttpService, useClass: FakeHttpService },
      ],
    }).compile();

    service = app.get<SourceFactory>(SourceFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create source', () => {
    const source = service.createSource(SourcesTypeEnum.source1, 'test-url');
    expect(source).toBeDefined();

    const source2 = service.createSource(SourcesTypeEnum.source2, 'test-url');
    expect(source2).toBeDefined();
  });
});
