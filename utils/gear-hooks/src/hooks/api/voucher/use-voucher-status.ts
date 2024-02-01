import { useCallback, useContext, useEffect, useState } from 'react';

import { AlertContext, ApiContext } from 'context';

import { UseGetApproxBlockTimestamp } from '../block';

function useGetVoucherStatus() {
  const getApproxBlockTimestamp = UseGetApproxBlockTimestamp();

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
  const { isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

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
