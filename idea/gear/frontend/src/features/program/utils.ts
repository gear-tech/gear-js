import { BulbStatus } from '@/shared/ui/bulbBlock';

import { ProgramStatus } from './consts';

const getBulbStatus = (programStatus: ProgramStatus): BulbStatus => {
  switch (programStatus) {
    case ProgramStatus.Active:
      return BulbStatus.Success;

    case ProgramStatus.Paused:
      return BulbStatus.Loading;

    case ProgramStatus.ProgramSet:
    case ProgramStatus.Exited:
      return BulbStatus.Exited;

    default:
      return BulbStatus.Error;
  }
};

export { getBulbStatus };
