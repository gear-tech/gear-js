import { BulbStatus } from 'shared/ui/BulbBlock';

import { ProgramStatus } from '../model/consts';

const getBulbStatus = (programStatus: ProgramStatus): BulbStatus => {
  switch (programStatus) {
    case ProgramStatus.Success:
      return BulbStatus.Success;
    case ProgramStatus.InProgress:
      return BulbStatus.Loading;
    default:
      return BulbStatus.Error;
  }
};

export { getBulbStatus };
