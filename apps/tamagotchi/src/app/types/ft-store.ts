import { Hex } from '@gear-js/api';

type StoreItemDescription = {
  description: string;
  media: string;
  title: string;
};

export type StoreItemType = {
  id: number;
  amount: number;
  description: StoreItemDescription;
};

export type ItemsStoreResponse = {
  admin: Hex;
  attributes: Record<number, [StoreItemDescription, number]>;
  ftContractId: Hex;
  owners: Record<Hex, number[]>;
  transactionId: number;
  transactions: {};
};
