import { Hex } from '@gear-js/api';

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

export type { Token, TokenDetails };
