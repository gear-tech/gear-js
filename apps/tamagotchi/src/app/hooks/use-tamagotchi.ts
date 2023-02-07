import { useEffect } from 'react';
import { useAccount, useReadFullState, useSendMessage } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useLessons, useTamagotchi } from 'app/context';
import type { TamagotchiState } from 'app/types/lessons';

export function useReadTamagotchi<T>() {
  const { lesson, lessonMeta } = useLessons();
  return useReadFullState<T>(lesson?.programId, lessonMeta);
}

export function useInitTamagotchi() {
  const { account } = useAccount();
  const { setTamagotchi } = useTamagotchi();
  const { setIsAdmin } = useLessons();
  const { state, isStateRead } = useReadTamagotchi<TamagotchiState>();

  useEffect(() => {
    if (state && isStateRead && account) {
      const { fed, rested, entertained, owner, allowedAccount } = state;
      setTamagotchi({ ...state, isDead: [fed, rested, entertained].reduce((sum, a) => sum + a) === 0 });
      const { decodedAddress } = account;
      setIsAdmin([owner, allowedAccount].includes(decodedAddress));
    }
  }, [state, isStateRead, account]);
}

export function useTamagotchiMessage() {
  const { lesson, lessonMeta } = useLessons();
  return useSendMessage(lesson?.programId as HexString, lessonMeta);
}
