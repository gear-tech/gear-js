import { HexString } from '@polkadot/util/types';

export type T1 = {
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
type T4 = {
  energy: number;
  power: number;
};

export type TamagotchiState = T1 & T2 & T3 & T4;

export type LessonState = {
  step: number;
  programId: HexString;
};
