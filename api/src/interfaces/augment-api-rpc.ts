import type { Observable } from '@polkadot/types/types';
import type { U64 } from '@polkadot/types';
import { AugmentedRpc } from '@polkadot/api/types';
import { Hex } from './gear-type';

declare module '@polkadot/rpc-core/types/jsonrpc' {
  export interface RpcInterface {
    gear: {
      getInitGasSpent: AugmentedRpc<(source: Hex, code: Hex, payload: Hex) => Observable<U64>>;
      getHandleGasSpent: AugmentedRpc<(source: Hex, dest: Hex, payload: Hex) => Observable<U64>>;
      getReplyGasSpent: AugmentedRpc<(source: Hex, messageId: Hex, exitCode: number, payload: Hex) => Observable<U64>>;
    };
  }
}
