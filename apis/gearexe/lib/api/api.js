import { query } from './query/index.js';
import { call } from './call/index.js';

class GearExeApi {
    _provider;
    query;
    call;
    constructor(provider) {
        this._provider = provider;
        this._setProps('query', query);
        this._setProps('call', call);
        delete this._setProps;
    }
    _setProps(thisProperty, modules) {
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

export { GearExeApi };
