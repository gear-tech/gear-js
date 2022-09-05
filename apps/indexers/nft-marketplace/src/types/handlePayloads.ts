export interface MintHandler {
  id: string;
  tokenId: string;
  nftContract: string;
  owner: string;
  name: string;
  description: string;
  media: string;
  reference: string;
}

export interface BurnHandler {
  tokenId: string;
}

export interface TransferHandler {
  tokenId: string;
  id: string;
  to: string;
  timestamp: number;
  from?: string;
  price?: number;
}

export interface ListTokenHandler {
  tokenId: string;
  price: null | number;
}

export interface ItemSoldHandler extends Required<Omit<TransferHandler, 'from' | 'to'>> {
  newOwner: string;
}

export interface NewAuctionHandler {
  id: string;
  tokenId: string;
  price: number;
  timestamp: number;
  ftContract: string | null;
}

export interface NewBidHandler {
  id: string;
  tokenId: string;
  price: number;
}

export interface SettleAuctionHandler {
  tokenId: string;
  newOwner: string;
  price: number;
  id: string;
  timestamp: number;
}

export interface AddOfferHandler {
  id: string;
  tokenId: string;
  price: number;
  account: string;
  timestamp: number;
}

export interface AcceptOfferHandler {
  id: string;
  tokenId: string;
  newOwner: string;
  price: number;
  timestamp: number;
}

export interface CancelOfferHandler {
  tokenId: string;
  price: number;
}
