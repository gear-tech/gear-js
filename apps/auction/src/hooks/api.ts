import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import auctionMetaWasm from 'assets/wasm/auction.meta.wasm';
import { ADDRESS } from 'consts';
import { AuctionState } from 'types';

function useAuction() {
  const { state } = useReadState<AuctionState>(ADDRESS.AUCTION_CONTRACT, auctionMetaWasm);
}

function useAuctionMessage() {
  return useSendMessage(ADDRESS.AUCTION_CONTRACT, auctionMetaWasm);
}

export { useAuctionMessage };
