import { Metadata } from '@gear-js/api';

import * as hooks from 'hooks';
import { ProgramModel } from 'types/program';

export const useProgramMock = (program?: ProgramModel) => {
  const mock = jest.spyOn(hooks, 'useProgram');

  const meta: string | undefined = program?.meta?.meta;
  const parsedMeta = meta ? (JSON.parse(meta) as Metadata) : void 0;

  mock.mockReturnValue([program, parsedMeta]);

  return mock;
};
