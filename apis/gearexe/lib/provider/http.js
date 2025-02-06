import { snakeToCamel } from '../util/snake-camel.js';
import { encodeJsonRpc, isErrorResponse, getErrorMessage } from './jsonrpc.js';

class HttpGearexeProvider {
    _url;
    constructor(_url = 'http://127.0.0.1:9944') {
        this._url = _url;
    }
    connect() {
        return Promise.resolve();
    }
    disconnect() {
        return Promise.resolve();
    }
    async send(method, parameters) {
        const body = encodeJsonRpc(method, parameters);
        const response = await fetch(this._url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error('Request failed. ' + response.statusText);
        }
        const json = await response.json();
        if (isErrorResponse(json)) {
            throw new Error(getErrorMessage(json));
        }
        return snakeToCamel(json.result);
    }
    subscribe() {
        throw new Error('Subscribe method not supported for HTTP provider');
    }
    unsubscribe() {
        throw new Error('Unsubscribe method not supported for HTTP provider');
    }
}

export { HttpGearexeProvider };
