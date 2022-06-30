import { useAccount, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import nftMetaWasm from 'assets/wasm/nft.meta.wasm';
import { ADDRESS } from 'consts';
import { useMemo } from 'react';
import { NFTState, OwnersNFTState } from 'types';

function useNftState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.NFT_CONTRACT, nftMetaWasm, payload);
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
  return useSendMessage(ADDRESS.NFT_CONTRACT, nftMetaWasm);
}

export { useNft, useOwnersNft, useNftMessage };
