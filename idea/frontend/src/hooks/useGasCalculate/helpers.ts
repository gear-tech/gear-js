import { GasInfo } from '@gear-js/api';

import { Result } from './types';

const preparedGasInfo = (gasInfo: GasInfo): Result => ({
  limit: gasInfo.min_limit.toNumber(),
  waited: gasInfo.waited.toPrimitive(),
  burned: gasInfo.burned.toHuman(),
  reserved: gasInfo.reserved.toHuman(),
  minLimit: gasInfo.min_limit.toHuman(),
  mayBeReturned: gasInfo.may_be_returned.toHuman(),
});

export { preparedGasInfo };
