import { SourcesTypeEnum } from '../enums/sources-enum';

export interface SourceConfig {
  url: string;
  type: SourcesTypeEnum;
}
