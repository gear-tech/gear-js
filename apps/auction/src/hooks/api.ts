import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { Hex } from '@gear-js/api';
import { useMemo } from 'react';
import { AuctionState, NFTState } from 'types';
import { useWasm } from './context';

function useAuction() {
  const { auction } = useWasm();
  const { programId, metaBuffer } = auction;

  const payload = useMemo(() => ({ Info: null }), []);
  const { state } = useReadState<AuctionState>(programId, metaBuffer, payload);

  return state?.Info;
}

function useNft(address: Hex | undefined, tokenId: string | undefined) {
  const isAddress = !address?.startsWith('0x00');

  const { nft } = useWasm();
  const { metaBuffer } = nft;

  const payload = useMemo(() => ({ Token: { tokenId } }), [tokenId]);
  const { state, isStateRead } = useReadState<NFTState>(isAddress ? address : undefined, metaBuffer, payload);

  return { nft: state?.Token.token, isNftStateRead: isStateRead };
}

function useAuctionMessage() {
  const { auction } = useWasm();
  const { programId, meta } = auction;

  return useSendMessage(programId, meta);
}

function useNftMessage(address: Hex) {
  const { nft } = useWasm();
  const { meta } = nft;

  return useSendMessage(address, meta);
}

export { useAuction, useNft, useAuctionMessage, useNftMessage };
