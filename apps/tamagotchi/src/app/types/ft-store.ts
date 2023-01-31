import { HexString } from '@polkadot/util/types';

export type StoreItemsNames = 'sword' | 'hat' | 'bag' | 'glasses';

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
  admin: HexString;
  attributes: Record<number, [StoreItemDescription, number]>;
  ftContractId: HexString;
  owners: Record<HexString, number[]>;
  transactionId: number;
  transactions: {};
};
