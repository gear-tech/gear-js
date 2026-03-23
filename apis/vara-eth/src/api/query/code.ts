import type { Hex } from 'viem';
import type { IVaraEthProvider } from '../../types/index.js';

export class CodeQueries {
  constructor(private _provider: IVaraEthProvider) {}

  async getOriginal(id: Hex): Promise<Hex> {
    return this._provider.send<Hex>('code_getOriginal', [id]);
  }

  async getInstrumented(runtimeId: number, codeId: Hex): Promise<Hex> {
    return this._provider.send<Hex>('code_getInstrumented', [runtimeId, codeId]);
  }
}
