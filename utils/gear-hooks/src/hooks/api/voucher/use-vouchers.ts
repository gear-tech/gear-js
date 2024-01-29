import { HexString, IVoucherDetails, decodeAddress, generateVoucherId } from '@gear-js/api';
import { useState, useEffect, useContext } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

type DeprecatedVoucherDetails = Partial<IVoucherDetails>;

function useVouchers(accountAddress: string | undefined, programId?: HexString | undefined) {
  const { api, isApiReady, isV110Runtime } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [vouchers, setVouchers] = useState<Record<HexString, IVoucherDetails | DeprecatedVoucherDetails>>();
  const isEachVoucherReady = vouchers !== undefined;

  const getDeprecatedVouchers = async (_accountAddress: string, _programId?: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const decodedAddress = decodeAddress(_accountAddress);

    if (!_programId || !(await api.voucher.exists(decodedAddress, _programId))) return {};

    const voucherId = generateVoucherId(decodedAddress, _programId);

    return { [voucherId]: {} };
  };

  const getVouchers = async (_accountAddress: string, _programId?: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const _vouchers = await api.voucher.getAllForAccount(_accountAddress);

    if (!_programId) return _vouchers;

    const entries = Object.entries(_vouchers);
    const entriesForProgram = entries.filter(([, { programs }]) => !programs.length || programs.includes(_programId));

    return Object.fromEntries(entriesForProgram);
  };

  useEffect(() => {
    setVouchers(undefined);

    if (!api || !accountAddress) return;

    const get = isV110Runtime ? getVouchers : getDeprecatedVouchers;

    get(accountAddress, programId)
      .then((result) => setVouchers(result))
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accountAddress, programId]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers(programId?: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVouchers(account?.address, programId);
}

export { useVouchers, useAccountVouchers };
export type { DeprecatedVoucherDetails };
