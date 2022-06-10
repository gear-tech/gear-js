import { useAccount, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import { nftMetaWasm } from 'assets';
import { ADDRESS } from 'consts';
import { Params, Token } from 'types';
import { useParams } from 'react-router-dom';
import { Hex } from '@gear-js/api';

type TokenPayload = { Token: { tokenId: string } };
type TokensPayload = { AllTokens: null };
type OwnerTokensPayload = { TokensForOwner: { owner: Hex } };
type ApprovedTokensPayload = { ApprovedTokens: { account: Hex } };

type TokenState = { Token: { token: Token } };
type TokensState = { AllTokens: { tokens: Token[] } };
type OwnerTokensState = { TokensForOwner: { tokens: Token[] } };
type ApprovedTokensState = { ApprovedTokens: { tokens: Token[] } };

type Payload = TokenPayload | TokensPayload | OwnerTokensPayload | ApprovedTokensPayload;
type State<T> = T extends TokenPayload
  ? TokenState
  : T extends TokensPayload
  ? TokensState
  : T extends OwnerTokensPayload
  ? OwnerTokensState
  : T extends ApprovedTokensPayload
  ? ApprovedTokensState
  : never;

function useNFTState<T extends Payload | undefined>(payload: T): State<T> | undefined {
  return useReadState(ADDRESS.NFT_CONTRACT, nftMetaWasm, payload) as State<T>;
}

function useNFT() {
  const { id } = useParams() as Params;
  const payload = useMemo(() => ({ Token: { tokenId: id } }), [id]);

  const nft = useNFTState(payload);

  return nft?.Token.token;
}

function useNFTs() {
  const payload = useMemo(() => ({ AllTokens: null }), []);
  const nfts = useNFTState(payload);

  return nfts?.AllTokens.tokens;
}

function useOwnerNFTs() {
  const { account } = useAccount();

  const owner = account?.decodedAddress;
  const payload = useMemo(() => (owner ? { TokensForOwner: { owner } } : undefined), [owner]);

  const nfts = useNFTState(payload);

  // escaping infinite loading without login, mb it's worth to return read status from useReadState hook for this purpose
  return account ? nfts?.TokensForOwner.tokens : [];
}

function useApprovedNFTs() {
  const { account } = useAccount();
  const decodedAddress = account?.decodedAddress;

  const getPayload = () => (decodedAddress ? { ApprovedTokens: { account: decodedAddress } } : undefined);
  const payload = useMemo(getPayload, [decodedAddress]);

  const nfts = useNFTState(payload);

  // escaping infinite loading without login
  return account ? nfts?.ApprovedTokens.tokens : [];
}

function useSendNFTMessage() {
  return useSendMessage(ADDRESS.NFT_CONTRACT, nftMetaWasm);
}

export { useNFT, useNFTs, useOwnerNFTs, useApprovedNFTs, useSendNFTMessage };
