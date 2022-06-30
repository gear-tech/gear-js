import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import marketplaceMetaWasm from 'assets/wasm/marketplace.meta.wasm';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useMemo } from 'react';
import { MarketNFT } from 'types';

type MarketplaceState = { AllItems: MarketNFT[] };
type NFTState = { ItemInfo: MarketNFT };

function useMarketplaceState<T>(payload: AnyJson) {
  return useReadState<T>(MARKETPLACE_CONTRACT_ADDRESS, marketplaceMetaWasm, payload);
}

function useMarketplace() {
  const payload = useMemo(() => ({ AllItems: null }), []);
  const { state, isStateRead } = useMarketplaceState<MarketplaceState>(payload);

  return { NFTs: state?.AllItems, isEachNFTRead: isStateRead };
}

function useMarketNft(tokenId: string) {
  const payload = useMemo(() => ({ ItemInfo: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId } }), [tokenId]);
  const { state } = useMarketplaceState<NFTState>(payload);

  return state?.ItemInfo;
}

function useMarketplaceMessage() {
  return useSendMessage(MARKETPLACE_CONTRACT_ADDRESS, marketplaceMetaWasm);
}

export { useMarketplaceState, useMarketNft, useMarketplace, useMarketplaceMessage };
