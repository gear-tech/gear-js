import { Hex } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

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

interface Account extends InjectedAccountWithMeta {
  decodedAddress: Hex;
  balance: { value: string; unit: string };
}

export type { NFT, NFTDetails, Offer, MarketNFT, Account };
