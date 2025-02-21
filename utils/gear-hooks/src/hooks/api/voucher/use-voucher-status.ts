import { useCallback, useEffect, useState } from 'react';

import { useAlert, useApi } from '@/context';

import { useGetApproxBlockTimestamp } from '../block';

function useGetVoucherStatus() {
  const getApproxBlockTimestamp = useGetApproxBlockTimestamp();

  const getVoucherStatus = useCallback(
    async (expirationBlock: number) => {
      const expirationTimestamp = await getApproxBlockTimestamp(expirationBlock);
      const isVoucherActive = expirationTimestamp > Date.now();

      return { expirationTimestamp, isVoucherActive };
    },
    [getApproxBlockTimestamp],
  );

  return getVoucherStatus;
}

function useVoucherStatus(expirationBlock: number | undefined) {
  const { isApiReady } = useApi();
  const alert = useAlert();

  const getVoucherStatus = useGetVoucherStatus();

  const [status, setStatus] = useState<Awaited<ReturnType<ReturnType<typeof useGetVoucherStatus>>>>();

  useEffect(() => {
    setStatus(undefined);

    if (!isApiReady || !expirationBlock) return;

    getVoucherStatus(expirationBlock)
      .then((result) => setStatus(result))
      .catch(({ message }: Error) => alert.error(message));
  }, [isApiReady, expirationBlock]);

  return status === undefined
    ? { expirationTimestamp: undefined, isVoucherActive: undefined, isVoucherStatusReady: false as const }
    : { ...status, isVoucherStatusReady: true as const };
}

export { useVoucherStatus, useGetVoucherStatus };
