import { BuiltinQueryIdError } from '../errors';
import type { GearApi } from '../GearApi';
import type { HexString } from '../types';

export class GearBuiltin {
  constructor(private _api: GearApi) {}

  async queryId(builtinId: number | bigint): Promise<HexString> {
    try {
      const valueId = this._api.createType('u64', BigInt(builtinId));
      const result = await this._api.rpc.gearBuiltin.queryId(valueId);
      return result.toHex();
    } catch (err) {
      throw new BuiltinQueryIdError(err.message);
    }
  }
}
