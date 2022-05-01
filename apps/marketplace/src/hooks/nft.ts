import { GearKeyring, Hex } from '@gear-js/api';
import { nftMetaWasm } from 'assets';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useMetadata, useReadState } from './api';
import { useAccount } from './context';

function useNftMeta() {
  const { metadata, metaBuffer } = useMetadata(nftMetaWasm);

  return { nftMeta: metadata, nftMetaBuffer: metaBuffer };
}

type Token = { Token: { tokenId: number } };
type OwnerTokens = { TokensForOwner: { owner: Hex } };

type Payload = Token | OwnerTokens;

function useNftState(payload: Payload) {
  const { nftMetaBuffer } = useNftMeta();
  const nftState = useReadState(NFT_CONTRACT_ADDRESS, nftMetaBuffer, payload);

  return nftState;
}

function useNft(tokenId: number) {
  return useNftState({ Token: { tokenId } });
}

function useAccountNfts() {
  const { account } = useAccount();
  // TODO: ! assertion
  const { address } = account!;
  const decodedAddress = GearKeyring.decodeAddress(address);

  return useNftState({ TokensForOwner: { owner: decodedAddress } });
}

export { useNft, useAccountNfts };
