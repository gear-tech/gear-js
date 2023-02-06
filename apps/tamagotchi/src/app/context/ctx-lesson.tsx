import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import type { LessonState } from 'app/types/lessons';
import { getLessonAssets } from 'app/utils/get-lesson-assets';

type Program = {
  lesson?: LessonState;
  setLesson: Dispatch<SetStateAction<LessonState | undefined>>;
  lessonMeta?: ProgramMetadata;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
};

export const LessonsCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [lesson, setLesson] = useState<LessonState>();
  const [lessonMeta, setLessonMeta] = useState<ProgramMetadata>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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

  return {
    lesson,
    setLesson,
    lessonMeta,
    isAdmin,
    setIsAdmin,
  };
};

export function LessonsProvider({ children }: { children: ReactNode }) {
  const { Provider } = LessonsCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
