function id() {
    return Math.floor(Math.random() * 1_000_000);
}
function encodeJsonRpc(method, parameters) {
    return { method, params: parameters.map(transformBigint), id: id(), jsonrpc: '2.0' };
}
function isErrorResponse(response) {
    return 'error' in response;
}
function getErrorMessage(response) {
    let error = `RpcError(${response.error.code}): ${response.error.message}`;
    if (response.error.data) {
        error += ` :: ${response.error.data}`;
    }
    return error;
}
function transformBigint(object) {
    if (typeof object === 'bigint') {
        return Number(object);
    }
    else if (Array.isArray(object)) {
        return object.map(transformBigint(object));
    }
    else if (object !== null && typeof object === 'object') {
        return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transformBigint(value)]));
    }
    return object;
}

export { encodeJsonRpc, getErrorMessage, isErrorResponse };
