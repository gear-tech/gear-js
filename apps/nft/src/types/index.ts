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

type TokenDetails = {
  rarity?: string;
  attributes?: { [key: string]: string };
};

export type { Params, Token, TokenDetails };
