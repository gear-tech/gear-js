import { AnyJson } from '@polkadot/types/types';
import { useReadState } from '@gear-js/react-hooks';

import { STAKING_CONTRACT_ADDRESS } from 'consts';
import stakingMetaWasm from 'assets/wasm/staking.meta.wasm';

function useStakingState<T>(payload: AnyJson, isReadOnError?: boolean) {
  return useReadState<T>(STAKING_CONTRACT_ADDRESS, stakingMetaWasm, payload, isReadOnError);
}

export { useStakingState };
