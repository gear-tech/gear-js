import { GearKeyring, Hex } from '@gear-js/api';
import { nftMetaWasm } from 'assets';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { NFT } from 'types';
import { useMetadata, useReadState } from './api';
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
  const { address } = account!;
  const decodedAddress = GearKeyring.decodeAddress(address);

  const state = useNftState({ TokensForOwner: { owner: decodedAddress } });

  return state?.TokensForOwner.tokens;
}

export { useNft, useOwnersNft };
