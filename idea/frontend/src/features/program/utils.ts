import { BulbStatus } from 'shared/ui/bulbBlock';

import { ProgramStatus } from './consts';

const getBulbStatus = (programStatus: ProgramStatus): BulbStatus => {
  switch (programStatus) {
    case ProgramStatus.Active:
      return BulbStatus.Success;
    case ProgramStatus.Paused:
      return BulbStatus.Loading;
    default:
      return BulbStatus.Error;
  }
};

export { getBulbStatus };
