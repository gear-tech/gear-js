import { BlockHeader, IGearExeProvider } from '../../types/index.js';

export class Block {
  constructor(private _provider: IGearExeProvider) {}

  async header(hash?: string): Promise<BlockHeader> {
    const parameters = hash ? [hash] : [];

    const response = await this._provider.send<[string, Omit<BlockHeader, 'hash'>]>('block_header', parameters);

    return {
      hash: response[0],
      ...response[1],
    };
  }
}
