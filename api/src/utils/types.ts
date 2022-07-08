export function transformTypes(types: object): { [key: string]: object } {
  return Object.values(types).reduce((res, types): object => ({ ...res, ...types }), {});
}
