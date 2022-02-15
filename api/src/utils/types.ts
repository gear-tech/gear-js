export function transformTypes(types: object): any {
  return Object.values(types).reduce((res, types): object => ({ ...res, ...types }), {});
}
