import { HexString } from '@gear-js/api';
import { useState, useEffect, useMemo } from 'react';

import { useAccount, useAlert } from '@/context';

import { useGetVoucherStatus } from './use-voucher-status';
import { useVouchers } from './use-vouchers';

function useIsAnyVoucherActive(accountAddress: string | undefined, programId: HexString | undefined) {
  const { vouchers } = useVouchers(accountAddress, programId);
  const voucherEntries = useMemo(() => Object.entries(vouchers || {}), [vouchers]);

  const alert = useAlert();

  const getVoucherStatus = useGetVoucherStatus();

  const [isAnyVoucherActive, setIsAnyVoucherActive] = useState<boolean>();
  const isAnyVoucherActiveReady = isAnyVoucherActive !== undefined;

  const getIsActive = async () => {
    for (const [, { expiry }] of voucherEntries) {
      const { isVoucherActive } = await getVoucherStatus(expiry);

      if (isVoucherActive) return true;
    }

    return false;
  };

  useEffect(() => {
    setIsAnyVoucherActive(undefined);

    if (!voucherEntries.length) return;

    getIsActive()
      .then((result) => setIsAnyVoucherActive(result))
      .catch(({ message }: Error) => alert.error(message));
  }, [voucherEntries, getVoucherStatus]);

  return { isAnyVoucherActive, isAnyVoucherActiveReady };
}

function useIsAnyAccountVoucherActive(programId: HexString | undefined) {
  const { account } = useAccount();

  return useIsAnyVoucherActive(account?.address, programId);
}

export { useIsAnyVoucherActive, useIsAnyAccountVoucherActive };
