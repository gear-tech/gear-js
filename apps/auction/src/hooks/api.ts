import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import auctionMetaWasm from 'assets/wasm/auction.meta.wasm';
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
  const payload = useMemo(() => ({ Token: { tokenId } }), [tokenId]);
  const { state } = useReadState<NFTState>(address, nftMetaWasm, payload);

  return state?.Token.token;
}

function useAuctionMessage() {
  return useSendMessage(ADDRESS.AUCTION_CONTRACT, auctionMetaWasm);
}

export { useAuction, useNft, useAuctionMessage };
