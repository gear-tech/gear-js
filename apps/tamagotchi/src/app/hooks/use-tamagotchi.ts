import { useEffect } from 'react';
import { useReadFullState, useSendMessage } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useLesson } from 'app/context';
import type { TamagotchiState } from 'app/types/lessons';

export function useReadTamagotchi<T>() {
  const { lesson, lessonMeta } = useLesson();
  return useReadFullState<T>(lesson?.programId, lessonMeta);
}

export function useTamagotchi() {
  const { setTamagotchi } = useLesson();
  const { state, isStateRead } = useReadTamagotchi<TamagotchiState>();

  useEffect(() => {
    if (state && isStateRead) {
      const { fed, rested, entertained } = state;
      setTamagotchi({ ...state, isDead: [fed, rested, entertained].reduce((sum, a) => sum + a) === 0 });
    }
    console.log('state in use', state);
  }, [state, isStateRead]);
}

export function useTamagotchiMessage() {
  const { lesson, lessonMeta } = useLesson();
  return useSendMessage(lesson?.programId as HexString, lessonMeta);
}
