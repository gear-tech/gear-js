import { useLesson } from '../context';
import { TamagotchiState } from '../types/lessons';
import { useEffect } from 'react';
import { useWasmMetadata } from './use-metadata';
import state2 from 'assets/meta/state2.meta.wasm';
import { useReadWasmState } from 'app/hooks/use-read-wasm-state';
import { useReadFullState } from '@gear-js/react-hooks';

type StateWasmResponse = {
  fed: number;
  entertained: number;
  rested: number;
};

export function useReadTamagotchi<T>() {
  const { lesson, meta } = useLesson();
  return useReadFullState<T>(lesson?.programId, meta);
}

export function useTamagotchi() {
  const { setTamagotchi } = useLesson();
  const { state } = useReadTamagotchi<TamagotchiState>();

  useEffect(() => {
    if (state) setTamagotchi(state);
    console.log(state);
  }, [setTamagotchi, state]);
}

export function useReadTamagotchiWasm<T>() {
  const { lesson } = useLesson();
  const metadata = useWasmMetadata(state2);
  return useReadWasmState<T>(lesson?.programId, metadata?.buffer, 'current_state');
}

export function useTamagotchiWasm() {
  const { tamagotchi, setTamagotchi } = useLesson();
  const { state } = useReadTamagotchiWasm<StateWasmResponse>();

  useEffect(() => {
    if (state) {
      setTamagotchi({ ...tamagotchi, ...state } as TamagotchiState);
      console.log('init wasm state:', { state });
    }
    const interval = setInterval(() => {
      if (state) {
        setTamagotchi({ ...tamagotchi, ...state } as TamagotchiState);
        console.log('interval wasm state:', { state });
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [state]);
}
