import { HexString } from '@polkadot/util/types';

export type StoreItemsNames = 'sword' | 'hat' | 'bag' | 'glasses';

type StoreItemDescription = {
  description: string;
  media: StoreItemsNames;
  title: string;
};

export type StoreItemType = {
  id: number;
  amount: number;
  description: StoreItemDescription;
  isBought: boolean;
};

export type ItemsStoreResponse = {
  admin: HexString;
  attributes: Record<number, [StoreItemDescription, number]>;
  ftContractId: HexString;
  owners: Record<HexString, number[]>;
  transactionId: number;
  transactions: {};
};
