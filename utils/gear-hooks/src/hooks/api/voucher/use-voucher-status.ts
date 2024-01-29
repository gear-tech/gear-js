import { useContext } from 'react';

import { ApiContext } from 'context';

import { useApproxBlockTimestamp } from '../block';

function useVoucherStatus(expirationBlock: number | undefined) {
  const { isV110Runtime } = useContext(ApiContext);
  const { blockTimestamp, isBlockTimestampReady } = useApproxBlockTimestamp(expirationBlock);

  const expirationTimestamp = isV110Runtime ? blockTimestamp : undefined;
  const isVoucherStatusReady = isV110Runtime ? isBlockTimestampReady : true;
  const isVoucherActive = isV110Runtime ? !!expirationTimestamp && expirationTimestamp > Date.now() : true;

  return { expirationTimestamp, isVoucherStatusReady, isVoucherActive };
}

export { useVoucherStatus };
