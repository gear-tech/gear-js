import type { Observable } from '@polkadot/types/types';
import type { U64, Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { AugmentedRpc } from '@polkadot/api/types';

declare module '@polkadot/rpc-core/types/jsonrpc' {
  export interface RpcInterface {
    gear: {
      getGasSpent: AugmentedRpc<(id: H256 | string, payload: string | Bytes | Uint8Array) => Observable<U64>>;
    };
  }
}
