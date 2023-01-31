import { AnyJson } from '@polkadot/types/types';
import { useReadState } from './use-read-state';
import { useLesson, useTokensBalanceStore } from '../context';
import { BalanceLogic, BalanceMain, BalanceStorage } from '../types/ft-wallet';
import { HexString } from '@polkadot/util/types';

const payload = {};

function useReadFTMain<T>(payload: AnyJson) {
  const { metaMain, programId } = useTokensBalanceStore();
  return useReadState<T>(programId, metaMain, payload);
}

function useFTMain() {
  const { state } = useReadFTMain<BalanceMain>(payload);
  return state;
}

function useReadFTLogic<T>(payload: AnyJson) {
  const state = useFTMain();
  const { metaLogic } = useTokensBalanceStore();
  return useReadState<T>(state?.ftLogicId, metaLogic, payload);
}

function useFTLogic() {
  const { state } = useReadFTLogic<BalanceLogic>(payload);
  return state;
}

function useReadFTStorage<T>(payload: AnyJson) {
  const state = useFTLogic();
  const { lesson } = useLesson();
  const { metaStorage } = useTokensBalanceStore();
  const getStorageIdByAccount = () => {
    if (state) {
      for (const a of state.idToStorage) {
        if (a[0] === lesson?.programId.charAt(2)) {
          return a[1] as HexString;
        }
      }
    }
  };
  return useReadState<T>(getStorageIdByAccount(), metaStorage, payload);
}

export function useFTStorage() {
  const { lesson } = useLesson();
  const { state } = useReadFTStorage<BalanceStorage>(payload);
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
