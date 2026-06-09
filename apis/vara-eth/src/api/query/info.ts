import type { IVaraEthProvider } from '../../types/index.js';

export class InfoQueries {
  constructor(private _provider: IVaraEthProvider) {}

  /**
   * Fetches the node's RPC version string.
   *
   * Returns `null` if the node does not implement the `version` RPC method (legacy node).
   * A `null` return causes {@link VaraEthApi} to fall back to the legacy injected
   * transaction format.
   */
  async version(): Promise<string | null> {
    try {
      return await this._provider.send<string>('version', []);
    } catch {
      return null;
    }
  }
}
