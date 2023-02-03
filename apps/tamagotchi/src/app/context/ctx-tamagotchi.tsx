import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import type { LessonState, NotificationType } from 'app/types/lessons';
import type { TamagotchiState } from 'app/types/lessons';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from '../utils/get-lesson-assets';
import { useMetadata } from '../hooks/use-metadata';
import metaStore from '../../assets/meta/meta-store.txt';
import { ENV } from '../consts';
import { HexString } from '@polkadot/util/types';
import { NotificationResponseTypes } from 'app/types/lessons';

type ItemsStoreType = {
  programId: HexString;
  meta: ProgramMetadata;
};

type Program = {
  lesson?: LessonState;
  setLesson: Dispatch<SetStateAction<LessonState | undefined>>;
  notification: NotificationType;
  setNotification: Dispatch<SetStateAction<NotificationType>>;
  activeNotification?: NotificationResponseTypes;
  setActiveNotification: Dispatch<SetStateAction<NotificationResponseTypes | undefined>>;
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
  const [notification, setNotification] = useState<NotificationType>([]);
  const [activeNotification, setActiveNotification] = useState<NotificationResponseTypes>();

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

  useEffect(() => {
    if (notification.length > 0) {
      setActiveNotification(notification.reduce((el, prev) => (el[1] < prev[1] ? el : prev))[0]);
    } else setActiveNotification(undefined);
  }, [tamagotchi, notification]);

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
    notification,
    setNotification,
    activeNotification,
    setActiveNotification,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = LessonsCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
