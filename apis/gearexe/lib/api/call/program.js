class ProgramCalls {
    _provider;
    constructor(_provider) {
        this._provider = _provider;
    }
    async calculateReplyForHandle(source, programId, payload, value = 0n, atBlock) {
        const response = await this._provider.send('program_calculateReplyForHandle', [
            atBlock || null,
            source,
            programId,
            payload,
            value,
        ]);
        return response;
    }
}

export { ProgramCalls };
