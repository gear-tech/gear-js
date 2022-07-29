import { Hex } from '@gear-js/api';

type Auction = {
  currentPrice: string;
  discountRate: string;
  nftContractActorId: Hex;
  startingPrice: string;
  timeLeft: string;
  tokenId: string;
  tokenOwner: Hex;
  auctionOwner: Hex;
  status: string | { Purchased: { price: string } };
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

type AuctionState = { Info: Auction };
type NFTState = { Token: { token: Token } };

type Countdown = { hours: string; minutes: string; seconds: string };

export type { Auction, AuctionState, NFTState, Countdown };
