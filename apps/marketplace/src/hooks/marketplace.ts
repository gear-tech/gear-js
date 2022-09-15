import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import { AuctionFormValues, MarketNFT, MarketNFTState, MarketplaceState } from 'types';
import { getMilliseconds } from 'utils';
import { useWasm } from './context';

function useMarketplaceState<T>(payload: AnyJson) {
  const { marketplace } = useWasm();
  const { programId, metaBuffer } = marketplace || {};

  return useReadState<T>(programId, metaBuffer, payload);
}

function useMarketplace() {
  const payload = useMemo(() => ({ AllItems: null }), []);
  const { state, isStateRead } = useMarketplaceState<MarketplaceState>(payload);

  return { NFTs: state?.AllItems, isEachNFTRead: isStateRead };
}

function useGetMarketNftPayload() {
  const { nft } = useWasm();
  const nftContractId = nft.programId;

  return (tokenId: string) => ({ ItemInfo: { nftContractId, tokenId } });
}

function useMarketNft(tokenId: string) {
  const getMarketNFTPayload = useGetMarketNftPayload();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const payload = useMemo(() => getMarketNFTPayload(tokenId), [tokenId]);

  const { state } = useMarketplaceState<MarketNFTState>(payload);

  return state?.ItemInfo;
}

function useMarketplaceMessage() {
  const { marketplace } = useWasm();
  const { programId, meta } = marketplace;

  return useSendMessage(programId, meta);
}

function useMarketplaceActions(tokenId: string, price: MarketNFT['price'] | undefined) {
  const sendMessage = useMarketplaceMessage();
  const { nft } = useWasm();

  const nftContractId = nft.programId;
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

export {
  useMarketplaceState,
  useGetMarketNftPayload,
  useMarketNft,
  useMarketplace,
  useMarketplaceMessage,
  useMarketplaceActions,
};
