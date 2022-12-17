import { Hex } from '@gear-js/api';

type Params = {
  id: string;
};

export type ArtMetadata = {
  name: string,
  tokenId: string,
  ownerId: Hex,
  collectionName: string | null,
  description: string | null,
  socialNetwork: string,
  country_and_city: string[] | null,
  linkToMedia: string | null,
  coordinates: string | null,
  createdAt: string | null,
  childTokenId: string | null,
}

type Token = {
  approvedAccountIds: Hex[]; // todo: remove
  description: string;
  id: string; // todo: remove
  tokenId: string;
  // media: string;
  name: string;
  ownerId: Hex;
  reference: string; // todo: remove
  "collectionName": string,
  "socialNetwork": string,
  "countryAndCity": string[],
  "linkToMedia": string,
  "coordinates": string,
  "childTokenId": null
};

type Attributes = {
  [key: string]: string;
};

type TokenDetails = {
  rarity?: string;
  attributes?: Attributes;
};

export type { Params, Token, Attributes, TokenDetails };
