import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { LessonsAll } from '../types/lessons';

type Value = {
  lesson: number;
  setLesson: Dispatch<SetStateAction<number>>;
  tamagotchi?: LessonsAll;
  setTamagotchi: Dispatch<SetStateAction<LessonsAll | undefined>>;
};

export const LessonsContext = createContext({} as Value);

const useLessons = (): Value => {
  const [lesson, setLesson] = useState<number>(1);
  const [tamagotchi, setTamagotchi] = useState<LessonsAll>();

  return {
    lesson,
    setLesson,
    tamagotchi,
    setTamagotchi,
  };
};

export function LessonsProvider({ children }: { children: ReactNode }) {
  const { Provider } = LessonsContext;
  return <Provider value={useLessons()}>{children}</Provider>;
}
