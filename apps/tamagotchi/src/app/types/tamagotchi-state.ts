import { LessonsAll } from './lessons';
import { Hex } from '@gear-js/api';

export type TmgState = {
  lesson: number;
  tamagotchi?: LessonsAll;
  programId: Hex;
};
