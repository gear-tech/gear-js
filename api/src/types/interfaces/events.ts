import { GearEvent } from '../../events-types/Event';
import { Header } from '@polkadot/types/interfaces';
import { Balance } from '@polkadot/types/interfaces';

export interface IEventCallback<T extends GearEvent> {
  (event: T): void | Promise<void>;
}

export interface IBlocksCallback {
  (event: Header): void | Promise<void>;
}

export interface IBalanceCallback {
  (event: Balance): void | Promise<void>;
}
