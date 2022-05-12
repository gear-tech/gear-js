import { Hex } from '@gear-js/api';

type NFT = {
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
  hash_: Hex;
  id: Hex;
  ftContractId: Hex | null;
  price: string;
};

type Bid = Omit<Offer, 'hash_' | 'ftContractId'>;

type Auction = {
  bidPeriod: string;
  bids: Bid[];
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

export type { NFT, NFTDetails, MarketNFT };
