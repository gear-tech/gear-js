import { GearKeyring, Hex } from '@gear-js/api';
import { nftMetaWasm } from 'assets';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { NFT } from 'types';
import { useMetadata, useReadState } from './api';
import { useAccount } from './context';

type NFTPayload = { Token: { tokenId: string } };
type OwnersNFTPayload = { TokensForOwner: { owner: Hex } };

function useNftMeta() {
  const { metadata, metaBuffer } = useMetadata(nftMetaWasm);

  return { nftMeta: metadata, nftMetaBuffer: metaBuffer };
}

function useNftState(payload: NFTPayload): NFT;
function useNftState(payload: OwnersNFTPayload): NFT[];
function useNftState(payload: NFTPayload | OwnersNFTPayload) {
  const { nftMetaBuffer } = useNftMeta();

  return useReadState(NFT_CONTRACT_ADDRESS, nftMetaBuffer, payload);
}

function useNft(tokenId: string) {
  return useNftState({ Token: { tokenId } });
}

function useOwnersNft() {
  const { account } = useAccount();
  // TODO: ! assertion
  const { address } = account!;
  const decodedAddress = GearKeyring.decodeAddress(address);

  return useNftState({ TokensForOwner: { owner: decodedAddress } });
}

export { useNft, useOwnersNft };
