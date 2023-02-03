import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import type { LessonState } from 'app/types/lessons';
import type { TamagotchiState } from 'app/types/lessons';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from '../utils/get-lesson-assets';
import { useMetadata } from '../hooks/use-metadata';
import metaStore from '../../assets/meta/meta-store.txt';
import { ENV } from '../consts';
import { HexString } from '@polkadot/util/types';

type ItemsStoreType = {
  programId: HexString;
  meta: ProgramMetadata;
};

type Program = {
  lesson?: LessonState;
  setLesson: Dispatch<SetStateAction<LessonState | undefined>>;
  tamagotchi?: TamagotchiState;
  setTamagotchi: Dispatch<SetStateAction<TamagotchiState | undefined>>;
  isFetched: boolean;
  setIsFetched: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
  meta?: ProgramMetadata;
  tamagotchiItems: number[];
  setTamagotchiItems: Dispatch<SetStateAction<number[]>>;
  store: ItemsStoreType;
};

export const LessonsCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [lesson, setLesson] = useState<LessonState>();
  const [store, setStore] = useState<ItemsStoreType>({} as ItemsStoreType);
  const [tamagotchi, setTamagotchi] = useState<TamagotchiState>();
  const [tamagotchiItems, setTamagotchiItems] = useState<number[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [meta, setMeta] = useState<ProgramMetadata>();
  const isParsed = useRef(false);

  const { metadata: mStore } = useMetadata(metaStore);

  useEffect(() => {
    if (mStore) {
      setStore({
        programId: ENV.store,
        meta: mStore,
      });
    }
  }, [mStore]);

  const reset = () => {
    setLesson(undefined);
    setTamagotchi(undefined);
    setIsFetched(false);
  };

  useEffect(() => {
    const ls = localStorage.getItem('tmgState');
    if (ls) {
      setLesson(JSON.parse(ls));
      isParsed.current = true;
    }
  }, []);

  useEffect(() => {
    if (lesson) {
      console.log('set');
      localStorage.setItem('tmgState', JSON.stringify(lesson));

      fetch(getLessonAssets(+lesson.step))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setMeta(meta));
    } else if (isParsed.current) {
      localStorage.removeItem('tmgState');
    }
  }, [lesson]);

  return {
    lesson,
    setLesson,
    tamagotchi,
    setTamagotchi,
    isFetched,
    setIsFetched,
    reset,
    meta,
    tamagotchiItems,
    setTamagotchiItems,
    store,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = LessonsCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
