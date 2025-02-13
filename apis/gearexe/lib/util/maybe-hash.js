function transformMaybeHash(value) {
    if (value == undefined) {
        return null;
    }
    if (value == 'Empty') {
        return null;
    }
    if (typeof value !== 'object') {
        return value;
    }
    return value.Hash;
}
function transformMaybeHashes(object, paths) {
    if (typeof object !== 'object') {
        return object;
    }
    for (const path of paths) {
        object[path] = transformMaybeHash(object[path]);
    }
}

export { transformMaybeHash, transformMaybeHashes };
