import { useReadState } from './use-read-state';
import { AnyJson } from '@polkadot/types/types';
import { useTokensBalanceStore } from '../context';
import { StoreNFT } from '../types/tamagotchi-state';
import { useMemo } from 'react';

function useBalanceState<T>(payload: AnyJson) {
  const { meta, programId } = useTokensBalanceStore();
  return useReadState<T>(programId, meta, payload);
}

export function useNFTs() {
  const payload = useMemo(() => ({}), []);
  const { state } = useBalanceState<StoreNFT>(payload);

  return { items: Object.values(state?.attributes ?? {}), owners: state?.owners };
}
