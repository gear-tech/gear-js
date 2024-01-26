import { useBlockTimestamp } from './use-block-timestamp';

function useVoucherStatus(expireBlock: number | undefined) {
  const { blockTimestamp, isBlockTimestampReady } = useBlockTimestamp(expireBlock);

  const expirationTimestamp = blockTimestamp;
  const isVoucherStatusReady = isBlockTimestampReady;
  const isVoucherActive = !!expirationTimestamp && expirationTimestamp > Date.now();

  return { expirationTimestamp, isVoucherStatusReady, isVoucherActive };
}

export { useVoucherStatus };
