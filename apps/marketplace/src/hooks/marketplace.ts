import { Hex } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { marketplaceMetaWasm } from 'assets';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useMemo } from 'react';
import { MarketNFT } from 'types';
import { useMessage, useMetadata, useReadState } from './api';

type NFTPayload = { ItemInfo: { nftContractId: Hex; tokenId: string } };
type NFTState = { ItemInfo: MarketNFT };

type NFTsPayload = { AllItems: null };
type NFTsState = { AllItems: MarketNFT[] };

function useMarketplaceMeta() {
  const { metadata, metaBuffer } = useMetadata(marketplaceMetaWasm);

  return { marketplaceMeta: metadata, marketplaceMetaBuffer: metaBuffer };
}

function useMarketplaceState(payload: NFTPayload): NFTState | undefined;
function useMarketplaceState(payload: NFTsPayload): NFTsState | undefined;
function useMarketplaceState(payload: AnyJson) {
  const { marketplaceMetaBuffer } = useMarketplaceMeta();
  const marketplaceState = useReadState(MARKETPLACE_CONTRACT_ADDRESS, marketplaceMetaBuffer, payload);

  return marketplaceState;
}

function useMarketNft(tokenId: string) {
  const payload = useMemo(() => ({ ItemInfo: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId } }), [tokenId]);
  const state = useMarketplaceState(payload);
  return state?.ItemInfo;
}

function useMarketplace() {
  const payload = useMemo(() => ({ AllItems: null }), []);
  const state = useMarketplaceState(payload);
  return state?.AllItems;
}

function useMarketplaceMessage() {
  const { marketplaceMeta } = useMarketplaceMeta();
  return useMessage(MARKETPLACE_CONTRACT_ADDRESS, marketplaceMeta);
}

export { useMarketplaceMeta, useMarketplaceState, useMarketNft, useMarketplace, useMarketplaceMessage };
