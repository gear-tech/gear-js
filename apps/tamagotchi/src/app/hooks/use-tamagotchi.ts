import { useLesson } from '../context';
import { TamagotchiState } from '../types/lessons';
import { useEffect } from 'react';
import { useReadFullState } from '@gear-js/react-hooks';

export function useReadTamagotchi<T>() {
  const { lesson, meta } = useLesson();
  return useReadFullState<T>(lesson?.programId, meta);
}

export function useTamagotchi() {
  const { setTamagotchi } = useLesson();
  const { state } = useReadTamagotchi<TamagotchiState>();

  useEffect(() => {
    // state ? setTamagotchi(state) : reset();
    if (state) setTamagotchi(state);
    // console.log('state in use', state);
  }, [state]);
}
