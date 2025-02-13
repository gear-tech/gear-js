class WsGearexeProvider {
    _url;
    _conn;
    _isConnected;
    constructor(_url) {
        this._url = _url;
        this.connect();
    }
    _onOpen() {
        this._isConnected = true;
    }
    _onClose() {
        this._isConnected = false;
    }
    _onError() {
        throw new Error('Connection error');
    }
    _onMessage() {
        throw new Error('Method not implemented.');
    }
    get isConnected() {
        return this._isConnected;
    }
    get url() {
        return this._url;
    }
    async connect() {
        this._conn = new WebSocket(this._url);
        this._conn.addEventListener('open', this._onOpen);
        this._conn.addEventListener('close', this._onClose);
        this._conn.onerror = this._onError;
        this._conn.onmessage = this._onMessage;
    }
    async disconnect() {
        this._conn.close();
    }
    send(_method, _parameters) {
        throw new Error('Method not implemented.');
    }
    subscribe(_method, _parameters, _callback) {
        throw new Error('Method not implemented.');
    }
    unsubscribe(_id) {
        throw new Error('Method not implemented.');
    }
}

export { WsGearexeProvider };
