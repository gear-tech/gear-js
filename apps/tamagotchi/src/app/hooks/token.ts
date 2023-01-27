import { useMemo } from 'react';
import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useReadState } from './use-read-state';
import { useLesson, useTokensBalanceStore } from '../context';

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
  // console.log({ state });
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
  const { lesson } = useLesson();
  const { metaStorage } = useTokensBalanceStore();
  // console.log('logic: ', { state });
  const getStorageIdByAccount = () => {
    if (state) {
      for (const a of state.idToStorage) {
        if (a[0] === lesson?.programId.charAt(2)) {
          return a[1] as Hex;
        }
      }
    }
  };
  return useReadState<T>(getStorageIdByAccount(), metaStorage, payload);
}
export function useFTStorage() {
  const payload = useMemo(() => ({}), []);
  const { lesson } = useLesson();
  const { state } = useReadFTStorage<BalanceStorage>(payload);

  // console.log('storage: ', { state });
  const getBalanceByAccountId = () => {
    if (state) {
      for (const a of state.balances) {
        if (a[0] === lesson?.programId) {
          return a[1] as number;
        }
      }
    }
    return 0;
  };
  return getBalanceByAccountId();
}
