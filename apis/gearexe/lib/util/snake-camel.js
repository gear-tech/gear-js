function snakeToCamel(object) {
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (Array.isArray(object)) {
        return object.map(snakeToCamel);
    }
    return Object.keys(object).reduce((accumulator, key) => {
        const camelKey = key.replaceAll(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        accumulator[camelKey] = snakeToCamel(object[key]);
        return accumulator;
    }, {});
}

export { snakeToCamel };
