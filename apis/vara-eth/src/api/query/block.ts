import type { BlockHeader, BlockRequestEvent, IVaraEthProvider } from '../../types/index.js';
import { normalizeBlockEvent } from '../../util/normalize.js';

export class BlockQueries {
  constructor(private _provider: IVaraEthProvider) {}

  async header(hash?: string): Promise<BlockHeader> {
    const parameters = hash ? [hash] : [];

    const response = await this._provider.send<[string, Omit<BlockHeader, 'hash'>]>('block_header', parameters);

    return {
      hash: response[0],
      ...response[1],
    };
  }

  async events(hash?: string): Promise<BlockRequestEvent[]> {
    const parameters = hash ? [hash] : [];
    const events = await this._provider.send<BlockRequestEvent[]>('block_events', parameters);
    events.forEach(normalizeBlockEvent);
    return events;
  }
}
