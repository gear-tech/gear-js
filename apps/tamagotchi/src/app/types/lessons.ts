import { Hex } from '@gear-js/api';

type T1 = {
  name: string;
  dateOfBirth: number;
};

type T2 = {
  entertained: number;
  entertainedBlock: number;
  fed: number;
  fedBlock: number;
  owner: string;
  rested: number;
  restedBlock: number;
};

type T3 = {
  allowedAccount: string;
};

export type TamagotchiState = T1 & T2 & T3;

export type LessonState = {
  step: number;
  programId: Hex;
};
