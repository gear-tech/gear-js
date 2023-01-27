import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import type { LessonState } from 'app/types/lessons';
import type { TamagotchiState } from 'app/types/lessons';
import { getProgramMetadata, Hex, MessagesDispatched, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from '../utils/get-lesson-assets';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useMetadata } from '../hooks/use-metadata';
import metaStore from '../../assets/meta/meta-store.txt';
import { ENV } from '../consts';

type ItemsStoreType = {
  programId: Hex;
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

  const { api } = useApi();
  const alert = useAlert();
  const [error, setError] = useState('');
  const [isStateRead, setIsStateRead] = useState(true);

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

      fetch(getLessonAssets(Number(lesson?.step)))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setMeta(meta));
    } else if (isParsed.current) {
      localStorage.removeItem('tmgState');
    }
  }, [lesson]);

  useEffect(() => {
    readState(true);
    setError('');
  }, [lesson, meta, api]);

  const readState = (isInitLoad?: boolean) => {
    if (lesson && meta && api) {
      const { programId } = lesson;
      if (isInitLoad) setIsStateRead(false);

      api.programState
        .read({ programId }, meta)
        .then((codecState) => codecState.toJSON() as TamagotchiState)
        .then((result) => {
          setTamagotchi(result);
          setIsStateRead(true);
        })
        .catch(({ message }: Error) => {
          setError(message);
          reset();
        });
    }
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api && lesson?.programId) {
      unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', ({ data }: MessagesDispatched) => {
        const changedIDs = data.stateChanges.toHuman() as Hex[];
        const isAnyChange = changedIDs.some((id) => id === lesson?.programId);

        if (isAnyChange) readState();
      });
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, lesson?.programId]);

  useEffect(() => {
    if (error) alert.error(error);
  }, [error]);

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
