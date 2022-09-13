import { GasInfo } from '@gear-js/api';

import { Result } from './types';

const preparedGasInfo = (gasInfo: GasInfo): Result => ({
  waited: gasInfo.waited.toPrimitive(),
  burned: gasInfo.burned.toHuman(),
  reserved: gasInfo.reserved.toHuman(),
  minLimit: gasInfo.min_limit.toHuman(),
  limit: gasInfo.min_limit.toNumber(),
});

export { preparedGasInfo };
