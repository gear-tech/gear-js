import { Hex } from '@gear-js/api';

type BaseNFT = {
  id: string;
  name: string;
  description: string;
  media: string;
  reference: string;
  ownerId: Hex;
  approvedAccountIds: Hex[];
};

type NFTDetails = {
  royalty: number;
  rarity: string;
  attributes: { [key: string]: string };
};

type Offer = {
  id: Hex;
  price: string;
  hash_?: Hex;
  ftContractId?: Hex | null;
};

type Auction = {
  bidPeriod: string;
  bids: Offer[];
  currentPrice: string;
  endedAt: string;
  startedAt: string;
};

type MarketNFT = {
  ownerId: Hex;
  nftContractId: Hex | null;
  ftContractId: Hex | null;
  tokenId: string;
  price: string | null;
  auction: Auction | null;
  offers: Offer[];
};

type NFT = BaseNFT & MarketNFT;

type MarketplaceState = { AllItems: MarketNFT[] };
type MarketNFTState = { ItemInfo: MarketNFT };
type NFTState = { Token: { token: BaseNFT } };
type OwnersNFTState = { TokensForOwner: { tokens: BaseNFT[] } };

type Filter = {
  value: string;
  list: string[];
  onChange: (filter: string) => void;
};

export type {
  BaseNFT,
  NFTDetails,
  Offer,
  MarketNFT,
  NFT,
  MarketplaceState,
  MarketNFTState,
  NFTState,
  OwnersNFTState,
  Filter,
};
