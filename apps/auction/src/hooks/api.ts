import { useSendMessage } from '@gear-js/react-hooks';
import auctionMetaWasm from 'assets/wasm/auction.meta.wasm';
import { ADDRESS } from 'consts';

function useAuctionMessage() {
  return useSendMessage(ADDRESS.AUCTION_CONTRACT, auctionMetaWasm);
}

export { useAuctionMessage };
