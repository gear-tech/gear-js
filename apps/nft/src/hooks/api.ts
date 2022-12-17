import { useAccount, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import { ArtMetadata, Params, Token } from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';
import { useWasm } from './context';

type TokenState = { Token: { artMetadata: ArtMetadata } };
type TokensState = { AllTokens: { tokens: Token[] } };
type OwnerTokensState = { TokensForOwner: { tokens: Token[] } };
type ApprovedTokensState = { ApprovedTokens: { tokens: Token[] } };

function useNFTState<T>(payload: AnyJson) {
  const nft = useWasm();
  const { programId, metaBuffer } = nft;

  return useReadState<T>(programId, metaBuffer, payload);
}

function useNFT() {
  const { id } = useParams() as Params;
  const payload = useMemo(() => ({ Token: { tokenId: id } }), [id]);

  const { state } = useNFTState<TokenState>(payload);

  return state?.Token.artMetadata;
}

function useNFTs() {
  const payload = useMemo(() => ({ AllTokens: null }), []);
  const { state } = useNFTState<TokensState>(payload);

  return state?.AllTokens.tokens;
}

function useOwnerNFTs() {
  const { account } = useAccount();

  const owner = account?.decodedAddress;
  const payload = useMemo(() => (owner ? { TokensForOwner: { owner } } : undefined), [owner]);
  const { state, isStateRead } = useNFTState<OwnerTokensState>(payload);

  return { ownerNFTs: state?.TokensForOwner.tokens, isOwnerNFTsRead: isStateRead };
}

function useApprovedNFTs() {
  const { account } = useAccount();
  const decodedAddress = account?.decodedAddress;

  const getPayload = () => (decodedAddress ? { ApprovedTokens: { account: decodedAddress } } : undefined);
  const payload = useMemo(getPayload, [decodedAddress]);
  const { state, isStateRead } = useNFTState<ApprovedTokensState>(payload);

  return { approvedNFTs: state?.ApprovedTokens.tokens, isApprovedNFTsRead: isStateRead };
}

function useSendNFTMessage() {
  const nft = useWasm();
  const { programId, meta } = nft;

  return useSendMessage(programId, meta);
}

export { useNFT, useNFTs, useOwnerNFTs, useApprovedNFTs, useSendNFTMessage };
