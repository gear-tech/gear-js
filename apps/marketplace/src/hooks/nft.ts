import { useAccount, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import marketplaceMetaWasm from 'assets/wasm/marketplace.meta.wasm';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useMemo } from 'react';
import { NFT } from 'types';

type NFTState = { Token: { token: NFT } };
type OwnersNFTState = { TokensForOwner: { tokens: NFT[] } };

function useNftState<T>(payload: AnyJson) {
  return useReadState<T>(NFT_CONTRACT_ADDRESS, marketplaceMetaWasm, payload);
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

  const { state } = useNftState<OwnersNFTState>(payload);

  return state?.TokensForOwner.tokens;
}

function useNftMessage() {
  return useSendMessage(NFT_CONTRACT_ADDRESS, marketplaceMetaWasm);
}

export { useNft, useOwnersNft, useNftMessage };
