import { Enum } from '@polkadot/types';

export interface Reason<R extends Enum, S extends Enum> extends Enum {
  isRuntime: boolean;
  isSystem: boolean;
  asRuntime: R;
  asSystem: S;
}
