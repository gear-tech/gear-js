import { BlockHeader, BlockRequestEvent, IVaraEthProvider, StateTransition } from '../../types/index.js';
import { normalizeBlockEvent, normalizeStateTransition } from '../../util/normalize.js';

export class Block {
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

  async outcome(hash?: string): Promise<StateTransition[]> {
    const parameters = hash ? [hash] : [];
    const transitions = await this._provider.send<StateTransition[]>('block_outcome', parameters);
    transitions.forEach(normalizeStateTransition);
    return transitions;
  }
}
