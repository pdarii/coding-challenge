import { HttpService } from '@nestjs/axios';
import { SourcesTypeEnum } from '../enums/sources-enum';
import { Source1 } from './source1';
import { Source2 } from './source2';

export class SourceFactory {
  create(type: SourcesTypeEnum, url: string) {
    const httpService = new HttpService();
    switch (type) {
      case SourcesTypeEnum.source1:
        return new Source1(url, httpService);
      case SourcesTypeEnum.source2:
        return new Source2(url, httpService);
      //   default:
      //     return new Error('Source type not supported');
      // TODO error handling
    }
  }
}
