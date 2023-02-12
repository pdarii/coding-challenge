import { SourcesTypeEnum } from '../enums/sources-enum';
import { SourceConfig } from '../interfaces/source-config.interface';

export const SOURCE_CONFIG_MOCK: SourceConfig = {
  url: 'https://mytest.url',
  type: SourcesTypeEnum.source1,
};
