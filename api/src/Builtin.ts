import { HexString } from 'types';
import { GearApi } from './GearApi';
import { u64 } from '@polkadot/types-codec';
import { BuiltinQueryIdError } from './errors';

export class GearBuiltin {
  constructor(private _api: GearApi) {}

  async queryId(builtinId: u64): Promise<HexString> {
    try {
      const result = await this._api.rpc.gearBuiltin.queryId(builtinId);
      return result.toHex();
    } catch (err) {
      throw new BuiltinQueryIdError(err.message);
    }
  }
}
