import { AnyJson } from '@polkadot/types/types';
import { useReadState } from '@gear-js/react-hooks';
import { ADDRESS } from 'consts';
import stakingMetaWasm from 'assets/wasm/nft_street_art.meta.wasm';

export function useMetaWasmState<T>(payload: AnyJson, isReadOnError?: boolean) {
  return useReadState<T>(ADDRESS.NFT_CONTRACT_ADDRESS, stakingMetaWasm, payload, isReadOnError);
}
