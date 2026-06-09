import type { IVaraEthProvider } from '../../types/index.js';

export class InfoQueries {
  constructor(private _provider: IVaraEthProvider) {}

  async version(): Promise<string | null> {
    try {
      return await this._provider.send<string>('version', []);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
