interface MarketplaceBasePayload {
  nftContractId: string;
  tokenId: number;
}

export interface MintedPayload {
  tokenId: number;
  owner: string;
  tokenMetadata: {
    name: string;
    description: string;
    media: string;
    reference: string;
  };
}

export type BurntPayload = Pick<MintedPayload, 'tokenId'>;

export interface TransferPayload {
  from: string;
  to: string;
  tokenId: number;
}

export interface MarketDataAddedPayload extends MarketplaceBasePayload {
  ftContractId: null | string;
  price: null | number;
}

export interface ItemSoldPayload extends MarketplaceBasePayload {
  price: number;
}

export interface AuctionCreatedPayload extends MarketplaceBasePayload {
  ftContractId: null | string;
  price: number;
}

export interface BidAddedPayload extends MarketplaceBasePayload, Pick<AuctionCreatedPayload, 'price'> {}

export interface AuctionSettledPayload extends MarketplaceBasePayload, Pick<AuctionCreatedPayload, 'price'> {
  newOwner: string;
}

export interface OfferAddedPayload extends MarketplaceBasePayload {
  ftContractId: null | string;
  price: number;
}

export type OfferCancelledPayload = OfferAddedPayload;

export interface OfferAcceptedPayload extends OfferAddedPayload {
  newOwner: string;
}
