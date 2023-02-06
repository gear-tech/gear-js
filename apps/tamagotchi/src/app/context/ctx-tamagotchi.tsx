import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import type { LessonState, TamagotchiState } from 'app/types/lessons';
import type { StoreItemsNames } from 'app/types/ft-store';
import { getLessonAssets } from 'app/utils/get-lesson-assets';

type Program = {
  lesson?: LessonState;
  setLesson: Dispatch<SetStateAction<LessonState | undefined>>;
  tamagotchi?: TamagotchiState;
  setTamagotchi: Dispatch<SetStateAction<TamagotchiState | undefined>>;
  reset: () => void;
  lessonMeta?: ProgramMetadata;
  tamagotchiItems: StoreItemsNames[];
  setTamagotchiItems: Dispatch<SetStateAction<StoreItemsNames[]>>;
};

export const LessonsCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [lesson, setLesson] = useState<LessonState>();
  const [lessonMeta, setLessonMeta] = useState<ProgramMetadata>();
  const [tamagotchi, setTamagotchi] = useState<TamagotchiState>();
  const [tamagotchiItems, setTamagotchiItems] = useState<StoreItemsNames[]>([]);
  const isParsed = useRef(false);

  useEffect(() => {
    if (lesson) {
      localStorage.setItem('tmgState', JSON.stringify(lesson));

      fetch(getLessonAssets(+lesson.step))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setLessonMeta(meta));
    } else {
      if (!isParsed.current) {
        const ls = localStorage.getItem('tmgState');
        if (ls) {
          setLesson(JSON.parse(ls));
          isParsed.current = true;
        }
      } else localStorage.removeItem('tmgState');
    }
  }, [lesson]);

  const reset = () => {
    setLesson(undefined);
    setTamagotchi(undefined);
  };

  return {
    lesson,
    setLesson,
    lessonMeta,
    tamagotchi,
    setTamagotchi,
    reset,
    tamagotchiItems,
    setTamagotchiItems,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = LessonsCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
