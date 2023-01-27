import { useReadState } from './use-read-state';
import { AnyJson } from '@polkadot/types/types';
import { useLesson, useNFTStore } from '../context';
import { IStoreItem, StoreNFT, StoreNFTItem, StoreNFTItemDescription } from '../types/tamagotchi-state';
import { useMemo } from 'react';
import { Hex } from '@gear-js/api';
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
  const { lesson, setTamagotchiItems } = useLesson();
  console.log('store: ', { state });

  const getStoreItems = (): IStoreItem[] => {
    const result = [] as IStoreItem[];
    for (const idx in state?.attributes) {
      result.push({
        id: +idx,
        amount: state?.attributes[idx][1] as number,
        description: state?.attributes[idx][0] as StoreNFTItemDescription,
      });
    }
    return result;
  };

  const getAttributesByOwner = () =>
    lesson && state ? (state?.owners as Record<string, number[]>)[lesson?.programId] : [];

  setTamagotchiItems(getAttributesByOwner() ?? []);

  return { items: getStoreItems(), owners: state?.owners };
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
