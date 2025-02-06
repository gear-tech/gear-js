import { IGearExeProvider } from '../types/index.js';
import { Query } from './query/index.js';
import { Call } from './call/index.js';
export declare class GearExeApi {
    private _provider;
    readonly query: Query;
    readonly call: Call;
    constructor(provider: IGearExeProvider);
    private _setProps;
    get provider(): IGearExeProvider;
}
