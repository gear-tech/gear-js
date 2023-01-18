import { ProgramMetadata } from '@gear-js/api';

type Tamagotchi1 = {
  name: string;
  dateOfBirth: number;
};

type Tamagotchi2 = {
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

type Tamagotchi3 = {
  allowedAccount: string;
};

export type TamagotchiState = Tamagotchi1 & Tamagotchi2 & Tamagotchi3;

export type LessonMetadataResponse = {
  tamagotchi: ProgramMetadata;
  store?: ProgramMetadata;
};
