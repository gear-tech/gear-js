import { IGearExeProvider } from '../types/index.js';
import { query, Query } from './query/index.js';
import { call, Call } from './call/index.js';

export class GearExeApi {
  private _provider: IGearExeProvider;
  public readonly query: Query;
  public readonly call: Call;

  constructor(provider: IGearExeProvider) {
    this._provider = provider;

    this._setProps('query', query);
    this._setProps('call', call);

    delete this._setProps;
  }

  private _setProps(thisProperty: string, modules: Record<string, any>) {
    const properties = {};
    for (const [key, value] of Object.entries(modules)) {
      properties[key] = new value(this._provider);
    }
    this[thisProperty] = properties;
  }

  get provider() {
    return this._provider;
  }
}
