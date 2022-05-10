import { Hex } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { marketplaceMetaWasm } from 'assets';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useMetadata, useReadState } from './api';

type Offer = {
  id: Hex;
  price: string;
};

type Auction = {
  bidPeriod: string;
  bids: Offer[];
  currentPrice: string;
  endedAt: string;
  startedAt: string;
};

type NFT = {
  ownerId: Hex;
  nftContractId: Hex | null;
  ftContractId: Hex | null;
  tokenId: string;
  price: string | null;
  auction: Auction | null;
  offers: Offer[];
};

type NFTPayload = { ItemInfo: { nftContractId: Hex; tokenId: string } };
type NFTState = { ItemInfo: NFT };

function useMarketplaceMeta() {
  const { metadata, metaBuffer } = useMetadata(marketplaceMetaWasm);

  return { marketplaceMeta: metadata, marketplaceMetaBuffer: metaBuffer };
}

function useMarketplaceState(payload: NFTPayload): NFTState | undefined;
function useMarketplaceState(payload: AnyJson) {
  const { marketplaceMetaBuffer } = useMarketplaceMeta();
  const marketplaceState = useReadState(MARKETPLACE_CONTRACT_ADDRESS, marketplaceMetaBuffer, payload);

  return marketplaceState;
}

function useMarketNft(tokenId: string) {
  const state = useMarketplaceState({ ItemInfo: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId } });
  return state?.ItemInfo;
}

export { useMarketplaceMeta, useMarketplaceState, useMarketNft };
