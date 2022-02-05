import type { Observable, Codec } from '@polkadot/types/types';
import type { U64, Bytes } from '@polkadot/types';
import { AugmentedRpc } from '@polkadot/api/types';
import { AccountId, ProgramId } from './gear-api';

declare module '@polkadot/rpc-core/types/jsonrpc' {
  export interface RpcInterface {
    gear: {
      getGasSpent: AugmentedRpc<
        (
          accountId: AccountId,
          id: ProgramId,
          payload: string | Bytes | Uint8Array,
          kind: string | Bytes | Uint8Array | Codec,
        ) => Observable<U64>
      >;
    };
  }
}
