import { useReadState } from './use-read-state';
import { AnyJson } from '@polkadot/types/types';
import { useNFTStore } from '../context';
import { StoreNFT } from '../types/tamagotchi-state';
import { useMemo } from 'react';
// import { Hex } from '@gear-js/api';
// import { useAccount } from '@gear-js/react-hooks';

// type OwnerTokensState = { GetAttributes: { tamagotchiId: Hex } };

function useNFTState<T>(payload: AnyJson) {
  const { meta, programId } = useNFTStore();
  return useReadState<T>(programId, meta, payload);
}

export function useNFTs() {
  const payload = useMemo(() => ({}), []);
  const { state } = useNFTState<StoreNFT>(payload);

  return { items: state?.attributes, owners: state?.owners };
}

// export function useOwnerNFTs() {
//   const { account } = useAccount();
//
//   const tamagotchiId = account?.decodedAddress;
//   const payload = useMemo(() => (tamagotchiId ? { GetAttributes: { tamagotchiId } } : undefined), [tamagotchiId]);
//   const { state, isStateRead } = useNFTState<StoreNFT>(payload);
//
//   return { ownerNFTs: state?.attributes, isOwnerNFTsRead: isStateRead };
// }
