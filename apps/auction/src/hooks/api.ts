import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import auctionMetaWasm from 'assets/wasm/dutch_auction.meta.wasm';
import nftMetaWasm from 'assets/wasm/nft.meta.wasm';
import { ADDRESS } from 'consts';
import { AuctionState, NFTState } from 'types';
import { Hex } from '@gear-js/api';

function useAuction() {
  const payload = useMemo(() => ({ Info: null }), []);
  const { state } = useReadState<AuctionState>(ADDRESS.AUCTION_CONTRACT, auctionMetaWasm, payload);

  return state?.Info;
}

function useNft(address: Hex | undefined, tokenId: string | undefined) {
  const isAddress = !address?.startsWith('0x00');

  const payload = useMemo(() => ({ Token: { tokenId } }), [tokenId]);
  const { state, isStateRead } = useReadState<NFTState>(isAddress ? address : undefined, nftMetaWasm, payload);

  return { nft: state?.Token.token, isNftStateRead: isStateRead };
}

function useAuctionMessage() {
  return useSendMessage(ADDRESS.AUCTION_CONTRACT, auctionMetaWasm);
}

function useNftMessage(address: Hex) {
  return useSendMessage(address, nftMetaWasm);
}

export { useAuction, useNft, useAuctionMessage, useNftMessage };
