import { Hex } from '@gear-js/api';
import { nftMetaWasm } from 'assets';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { NFT } from 'types';
import { useMessage, useMetadata, useReadState } from './api';
import { useAccount } from './context';

type NFTPayload = { Token: { tokenId: string } };
type OwnersNFTPayload = { TokensForOwner: { owner: Hex } };

type NFTState = { Token: { token: NFT } };
type OwnersNFTState = { TokensForOwner: { tokens: NFT[] } };

function useNftMeta() {
  const { metadata, metaBuffer } = useMetadata(nftMetaWasm);

  return { nftMeta: metadata, nftMetaBuffer: metaBuffer };
}

function useNftState(payload: NFTPayload): NFTState | undefined;
function useNftState(payload: OwnersNFTPayload): OwnersNFTState | undefined;
function useNftState(payload: NFTPayload | OwnersNFTPayload) {
  const { nftMetaBuffer } = useNftMeta();

  return useReadState(NFT_CONTRACT_ADDRESS, nftMetaBuffer, payload);
}

function useNft(tokenId: string) {
  const state = useNftState({ Token: { tokenId } });
  return state?.Token.token;
}

function useOwnersNft() {
  const { account } = useAccount();

  // TODO: ! assertion
  // @ts-ignore
  const state = useNftState({ TokensForOwner: { owner: account?.decodedAddress } });

  return state?.TokensForOwner.tokens;
}

function useNftMessage() {
  const { nftMeta } = useNftMeta();
  return useMessage(NFT_CONTRACT_ADDRESS, nftMeta);
}

export { useNft, useOwnersNft, useNftMessage };
