export function transformTypes(types: object): object {
  return Object.values(types).reduce((res, types): object => ({ ...res, ...types }), {});
}
