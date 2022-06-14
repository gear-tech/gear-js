import { Hex } from '@gear-js/api';

type Params = {
  id: string;
};

type Token = {
  approvedAccountIds: Hex[];
  description: string;
  id: string;
  media: string;
  name: string;
  ownerId: Hex;
  reference: string;
};

type Attributes = {
  [key: string]: string;
};

type TokenDetails = {
  rarity?: string;
  attributes?: Attributes;
};

export type { Params, Token, Attributes, TokenDetails };
