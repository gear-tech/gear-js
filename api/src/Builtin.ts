import { HexString } from 'types';
import { GearApi } from './GearApi';
import { u64 } from '@polkadot/types-codec';

export class GearBuiltin {
  constructor(private _api: GearApi) {}

  async queryId(builtinId: u64): Promise<HexString | null> {
    return this._api.rpc.gearBuiltin
      .queryId(builtinId)
      .then((result) => result.toHex())
      .catch(() => null);
  }
}
