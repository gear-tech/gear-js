const isUndefined = (value: unknown): value is undefined => value === undefined;
const isString = (value: unknown): value is string => typeof value === 'string';

export { isUndefined, isString };
