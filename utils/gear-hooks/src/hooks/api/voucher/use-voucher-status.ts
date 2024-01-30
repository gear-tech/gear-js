import { useApproxBlockTimestamp } from '../block';

function useVoucherStatus(expirationBlock: number | undefined) {
  const { blockTimestamp, isBlockTimestampReady } = useApproxBlockTimestamp(expirationBlock);

  const expirationTimestamp = blockTimestamp;
  const isVoucherStatusReady = isBlockTimestampReady;
  const isVoucherActive = !!expirationTimestamp && expirationTimestamp > Date.now();

  return { expirationTimestamp, isVoucherStatusReady, isVoucherActive };
}

export { useVoucherStatus };
