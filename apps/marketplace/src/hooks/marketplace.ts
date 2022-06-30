import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import marketplaceMetaWasm from 'assets/wasm/marketplace.meta.wasm';
import { ADDRESS } from 'consts';
import { MarketNFTState, MarketplaceState } from 'types';
import { getMarketNFTPayload } from 'utils';

function useMarketplaceState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.MARKETPLACE_CONTRACT, marketplaceMetaWasm, payload);
}

function useMarketplace() {
  const payload = useMemo(() => ({ AllItems: null }), []);
  const { state, isStateRead } = useMarketplaceState<MarketplaceState>(payload);

  return { NFTs: state?.AllItems, isEachNFTRead: isStateRead };
}

function useMarketNft(tokenId: string) {
  const payload = useMemo(() => getMarketNFTPayload(tokenId), [tokenId]);
  const { state } = useMarketplaceState<MarketNFTState>(payload);

  return state?.ItemInfo;
}

function useMarketplaceMessage() {
  return useSendMessage(ADDRESS.MARKETPLACE_CONTRACT, marketplaceMetaWasm);
}

export { useMarketplaceState, useMarketNft, useMarketplace, useMarketplaceMessage };
