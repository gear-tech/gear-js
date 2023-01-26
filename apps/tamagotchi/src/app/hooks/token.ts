import { useMemo } from 'react';
import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useReadState } from './use-read-state';
import { useTokensBalanceStore } from '../context';

type Balance = {
  admin: Hex;
  ftLogicId: Hex;
  transactions: [];
};
type BalanceLogic = {
  admin: Hex;
  ftLogicId: Hex;
  transactions: [];
  ftokenId: Hex;
  idToStorage: Array<[string, Hex]>;
  instructions: [];
  storageCodeHash: Hex;
  transactionStatus: [];
};
type BalanceStorage = {
  approvals: [];
  balances: Array<[Hex, number]>;
  ftLogicId: Hex;
  transactionStatus: [];
};

function useReadFTMain<T>(payload: AnyJson) {
  const { metaMain, programId } = useTokensBalanceStore();
  return useReadState<T>(programId, metaMain, payload);
}
function useFTMain() {
  const payload = useMemo(() => ({}), []);
  const { state } = useReadFTMain<Balance>(payload);
  return state;
}
function useReadFTLogic<T>(payload: AnyJson) {
  const state = useFTMain();
  const { metaLogic } = useTokensBalanceStore();
  return useReadState<T>(state?.ftLogicId, metaLogic, payload);
}
function useFTLogic() {
  const payload = useMemo(() => ({}), []);
  const { state } = useReadFTLogic<BalanceLogic>(payload);
  return state;
}
function useReadFTStorage<T>(payload: AnyJson) {
  const state = useFTLogic();
  const { account } = useAccount();
  const { metaStorage } = useTokensBalanceStore();
  const getStorageIdByAccount = () => {
    if (state) {
      for (const a of state.idToStorage) {
        if (a[0] === account?.decodedAddress.charAt(0)) {
          return a[1] as Hex;
        }
      }
    }
  };
  return useReadState<T>(getStorageIdByAccount(), metaStorage, payload);
}
export function useFTStorage() {
  const payload = useMemo(() => ({}), []);
  const { account } = useAccount();
  const { state } = useReadFTStorage<BalanceStorage>(payload);

  const getBalanceByAccountId = () => {
    if (state) {
      for (const a of state.balances) {
        if (a[0] === account?.decodedAddress) {
          return a[1] as number;
        }
      }
    }
    return 0;
  };
  return getBalanceByAccountId();
}
