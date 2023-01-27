import { Hex } from '@gear-js/api';

export type IStoreItem = {
  id: number;
  amount: number;
  description: StoreNFTItemDescription;
};

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

export type LessonState = {
  step: number;
  programId: Hex;
};
