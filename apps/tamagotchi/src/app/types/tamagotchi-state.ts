import { LessonsAll } from './lessons';
import { Hex } from '@gear-js/api';

export type StoreNFTItemDescription = {
  description: string;
  media: string;
  title: string;
};

export type StoreNFTItem = [StoreNFTItemDescription, number];

export type StoreNFT = {
  admin: Hex;
  attributes: Record<string, StoreNFTItem>;
  ftContractId: Hex;
  owners: {};
  transactionId: number;
  transactions: {};
};

export type TmgState = {
  lesson: number;
  tamagotchi?: LessonsAll;
  programId: Hex;
  isDirty?: boolean;
  store?: StoreNFT;
};
