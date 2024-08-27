import { HexString, ProgramMetadata, decodeAddress } from '@gear-js/api';
import {
  getTypedEntries,
  useAccount,
  useBalance,
  useProgramQuery,
  useReadFullState,
  useVouchers,
} from '@gear-js/react-hooks';
import { useMemo, useEffect, useState } from 'react';

import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';

import { SIGNLESS_STORAGE_KEY } from './consts';
import { getUnlockedPair } from '../utils';
import { getStorage } from './utils';
import { BaseProgram, Session, State } from './types';

function useMetadataSession(programId: HexString, metadata: ProgramMetadata | undefined) {
  const { account } = useAccount();

  const payload = useMemo(() => ({ SessionForTheAccount: account?.decodedAddress }), [account]);
  const { state } = useReadFullState<State>(programId, metadata, payload);

  const session = state?.SessionForTheAccount;
  const isSessionReady = session !== undefined;
  const isSessionActive = Boolean(session);

  return { session, isSessionReady, isSessionActive };
}

function useSailsSession(program: BaseProgram) {
  const { account } = useAccount();
  const { data: responseSession } = useProgramQuery({
    program,
    serviceName: 'session',
    functionName: 'sessionForTheAccount',
    args: [account?.decodedAddress || ''],
    watch: true,
  });

  const isSessionReady = responseSession !== undefined;
  const isSessionActive = Boolean(responseSession);

  if (!responseSession) {
    return { session: responseSession, isSessionReady, isSessionActive };
  }

  const { key, expires, allowed_actions } = responseSession;
  const session = { key: key as HexString, expires: String(expires), allowedActions: allowed_actions };

  return { session, isSessionReady, isSessionActive };
}

function useLatestVoucher(programId: HexString, address: string | undefined) {
  const decodedAddress = address ? decodeAddress(address) : '';
  const { vouchers } = useVouchers(decodedAddress, programId);

  const typedEntries = getTypedEntries(vouchers || {});

  const latestVoucher = useMemo(() => {
    if (!vouchers || !typedEntries?.length) return undefined;

    const [[id, voucher]] = typedEntries.sort(([, voucher], [, nextVoucher]) => nextVoucher.expiry - voucher.expiry);

    return { ...voucher, id };
  }, [vouchers]);

  return latestVoucher;
}

function usePair(programId: HexString, session?: Session | null) {
  const { account } = useAccount();
  const [pair, setPair] = useState<KeyringPair>();
  const voucher = useLatestVoucher(programId, pair?.address);
  const { balance } = useBalance(voucher?.id);
  const voucherBalance = balance ? balance.toNumber() : 0;

  // there's probably a better way to handle storage voucher, since we may not need it in a context
  const [storagePair, setStoragePair] = useState(account ? getStorage()[account.address] : undefined);
  const storageVoucher = useLatestVoucher(programId, storagePair?.address);
  const { balance: _storageVoucherBalance } = useBalance(storageVoucher?.id);
  const storageVoucherBalance = _storageVoucherBalance ? _storageVoucherBalance.toNumber() : 0;

  const [isLoading, setIsLoading] = useState(false);
  const isActive = Boolean(pair);

  const unlockPair = (password: string) => {
    if (!storagePair) throw new Error('Pair not found');

    const result = getUnlockedPair(storagePair, password);

    setPair(result);
  };

  const setPairToStorage = (value: KeyringPair$Json | undefined) => {
    if (!account) throw new Error('No account address');

    const storage = { ...getStorage(), [account.address]: value };

    localStorage.setItem(SIGNLESS_STORAGE_KEY, JSON.stringify(storage));
    setStoragePair(value);
  };

  useEffect(() => {
    if (!account) return setStoragePair(undefined);

    setStoragePair(getStorage()[account.address]);
  }, [account]);

  const savePair = (value: KeyringPair, password: string) => {
    setPairToStorage(value.toJson(password));
    setPair(value);
  };

  const deletePair = () => {
    setPairToStorage(undefined);
    setPair(undefined);
  };

  useEffect(() => {
    if (session) return;

    setPair(undefined);
  }, [session]);

  useEffect(() => {
    setPair(undefined);
  }, [account]);

  return {
    pair,
    storagePair,
    savePair,
    deletePair,
    unlockPair,
    voucherBalance,
    voucher,
    isLoading,
    setIsLoading,
    isActive,
    storageVoucher,
    storageVoucherBalance,
  };
}

export { useMetadataSession, useSailsSession, useLatestVoucher, usePair };
