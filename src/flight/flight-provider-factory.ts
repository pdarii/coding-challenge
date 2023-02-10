import { Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Source1Service } from './services/source1.service';
import { Source2Service } from './services/source2.service';

export const flightSourceFactory = {
  provide: 'RESOURCE',
  scope: Scope.DEFAULT,
  useFactory: (req: Request): Source1Service | Source2Service => {
    // const { animal } = req.query;
    console.dir(req['query']);

    // if (animal === 'dog') {
    //   return new DogService();
    // }
    return new Source1Service();
  },
  inject: [REQUEST],
};
