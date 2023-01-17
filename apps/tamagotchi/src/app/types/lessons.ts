import { ProgramMetadata } from '@gear-js/api';

type Lesson1 = {
  name: string;
  dateOfBirth: number;
};

type Lesson2 = {
  // name: string;
  // dateOfBirth: number;
  entertained: number;
  entertainedBlock: number;
  fed: number;
  fedBlock: number;
  owner: string;
  rested: number;
  restedBlock: number;
};

type Lesson3 = {
  allowedAccount: string;
};

export type LessonsAll = Lesson1 & Lesson2 & Lesson3;

export type LessonMetadataResponse = {
  tamagotchi: ProgramMetadata;
  store?: ProgramMetadata;
};
