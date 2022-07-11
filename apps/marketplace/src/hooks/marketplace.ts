import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import marketplaceMetaWasm from 'assets/wasm/marketplace.meta.wasm';
import { ADDRESS } from 'consts';
import { AuctionFormValues, MarketNFT, MarketNFTState, MarketplaceState } from 'types';
import { getMarketNFTPayload, getMilliseconds } from 'utils';

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

function useMarketplaceActions(tokenId: string, price: MarketNFT['price'] | undefined) {
  const sendMessage = useMarketplaceMessage();

  const nftContractId = ADDRESS.NFT_CONTRACT;
  const ftContractId = null;

  const buy = (onSuccess: () => void) => {
    const payload = { BuyItem: { nftContractId, tokenId } };
    const value = price?.replaceAll(',', '');

    sendMessage(payload, { value, onSuccess });
  };

  const offer = (value: string, onSuccess: () => void) => {
    const payload = { AddOffer: { nftContractId, ftContractId, tokenId, price: value } };

    sendMessage(payload, { value, onSuccess });
  };

  const bid = (value: string, onSuccess: () => void) => {
    const payload = { AddBid: { nftContractId, tokenId, price: value } };
    sendMessage(payload, { value, onSuccess });
  };

  const settle = (onSuccess: () => void) => {
    const payload = { SettleAuction: { nftContractId, tokenId } };
    sendMessage(payload, { onSuccess });
  };

  const startSale = (value: string, onSuccess: () => void) => {
    const payload = { AddMarketData: { nftContractId, ftContractId, tokenId, price: value } };

    sendMessage(payload, { value, onSuccess });
  };

  const startAuction = (values: AuctionFormValues, onSuccess: () => void) => {
    const duration = getMilliseconds(values.duration);
    const bidPeriod = getMilliseconds(values.bidPeriod);
    const { minPrice } = values;

    const payload = { CreateAuction: { nftContractId, ftContractId, tokenId, duration, bidPeriod, minPrice } };

    sendMessage(payload, { onSuccess });
  };

  return { buy, offer, bid, settle, startSale, startAuction };
}

export { useMarketplaceState, useMarketNft, useMarketplace, useMarketplaceMessage, useMarketplaceActions };
