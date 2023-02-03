import { useReadFullState } from '@gear-js/react-hooks';
import type { HexString } from '@polkadot/util/types';
import { useLesson, useTokensBalanceStore } from 'app/context';
import { BalanceLogic, BalanceMain, BalanceStorage } from 'app/types/ft-wallet';
import { useFtMessage } from './use-ft-message';
import { useMetadata } from './use-metadata';
import metaCode from '../../assets/meta/meta-ft-code.txt';

function useReadFTMain<T>() {
  const { metaMain, programId } = useTokensBalanceStore();
  return useReadFullState<T>(programId, metaMain);
}

function useFTMain() {
  const { state } = useReadFTMain<BalanceMain>();
  return state;
}

function useReadFTLogic<T>() {
  const state = useFTMain();
  const { metaLogic } = useTokensBalanceStore();
  return useReadFullState<T>(state?.ftLogicId, metaLogic);
}

function useFTLogic() {
  const { state } = useReadFTLogic<BalanceLogic>();
  return state;
}

function useReadFTStorage<T>() {
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
  return useReadFullState<T>(getStorageIdByAccount(), metaStorage);
}

export function useFTStorage() {
  const { lesson } = useLesson();
  const { state } = useReadFTStorage<BalanceStorage>();
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

export function useGetFTBalance() {
  const { lesson } = useLesson();
  const sendHandler = useFtMessage();
  const { metadata } = useMetadata(metaCode);
  const balance = useFTStorage();

  const handler = (cb?: () => void) => {
    const encodedMint = metadata
      ?.createType(9, {
        Mint: {
          amount: 5000,
          recipient: lesson?.programId,
        },
      })
      .toU8a();

    const onSuccess = () => cb && cb();

    if (encodedMint) {
      sendHandler(
        { Message: { transaction_id: Math.floor(Math.random() * Date.now()), payload: [...encodedMint] } },
        { onSuccess },
      );
    }
  };

  return { balance, handler };
}
