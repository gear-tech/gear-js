class Block {
    _provider;
    constructor(_provider) {
        this._provider = _provider;
    }
    async header(hash) {
        const parameters = hash ? [hash] : [];
        const response = await this._provider.send('block_header', parameters);
        return {
            hash: response[0],
            ...response[1],
        };
    }
}

export { Block };
