import { useAccount, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import { NFTState, OwnersNFTState } from 'types';
import { useWasm } from './context';

function useNftState<T>(payload: AnyJson) {
  const { nft } = useWasm();
  const { programId, metaBuffer } = nft;

  return useReadState<T>(programId, metaBuffer, payload);
}

function useNft(tokenId: string) {
  const payload = useMemo(() => ({ Token: { tokenId } }), [tokenId]);
  const { state } = useNftState<NFTState>(payload);

  return state?.Token.token;
}

function useOwnersNft() {
  const { account } = useAccount();

  const getPayload = () => (account ? { TokensForOwner: { owner: account?.decodedAddress } } : undefined);
  const payload = useMemo(getPayload, [account]);

  const { state, isStateRead } = useNftState<OwnersNFTState>(payload);
  return { NFTs: state?.TokensForOwner.tokens, isEachNFTRead: isStateRead };
}

function useNftMessage() {
  const { nft } = useWasm();
  const { programId, meta } = nft;

  return useSendMessage(programId, meta);
}

export { useNft, useOwnersNft, useNftMessage };
